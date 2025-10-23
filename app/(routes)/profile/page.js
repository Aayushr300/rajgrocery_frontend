"use client";

import { useState } from "react";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      phone: "+1 (555) 123-4567",
      isDefault: true,
    },
    {
      id: 2,
      name: "John Doe",
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "United States",
      phone: "+1 (555) 987-6543",
      isDefault: false,
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      last4: "8888",
      brand: "Mastercard",
      expiry: "08/24",
      isDefault: false,
    },
    {
      id: 3,
      type: "paypal",
      email: "john.doe@example.com",
      isDefault: false,
    },
  ]);

  const navigationItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "orders", label: "Order History", icon: "📦" },
    { id: "addresses", label: "Address Book", icon: "📍" },
    { id: "payments", label: "Payment Methods", icon: "💳" },
    { id: "reviews", label: "My Reviews", icon: "⭐" },
    { id: "wishlist", label: "Wishlist", icon: "❤️" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const stats = [
    { label: "Total Orders", value: "12", change: "+2" },
    { label: "Pending Orders", value: "2", change: "-1" },
    { label: "Completed Orders", value: "10", change: "+3" },
    { label: "Total Spent", value: "$1,240", change: "+$120" },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "order",
      message: "Order #12345 shipped",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "review",
      message: 'You reviewed "Wireless Headphones"',
      time: "1 day ago",
    },
    {
      id: 3,
      type: "wishlist",
      message: 'Added "Smart Watch" to wishlist',
      time: "2 days ago",
    },
  ];

  const orders = [
    {
      id: "12345",
      date: "2024-01-15",
      status: "Delivered",
      total: 129.99,
      items: [
        { name: "Wireless Headphones", quantity: 1 },
        { name: "Phone Case", quantity: 2 },
      ],
    },
    {
      id: "12344",
      date: "2024-01-10",
      status: "Processing",
      total: 89.99,
      items: [{ name: "Smart Watch", quantity: 1 }],
    },
    {
      id: "12343",
      date: "2024-01-05",
      status: "Shipped",
      total: 45.99,
      items: [{ name: "USB-C Cable", quantity: 3 }],
    },
  ];

  // Component Functions
  const ProfileHeader = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">JD</span>
          </div>
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
          <p className="text-gray-600">john.doe@example.com</p>
          <div className="flex items-center mt-1 space-x-4 text-sm text-gray-500">
            <span>Member since Jan 2024</span>
            <span>•</span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Verified
            </span>
          </div>
        </div>

        <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          Edit Profile
        </button>
      </div>
    </div>
  );

  const ProfileNavigation = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
              activeTab === item.id
                ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );

  const ProfileOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  stat.change.startsWith("+")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">📦</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-4 px-4 rounded-lg transition-colors duration-200 text-left">
            <span className="block font-medium">Track Your Order</span>
            <span className="text-sm text-gray-600">Check delivery status</span>
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-4 px-4 rounded-lg transition-colors duration-200 text-left">
            <span className="block font-medium">Start a Return</span>
            <span className="text-sm text-gray-600">
              Return or exchange items
            </span>
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-4 px-4 rounded-lg transition-colors duration-200 text-left">
            <span className="block font-medium">Contact Support</span>
            <span className="text-sm text-gray-600">
              Get help with your order
            </span>
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-4 px-4 rounded-lg transition-colors duration-200 text-left">
            <span className="block font-medium">Browse Products</span>
            <span className="text-sm text-gray-600">Continue shopping</span>
          </button>
        </div>
      </div>
    </div>
  );

  const OrderHistory = () => {
    const getStatusColor = (status) => {
      switch (status) {
        case "Delivered":
          return "bg-green-100 text-green-800";
        case "Processing":
          return "bg-yellow-100 text-yellow-800";
        case "Shipped":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Order History</h2>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {order.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${order.total}</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-4 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-xs">Image</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Order Details
                  </button>
                  <div className="flex space-x-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                      Buy Again
                    </button>
                    <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                      Get Help
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AddressBook = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Address Book</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          Add New Address
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <div
            key={address.id}
            className={`border-2 rounded-lg p-6 ${
              address.isDefault
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{address.name}</h3>
                {address.isDefault && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    Default
                  </span>
                )}
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Edit
              </button>
            </div>

            <div className="space-y-1 text-gray-600">
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.zipCode}
              </p>
              <p>{address.country}</p>
              <p>{address.phone}</p>
            </div>

            <div className="mt-4 flex space-x-3">
              {!address.isDefault && (
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Set as Default
                </button>
              )}
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PaymentMethods = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          Add Payment Method
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                {method.type === "paypal" ? (
                  <span className="text-blue-600 font-bold">PayPal</span>
                ) : (
                  <span className="text-gray-600">{method.brand}</span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {method.type === "paypal"
                    ? `PayPal (${method.email})`
                    : `${method.brand} •••• ${method.last4}`}
                </p>
                {method.type === "card" && (
                  <p className="text-sm text-gray-600">
                    Expires {method.expiry}
                  </p>
                )}
              </div>
              {method.isDefault && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Default
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {!method.isDefault && (
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Set Default
                </button>
              )}
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ReviewsSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">My Reviews</h2>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⭐</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No reviews yet
        </h3>
        <p className="text-gray-600 mb-4">
          Start reviewing your purchased items to help other shoppers.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          Write Your First Review
        </button>
      </div>
    </div>
  );

  const WishlistSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Wishlist</h2>
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❤️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-gray-600 mb-4">Save items you love for later.</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          Start Shopping
        </button>
      </div>
    </div>
  );

  const SettingsSection = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              defaultValue="john.doe@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2">
            Change Password
          </button>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div>
            <h3 className="font-medium text-gray-900">Delete Account</h3>
            <p className="text-sm text-gray-600">
              Permanently delete your account and all data
            </p>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProfileOverview />;
      case "orders":
        return <OrderHistory />;
      case "addresses":
        return <AddressBook />;
      case "payments":
        return <PaymentMethods />;
      case "reviews":
        return <ReviewsSection />;
      case "wishlist":
        return <WishlistSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <ProfileOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <ProfileNavigation />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
