const { google } = require("googleapis");
const Email = require("../models/Email");
let gmailInstance = null;
let emailsCache = [];
let emailClient = null;
let oauth2Client = null;

function initializeEmails(accessToken, refreshToken) {
  oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  gmailInstance = google.gmail({ version: "v1", auth: oauth2Client });

  console.log("📧 Gmail service initialized!");
  return gmailInstance;
}

                                                         
function getGmailInstance() {
  if (!gmailInstance) throw new Error("Gmail is not initialized!");
  return gmailInstance;
}

// Fetch latest 100 emails and update cache
async function fetchLatestEmails() {
  if (!gmailInstance) return [];

  const res = await gmailInstance.users.messages.list({
    userId: "me",
    maxResults: 100,
  });

  const messages = res.data.messages || [];
  const emails = await Promise.all(
    messages.map(async (msg) => {
      const msgRes = await gmailInstance.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "full",
      });

      const payload = msgRes.data.payload;
      const headers = payload.headers;

      const subject = headers.find((h) => h.name === "Subject")?.value || "";
      const from = headers.find((h) => h.name === "From")?.value || "";
      let body = "";

      if (payload.parts) {
        const htmlPart = payload.parts.find((p) => p.mimeType === "text/html");
        if (htmlPart?.body?.data) {
          body = Buffer.from(htmlPart.body.data, "base64").toString("utf-8");
        }
      } else if (payload.body?.data) {
        body = Buffer.from(payload.body.data, "base64").toString("utf-8");
      }

      return { id: msg.id, subject, from, body };
    })
  );

  emailsCache = emails.slice(-100); // update cache
  return emailsCache;
}

function getEmailsCache() {
  return emailsCache;
}

function getEmailClient() {
  return emailClient;
}

module.exports = {
  initializeEmails,
  getGmailInstance,
  fetchLatestEmails,
  getEmailsCache,
  getEmailClient,
};
