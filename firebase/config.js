import admin from "firebase-admin";

import serviceAccount from "../maxcool-group-firebase-adminsdk-r4l98-497a772b6c.json" with { type: "json" }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
