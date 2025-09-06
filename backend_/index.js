const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const db=require("./config/db");
require("dotenv").config();
require("./config/passport");
const { Server } = require("socket.io");
// const { getEmails } = require("./services/emailService");

const { fetchLatestEmails, getGmailInstance } = require("./services/emailService");

const authRoutes = require("./routes/authRoutes");
const emailRoutes = require("./routes/emailRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const Email = require("./models/Email");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/emails", emailRoutes);
app.use("/categories", categoryRoutes);

// Socket.io

// Socket.io
const emailCache = []; // in-memory cache (latest 100)

// Poll Gmail every 30s and sync DB + cache
setInterval(async () => {
  try {
    const gmail = getGmailInstance(); // throws if not logged in
    const emails = await fetchLatestEmails();

    if (emails.length) {
      console.log("📩 Poll fetched emails:", emails.length);

      // 1. Clear old emails in DB
      await Email.deleteMany({});

      // 2. Insert fresh emails
      await Email.insertMany(emails);

      // 3. Update in-memory cache
      emailCache.splice(0, emailCache.length, ...emails.slice(-100));
      
      // console.log(emailCache);
      // 4. Broadcast to all connected clients
      io.emit("emails", emailCache);
      console.log("📨 Emails synced & broadcasted:", emailCache.length);
    }
  } catch (err) {
    console.log("⏳ Poll skipped:", err.message);
  }
}, 30000);


io.on("connection", async (socket) => {
  console.log("📡 Client connected:", socket.id);

  try {
    // Load last 100 emails from DB on new connection
    const latestEmails = await Email.find().sort({ createdAt: -1 }).limit(100);
    emailCache.splice(0, emailCache.length, ...latestEmails.reverse()); // reset + fill cache

    socket.emit("emails", emailCache);
  } catch (err) {
    console.error("❌ Error loading emails:", err);
    socket.emit("emails", []); // fallback
  }

  // Handle new incoming email event
  socket.on("new-email", async (emailData) => {
    try {
      const newEmail = new Email(emailData);
      await newEmail.save();

      // update cache
      emailCache.push(newEmail);
      if (emailCache.length > 100) emailCache.shift();

      // broadcast to all clients
      io.emit("emails", emailCache);
      console.log("📨 New email broadcasted:", newEmail._id);
    } catch (err) {
      console.error("❌ Error saving new email:", err);
      socket.emit("error", { message: "Failed to save email" });
    }
  });

  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});


// DB connection
// mongoose
//   .connect(process.env.MONGO_URI || "mongodb://localhost:27017/emailApp")
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));
db();

// Start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



