export const DeletePhotoFromStorage = async (
  successCB = () => {},
  errorCB = () => {}
) => {
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
    successCB(
      "Successfully deleted photos from storage and cleared Firestore data."
    );
  } catch (err) {
    errorCB(`Error deleting photos from storage: ${err.message}`);
  }
};

export const RemovePushToken = async (
  collectionName,
  userId,
  successCB = () => {},
  errorCB = () => {}
) => {
  try {
    const docRef = admin.firestore().collection(collectionName).doc(userId);
    await docRef.update({
      devicePushToken: admin.firestore.FieldValue.delete(),
    });
    successCB("Firestore Success");
  } catch (error) {
    console.error("Error deleting push token:", error.message);
    errorCB(`Firestore Error: ${error.message}`);
  }
};
