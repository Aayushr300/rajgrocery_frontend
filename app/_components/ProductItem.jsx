import React from "react";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useCart } from "../_context/CartContext";

function ProductItem({ product }) {
  const { cart, addToCart, removeFromCart } = useCart();
  console.log("Product", product);
  // Check if product is already in the cart
  // Find the cart item by product_id
  const cartItem = cart.find((item) => item.product_id === product.product_id);
  const quantity = cartItem?.quantity || 0;
  return (
    <div className="w-full hover:scale-102 max-w-[300px] mx-auto p-3 md:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
      {/* Image + Discount Badge */}
      {/* <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-50">
        {product.mrp > product.sellingPrice && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold z-10">
            {Math.round(
              ((product.mrp - product.sellingPrice) / product.mrp) * 100
            )}
            % OFF
          </div>
        )}
        <Image
          src={product.image_url}
          alt={product.product_name}
          fill
          className="object-contain p-3"
        />
      </div> */}

      <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-50">
        {Number(product.mrp) > Number(product.selling_price) && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-bold z-10">
            {Math.round(
              ((Number(product.mrp) - Number(product.selling_price)) /
                Number(product.mrp)) *
                100
            )}
            % OFF
          </div>
        )}
        <Image
          src={product.image_url}
          alt={product.product_name}
          fill
          className="object-contain p-3"
        />
      </div>

      {/* Name */}
      <h2 className="mt-3 text-base font-medium text-gray-800">
        {product.product_name}
      </h2>

      {/* Price */}
      <div className="flex items-center gap-3 mt-1">
        <h2 className="text-lg font-semibold text-green-600">
          ₹{product.selling_price}
        </h2>
        {product.mrp > product.selling_price && (
          <h2 className="text-sm text-gray-500 line-through">₹{product.mrp}</h2>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-4 flex justify-between gap-2">
        {quantity === 0 ? (
          <Button
            onClick={() => addToCart(product)}
            variant="outline"
            className="flex-1 py-2 px-3 bg-white text-green-600 border border-green-600 hover:bg-green-600 hover:text-white transition duration-300 font-medium rounded-lg flex items-center justify-center gap-2 text-sm"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">Add</span>
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 border rounded-lg border-green-600">
            <button
              onClick={() => removeFromCart(product.product_id)}
              className="px-3 py-1 text-green-600 font-bold hover:bg-green-100 transition rounded-l"
            >
              -
            </button>
            <span className="px-3 py-1">{quantity}</span>
            <button
              onClick={() => addToCart(product)}
              className="px-3 py-1 text-green-600 font-bold hover:bg-green-100 transition rounded-r"
            >
              +
            </button>
          </div>
        )}

        <Button
          variant="outline"
          className="flex-1 py-2 px-3 bg-white text-green-600 border border-green-600 hover:bg-green-600 hover:text-white transition duration-300 font-medium rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <SiWhatsapp size={18} />
          <span className="hidden sm:inline">Chat</span>
        </Button>
      </div>
    </div>
  );
}

export default ProductItem;
