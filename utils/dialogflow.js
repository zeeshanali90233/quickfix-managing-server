import { AGENTID, LOCATION, PROJECTID } from "../config/env.js";

export const detectIntentText = async (
  client,
  sessionId,
  text,
  languageCode = "en",
  successCB = () => {},
  errorCB = () => {}
) => {
  const sessionPath = client.projectLocationAgentSessionPath(
    PROJECTID,
    LOCATION,
    AGENTID,
    sessionId
  );
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text || "My message didn't deliver correctly",
      },
      languageCode: languageCode,
    },
    analyzeQueryTextSentiment: true,
  };
  try {
    const [response] = await client.detectIntent(request);
    const responseMessage = response.queryResult?.responseMessages?.find(
      (msg) => msg.text
    )?.text?.text?.[0];

    if (responseMessage) {
      successCB(responseMessage);
    } else {
      errorCB("No response message found.");
    }
    return responseMessage;
  } catch (error) {
    errorCB(`Something went wrong: ${error.message}`);
    return "Something went wrong while communicating. Please try again later!";
  }
};
