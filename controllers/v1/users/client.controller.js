import { getDatabase } from "firebase-admin/database";
import { adminInstance } from "../../../firebase/admin.js";

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
      const fcmToken = childSnapshot.val()?.fcmToken ?? "";
      if (userData) {
        clients.push({
          id: childSnapshot.key,
          ...userData,
          fcmToken: fcmToken,
        });
      }
    });

    return res.status(200).json({
      message: "Clients retrieved successfully",
      clients,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to get clients",
      error,
    });
  }
};

export const SearchClients = async (req, res) => {
  try {
    const { query, fields } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        message: "Search query is required",
        code: "INVALID_QUERY",
      });
    }

    const searchQuery = query.trim().toLowerCase();
    const searchFields = fields
      ? fields.split(",").map((f) => f.trim())
      : ["preferredUserID", "businessName"];

    const db = getDatabase(adminInstance);
    const usersRef = db.ref("users");

    const dbQuery = usersRef.orderByChild("userData/role").equalTo(2);
    const snapshot = await dbQuery.once("value");

    if (snapshot.numChildren() === 0) {
      return res.status(200).json({
        message: "No clients found",
        clients: [],
        count: 0,
      });
    }

    const matchedClients = [];
    snapshot.forEach((childSnapshot) => {
      const userData = childSnapshot.val().userData;
      if (userData) {
        let isMatch = false;

        // Search in specified fields
        for (const field of searchFields) {
          const fieldValue = userData[field];
          if (fieldValue && typeof fieldValue === "string") {
            if (fieldValue.toLowerCase().includes(searchQuery)) {
              isMatch = true;
              break;
            }
          }
        }

        if (isMatch) {
          matchedClients.push({
            id: childSnapshot.key,
            ...userData,
          });
        }
      }
    });

    return res.status(200).json({
      message:
        matchedClients.length > 0
          ? "Clients found"
          : "No matching clients found",
      clients: matchedClients,
      count: matchedClients.length,
      searchQuery: query.trim(),
      searchFields,
    });
  } catch (error) {
    const errorId = Math.random().toString(36).substring(2, 9);
    return res.status(500).json({
      message: "Failed to search clients",
      error: error.message,
      errorId,
    });
  }
};

export const GetAllClientsRequests = async (req, res) => {
  try {
    const db = getDatabase(adminInstance);
    const requestsRef = db.ref("request");
    const snapshot = await requestsRef.once("value");

    if (!snapshot.exists()) {
      return res.status(200).json({
        message: "No requests found",
        count: 0,
        businesses: [],
      });
    }

    const businessMap = new Map();

    snapshot.forEach((requestSnapshot) => {
      const request = requestSnapshot.val();
      const businessName = request.businessName;

      if (!businessName) return;

      const businessEntry = businessMap.get(businessName) || {
        businessName,
        requests: [],
      };

      businessEntry.requests.push({
        requestID: requestSnapshot.key,
        createdBy: request.createdBy || null,
        timeStamp: request.timeStamp || null,
        problemDescription: request.problemDescription || "",
        requestDetail: request.requestDetail || "",
        status: request.status || "pending",
        technicianDetails: request.technicianDetails || {},
        businessCordinates: request.businessCordinates || {},
        businessAddress: request.businessAddress || "",
      });

      businessMap.set(businessName, businessEntry);
    });

    const result = Array.from(businessMap.values()).sort((a, b) =>
      a.businessName.localeCompare(b.businessName)
    );

    return res.status(200).json({
      message: result.length
        ? "Data retrieved successfully"
        : "No requests found",
      count: result.reduce((acc, curr) => acc + curr.requests.length, 0),
      businesses: result,
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return res.status(500).json({
      message: "Failed to retrieve requests",
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

export const GetClientInfo = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        code: "INVALID_USER_ID",
      });
    }

    const db = getDatabase(adminInstance);
    const userRef = db.ref(`users/${userId}`);
    const packageRef = db.ref(`payments/${userId}`);

    // Fetch both user and package data concurrently
    const [userSnapshot, packageSnapshot] = await Promise.all([
      userRef.once("value"),
      packageRef.once("value"),
    ]);

    if (!userSnapshot.exists()) {
      return res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    const userData = userSnapshot.val().userData;
    const fcmToken = userSnapshot.val()?.fcmToken || "";
    if (userData?.role !== 2) {
      return res.status(403).json({
        message: "User is not a client",
        code: "INVALID_ROLE",
      });
    }

    const response = {
      id: userId,
      fcmToken: fcmToken,
      userData: userData,
      package: packageSnapshot.exists() ? packageSnapshot.val() : null,
    };
    return res.status(200).json({
      message: "Client info retrieved successfully",
      clientInfo: response,
    });
  } catch (error) {
    const errorId = Math.random().toString(36).substring(2, 9);
    return res.status(500).json({
      message: "Failed to retrieve client info",
      error: error.message,
      errorId,
    });
  }
};

export const UpdateClientCredits = async (req, res) => {
  try {
    const userId = req.params.id;
    const { credits, validTill } = req.body;

    if (!userId || !credits) {
      return res.status(400).json({
        message: "User ID and credits are required",
        code: "INVALID_INPUT",
      });
    }

    const db = getDatabase(adminInstance);
    const creditRef = db.ref(`payments/${userId}/`);
    const creditValue = (await creditRef.child("total").once("value")).val() || 0;
    const remainingValue = (await creditRef.child("remaining").once("value")).val() || 0;
    await creditRef.update({
      total: creditValue + Number(credits),
      remaining: remainingValue + Number(credits),
      validTill: validTill || null,
      updatedAt: Date.now(),
    });

    return res.status(200).json({
      message: "Credits updated successfully",
      credits,
    });
  } catch (error) {
    const errorId = Math.random().toString(36).substring(2, 9);
    return res.status(500).json({
      message: "Failed to update credits",
      error: error.message,
      errorId,
    });
  }
};

export const BlockClient = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        code: "INVALID_USER_ID",
      });
    }

    const db = getDatabase(adminInstance);
    const userRef = db.ref(`users/${userId}/userData`);

    await adminInstance.auth().updateUser(userId, {
      disabled: true,
    });

    // Update user data in Realtime Database
    await userRef.update({
      isBlocked: true,
      blockedAt: Date.now(),
    });

    return res.status(200).json({
      message: "User blocked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to block user",
      error: error.message,
    });
  }
};

export const UnblockClient = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        code: "INVALID_USER_ID",
      });
    }

    await adminInstance.auth().updateUser(userId, {
      disabled: false,
    });

    const db = getDatabase(adminInstance);
    const userRef = db.ref(`users/${userId}/userData`);

    // Update user data in Realtime Database
    await userRef.update({
      isBlocked: false,
      unblockedAt: Date.now(),
    });

    return res.status(200).json({
      message: "User unblocked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to unblock user",
      error: error.message,
    });
  }
};
