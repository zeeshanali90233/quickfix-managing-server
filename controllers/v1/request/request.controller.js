/** @type {import("express").RequestHandler} */
import { getDatabase } from "firebase-admin/database";

const increaseRequestCallBack = (req, res) => {
  const uid = req.params.id;
  let { numOfRequests, name } = req.body;

  if (!name) {
    name = "Pay As You Go";
  }

  if (!numOfRequests || !uid) {
    return res.status(400).json({
      message: "UserID or Number of Requests missing",
    });
  }

  try {
    const date = new Date();
    const db = getDatabase();
    const path = `payments/${uid}/${date.getMonth()}_${date.getFullYear()}`;

    db.ref(path)
      .update({ total: numOfRequests, name })
      .then(() => {
        return res.status(200).json({
          message: "Total updated successfully",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: "Failed to update total",
          error: error.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message,
    });
  }
};

export { increaseRequestCallBack };
