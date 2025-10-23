"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  SearchIcon,
  ShoppingCart,
  UserCircle,
  LogOut,
  ChevronDown,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

import GlobalApi from "../_utils/GlobalApi";
import { useCart } from "../_context/CartContext";
import { useAuth } from "../_context/AuthContext";

export default function Header() {
  const { cart } = useCart();
  const pathname = usePathname();

  // Use global auth context
  const { isLoggedIn, userData, setIsLoggedIn, setUserData } = useAuth();

  const [categoryList, setCategoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    GlobalApi.getCategory().then((resp) => {
      setCategoryList(resp.data.data);
    });
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Logout function
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    setIsLoggedIn(false);
    setUserData(null);
    toast.success("Logout successful!");
    window.location.href = "/";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Left section */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="logo"
                width={45}
                height={45}
                className="rounded-full"
              />
              <span className="hidden md:block font-bold text-xl text-green-600">
                Raj Grocery
              </span>
            </Link>

            {/* Category Dropdown (desktop) */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                  <LayoutGrid className="h-5 w-5" />
                  <span>Categories</span>
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-56 max-h-80 overflow-y-auto"
                >
                  <DropdownMenuLabel>Browse Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categoryList.map((category, index) => (
                    <DropdownMenuItem
                      key={category.id || index}
                      className="cursor-pointer py-2"
                    >
                      <Link
                        href={`/category/${category.name || category.id}`}
                        className="flex items-center w-full"
                      >
                        <Image
                          src={category.image_url}
                          unoptimized
                          width={24}
                          height={24}
                          alt={category.name}
                          className="mr-2 rounded-full"
                        />
                        <span>{category.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600"
              >
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User account */}
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 p-2 rounded-full"
                  >
                    {userData?.profileImage ? (
                      <Image
                        src={userData.profileImage}
                        alt={userData.name || "User"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <UserCircle className="h-7 w-7 text-green-600" />
                    )}
                    <span className="hidden md:inline text-sm font-medium">
                      {userData?.name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown className="hidden md:block h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-semibold">
                    {userData?.name || "User"}
                  </div>
                  <div className="px-2 py-1 text-xs text-gray-500">
                    {userData?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-orders" className="w-full">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin" className="hidden md:block">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signin" className="md:hidden">
                  <UserCircle className="h-6 w-6 text-green-600" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-3 border-t">
            <h3 className="px-2 py-1 text-sm font-semibold text-gray-500">
              Categories
            </h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryList.slice(0, 6).map((category, index) => (
                <Link
                  key={category.id || index}
                  href={`/category/${category.slug || category.id}`}
                  className="flex items-center p-2 rounded-lg hover:bg-green-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Image
                    src={
                      process.env.NEXT_PUBLIC_BACKEND_BASE_URL +
                      category.icon?.url
                    }
                    unoptimized
                    width={20}
                    height={20}
                    alt={category.name}
                    className="mr-2"
                  />
                  <span className="text-sm">{category.name}</span>
                </Link>
              ))}
            </div>
            {isLoggedIn ? (
              <div className="mt-4 pt-3 border-t">
                <Link
                  href="/my-orders"
                  className="block py-2 px-2 text-sm hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  href="/profile"
                  className="block py-2 px-2 text-sm hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-4 pt-3 border-t">
                <Link
                  href="/signin"
                  className="block py-2 px-2 text-sm hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
