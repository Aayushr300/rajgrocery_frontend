"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function DeleteProductModal({
  open,
  onOpenChange,
  product,
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle>Delete Product</DialogTitle>
          </div>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to delete this
            product?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
              <img
                src={product?.image_url || "/placeholder-product.jpg"}
                alt={product?.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div>
              <h4 className="font-medium">{product?.name}</h4>
              <p className="text-sm text-muted-foreground">
                {product?.category}
              </p>
              <p className="text-sm">Stock: {product?.stock}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
