"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Percent, IndianRupee, Truck } from "lucide-react";
import { format } from "date-fns";

export default function AddCouponModal({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    type: "percentage",
    discountValue: 10,
    maxDiscount: "",
    minOrderValue: 0,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    usageLimit: 100,
    applicableTo: "all_products",
    eligibility: "all_customers",
    status: "active",
    categories: [],
    products: [],
    customers: [],
  });

  const [showCalendar, setShowCalendar] = useState({
    start: false,
    end: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (name, value) => {
    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      discountValue: parseInt(formData.discountValue),
      maxDiscount: formData.maxDiscount ? parseInt(formData.maxDiscount) : null,
      minOrderValue: parseInt(formData.minOrderValue),
      usageLimit: parseInt(formData.usageLimit),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
    });
    // Reset form
    setFormData({
      code: "",
      description: "",
      type: "percentage",
      discountValue: 10,
      maxDiscount: "",
      minOrderValue: 0,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
      applicableTo: "all_products",
      eligibility: "all_customers",
      status: "active",
      categories: [],
      products: [],
      customers: [],
    });
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Coupon</DialogTitle>
          <DialogDescription>
            Add a new discount coupon for your customers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Code and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="SUMMER25"
                  required
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={generateCode}>
                  Generate
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Summer sale discount"
                required
              />
            </div>
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Discount Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4" />
                      Percentage
                    </div>
                  </SelectItem>
                  <SelectItem value="fixed">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" />
                      Fixed Amount
                    </div>
                  </SelectItem>
                  <SelectItem value="free_shipping">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Free Shipping
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {formData.type === "percentage"
                  ? "Discount Percentage"
                  : formData.type === "fixed"
                  ? "Discount Amount"
                  : "Free Shipping"}
              </Label>
              <Input
                id="discountValue"
                name="discountValue"
                type="number"
                min="1"
                max={formData.type === "percentage" ? "100" : undefined}
                value={formData.discountValue}
                onChange={(e) =>
                  handleNumberChange("discountValue", e.target.value)
                }
                required
                disabled={formData.type === "free_shipping"}
              />
            </div>
          </div>

          {/* Max Discount (for percentage) */}
          {formData.type === "percentage" && (
            <div className="space-y-2">
              <Label htmlFor="maxDiscount">Maximum Discount Amount (₹)</Label>
              <Input
                id="maxDiscount"
                name="maxDiscount"
                type="number"
                min="0"
                value={formData.maxDiscount}
                onChange={(e) =>
                  handleNumberChange("maxDiscount", e.target.value)
                }
                placeholder="Enter maximum discount amount"
              />
            </div>
          )}

          {/* Minimum Order Value */}
          <div className="space-y-2">
            <Label htmlFor="minOrderValue">Minimum Order Value (₹)</Label>
            <Input
              id="minOrderValue"
              name="minOrderValue"
              type="number"
              min="0"
              value={formData.minOrderValue}
              onChange={(e) =>
                handleNumberChange("minOrderValue", e.target.value)
              }
              required
            />
          </div>

          {/* Validity Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover
                open={showCalendar.start}
                onOpenChange={(open) =>
                  setShowCalendar({ ...showCalendar, start: open })
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => {
                      setFormData((prev) => ({ ...prev, startDate: date }));
                      setShowCalendar({ ...showCalendar, start: false });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover
                open={showCalendar.end}
                onOpenChange={(open) =>
                  setShowCalendar({ ...showCalendar, end: open })
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => {
                      setFormData((prev) => ({ ...prev, endDate: date }));
                      setShowCalendar({ ...showCalendar, end: false });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Usage Limit */}
          <div className="space-y-2">
            <Label htmlFor="usageLimit">Usage Limit</Label>
            <Input
              id="usageLimit"
              name="usageLimit"
              type="number"
              min="1"
              value={formData.usageLimit}
              onChange={(e) => handleNumberChange("usageLimit", e.target.value)}
              required
            />
          </div>

          {/* Applicability */}
          <div className="space-y-2">
            <Label htmlFor="applicableTo">Applicable To</Label>
            <Select
              value={formData.applicableTo}
              onValueChange={(value) =>
                handleSelectChange("applicableTo", value)
              }
            >
              <SelectTrigger id="applicableTo">
                <SelectValue placeholder="Select applicability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_products">All Products</SelectItem>
                <SelectItem value="specific_products">
                  Specific Products
                </SelectItem>
                <SelectItem value="category">Specific Categories</SelectItem>
                <SelectItem value="min_purchase">
                  Minimum Purchase Only
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Eligibility */}
          <div className="space-y-2">
            <Label htmlFor="eligibility">Customer Eligibility</Label>
            <Select
              value={formData.eligibility}
              onValueChange={(value) =>
                handleSelectChange("eligibility", value)
              }
            >
              <SelectTrigger id="eligibility">
                <SelectValue placeholder="Select eligibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_customers">All Customers</SelectItem>
                <SelectItem value="new_customers">
                  New Customers Only
                </SelectItem>
                <SelectItem value="existing_customers">
                  Existing Customers Only
                </SelectItem>
                <SelectItem value="specific_customers">
                  Specific Customers
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between">
            <Label htmlFor="status" className="flex flex-col space-y-1">
              <span>Active</span>
              <span className="text-sm font-normal text-muted-foreground">
                Make this coupon immediately active
              </span>
            </Label>
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  status: checked ? "active" : "inactive",
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Coupon</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
