const express = require("express");
const Email = require("../models/Email");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Add a new email
router.post("/", protect, async (req, res) => {
  try {
    const { subject, body, category } = req.body;

    const email = new Email({
      userId: req.user._id,
      subject,
      body,
      category,
    });

    await email.save();
    res.json(email);
  } catch (err) {
    console.error("Error saving email:", err);
    res.status(500).json({ msg: "Error saving email" });
  }
});

// Get all emails of logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const emails = await Email.find({ userId: req.user._id });
    res.json(emails);
  } catch (err) {
    console.error("Error fetching emails:", err);
    res.status(500).json({ msg: "Error fetching emails" });
  }
});

module.exports = router;
