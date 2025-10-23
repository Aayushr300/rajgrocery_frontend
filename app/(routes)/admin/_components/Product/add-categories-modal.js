"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaCloudUploadAlt } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AddCategoryModal({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null, // 👈 new field
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setFormData({
        name: "",
        description: "",
        image: null,
      });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 👇 Handle Image Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only PNG, JPG, and JPEG files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("File size must be under 5MB.");
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
    toast.success("Image selected successfully!");
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    // ✅ Prepare data to send
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    onSave(data); // send to backend / parent
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Create a new category and upload an image.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Category Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Electronics"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional category description"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Category Image</Label>
            <div className="border-2 border-dashed border-gray-300 hover:border-blue-600 transition-all duration-300 p-6 rounded-md text-center">
              <div className="p-4 bg-gray-100 rounded-full inline-flex">
                <FaCloudUploadAlt className="text-3xl text-gray-400" />
              </div>
              <h2 className="text-gray-700 text-lg font-semibold mt-3">
                Upload Category Image
              </h2>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleButtonClick}
                className="mt-3"
              >
                Browse to Upload
              </Button>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>

              {formData.image && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Preview"
                    className="max-h-24 rounded-lg object-contain mx-auto"
                  />
                  <p className="text-sm text-green-600 mt-2">
                    {formData.image.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Category</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
