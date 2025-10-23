import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 border border-gray-200">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Forgot Password"
            width={50}
            height={50}
            className="mx-auto"
          />
          <h2 className="font-bold text-2xl text-center">Forgot Password</h2>
          <p className="text-gray-500 text-center text-sm">
            Enter your registered email address and we’ll send you a reset link.
          </p>
        </div>

        {/* Form */}
        <div className="mt-6">
          <Input type="email" placeholder="Email" />
          <Button className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white">
            Send Reset Link
          </Button>

          {/* Back to Login */}
          <p className="mt-4 text-center text-sm">
            Remember your password?{" "}
            <Link href="/signin" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
