"use client";
import React, { useState, useEffect } from "react";
import CouponsSection from "../../_components/CouponsSection";

import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiTag,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;
export default function CartPage() {
  const [updateCart, setUpdateCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const finalprice = Number((totalAmount - discountAmount + 0).toFixed(2));
  const [availableCoupons, setAllCoupon] = useState([]);
  const router = useRouter();

  // Available coupons
  useEffect(() => {
    const getCoupons = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/coupons`);
        console.log("Response:", response);
        setAllCoupon(response.data); // ✅ Save data to state
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error("Failed to load coupons");
      }
    };

    getCoupons();
  }, []);

  useEffect(() => {
    handleCartItems();
  }, []);

  useEffect(() => {
    const total = updateCart.reduce(
      (acc, item) => acc + item.selling_price * item.quantity,
      0
    );
    setTotalAmount(total);

    // Reset coupon if subtotal drops below coupon's minOrder
    if (appliedCoupon && total < appliedCoupon.minOrder) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  }, [updateCart]);

  const handleCartItems = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setUpdateCart(cart);
  };

  const incrementQty = (id) => {
    const updatedCart = updateCart.map((item) =>
      item.product_id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setUpdateCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const decrementQty = (id) => {
    const updatedCart = updateCart.map((item) =>
      item.product_id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    setUpdateCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = updateCart.filter((item) => item.product_id !== id);
    setUpdateCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const applyCoupon = () => {
    setIsApplyingCoupon(true);
    setCouponError("");

    setTimeout(() => {
      const coupon = availableCoupons.find(
        (c) => c.code.toUpperCase() === couponCode.toUpperCase()
      );

      if (!coupon) {
        setCouponError("Invalid coupon code");
        setIsApplyingCoupon(false);
        return;
      }

      if (totalAmount < coupon.minOrder) {
        setCouponError(`Minimum order of ₹${coupon.minOrder} required`);
        setIsApplyingCoupon(false);
        return;
      }

      let discount = 0;
      if (coupon.type === "percentage") {
        discount = (totalAmount * coupon.discount) / 100;
      } else if (coupon.type === "fixed") {
        discount = coupon.discount;
      } else if (coupon.type === "shipping") {
        discount = 0; // Shipping type discount handled in UI
      }

      setDiscountAmount(discount);
      setAppliedCoupon(coupon);
      setIsApplyingCoupon(false);
    }, 500);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
  };

  // const createOrderInDb = async () => {
  //   setIsCheckingOut(true);
  //   setCheckoutError("");

  //   try {
  //     // Check if user is logged in
  //     const token = sessionStorage.getItem("token");
  //     if (!token) {
  //       setCheckoutError("Please log in to proceed to checkout");
  //       setIsCheckingOut(false);

  //       // Optional: Redirect to login page after a delay
  //       setTimeout(() => {
  //         router.push("/signin");
  //       }, 2000);
  //       return;
  //     }

  //     let userId;
  //     try {
  //       const user = JSON.parse(sessionStorage.getItem("user"));
  //       userId = user.id;

  //       if (!userId) {
  //         throw new Error("User ID not found");
  //       }
  //     } catch (error) {
  //       console.error("Error parsing user data:", error);
  //       setCheckoutError("Please log in again");
  //       setIsCheckingOut(false);

  //       // Clear invalid user data and redirect to login
  //       sessionStorage.removeItem("user");
  //       sessionStorage.removeItem("token");

  //       setTimeout(() => {
  //         router.push("/signin");
  //       }, 2000);
  //       return;
  //     }

  //     // Generate checkout ID
  //     const checkoutId =
  //       "CHK-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);

  //     const orderData = {
  //       data: {
  //         checkout_id: checkoutId,
  //         order_status: "pending",
  //         userId: userId,
  //         total_amount: finalprice,
  //         discount_amount: discountAmount,
  //         coupon_code: appliedCoupon ? appliedCoupon.code : null,
  //         order_item: updateCart.map((item) => ({
  //           productId: item.product_id,
  //           name: item.product_name,
  //           mrp: item.mrp,
  //           sellingPrice: item.selling_price,
  //           quantity: item.quantity,
  //           image: item.image_url,
  //         })),

  //         order_created_at: new Date().toISOString(),
  //       },
  //     };

  //     // Save to localStorage
  //     localStorage.setItem("latestOrder", JSON.stringify(orderData));

  //     // Simulate a brief delay for better UX
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     // Redirect to checkout page
  //     router.push(`/checkout/${checkoutId}`);
  //   } catch (error) {
  //     console.error("Error during checkout:", error);
  //     setCheckoutError("An error occurred during checkout. Please try again.");
  //   } finally {
  //     setIsCheckingOut(false);
  //   }
  // };

  const createOrderInDb = async () => {
    setIsCheckingOut(true);
    setCheckoutError("");

    try {
      // Check if token exists in sessionStorage
      const token = sessionStorage.getItem("token");
      if (!token) {
        setCheckoutError("Please log in to proceed to checkout");
        setIsCheckingOut(false);

        // Redirect to login page
        setTimeout(() => {
          router.push("/signin");
        }, 1000);
        return;
      }

      // Retrieve user info
      const user = JSON.parse(sessionStorage.getItem("user"));
      const userEmail = user?.email;
      if (!userEmail) {
        setCheckoutError("User info not found. Please log in again.");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
        setIsCheckingOut(false);

        setTimeout(() => {
          router.push("/signin");
        }, 1000);
        return;
      }

      // Generate checkout ID
      const checkoutId =
        "CHK-" + Date.now() + "-" + Math.floor(Math.random() * 1000000);

      const orderData = {
        data: {
          checkout_id: checkoutId,
          order_status: "pending",
          userEmail: userEmail, // using email as identifier
          total_amount: finalprice,
          discount_amount: discountAmount,
          coupon_code: appliedCoupon?.code || null,
          order_item: updateCart.map((item) => ({
            productId: item.product_id,
            name: item.product_name,
            mrp: item.mrp,
            sellingPrice: item.selling_price,
            quantity: item.quantity,
            image: item.image_url,
          })),
          order_created_at: new Date().toISOString(),
        },
      };

      // Save to localStorage
      localStorage.setItem("latestOrder", JSON.stringify(orderData));

      // Redirect to checkout
      router.push(`/checkout/${checkoutId}`);
    } catch (error) {
      console.error("Error during checkout:", error);
      setCheckoutError("An error occurred during checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <FiShoppingBag className="text-green-600 text-3xl mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Your Shopping Cart
          </h1>
          {updateCart.length > 0 && (
            <span className="ml-auto bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium">
              {updateCart.length} {updateCart.length === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {updateCart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md mx-auto">
            <div className="text-gray-300 mb-4">
              <FiShoppingBag className="mx-auto text-5xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link href="/">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center mx-auto">
                <FiShoppingBag className="mr-2" />
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart Items */}
            <div className="w-full lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiShoppingBag className="mr-2 text-green-600" />
                  Cart Items
                </h2>
                <div className="space-y-4">
                  {updateCart.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={
                            item.image_url || "https://via.placeholder.com/150"
                          }
                          alt={item.product_name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.product_name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.brand || "Generic Brand"}
                        </p>
                        <div className="flex items-center mt-2">
                          <p className="text-md font-bold text-green-700">
                            ₹{item.selling_price}
                          </p>
                          {item.mrp > item.selling_price && (
                            <p className="text-gray-400 line-through text-sm ml-2">
                              ₹{item.mrp}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col items-end">
                        <div className="flex items-center border rounded-md bg-gray-50">
                          <button
                            onClick={() => decrementQty(item.product_id)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-md"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="px-3 py-1 text-gray-800 font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQty(item.product_id)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-md"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <p className="text-lg font-bold text-gray-900 mt-2">
                          ₹{(item.selling_price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 mt-2 hover:bg-red-50 rounded-full"
                          aria-label="Remove item"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Section */}
              <CouponsSection
                totalAmount={totalAmount}
                appliedCoupon={appliedCoupon}
                setAppliedCoupon={setAppliedCoupon}
                discountAmount={discountAmount}
                setDiscountAmount={setDiscountAmount}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
              />
            </div>

            {/* Right Column - Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-3">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  {updateCart.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600 truncate max-w-[60%]">
                        {item.product_name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(item.selling_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}

                {appliedCoupon?.type === "shipping" && (
                  <div className="flex justify-between text-green-600">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                )}

                <div className="flex justify-between text-lg font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-green-700">
                    ₹{finalprice.toFixed(2)}
                  </span>
                </div>

                {checkoutError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <FiAlertCircle className="text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">
                      {checkoutError}
                    </span>
                  </div>
                )}

                <button
                  onClick={createOrderInDb}
                  disabled={isCheckingOut}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 mt-6 text-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCheckingOut ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </button>

                <div className="mt-4 text-center">
                  <Link href="/">
                    <button className="text-green-600 hover:text-green-800 font-medium">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
