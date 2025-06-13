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

          // Validate validTill and check if it's within 7 days
          if (
            validTill &&
            !isNaN(validTill.getTime()) &&
            validTill <= sevenDaysFromNow
          ) {
            // Fetch user data for the paymentId
            const userSnapshot = await db
              .ref(`users/${paymentId}/userData`)
              .once("value");
            const userData = userSnapshot.val() || {};
            const email = userData.email;
            const name = userData.businessName || userData.name || "Client";
            if (email) {
              promises.push(
                sendEmail_Util({
                  to: [email],
                  subject: `Reminder: Your ${payment.name} Package is About to Expire`,
                  htmlBody: `<h3>Hello ${name},</h3>
                  <p>This is a reminder from QuickFix: Your <strong>${
                    payment.name
                  }</strong> package (valid until ${validTill.toLocaleDateString()}) is nearing its expiry.</p>
                  <p>Remaining: ${payment.remaining} of ${payment.total}</p>
                  <p>To avoid service disruption, please visit your dashboard to renew.</p>
                  <p>Thank you for choosing QuickFix!</p>`,
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
