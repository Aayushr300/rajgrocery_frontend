// CouponsSection.js
"use client";

import { useState, useEffect } from "react";
import { FiTag, FiCheck } from "react-icons/fi";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CouponsSection({
  totalAmount,
  appliedCoupon,
  setAppliedCoupon,
  discountAmount,
  setDiscountAmount,
  couponCode,
  setCouponCode,
}) {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Fetch coupons from API
  useEffect(() => {
    const getCoupons = async () => {
      try {
        const response = await axios.get(`${BACKEND_API_URL}/coupons`);
        setAvailableCoupons(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        toast.error("Failed to load coupons");
      }
    };

    getCoupons();
  }, []);

  const applyCoupon = (code) => {
    setIsApplyingCoupon(true);
    setCouponError("");

    setTimeout(() => {
      const coupon = availableCoupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase()
      );

      if (!coupon) {
        setCouponError("Invalid coupon code");
        setIsApplyingCoupon(false);
        return;
      }

      if (totalAmount < parseFloat(coupon.min_order_value)) {
        setCouponError(
          `Minimum order of ₹${parseFloat(coupon.min_order_value)} required`
        );
        setIsApplyingCoupon(false);
        return;
      }

      let discount = 0;
      if (coupon.discount_type === "percentage") {
        discount = (totalAmount * parseFloat(coupon.discount_value)) / 100;
      } else if (coupon.discount_type === "fixed") {
        discount = parseFloat(coupon.discount_value);
      }

      setDiscountAmount(discount);
      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      setIsApplyingCoupon(false);
    }, 300);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    setCouponError("");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiTag className="mr-2 text-green-600" />
        Apply Coupon
      </h2>

      {appliedCoupon ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiCheck className="text-green-600 mr-2" />
              <span className="font-medium text-green-800">
                Coupon applied: {appliedCoupon.code}
              </span>
              <span className="ml-2 text-green-600">
                -{" "}
                {appliedCoupon.discount_type === "percentage"
                  ? `${appliedCoupon.discount_value}% off`
                  : `₹${appliedCoupon.discount_value} off`}
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-green-800 hover:text-green-900 text-sm font-medium"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button
              onClick={() => applyCoupon(couponCode)}
              disabled={isApplyingCoupon || !couponCode.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isApplyingCoupon ? "Applying..." : "Apply"}
            </button>
          </div>
          {couponError && (
            <p className="text-red-500 text-sm mt-2">{couponError}</p>
          )}
        </>
      )}

      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Available coupons
        </h3>
        <div className="space-y-2">
          {availableCoupons.map((coupon) => (
            <div
              key={coupon.coupon_id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
            >
              <div>
                <p className="font-medium text-gray-900">{coupon.code}</p>
                <p className="text-sm text-gray-500">{coupon.description}</p>
              </div>
              <button
                onClick={() => applyCoupon(coupon.code)}
                className="text-green-600 hover:text-green-800 text-sm font-medium"
              >
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
