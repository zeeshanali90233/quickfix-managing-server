import { adminInstance } from "../lib/firebase.js";
import { getDatabase } from "firebase-admin/database";

export const GetAllClients = async (req, res) => {
  try {
    const db = getDatabase(adminInstance);
    const usersRef = db.ref("users");

    const query = usersRef.orderByChild("userData/role").equalTo(2);
    const snapshot = await query.once("value");

    if (snapshot.numChildren() === 0) {
      return res.status(404).json({ message: "No clients found with role 2" });
    }

    const clients = [];
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val().userData;
      if (userData) {
        clients.push({
          id: childSnapshot.key,
          ...userData,
        });
      }
    });

    return res.status(200).json({
      message: "Clients retrieved successfully",
      clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({
      message: "Failed to get clients",
      error,
    });
  }
};

export const GetAllClientsRequests = async (req, res) => {
  try {
    const db = getDatabase(adminInstance);
    const usersRef = db.ref("users");

    const query = usersRef.orderByChild("userData/role").equalTo(2);
    const usersSnapshot = await query.once("value");

    const businessMap = new Map();

    usersSnapshot.forEach((userSnapshot) => {
      const userId = userSnapshot.key;
      const userData = userSnapshot.child("userData").val();
      const requestsCreated = userSnapshot.child("requestsCreated").val();

      if (!userData || userData.role !== 2) return;

      if (requestsCreated) {
        Object.entries(requestsCreated).forEach(([requestId, requestData]) => {
          const businessName = requestData.businessName;
          if (!businessName) return;

          const businessEntry = businessMap.get(businessName) || {
            businessName,
            requests: [],
          };

          businessEntry.requests.push({
            requestID: requestId,
            createdBy: userId,
            timeStamp: requestData.timeStamp || null,
            problemDescription: requestData.problemDescription || "",
            requestDetail: requestData.requestDetail || "",
            status: requestData.status || "pending",
            technicianDetails: requestData.technicianDetails || {},
          });

          businessMap.set(businessName, businessEntry);
        });
      }
    });

    const result = Array.from(businessMap.values()).sort((a, b) =>
      a.businessName.localeCompare(b.businessName)
    );

    return res.status(200).json({
      message: result.length
        ? "Data retrieved successfully"
        : "No business requests found for role 2 users",
      count: result.reduce((acc, curr) => acc + curr.requests.length, 0),
      businesses: result,
    });
  } catch (error) {
    console.error("Error fetching business requests:", error);
    return res.status(500).json({
      message: "Failed to retrieve business requests",
      error: error.message,
    });
  }
};

export const GetClientRequests = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({
        message: "Valid user ID is required",
        code: "INVALID_USER_ID",
      });
    }

    const db = getDatabase(adminInstance);

    const userRef = db.ref(`users/${userId}`);

    const userSnapshot = await userRef.once("value").catch((err) => {
      throw new Error(`Database read failed (user data): ${err.message}`);
    });

    if (!userSnapshot.exists()) {
      return res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    const userData = userSnapshot.val();
    const userRole = userData.userData?.role;

    if (userRole !== 2) {
      return res.status(403).json({
        message: "User is not a client (role is not 2)",
        code: "INVALID_ROLE",
      });
    }

    const requestsRef = db.ref(`users/${userId}/requestsCreated`);

    const snapshot = await requestsRef.once("value").catch((err) => {
      throw new Error(`Database read failed (requests): ${err.message}`);
    });

    if (!snapshot.exists()) {
      return res.status(200).json({
        message: "No requests found",
        requests: [],
        count: 0,
        _metadata: {
          userId,
          timestamp: Date.now(),
        },
      });
    }

    const requests = [];
    snapshot.forEach((childSnapshot) => {
      const request = childSnapshot.val();
      requests.push({
        id: childSnapshot.key,
        by: request.createdBy || null,
        at: request.timeStamp || 0,
        problem: request.problemDescription?.substring(0, 100) || "",
        details: request.requestDetail || "",
        status: request.status?.toLowerCase() || "pending",
        tech: request.technicianDetails || null,
      });
    });

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=60");

    return res.status(200).json({
      message: requests.length ? "Requests retrieved" : "No requests",
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    const errorId = Math.random().toString(36).substring(2, 9);
    console.error(`[${errorId}] ${error.message}`);

    return res.status(500).json({
      message: "Request processing error",
      error: error.message,
      errorId: errorId,
    });
  }
};
