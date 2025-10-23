"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FiCheckCircle,
  FiTruck,
  FiPackage,
  FiClock,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiShoppingBag,
  FiArrowLeft,
  FiDownload,
  FiShare,
} from "react-icons/fi";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import axios from "axios";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function OrderConfirmationPage() {
  const router = useRouter();
  const params = useParams();
  const { orderId } = params;
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`${BACKEND_API_URL}/orders/${orderId}`);
        setOrderData(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleContinueShopping = () => router.push("/");

  const downloadInvoice = async () => {
    try {
      const res = await axios.get(
        `${BACKEND_API_URL}/orders/${orderId}/invoice`,
        { responseType: "blob" } // important for binary file
      );

      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      toast.error("Failed to download invoice");
    }
  };

  // const downloadInvoice = () => toast.success("Invoice downloaded!");
  const shareOrder = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Order Details",
          text: `Check out my order #${orderId} from Your Store`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Order link copied!");
    }
  };

  const getExpectedDeliveryDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      </div>
    );

  if (!orderData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-semibold text-lg">
            Unable to load order details
          </p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );

  const { shippingAddress } = orderData;
  const address = shippingAddress?.address || {};

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Toaster />

      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-green-600 hover:text-green-800 transition"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-green-900 text-center">
            Order Confirmation
          </h1>
          <div className="w-6" />
        </div>
      </header>

      <motion.div
        className="container mx-auto px-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Card */}
        <motion.div
          className="bg-white shadow-lg rounded-xl p-8 text-center flex flex-col items-center space-y-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <FiCheckCircle className="text-green-600 text-4xl" />
          </div>
          <h2 className="text-2xl font-bold text-green-900">
            Order Confirmed!
          </h2>
          <p className="text-green-600">
            Your order <span className="font-semibold">#{orderId}</span> has
            been placed successfully.
          </p>
          <p className="text-green-700">A confirmation email has been sent.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Delivery Info */}
            <motion.div
              className="bg-white shadow rounded-xl p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-green-900 flex items-center mb-4">
                <FiTruck className="mr-2" /> Delivery Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Shipping Address */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-medium text-green-900">
                    {shippingAddress?.full_name || "N/A"}
                  </p>
                  <p>{address.address_line_1 || "N/A"}</p>
                  {address.address_line_2 && <p>{address.address_line_2}</p>}
                  <p>
                    {address.city || ""}, {address.state || ""},{" "}
                    {address.postal_code || ""}, {address.country || ""}
                  </p>
                  <div className="mt-2 flex items-center text-green-700">
                    <FiPhone className="mr-2" />{" "}
                    {shippingAddress?.phone || "N/A"}
                  </div>
                  <div className="flex items-center text-green-700">
                    <FiMail className="mr-2" />{" "}
                    {shippingAddress?.email || "N/A"}
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2 text-green-700">
                    <FiClock className="mr-2" /> Expected Delivery
                  </div>
                  <p className="text-green-900 font-semibold">
                    {getExpectedDeliveryDate()}
                  </p>
                  <div className="mt-4 flex items-center text-green-700">
                    <FiPackage className="mr-2" /> Standard Delivery (2-3
                    business days)
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Items */}
            <motion.div
              className="bg-white shadow rounded-xl p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-green-900 flex items-center mb-4">
                <FiShoppingBag className="mr-2" /> Order Items
              </h3>
              <div className="space-y-4">
                {orderData.order_item.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center border-b pb-2 last:border-0"
                  >
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-md overflow-hidden mr-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-green-900">
                          {item.name}
                        </p>
                        <p className="text-green-600 text-sm">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-green-600 text-sm">
                          Size: {item.size || "Standard"}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-green-900">
                      ₹{(item.sellingPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Payment Info */}
            <motion.div
              className="bg-white shadow rounded-xl p-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-green-900 flex items-center mb-4">
                <FiCreditCard className="mr-2" /> Payment Information
              </h3>
              <div className="bg-green-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                <div>
                  <p className="text-green-700 text-sm">Method</p>
                  <p className="font-medium text-green-900">
                    {orderData.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Credit/Debit Card"}
                  </p>
                </div>
                <div>
                  <p className="text-green-700 text-sm">Status</p>
                  <p className="font-medium text-green-600">
                    {orderData.paymentMethod === "cod"
                      ? "Paid on Delivery"
                      : "Paid Successfully"}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* Summary Card */}
            <motion.div
              className="bg-white shadow rounded-xl p-6 sticky top-6"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold text-green-900 border-b pb-3 mb-4">
                Order Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-green-600">
                  <span>Subtotal</span>
                  <span>₹{orderData.total_amount.toFixed(2)}</span>
                </div>
                {orderData.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{orderData.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-green-600">
                  <span>Delivery</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Tax</span>
                  <span>₹{(orderData.total_amount * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-800 border-t pt-2">
                  <span>Total</span>
                  <span>
                    ₹
                    {(
                      orderData.total_amount +
                      orderData.total_amount * 0.05
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={downloadInvoice}
                  className="w-full flex items-center justify-center bg-green-100 text-green-700 hover:bg-green-200 py-2 px-4 rounded-lg transition"
                >
                  <FiDownload className="mr-2" /> Download Invoice
                </button>
                <button
                  onClick={shareOrder}
                  className="w-full flex items-center justify-center border border-green-600 text-green-700 hover:bg-green-50 py-2 px-4 rounded-lg transition"
                >
                  <FiShare className="mr-2" /> Share Order
                </button>
                <button
                  onClick={handleContinueShopping}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow transition"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
