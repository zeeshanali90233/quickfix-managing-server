import admin from "firebase-admin";

// import serviceAccount from "../maxcool-group-firebase-adminsdk-r4l98-de1b2d6c85.json" with { type: "json" }

console.log({
  type: process.env.SDK_TYPE,
  project_id: process.env.SDK_PROJECT_ID,
  private_key_id: process.env.SDK_PRIVATE_KEY_ID,
  private_key: process.env.SDK_PRIVATE_KEY,
  client_email: process.env.SDK_CLIENT_EMAIL,
  client_id: process.env.SDK_CLIENT_ID,
  auth_uri: process.env.SDK_AUTH_URI,
  token_uri: process.env.SDK_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.SDK_AUTH_PROVIDER_CERT_URI,
  client_x509_cert_url: process.env.SDK_CLIENT_PROVIDER_CERT_URI,
  universe_domain: process.env.SDK_UNIVERSE_DOMAIN,
});
admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.SDK_TYPE,
    project_id: process.env.SDK_PROJECT_ID,
    private_key_id: process.env.SDK_PRIVATE_KEY_ID,
    private_key: process.env.SDK_PRIVATE_KEY,
    client_email: process.env.SDK_CLIENT_EMAIL,
    client_id: process.env.SDK_CLIENT_ID,
    auth_uri: process.env.SDK_AUTH_URI,
    token_uri: process.env.SDK_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.SDK_AUTH_PROVIDER_CERT_URI,
    client_x509_cert_url: process.env.SDK_CLIENT_PROVIDER_CERT_URI,
    universe_domain: process.env.SDK_UNIVERSE_DOMAIN,
  }),
});

export default admin;
