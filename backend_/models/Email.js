const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  id: { type: String, required: true },  // <-- change ObjectId to String
  subject: String,
  from: String,
  body: String,
  receivedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Email", emailSchema);
