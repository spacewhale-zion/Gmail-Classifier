import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit3, Plus } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  keywords: string[];
}

// 🔹 Add Category Form
const AddCategoryForm: React.FC<{
  userId: string;
  onAdd: (category: Category) => void;
}> = ({ userId, onAdd }) => {
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await axios.post("http://localhost:5000/categories", {
        userId,
        name,
        keywords: keywords.split(",").map((k) => k.trim()),
      });
      onAdd(res.data);
      setName("");
      setKeywords("");
    } catch (err) {
      console.error("Failed to add category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm"
    >
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Plus className="h-4 w-4" /> Add New Category
      </h3>
      <input
        type="text"
        placeholder="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="text"
        placeholder="Keywords (comma separated)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? "Adding..." : "Add Category"}
      </button>
    </form>
  );
};

// 🔹 Edit Category Form
const EditCategoryForm: React.FC<{
  category: Category;
  onSave: (updated: Category) => void;
  onCancel: () => void;
}> = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState(category.name);
  const [keywords, setKeywords] = useState(category.keywords.join(", "));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const res = await axios.put(
        `http://localhost:5000/categories/${category._id}`,
        {
          name,
          keywords: keywords.split(",").map((k) => k.trim()),
        }
      );
      onSave(res.data);
    } catch (err) {
      console.error("Failed to edit category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 p-4 border rounded-lg bg-gray-100">
      <h3 className="font-semibold mb-2">Edit Category</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
        placeholder="Category Name"
      />
      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
        placeholder="Keywords (comma separated)"
      />
      <div className="space-x-2">
        <button
          onClick={handleSave}
          disabled={isSubmitting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// 🔹 Category Card
const CategoryCard: React.FC<{
  category: Category;
  onDelete: (id: string, name: string) => void;
  onEdit: (c: Category) => void;
  isSubmitting: boolean;
}> = ({ category, onDelete, onEdit, isSubmitting }) => (
  <div className="flex justify-between items-center bg-white p-4 border rounded-lg shadow-sm">
    <div>
      <div className="font-semibold text-gray-800">{category.name}</div>
      <div className="text-sm text-gray-600">{category.keywords.join(", ")}</div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(category)}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
      >
        <Edit3 className="h-4 w-4" /> Edit
      </button>
      <button
        onClick={() => onDelete(category._id, category.name)}
        disabled={isSubmitting}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
      >
        <Trash2 className="h-4 w-4" /> Delete
      </button>
    </div>
  </div>
);

// 🔹 Stats Footer
const StatsFooter: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const totalKeywords = categories.reduce(
    (sum, c) => sum + c.keywords.length,
    0
  );
  return (
    <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {categories.length}
          </div>
          <div className="text-sm text-gray-600">Total Categories</div>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{totalKeywords}</div>
          <div className="text-sm text-gray-600">Total Keywords</div>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {totalKeywords > 0
              ? (totalKeywords / categories.length).toFixed(1)
              : "0"}
          </div>
          <div className="text-sm text-gray-600">Avg Keywords/Category</div>
        </div>
      </div>
    </div>
  );
};

// 🔹 Main ManageCategories
const ManageCategories: React.FC<{ userId: string }> = ({ userId }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/categories/${userId}`
        );
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    if (userId) fetchCategories();
  }, [userId]);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      setIsSubmitting(true);
      await axios.delete(`http://localhost:5000/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdd = (newCategory: Category) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleSaveEdit = (updated: Category) => {
    setCategories((prev) =>
      prev.map((c) => (c._id === updated._id ? updated : c))
    );
    setEditCategory(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

      {/* Add Form */}
      <AddCategoryForm userId={userId} onAdd={handleAdd} />

      {/* Categories List */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <p className="text-gray-500">No categories available.</p>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onDelete={handleDelete}
              onEdit={setEditCategory}
              isSubmitting={isSubmitting}
            />
          ))
        )}
      </div>

      {/* Edit Form */}
      {editCategory && (
        <EditCategoryForm
          category={editCategory}
          onSave={handleSaveEdit}
          onCancel={() => setEditCategory(null)}
        />
      )}

      {/* Stats Footer */}
      {categories.length > 0 && <StatsFooter categories={categories} />}
    </div>
  );
};

export default ManageCategories;
