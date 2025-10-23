"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import AddCategoriesModal from "./add-categories-modal";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function CategoriesTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BACKEND_API}/admin/get-categories`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data) setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Add new category
  const handleSaveCategory = async (formData) => {
    try {
      const res = await fetch(`${BACKEND_API}/admin/categories`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Category added successfully!");
        setIsAddModalOpen(false);
        fetchCategories(); // Refresh table
      } else {
        toast.error(data.message || "Failed to add category");
      }
    } catch (err) {
      toast.error("An error occurred");
      console.error("API error:", err);
    }
  };

  // 🔹 Delete category
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`${BACKEND_API}/admin/delete-category/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("An error occurred");
    }
  };

  // 🔹 Edit category (basic example — can connect to an edit modal)
  const handleEdit = (category) => {
    toast.info(`Edit modal for "${category.name}" coming soon!`);
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage all product categories</CardDescription>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Description</th>
                <th className="p-3 text-left">Created By</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-muted-foreground"
                  >
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.category_id}
                    className="border-b hover:bg-muted/50"
                  >
                    <td className="p-3">
                      {cat.image_url ? (
                        <img
                          src={cat.image_url}
                          alt={cat.name}
                          className="w-10 h-10 rounded object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded" />
                      )}
                    </td>
                    <td className="p-3 font-medium">{cat.name}</td>
                    <td className="p-3">{cat.description || "-"}</td>
                    <td className="p-3">{cat.created_by || "Admin"}</td>
                    <td className="p-3 flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(cat)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(cat.category_id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      <AddCategoriesModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleSaveCategory}
      />
    </Card>
  );
}
