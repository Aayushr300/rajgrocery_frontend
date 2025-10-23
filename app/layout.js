"use client";
import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import { Toaster } from "sonner";
import Footer from "./_components/Footer";
import { CartProvider } from "./_context/CartContext";
import { AuthProvider } from "./_context/AuthContext";
import { usePathname } from "next/navigation";

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname(); // ✅ inside component
  const hideFooter = pathname.startsWith("/admin"); // hide footer on /admin routes

  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased`}>
        <AuthProvider>
          <CartProvider>
            {!hideFooter && <Header />}
            <Toaster richColors position="top-right" />
            {children}
            {!hideFooter && <Footer />}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
