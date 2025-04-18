import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.resolve("serviceAccount", "quickfix-sa.json");

let serviceAccount;
try {
  const fileContent = fs.readFileSync(serviceAccountPath, "utf-8");
  serviceAccount = JSON.parse(fileContent);
} catch (error) {
  console.error("Error reading or parsing service account file:", error);
  process.exit(1);
}

export const adminInstance = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quickfix-cc5a1-default-rtdb.firebaseio.com",
});
