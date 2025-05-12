import cron from "node-cron";

export function initliazeCronJobs(successCB, errorCB) {
  try {
    // At 3 PM: Actual Real World Pakistan Time
    // 10 PM 1M: Server Time: GMT+0h
    cron.schedule("1 10 * * *", () => {
      console.log("Package Expiry Notifications");
    });
    successCB("✅ Jobs initialized");
  } catch (error) {
    errorCB(`❌ Failed to initialize Jobs: ${error}`);
    throw error;
  }
}
