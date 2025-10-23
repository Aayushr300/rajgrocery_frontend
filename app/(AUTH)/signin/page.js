"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Spinner icon
import { useAuth } from "@/app/_context/AuthContext";

export default function LoginPage() {
  const { setIsLoggedIn, setUserData } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // NEW state
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem("token");
    if (user) {
      router.push("/");
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner

    GlobalApi.SignInUser(email, password)
      .then((response) => {
        if (!response || !response.user) {
          throw new Error("User login failed");
        }

        // Save token and user to sessionStorage
        sessionStorage.setItem("token", response.jwt);
        sessionStorage.setItem("user", JSON.stringify(response.user));

        // ⚡ Update AuthContext
        setIsLoggedIn(true);
        setUserData(response.user);

        toast.success(response.message || "Login successful!");
        router.push("/"); // Redirect
      })
      .catch((error) => {
        console.error("Login error:", error);
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 px-4">
      <div className="flex flex-col gap-1 items-center justify-center p-8 sm:p-10 bg-white shadow-md rounded-lg w-full max-w-md border border-gray-200">
        <Image src="/logo.jpg" alt="Login" width={50} height={50} />

        <h2 className="font-bold text-3xl mt-2">Sign In</h2>
        <h2 className="text-gray-500 text-center text-sm">
          Enter your Email and Password to access your account
        </h2>

        <div className="w-full flex flex-col mt-7">
          <Input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
          />
          <Input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="mt-3"
          />

          <Button
            onClick={handleLogin}
            type="submit"
            disabled={!email || !password || loading} // disable when loading
            className="mt-5 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="flex justify-between items-center mt-4 text-sm w-full">
            <Link
              href="/forgot-password"
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
            <Link
              href="/create-account"
              className="text-blue-500 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
