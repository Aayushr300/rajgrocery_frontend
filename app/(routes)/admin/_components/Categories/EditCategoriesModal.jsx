"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function EditCategoriesModal({
  open,
  onOpenChange,
  category,
  onSave,
}) {
  const [name, setName] = useState(category?.name || "");
  const [description, setDescription] = useState(category?.description || "");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
      setImage(null);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return toast.error("Category name is required");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (image) formData.append("image", image);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${category.category_id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Category updated successfully");
        onSave(data.category); // pass updated category to parent
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <h3 className="text-lg font-bold">Edit Category</h3>

        <div>
          <Label>Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <Label>Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
