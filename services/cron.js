import cron from "node-cron";
import { sendEmail_Util } from "../utils/email.js";
import { getDatabase } from "firebase-admin/database";
import { adminInstance } from "../firebase/admin.js";

export function initializeCronJobs(successCB, errorCB) {
  try {
    cron.schedule("0 20 * * *", async () => {
      console.log("Package Expiry Notifications - Started");

      try {
        const db = getDatabase(adminInstance);
        const paymentsRef = db.ref("payments");

        const paymentsSnapshot = await paymentsRef.once("value");
        const paymentsData = paymentsSnapshot.val() || {};

        const promises = [];
        const now = new Date();
        const sevenDaysFromNow = new Date(
          now.getTime() + 7 * 24 * 60 * 60 * 1000
        ); // 7 days from now

        for (const [paymentId, payment] of Object.entries(paymentsData)) {
          const validTill = payment.validTill
            ? new Date(payment.validTill)
            : null;
          const remaining = payment.remaining || 0;
          const total = payment.total || 0;

          // Check for package expiry (within 7 days)
          const isExpiringWithin7Days =
            validTill &&
            !isNaN(validTill.getTime()) &&
            validTill <= sevenDaysFromNow;

          // Check for low/zero remaining credits
          const hasLowCredits = remaining <= 0 || remaining <= total * 0.1; // 10% or less remaining

          if (isExpiringWithin7Days || hasLowCredits) {
            // Fetch user data for the paymentId
            const userSnapshot = await db
              .ref(`users/${paymentId}/userData`)
              .once("value");
            const userData = userSnapshot.val() || {};
            const email = userData.email;
            const name = userData.businessName || userData.name || "Client";

            if (email) {
              let subject, htmlBody;

              if (hasLowCredits) {
                subject = `Alert: Your ${payment.name} Package Credits Are Running Low`;
                htmlBody = `<h3>Hello ${name},</h3>
                <p>This is an alert from QuickFix: Your <strong>${payment.name}</strong> package credits are running low.</p>
                <p>Remaining: <strong>${remaining}</strong> of ${total} credits</p>
                ${
                  remaining <= 0
                    ? '<p style="color: red;"><strong>Your credits have been exhausted!</strong></p>'
                    : '<p>Please consider purchasing additional credits to continue using our services.</p>'
                }
                <p>Visit your dashboard to top up your credits.</p>
                <p>Thank you for choosing QuickFix!</p>`;
              } else {
                subject = `Reminder: Your ${payment.name} Package is About to Expire`;
                htmlBody = `<h3>Hello ${name},</h3>
                <p>This is a reminder from QuickFix: Your <strong>${payment.name}</strong> package (valid until ${validTill.toLocaleDateString()}) is nearing its expiry.</p>
                <p>Remaining: ${remaining} of ${total}</p>
                <p>To avoid service disruption, please visit your dashboard to renew.</p>
                <p>Thank you for choosing QuickFix!</p>`;
              }

              promises.push(
                sendEmail_Util({
                  to: [email],
                  subject,
                  htmlBody,
                })
              );
            }
          }
        }

        await Promise.all(promises);
        console.log(`Package Expiry Emails Sent to ${promises.length} Clients`);
      } catch (err) {
        console.error("Failed to send package expiry emails:", err.message);
      }
    });

    successCB("✅ Cron jobs initialized");
  } catch (error) {
    errorCB(`❌ Failed to initialize cron jobs: ${error.message}`);
    throw error;
  }
}
