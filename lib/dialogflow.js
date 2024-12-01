export async function detectIntentText(
  client,
  sessionId, //WA Number
  text,
  languageCode = "en"
) {
  // Define session path
  const sessionPath = client.projectLocationAgentSessionPath(
    process.env.PROJECTID,
    process.env.LOCATION,
    process.env.AGENTID,
    sessionId
  );

  // The request to send to Dialogflow CX
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
    // Send request to Dialogflow CX and get response
    const [response] = await client.detectIntent(request);
    // const confidence = response.queryResult.match.confidence;

    const responseMessage =
      response.queryResult?.responseMessages?.[0]?.text?.text?.[0];
    return responseMessage;
  } catch (error) {
    return "Something went wrong while communicating. Please try again later!";
  }
}
