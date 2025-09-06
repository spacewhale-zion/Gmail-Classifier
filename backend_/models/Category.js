const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategorySchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  keywords: [{ type: String }]
});

module.exports = mongoose.model("Category", CategorySchema);
