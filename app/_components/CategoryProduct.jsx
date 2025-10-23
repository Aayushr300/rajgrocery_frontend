import React from "react";
import GlobalApi from "../_utils/GlobalApi";
import Image from "next/image";
import { ShoppingCart, Phone } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProductItemDetails from "./ProductItemDetails";
import { Button } from "@/components/ui/button";
async function CategoryProduct({ categoryName }) {
  const getCategoryProductList = await GlobalApi.getProductByCategory(
    `${categoryName}`
  ); // ✅

  console.log("Category Product List:", getCategoryProductList);

  return (
    <div className="p-5 md:p-10 px-3 md:px-16">
      <h2 className="text-green-500 font-semibold">Category: {categoryName}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5">
        {getCategoryProductList.length > 0 ? (
          getCategoryProductList.map((product) => (
            <div
              key={product.id}
              className="w-full hover:scale-102 max-w-[300px] mx-auto p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out"
            >
              {/* Image + Discount Badge */}
              <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-50">
                {product.mrp > product.sellingPrice && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold z-10">
                    {Math.round(
                      ((product.mrp - product.sellingPrice) / product.mrp) * 100
                    )}
                    % OFF
                  </div>
                )}

                <Image
                  src={
                    process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                    product.images.url
                  }
                  alt={product.name}
                  fill
                  className="object-contain p-3"
                />
              </div>

              {/* Name */}
              <h2 className="mt-3 text-base font-medium text-gray-800">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-lg font-semibold text-green-600">
                  ₹{product.sellingPrice}
                </h2>
                {product.mrp > product.sellingPrice && (
                  <h2 className="text-sm text-gray-500 line-through">
                    ₹{product.mrp}
                  </h2>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-4 flex justify-between items-center gap-2">
                {/* Add to Cart */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 py-2 px-3 bg-white text-green-600 border border-green-600 hover:bg-green-600 hover:text-white transition duration-300 font-medium rounded-lg flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart size={18} />
                      <span className="hidden sm:inline">Add</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{product.name}</DialogTitle>
                      <DialogDescription>
                        Product details and options
                      </DialogDescription>
                    </DialogHeader>
                    <ProductItemDetails product={product} />
                  </DialogContent>
                </Dialog>

                {/* WhatsApp Button */}
                <Button
                  variant="outline"
                  className="flex-1 py-2 px-3 bg-white text-green-600 border border-green-600 hover:bg-green-600 hover:text-white transition duration-300 font-medium rounded-lg flex items-center justify-center gap-2 text-sm"
                >
                  <SiWhatsapp size={18} />
                  <span className="hidden sm:inline">Chat</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-red-500">No products found in this category.</p>
        )}
      </div>
    </div>
  );
}

export default CategoryProduct;
