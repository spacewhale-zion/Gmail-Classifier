const express = require("express");
const { getGmailInstance } = require("../services/emailService");
const { Base64 } = require("js-base64");

const router = express.Router();

// Fetch email details and render as HTML
router.get("/messages/:id", async (req, res) => {
  try {
    const gmail = getGmailInstance();
    const { id } = req.params;

    const message = await gmail.users.messages.get({
      userId: "me",
      id,
      format: "full",
    });

    let bodyData = "";
    const parts = message.data.payload.parts;

    if (parts && parts.length) {
      const htmlPart = parts.find(p => p.mimeType === "text/html");
      if (htmlPart?.body?.data) {
        bodyData = Base64.decode(
          htmlPart.body.data.replace(/-/g, "+").replace(/_/g, "/")
        );
      }
    } else if (message.data.payload.body?.data) {
      bodyData = Base64.decode(
        message.data.payload.body.data.replace(/-/g, "+").replace(/_/g, "/")
      );
    }

    res.send(bodyData || "<p>No content available</p>");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching email");
  }
});

// Proxy route for fetching external content
router.get("/proxy", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing 'url' query parameter");

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");

    // If it's JSON
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.json(data);
    }

    // Otherwise, treat it as HTML/text
    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error("Error fetching external URL:", err);
    res.status(500).send("Error fetching external content");
  }
});


module.exports = router;
