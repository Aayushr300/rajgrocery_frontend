"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./_components/AdminSidebar";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = sessionStorage.getItem("adminToken");
    setToken(storedToken);

    if (storedToken) {
      // Redirect logged-in users away from login/signup
      if (["/admin/login", "/admin/signup"].includes(pathname)) {
        router.push("/admin/dashboard");
        return;
      }
    } else {
      // Redirect non-logged-in users away from admin pages
      if (!["/admin/login", "/admin/signup"].includes(pathname)) {
        router.push("/admin/login");
        return;
      }
    }

    setIsLoading(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar only for logged-in users */}
      {token && <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />}

      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
