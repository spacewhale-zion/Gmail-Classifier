const { google } = require("googleapis");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:5000/auth/google/callback"; // your OAuth callback

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Function to fetch user's emails
const getEmails = async (accessToken) => {
  oAuth2Client.setCredentials({ access_token: accessToken });

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  // List the latest 10 messages
  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults: 10,
  });

  const messages = res.data.messages || [];

  // Fetch message details
  const emails = await Promise.all(
    messages.map(async (msg) => {
      const messageRes = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "Date"],
      });
      const headers = messageRes.data.payload.headers;
      return {
        id: msg.id,
        subject: headers.find((h) => h.name === "Subject")?.value,
        from: headers.find((h) => h.name === "From")?.value,
        date: headers.find((h) => h.name === "Date")?.value,
      };
    })
  );

  return emails;
};

module.exports = { getEmails };
