const express = require("express");
const Category = require("../models/Category"); // make sure path is correct

const router = express.Router();

// Create category
router.post("/", async (req, res) => {
  try {
    const { userId, name, keywords } = req.body;
    const category = new Category({ userId, name, keywords });
    await category.save();
    console.log("📂 New category created:", category);
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Get user categories
router.get("/:userId", async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");

    const categories = await Category.find({ userId: req.params.userId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Update category
router.put("/:id", async (req, res) => {
  try {
    const { name, keywords } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, keywords },
      { new: true } // return updated doc
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ error: "Error updating category" });
  }
});

// Delete category
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting category" });
  }
});

module.exports = router;
