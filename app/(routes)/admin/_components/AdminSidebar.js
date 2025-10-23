"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  BarChart3,
  ShoppingCart,
  Package,
  X,
  BadgePercent,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Products", href: "/admin/product", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: BadgePercent },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Discounts", href: "/admin/discounts", icon: BadgePercent },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Logout", href: "#", icon: LogOut }, // href is dummy for logout
];

export default function AdminSidebar({ open, setOpen }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    sessionStorage.removeItem("admin");
    setOpen(false);
    router.push("/admin/login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition duration-200 ease-in-out
          md:relative md:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <span className="text-white font-semibold text-xl">Admin Panel</span>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              // Handle Logout separately
              if (item.name === "Logout") {
                return (
                  <button
                    key={item.name}
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white"
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-800 hover:text-white
                    ${isActive ? "bg-gray-800 text-white" : ""}
                  `}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
}
