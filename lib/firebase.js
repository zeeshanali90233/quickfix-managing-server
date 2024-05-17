import admin from "firebase-admin";

import serviceAccount from "../maxcool-group-firebase-adminsdk-r4l98-de1b2d6c85.json" with { type: "json" }

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

export default admin;
