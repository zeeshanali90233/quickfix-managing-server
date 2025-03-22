import admin from "firebase-admin";
import fs from "fs";
const serviceAccount = JSON.parse(
  fs.readFileSync("serviceAccount/quickfix-sa.json", "utf-8")
);

export const adminInstance = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quickfix-cc5a1-default-rtdb.firebaseio.com",
});

export async function DeletePhotoFromStorage() {
  try {
    const cutOffDate = new Date();
    cutOffDate.setDate(cutOffDate.getDate() - 30);

    const requestSnapshot = await admin
      .firestore()
      .collection("Requests")
      .where("actionSideStatus", "==", "Completed")
      .where("problemImage", "!=", "")
      .where("postedAt", "<=", cutOffDate)
      .get();

    await Promise.all(
      requestSnapshot.docs.map(async (request) => {
        await adminInstance
          .storage()
          // .bucket("maxcool-group.appspot.com")
          .file("Requests/" + request.id)
          .delete({ ignoreNotFound: true });

        await admin.firestore().collection("Requests").doc(request.id).update({
          problemImage: "",
        });
      })
    );
  } catch (err) {
    console.log(err);
  }
}

export async function RemovePushToken(collectionName, userId) {
  try {
    const docRef = admin.firestore().collection(collectionName).doc(userId);
    await docRef.update({
      devicePushToken: admin.firestore.FieldValue.delete(),
    });
  } catch (err) {
    // throw err;
  }
}

export default admin;
