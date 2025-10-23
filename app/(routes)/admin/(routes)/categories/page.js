"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tag, Edit, Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import AddCategoriesModal from "../../_components/Categories/AddCategoriesModal";
import EditCategoriesModal from "../../_components/Categories/EditCategoriesModal";
import DeleteProductModal from "../../_components/Categories/DeleteCategoryModal";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${BACKEND_API}/get-categories`, {
          method: "GET",
          credentials: "include",
        });
        const result = await res.json();

        // Extract the array safely
        setCategories(result.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Add category
  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [newCategory, ...prev]);
  };

  // Update category
  const handleUpdateCategory = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.category_id === updatedCategory.category_id ? updatedCategory : cat
      )
    );
  };

  // Delete category
  const handleDeleteCategory = (deletedId) => {
    console.log("Deleted ID:", deletedId);
    setCategories((prev) =>
      prev.filter((cat) => cat.category_id !== deletedId)
    );
  };

  console.log("Ctegoied", categories);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Category
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((category, index) => (
              <tr
                key={category.category_id}
                className="hover:bg-blue-50/50 transition-all duration-200 group cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {category.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {category.category_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-700 max-w-xs truncate">
                    {category.description || (
                      <span className="text-gray-400 italic">
                        No description
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {category.image_url ? (
                      <div className="relative group">
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="h-12 w-12 object-cover rounded-lg shadow-sm border border-gray-200 transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all" />
                      </div>
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                        <Image className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-200 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Add modals below */}
      <AddCategoriesModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddCategory}
      />

      <EditCategoriesModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        category={selectedCategory}
        onUpdate={handleUpdateCategory}
      />

      <DeleteProductModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        category={selectedCategory}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}
