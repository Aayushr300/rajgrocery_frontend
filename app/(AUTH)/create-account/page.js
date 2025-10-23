"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; // Spinner icon

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // NEW
  const router = useRouter();

  useEffect(() => {
    const user = sessionStorage.getItem("token");
    if (user) {
      router.push("/");
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start spinner

    GlobalApi.registerUser(username, email, phone, password)
      .then((response) => {
        if (!response || !response.userId) {
          throw new Error("User registration failed");
        }
        toast.success("Account created successfully! Please sign in.");
        router.push("/signin");
      })
      .catch((error) => {
        const backendMsg = error?.response?.data?.message;
        toast.error(backendMsg || "Error creating account");
      })
      .finally(() => {
        setLoading(false); // Stop spinner
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 sm:p-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="/logo.jpg"
            alt="Create Account"
            width={50}
            height={50}
            className="rounded-full"
          />
          <h2 className="font-bold text-2xl sm:text-3xl">Create an Account</h2>
          <p className="text-gray-500 text-sm sm:text-base">
            Enter your email and password to get started
          </p>
        </div>

        {/* Form */}
        <form className="mt-6 flex flex-col gap-4">
          <Input
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Enter Phone Number"
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            onClick={handleSubmit}
            disabled={!username || !email || !password || loading}
            type="submit"
            className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-500 hover:underline font-medium"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
