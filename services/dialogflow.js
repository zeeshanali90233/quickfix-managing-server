import { SessionsClient } from "@google-cloud/dialogflow-cx";
import { LOCATION } from "../config/env.js";

let dialogFlowClient;

export const initializeDialogFlow = (successCB, errorCB) => {
  try {
    dialogFlowClient = new SessionsClient({
      apiEndpoint: `${LOCATION}-dialogflow.googleapis.com`,
    });

    successCB("✅ DialogFlow client initialized");
    return dialogFlowClient;
  } catch (error) {
    errorCB(`❌ Failed to initialize DialogFlow client: ${error}`);
    throw error;
  }
};

export const getDialogFlowClient = (successCB, errorCB) => {
  if (!dialogFlowClient) {
    errorCB("❌ DialogFlow client has not been initialized");
    throw new Error("DialogFlow client has not been initialized");
  }
  successCB("✅ DialogFlow client has been initialized");
  return dialogFlowClient;
};
