const express = require("express");
const passport = require("passport");
// const { logout } = require("../controllers/authController");
const { initializeEmails } = require("../services/emailService");

const router = express.Router();

// Login with Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/gmail.readonly"
    ]
  })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const accessToken = req.user?.accessToken;
    const refreshToken = req.user?.refreshToken;
    console.log("✅ accessToken:", accessToken);

    // Initialize Gmail with both tokens
    initializeEmails(accessToken, refreshToken);

    res.redirect(`${process.env.FRONTEND_URL}/dashboard`); // Redirect to frontend
  }
);


// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.status(200).send({ message: "Logged out" });
  });
});


// Check login status
router.get("/me", (req, res) => {
  if (req.user) {
    res.json({
      id: req.user.googleId,
      name: req.user.name,
      email: req.user.email,
    });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});


module.exports = router;
