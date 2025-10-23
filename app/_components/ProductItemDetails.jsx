"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import GlobalApi from "../_utils/GlobalApi";
import { toast } from "sonner";

function ProductItemDetails({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const price = product.sellingPrice ? product.sellingPrice : product.mrp;
  const [productTotalPrice, setProductTotalPrice] = useState(price);

  // Update total price when quantity changes
  useEffect(() => {
    setProductTotalPrice(price * quantity);
  }, [quantity, price]);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const token = sessionStorage.getItem("token");
  const user = sessionStorage.getItem("user");
  const userData = user ? JSON.parse(user) : null;

  const addToCart = () => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      quantity,
      amount: productTotalPrice,
      image: product.image || "",
    };

    // 1️⃣ Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // 2️⃣ Check if product already exists
    const index = existingCart.findIndex(
      (item) => item.productId === product.id
    );

    if (index > -1) {
      // Product exists, update quantity and amount
      existingCart[index].quantity += quantity;
      existingCart[index].amount =
        existingCart[index].sellingPrice * existingCart[index].quantity;
    } else {
      // New product, push to cart
      existingCart.push(cartItem);
    }

    // 3️⃣ Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));

    // 4️⃣ Show success toast
    toast.success("Product added to cart successfully!");
  };

  return (
    <div className="m-5 flex justify-center sm:px-6 md:px-10 lg:px-20 py-8">
      <div className="w-full max-w-md mx-auto bg-white text-black p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Product Image */}
        <div className="flex justify-center items-center overflow-hidden rounded-xl bg-slate-100 p-3">
          <Image
            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + product.images.url}
            alt={product.name}
            width={140}
            height={140}
            className="object-contain transition-transform duration-500 hover:scale-105 rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="mt-4">
          {/* Product Name */}
          <h2 className="text-lg font-bold mb-1">{product.name}</h2>

          {/* Brand */}
          <p className="text-sm text-gray-500 mb-3">
            {product.brand || product.name}
          </p>

          {/* Price */}
          <p className="text-xl font-bold text-green-600">
            ₹{product.sellingPrice}
          </p>

          {/* Quantity Type */}
          <p className="text-sm text-gray-600 mt-1">
            Quantity:{" "}
            <span className="font-semibold text-gray-800">
              {product.itemQuantityType}
            </span>
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-5">
            {/* Quantity Controls */}
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={decrement}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg transition-colors duration-200 active:bg-gray-300"
              >
                −
              </button>
              <span className="px-4 py-2 text-lg font-medium bg-white text-center">
                {quantity}
              </span>
              <button
                onClick={increment}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-lg transition-colors duration-200 active:bg-gray-300"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={addToCart}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-md transition-all duration-300 hover:scale-105 active:scale-95 
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                <>
                  🛒 <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductItemDetails;
