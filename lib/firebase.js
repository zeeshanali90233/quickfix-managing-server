import admin from "firebase-admin";

import serviceAccount from "../maxcool-group-firebase-adminsdk-r4l98-a12ab3b411.json" with { type: "json" }


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://maxcool-group-default-rtdb.firebaseio.com"
});



export function DeletePhotoFromStorage(imageURL){
  try{
    console.log("I called")
    return true
  }
  catch(err){
    console.log(err)
    return false
  }
}
export default admin;
