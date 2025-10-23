"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiCreditCard,
  FiTruck,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
  FiSave,
  FiCheck,
  FiLoader,
  FiPlus,
} from "react-icons/fi";
import axios from "axios";
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutPage({ params }) {
  const router = useRouter();
  const [orderId, setOrderId] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [activeTab, setActiveTab] = useState("delivery");
  const [errors, setErrors] = useState({});
  const [saveStatus, setSaveStatus] = useState(""); // "saving", "saved", "error"
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    fullname: "",
    customer_id: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    saveInfo: false,
    paymentMethod: "",
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);

      // Set user data in form
      setFormData((prev) => ({
        ...prev,
        email: userData.email || "",
        fullname: `${userData.firstName || ""} ${
          userData.lastName || ""
        }`.trim(),
        phone: userData.phone || "",
        customer_id: userData.id || userData.customer_id || "",
      }));
    }
  }, []);

  // In your useEffect that fetches addresses, ensure proper initial selection
  useEffect(() => {
    if (!user || !user.id) return;

    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_API_URL}/user/addresses/${user.id}`
        );

        if (response.data && response.data.length > 0) {
          setAddresses(response.data);

          // Auto-select default address if available
          const defaultAddress = response.data.find((addr) => addr.is_default);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
            populateFormWithAddress(defaultAddress);
          } else {
            // Select first address if no default
            setSelectedAddressId(response.data[0].id);
            populateFormWithAddress(response.data[0]);
          }
        } else {
          // No addresses found, show new address form
          setShowNewAddressForm(true);
          setSelectedAddressId(null); // Clear selection
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setShowNewAddressForm(true);
        setSelectedAddressId(null); // Clear selection
      }
    };

    fetchAddresses();
  }, [user]);
  // Populate form with address data
  const populateFormWithAddress = (address) => {
    setFormData((prev) => ({
      ...prev,
      fullname: address.full_name || prev.fullname,
      phone: address.phone || prev.phone,
      address_line_1: address.address_line1 || "",
      address_line_2: address.address_line2 || "",
      city: address.city || "",
      state: address.state || "",
      postal_code: address.postal_code || "",
      country: address.country || "India",
    }));
  };

  // Handle address selection
  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    const selectedAddress = addresses.find((addr) => addr.id === addressId);
    if (selectedAddress) {
      populateFormWithAddress(selectedAddress);
      setShowNewAddressForm(false);

      // Clear any address-related errors when selecting a saved address
      setErrors((prev) => ({
        ...prev,
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        postal_code: "",
      }));
    }
  };
  // Handle new address button click
  const handleNewAddressClick = () => {
    setShowNewAddressForm(true);
    setSelectedAddressId(null);
    // Clear address fields but keep personal info
    setFormData((prev) => ({
      ...prev,
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      saveInfo: true, // Default to saving new address
    }));
  };

  const paymentMethods = [
    {
      id: "cod",
      title: "Cash on Delivery",
      icon: <FiTruck />,
      description: "Pay when you receive your order",
    },
    {
      id: "razorpay",
      title: "Pay Online",
      icon: <FiCreditCard />,
      description: "Secure online payment via Razorpay",
    },
  ];

  // Resolve params and load order data
  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        setOrderId(resolvedParams.orderId);

        const savedOrder = localStorage.getItem("latestOrder");
        if (!savedOrder) {
          router.push("/cart");
          return;
        }

        const order = JSON.parse(savedOrder);
        setOrderData(order);
      } catch (error) {
        console.error("Checkout initialization error:", error);
        router.push("/cart");
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [params, router]);

  // Save address to profile API call
  const saveAddressToProfile = async () => {
    if (!formData.customer_id) return;

    setSavingAddress(true);
    setSaveStatus("saving");

    try {
      const addressData = {
        user_id: formData.customer_id,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2,
        city: formData.city,
        state: formData.state,
        postal_code: formData.postal_code,
        country: formData.country,
        full_name: formData.fullname,
        phone: formData.phone,
        is_default: true,
        address_type: "home",
      };

      const response = await fetch(`${BACKEND_API_URL}/user/address`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
      });
      console.log("Saving data ", response);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save address");
      }

      // Refresh addresses list
      if (user?.id) {
        const addressesResponse = await axios.get(
          `${BACKEND_API_URL}/user/addresses/${user.id}`
        );
        setAddresses(addressesResponse.data);
        // Select the newly saved address
        if (addressesResponse.data.length > 0) {
          const newAddress =
            addressesResponse.data[addressesResponse.data.length - 1];
          setSelectedAddressId(newAddress.id);
          setShowNewAddressForm(false);
        }
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error saving address:", error);
      setSaveStatus("error");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate delivery form
  const validateDeliveryForm = () => {
    const newErrors = {};
    console.log("fORM DATA", formData);
    if (!formData.fullname.trim()) newErrors.fullname = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    // if (!formData.address_line_1.trim())
    //   newErrors.address_line_1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.postal_code.trim())
      newErrors.postal_code = "postal_code is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    console.log("Continue to payment clicked");
    const isValid = validateDeliveryForm();
    console.log("Form validation result:", isValid);

    if (isValid) {
      console.log("Switching to payment tab");
      setActiveTab("payment");
    } else {
      console.log("Form validation failed with errors:", errors);
    }
  };

  const handleBackToDelivery = () => {
    setActiveTab("delivery");
  };

  // 🔥 RAZORPAY PAYMENT INTEGRATION
  const handleRazorpayPayment = async () => {
    setProcessingPayment(true);

    try {
      // 1. Create Razorpay Order on backend
      const orderResponse = await fetch(
        `${BACKEND_API_URL}/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Math.round(calculateTotal() * 100), // Amount in paise
            currency: "INR",
            receipt: `receipt_${orderId}`,
            notes: {
              order_id: orderId,
              customer_id: formData.customer_id,
            },
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error("Failed to create payment order");
      }

      const { order } = await orderResponse.json();

      // 2. Load Razorpay script
      await loadRazorpayScript();

      // 3. Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Raj Grocery",
        description: `Order #${orderId}`,
        image: "/logo.png",
        order_id: order.id,
        handler: async function (response) {
          // 4. Verify payment on backend
          await verifyPayment(response);
        },
        prefill: {
          name: formData.fullname,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          order_id: orderId,
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Payment initialization failed. Please try again.");
      setProcessingPayment(false);
    }
  };

  console.log("ADDRESSES", addresses);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
      document.body.appendChild(script);
    });
  };

  // Verify payment signature
  const verifyPayment = async (paymentResponse) => {
    try {
      const verifyResponse = await fetch(
        `${BACKEND_API_URL}/payments/verify-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            order_id: orderId,
          }),
        }
      );

      const result = await verifyResponse.json();

      if (result.success) {
        await confirmOrder("razorpay", paymentResponse.razorpay_payment_id);
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("Payment verification failed. Please contact support.");
      setProcessingPayment(false);
    }
  };

  const confirmOrder = async (paymentMethod, paymentId = null) => {
    try {
      const latestOrderRaw = localStorage.getItem("latestOrder");
      const latestOrder = latestOrderRaw ? JSON.parse(latestOrderRaw) : null;

      if (!latestOrder) {
        alert("No latest order found.");
        return;
      }

      const orderData = {
        order_id: orderId, // can be generated on frontend or backend
        customer_id: formData.customer_id, // better to send explicitly for backend reference

        // Payment info
        payment_method: paymentMethod, // "upi", "card", "cod", etc.
        payment_id: paymentId, // txn id if online, null if COD
        payment_status: paymentMethod === "cod" ? "pending" : "success", // backend should also verify
        payment_amount:
          latestOrder.data.final_amount || latestOrder.data.total_amount,

        // Customer info
        customer_details: {
          customer_id: formData.customer_id,
          full_name: formData.fullname,
          email: formData.email,
          phone: formData.phone,
          address: {
            address_line_1: formData.address_line_1,
            address_line_2: formData.address_line_2,
            city: formData.city,
            state: formData.state,
            postal_code: formData.postal_code,
            country: formData.country,
          },
        },

        // Items in the order
        order_items: latestOrder.data.order_item.map((item) => ({
          product_id: item.productId,
          name: item.name, // snapshot useful for invoice
          quantity: item.quantity,
          price: item.sellingPrice, // price at time of order
          mrp: item.mrp, // optional snapshot
          image: item.image, // optional snapshot
          subtotal: item.quantity * parseFloat(item.sellingPrice),
        })),

        // Order financials
        total_amount: latestOrder.data.total_amount, // before discount
        coupon_code: latestOrder.data.coupon_code || null,
        discount_amount: latestOrder.data.discount_amount || 0,
        final_amount:
          latestOrder.data.final_amount || latestOrder.data.total_amount,
        status: "pending", // backend can update later

        // Invoice info
        invoice: {
          order_id: orderId,
          invoice_number: null, // let backend generate (INV-2025-0001)
          billing_name: formData.fullname,
          billing_address: `${formData.address_line_1}, ${formData.city}, ${formData.state}, ${formData.postal_code}, ${formData.country}`,
          billing_phone: formData.phone,
          total_amount: latestOrder.data.total_amount,
          discount_amount: latestOrder.data.discount_amount || 0,
          final_amount:
            latestOrder.data.final_amount || latestOrder.data.total_amount,
          tax_amount: latestOrder.data.tax_amount || 0,
        },

        // Optional system fields
        created_at: new Date().toISOString(), // frontend timestamp (backend can override)
      };

      const response = await fetch(`${BACKEND_API_URL}/orders/order-confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        localStorage.removeItem("latestOrder");
        localStorage.removeItem("cart");
        router.push(`/order-success/${orderId}`);
        // ?payment_id=${paymentId}
      } else {
        throw new Error("Order confirmation failed");
      }
    } catch (error) {
      console.error("Order confirmation error:", error);
      alert("Order processing failed. Please contact support.");
      setProcessingPayment(false);
    }
  };

  // Handle COD order
  const handleCODOrder = async () => {
    setProcessingPayment(true);
    try {
      await confirmOrder("cod");
    } catch (error) {
      console.error("COD order error:", error);
      setProcessingPayment(false);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!formData.paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    if (formData.paymentMethod === "cod") {
      await handleCODOrder();
    } else if (formData.paymentMethod === "razorpay") {
      await handleRazorpayPayment();
    }
  };

  const calculateTotal = () => {
    if (!orderData?.data?.total_amount) return 0;
    const subtotal = orderData.data.total_amount;
    const tax = subtotal * 0.05;
    return subtotal + tax;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-green-700">Loading checkout...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            <FiArrowLeft className="mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-green-800">Checkout</h1>
          <div className="w-20"></div> {/* Spacer for alignment */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm mb-6">
              <button
                className={`flex-1 py-3 px-4 text-center font-medium rounded-md transition-all ${
                  activeTab === "delivery"
                    ? "bg-green-500 text-white shadow-md"
                    : "text-green-600 hover:bg-green-50"
                }`}
                onClick={() => setActiveTab("delivery")}
              >
                Delivery Information
              </button>
              <button
                className={`flex-1 py-3 px-4 text-center font-medium rounded-md transition-all ${
                  activeTab === "payment"
                    ? "bg-green-500 text-white shadow-md"
                    : "text-green-600 hover:bg-green-50"
                }`}
                onClick={() => setActiveTab("payment")} // FIXED: Removed the condition
              >
                Payment Method
              </button>
            </div>

            {/* Delivery Form */}
            {activeTab === "delivery" && (
              <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
                <h2 className="text-xl font-bold text-green-800 mb-6">
                  Delivery Details
                </h2>

                <form onSubmit={handleContinueToPayment} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-3 text-green-400" />
                        <input
                          type="text"
                          name="fullname"
                          value={formData.fullname}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.fullname
                              ? "border-red-500"
                              : "border-green-300"
                          }`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.fullname && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullname}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-3 text-green-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                            errors.phone ? "border-red-500" : "border-green-300"
                          }`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 text-green-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                          errors.email ? "border-red-500" : "border-green-300"
                        }`}
                        placeholder="Enter your email address"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Address Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Delivery Address
                    </h3>

                    {/* Show Saved Addresses */}
                    {!showNewAddressForm && addresses.length > 0 ? (
                      <div className="space-y-3 mb-6">
                        <h4 className="font-medium text-gray-700 mb-3">
                          Select Saved Address
                        </h4>

                        {addresses.map((address) => (
                          <div
                            key={address.address_id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                              selectedAddressId === address.address_id
                                ? "border-green-600 bg-green-50 shadow-md"
                                : "border-gray-200 hover:border-green-300 bg-white"
                            }`}
                            onClick={() =>
                              handleAddressSelect(address.address_id)
                            }
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <span className="font-medium text-gray-900">
                                    {address.full_name}
                                  </span>
                                  {/* Default badge (blue/grey) */}
                                  {address.is_default && (
                                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                      Default
                                    </span>
                                  )}
                                  {/* Selected badge - only show when this address is selected */}
                                  {selectedAddressId === address.address_id && (
                                    <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-700 text-sm">
                                  {address.address_line1}
                                  {address.address_line2 &&
                                    `, ${address.address_line2}`}
                                </p>
                                <p className="text-gray-700 text-sm">
                                  {address.city}, {address.state} -{" "}
                                  {address.postal_code}
                                </p>
                                <p className="text-gray-700 text-sm">
                                  {address.phone}
                                </p>
                              </div>

                              {/* Radio button for selection */}
                              <div className="flex items-center ml-4">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedAddressId === address.address_id
                                      ? "bg-green-600 border-green-600"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {selectedAddressId === address.address_id && (
                                    <FiCheck className="text-white text-sm" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Add New Address Button */}
                        <button
                          type="button"
                          onClick={handleNewAddressClick}
                          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-700 hover:border-green-400 hover:bg-green-50 transition-all flex items-center justify-center"
                        >
                          <FiPlus className="mr-2" />
                          Add New Address
                        </button>
                      </div>
                    ) : (
                      // New Address Form
                      <div className="space-y-4">
                        {addresses.length > 0 && (
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-700">
                              Add New Address
                            </h4>
                            <button
                              type="button"
                              onClick={() => {
                                setShowNewAddressForm(false);
                                if (addresses.length > 0) {
                                  handleAddressSelect(
                                    addresses.find((a) => a.is_default)
                                      ?.address_id || addresses[0].address_id
                                  );
                                }
                              }}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              ← Back to saved addresses
                            </button>
                          </div>
                        )}

                        {/* Address Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <input
                              type="text"
                              name="address_line_1"
                              placeholder="Address Line 1"
                              value={formData.address_line_1}
                              onChange={handleInputChange}
                              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 ${
                                errors.address_line_1
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.address_line_1 && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.address_line_1}
                              </p>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              name="address_line_2"
                              placeholder="Address Line 2"
                              value={formData.address_line_2}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                            />
                          </div>

                          <div>
                            <input
                              type="text"
                              name="city"
                              placeholder="City"
                              value={formData.city}
                              onChange={handleInputChange}
                              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 ${
                                errors.city
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.city && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.city}
                              </p>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              name="state"
                              placeholder="State"
                              value={formData.state}
                              onChange={handleInputChange}
                              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 ${
                                errors.state
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.state && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.state}
                              </p>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              name="postal_code"
                              placeholder="postal_code"
                              value={formData.postal_code}
                              onChange={handleInputChange}
                              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 ${
                                errors.postal_code
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {errors.postal_code && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.postal_code}
                              </p>
                            )}
                          </div>

                          <div>
                            <input
                              type="text"
                              name="country"
                              placeholder="Country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={saveAddressToProfile}
                          disabled={savingAddress}
                          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all disabled:bg-green-400"
                        >
                          {savingAddress ? "Saving..." : "Save Address"}
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Payment Method */}
            {activeTab === "payment" && (
              <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
                <h2 className="text-xl font-bold text-green-800 mb-6">
                  Select Payment Method
                </h2>

                <div className="space-y-4 mb-8">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        formData.paymentMethod === method.id
                          ? "border-green-500 bg-green-50 shadow-md"
                          : "border-green-200 hover:border-green-300 hover:bg-green-50"
                      }`}
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: method.id,
                        }))
                      }
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 mr-4">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-green-800">
                            {method.title}
                          </h3>
                          <p className="text-sm text-green-600">
                            {method.description}
                          </p>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            formData.paymentMethod === method.id
                              ? "bg-green-500 border-green-500"
                              : "border-green-300"
                          }`}
                        >
                          {formData.paymentMethod === method.id && (
                            <FiCheck className="text-white text-sm" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handlePaymentSubmit}
                  disabled={!formData.paymentMethod || processingPayment}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                >
                  {processingPayment ? (
                    <span className="flex items-center justify-center">
                      <FiLoader className="animate-spin mr-2" />
                      Processing...
                    </span>
                  ) : (
                    `Complete Order - ₹${calculateTotal().toFixed(2)}`
                  )}
                </button>

                <button
                  onClick={handleBackToDelivery}
                  className="w-full mt-4 text-green-600 hover:text-green-700 font-medium py-2"
                >
                  ← Back to Delivery Information
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-4">
                {orderData?.data?.order_item?.map((item) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-start border-b border-green-100 pb-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium text-green-700">
                          {item.name}
                        </p>
                        <p className="text-sm text-green-500">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-400 line-through">
                          MRP: ₹{Number(item.mrp).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-green-800">
                      ₹{(Number(item.sellingPrice) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-green-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-600">Subtotal</span>
                  <span className="text-green-800">
                    ₹{orderData?.data?.total_amount?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Tax (5%)</span>
                  <span className="text-green-800">
                    ₹{((orderData?.data?.total_amount || 0) * 0.05).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Delivery</span>
                  <span className="text-green-800">FREE</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-green-200">
                  <span className="text-green-700">Total Amount</span>
                  <span className="text-green-800">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
