import cron from "node-cron";
import { sendEmail_Util } from "../utils/email.js";
import { getDatabase } from "firebase-admin/database";
import { adminInstance } from "../firebase/admin.js";

export function initliazeCronJobs(successCB, errorCB) {
  try {
    cron.schedule("2 12 * * *", async () => {
      console.log("Package Expiry Notifications");

      try {
        const db = getDatabase(adminInstance);
        const usersRef = db.ref("users");
        const snapshot = await usersRef
          .orderByChild("userData/role")
          .equalTo(2)
          .once("value");

        const promises = [];

        snapshot.forEach((userSnap) => {
          const userData = userSnap.child("userData").val();
          const email = userData?.email;
          const name = userData?.name || "Client";

          if (email) {
            promises.push(
              sendEmail_Util({
                to: email,
                subject: " Reminder: Your Package is About to Expire",
                html: `<h3>Hello ${name},</h3>
                <p>This is a reminder from QuickFix: Your current package is nearing its expiry.</p>
                <p>To avoid service disruption, please visit your dashboard to renew.</p>
                <p>Thank you for choosing QuickFix!</p>`,
              })
            );
          }
        });

        await Promise.all(promises);
        console.log("Package Expiry Emails Sent to Clients");
      } catch (err) {
        console.error("Failed to send emails:", err.message);
      }
    });

    successCB("✅ Jobs initialized");
  } catch (error) {
    errorCB(`❌ Failed to initialize Jobs: ${error}`);
    throw error;
  }
}
