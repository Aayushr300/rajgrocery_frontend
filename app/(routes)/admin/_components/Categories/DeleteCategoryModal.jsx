"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DeleteCategoryModal({
  open,
  onOpenChange,
  category,
  onConfirm,
}) {
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/categories/${category.category_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      console.log("Data deleted", res);

      const data = await res.json();

      console.log("Delete response data:", data);
      if (data.success) {
        toast.success("Category deleted successfully");
        onConfirm(category.category_id);
        onOpenChange(false);
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting category");
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <div className="p-4 space-y-4">
        <h3 className="text-lg font-bold">Delete Category</h3>
        <p>
          Are you sure you want to delete <strong>{category?.name}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
