"use client";
import React, { useEffect, useState } from "react";
import {
  FiPackage,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiCreditCard,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiBox,
} from "react-icons/fi";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function MyOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.id) {
          setUserId(parsedUser.id);
        } else {
          setError("User ID not found. Please log in.");
          setLoading(false);
        }
      } else {
        setError("No user found. Please log in.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error reading user from sessionStorage:", err);
      setError("Something went wrong while fetching user data.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${BACKEND_API_URL}/user/my-order/${userId}`
        );
        const ordersData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setOrders(ordersData);
        setError("");
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load your orders. Please try again later."
        );
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FiClock className="text-yellow-500" />;
      case "completed":
      case "delivered":
        return <FiCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FiXCircle className="text-red-500" />;
      case "shipped":
        return <FiTruck className="text-blue-500" />;
      default:
        return <FiPackage className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "razorpay":
        return <FiCreditCard className="text-blue-500" />;
      case "cod":
        return <FiPackage className="text-green-500" />;
      default:
        return <FiCreditCard className="text-gray-500" />;
    }
  };

  const getOrderProgress = (status) => {
    const steps = [
      { key: "ordered", label: "Ordered", active: true },
      { key: "confirmed", label: "Confirmed", active: status !== "pending" },
      {
        key: "shipped",
        label: "Shipped",
        active:
          status === "shipped" ||
          status === "delivered" ||
          status === "completed",
      },
      {
        key: "delivered",
        label: "Delivered",
        active: status === "delivered" || status === "completed",
      },
    ];
    return steps;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <FiAlertCircle size={48} className="text-red-500 mb-4" />
        <p className="text-red-600 text-lg text-center mb-4">{error}</p>
        <Link href="/">
          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Return to Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FiPackage className="text-green-600 mr-3" />
            My Orders
          </h1>
          <p className="text-gray-600">
            View your order history and track your purchases
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center">
            <FiAlertCircle className="text-yellow-600 mr-3" />
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <FiPackage className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No orders found
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Looks like you haven't placed any orders yet. Start shopping to
              see your orders here!
            </p>
            <Link href="/">
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-colors duration-200">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <div
                key={order.order_id || idx}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Order Summary - Always Visible */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrderDetails(order.order_id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {order.items?.[0]?.image ? (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={order.items[0].image}
                              alt={order.items[0].name || "Product image"}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                            <div className="hidden w-full h-full bg-gray-200 items-center justify-center">
                              <FiBox className="text-gray-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FiBox className="text-gray-400 text-xl" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            Order #{order.order_id}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              order.status
                            )} flex items-center gap-1`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status?.charAt(0).toUpperCase() +
                              order.status?.slice(1)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-1">
                          {order.items?.length || 0} item
                          {order.items?.length !== 1 ? "s" : ""} • Placed on{" "}
                          {formatDate(order.created_at)}
                        </p>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="font-medium text-gray-900">
                            {formatPrice(order.final_amount)}
                          </span>
                          {order.discount_amount > 0 && (
                            <span className="text-green-600">
                              Saved {formatPrice(order.discount_amount)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-600">Order Total</p>
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(order.final_amount)}
                        </p>
                      </div>
                      <div className="text-gray-400">
                        {expandedOrder === order.order_id ? (
                          <FiChevronUp size={20} />
                        ) : (
                          <FiChevronDown size={20} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Order Details */}
                {expandedOrder === order.order_id && (
                  <div className="border-t border-gray-200">
                    {/* Order Progress */}
                    <div className="p-6 bg-gray-50">
                      <h4 className="font-medium text-gray-700 mb-4">
                        Order Status
                      </h4>
                      <div className="flex items-center justify-between max-w-2xl">
                        {getOrderProgress(order.status).map((step, index) => (
                          <div
                            key={step.key}
                            className="flex flex-col items-center flex-1"
                          >
                            <div className="flex items-center w-full">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                                  step.active
                                    ? "bg-green-500 border-green-500 text-white"
                                    : "bg-white border-gray-300 text-gray-400"
                                }`}
                              >
                                {index + 1}
                              </div>
                              {index <
                                getOrderProgress(order.status).length - 1 && (
                                <div
                                  className={`flex-1 h-1 ${
                                    getOrderProgress(order.status)[index + 1]
                                      .active
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                />
                              )}
                            </div>
                            <span
                              className={`text-xs mt-2 text-center ${
                                step.active
                                  ? "text-green-600 font-medium"
                                  : "text-gray-500"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.customer_details && (
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-start gap-3">
                          <FiMapPin className="text-gray-400 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-700 mb-2">
                              Delivery Address
                            </h4>
                            <div className="bg-white rounded-lg border border-gray-200 p-4">
                              <p className="font-medium text-gray-800">
                                {order.customer_details.full_name}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {order.customer_details.address?.address_line_1}
                                {order.customer_details.address
                                  ?.address_line_2 &&
                                  `, ${order.customer_details.address.address_line_2}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {order.customer_details.address?.city},{" "}
                                {order.customer_details.address?.state} -{" "}
                                {order.customer_details.address?.postal_code}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                Phone: {order.customer_details.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items Details */}
                    <div className="p-6 border-b border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-4">
                        Order Details
                      </h4>
                      <div className="space-y-4">
                        {order.items?.map((item, i) => (
                          <div
                            key={item.order_item_id || i}
                            className="flex gap-4 py-3"
                          >
                            {item.image ? (
                              <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                  src={item.image}
                                  alt={item.name || "Product image"}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.nextSibling.style.display = "flex";
                                  }}
                                />
                                <div className="hidden w-full h-full bg-gray-200 items-center justify-center">
                                  <FiBox className="text-gray-400" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FiBox className="text-gray-400 text-xl" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800">
                                {item.name || "Product"}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Quantity: {item.quantity}
                              </p>
                              {item.price && (
                                <p className="text-sm text-gray-500">
                                  Price: {formatPrice(item.price)} each
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatPrice(item.subtotal)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Payment Details */}
                    {order.payments?.[0] && (
                      <div className="p-6">
                        <h4 className="font-medium text-gray-700 mb-4">
                          Payment Information
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-700 mb-3">
                              Payment Details
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Method:</span>
                                <span className="font-medium flex items-center gap-1">
                                  {getPaymentMethodIcon(
                                    order.payments[0].payment_method
                                  )}
                                  {order.payments[0].payment_method.toUpperCase()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(
                                    order.payments[0].status
                                  )}`}
                                >
                                  {order.payments[0].status}
                                </span>
                              </div>
                              {order.payments[0].transaction_id && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Transaction ID:
                                  </span>
                                  <span className="font-medium text-gray-800">
                                    {order.payments[0].transaction_id}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Payment Date:
                                </span>
                                <span className="font-medium">
                                  {formatDate(order.payments[0].payment_date)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4">
                            <h5 className="font-medium text-gray-700 mb-3">
                              Price Breakdown
                            </h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">
                                  Total Amount:
                                </span>
                                <span>{formatPrice(order.total_amount)}</span>
                              </div>
                              {order.discount_amount > 0 && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Discount:
                                  </span>
                                  <span className="text-green-600">
                                    -{formatPrice(order.discount_amount)}
                                  </span>
                                </div>
                              )}
                              {order.coupon_code && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">
                                    Coupon Applied:
                                  </span>
                                  <span className="text-green-600">
                                    {order.coupon_code}
                                  </span>
                                </div>
                              )}
                              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                                <span className="font-medium text-gray-700">
                                  Final Amount:
                                </span>
                                <span className="font-bold text-lg text-gray-900">
                                  {formatPrice(order.final_amount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
