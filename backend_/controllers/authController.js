const jwt = require("jsonwebtoken");
const User = require("../models/User.js"); // Your User model

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// Google OAuth callback handler
const googleAuthCallback = async (req, res) => {
  try {
    const googleUser = req.user; // Passport attaches Google profile

    if (!googleUser) {
      return res.status(401).json({ success: false, message: "No user info from Google" });
    }

    let user = await User.findOne({ email: googleUser.emails[0].value });

    if (!user) {
      user = await User.create({
        name: googleUser.displayName,
        email: googleUser.emails[0].value,
        googleId: googleUser.id,
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};

// Logout
const logout = (req, res) => {
  if (req.logout) {
    req.logout(() => {
      res.json({ success: true, message: "Logged out successfully" });
    });
  } else {
    // For JWT-only setup, just clear token on frontend
    res.json({ success: true, message: "Logged out successfully" });
  }
};

module.exports = {
  googleAuthCallback,
  logout,
};
