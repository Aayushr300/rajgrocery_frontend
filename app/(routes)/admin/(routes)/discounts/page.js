"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  CalendarIcon,
  Percent,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL;
// API service functions
const couponAPI = {
  // Create new coupon

  async createCoupon(couponData) {
    const response = await axios.post(
      `${BACKEND_API_URL}/admin/coupons`,
      couponData, // data goes here directly
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 201) throw new Error("Failed to create coupon");

    return response.data; // ✅ Correct
  },

  // Update coupon
  async updateCoupon(couponId, couponData) {
    const response = await fetch(`/api/coupons/${couponId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
    });
    if (!response.ok) throw new Error("Failed to update coupon");
    return response.json();
  },

  // Delete coupon
  async deleteCoupon(couponId) {
    const response = await fetch(`/api/coupons/${couponId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete coupon");
    return response.json();
  },
};

const ITEMS_PER_PAGE = 10;

export default function CouponsPage() {
  const [allCoupons, setAllCoupons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: 10,
    min_order_value: 0,
    start_date: new Date(),
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    is_active: true,
  });
  useEffect(() => {
    loadCoupons();
  }, []);

  // Handles loading and error
  const loadCoupons = async () => {
    try {
      setLoading(true);
      const coupons = await getCoupons(); // call your separate function
      setAllCoupons(coupons);
    } catch (error) {
      console.error("Error loading coupons:", error);
      toast.error("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  // Separate function that actually fetches coupons
  // Separate function that actually fetches coupons
  const getCoupons = async () => {
    try {
      const response = await axios.get(`${BACKEND_API_URL}/admin/coupons`);
      return response.data; // ✅ axios already parses JSON
    } catch (error) {
      console.error("Error fetching coupons:", error);
      throw error;
    }
  };

  // Filter and sort coupons
  const filteredAndSortedCoupons = useMemo(() => {
    let filtered = allCoupons.filter((coupon) => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (coupon.description &&
          coupon.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && coupon.is_active) ||
        (statusFilter === "inactive" && !coupon.is_active);

      const matchesType =
        typeFilter === "all" || coupon.discount_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort coupons
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (
        sortField === "start_date" ||
        sortField === "end_date" ||
        sortField === "created_at"
      ) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    allCoupons,
    searchQuery,
    statusFilter,
    typeFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedCoupons.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCoupons = filteredAndSortedCoupons.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleAddCoupon = async (couponData) => {
    try {
      await couponAPI.createCoupon(couponData);
      toast.success("Coupon created successfully");
      await loadCoupons();
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast.error("Failed to create coupon");
    }
  };

  const handleEditCoupon = async (couponId, couponData) => {
    try {
      await couponAPI.updateCoupon(couponId, couponData);
      toast.success("Coupon updated successfully");
      await loadCoupons();
      setIsEditModalOpen(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error("Error updating coupon:", error);
      toast.error("Failed to update coupon");
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      await couponAPI.deleteCoupon(selectedCoupon.coupon_id);
      toast.success("Coupon deleted successfully");
      await loadCoupons();
      setIsDeleteModalOpen(false);
      setSelectedCoupon(null);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    }
  };

  const openEditModal = (coupon) => {
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_value: coupon.min_order_value,
      start_date: new Date(coupon.start_date),
      end_date: new Date(coupon.end_date),
      is_active: coupon.is_active,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (coupon) => {
    setSelectedCoupon(coupon);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document
        .getElementById("coupons-table")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Coupon code copied to clipboard");
  };

  const getStatusBadgeVariant = (isActive, startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!isActive) return "secondary";
    if (now < start) return "default";
    if (now > end) return "destructive";
    return "success";
  };

  const getStatusText = (isActive, startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (!isActive) return "Inactive";
    if (now < start) return "Scheduled";
    if (now > end) return "Expired";
    return "Active";
  };

  const getTypeBadgeVariant = (type) => {
    switch (type) {
      case "percentage":
        return "default";
      case "fixed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDiscount = (coupon) => {
    switch (coupon.discount_type) {
      case "percentage":
        return `${coupon.discount_value}% off`;
      case "fixed":
        return `₹${coupon.discount_value} off`;
      default:
        return coupon.discount_value;
    }
  };

  const isCouponActive = (coupon) => {
    const now = new Date();
    return (
      coupon.is_active &&
      new Date(coupon.start_date) <= now &&
      new Date(coupon.end_date) >= now
    );
  };

  const handleFormChange = (e) => {
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
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, code }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const couponData = {
      code: formData.code,
      description: formData.description,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      min_order_value: parseFloat(formData.min_order_value) || 0,
      start_date: formData.start_date.toISOString().split("T")[0],
      end_date: formData.end_date.toISOString().split("T")[0],
      is_active: formData.is_active ? 1 : 0,
    };

    if (isEditModalOpen && selectedCoupon) {
      await handleEditCoupon(selectedCoupon.coupon_id, couponData);
    } else {
      await handleAddCoupon(couponData);
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 10,
      min_order_value: 0,
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      is_active: true,
    });
  };

  // Delete Modal Component
  const DeleteCouponModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        isDeleteModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">Delete Coupon</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete coupon {selectedCoupon?.code}? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteCoupon}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );

  // Edit Modal Component
  const EditCouponModal = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        isEditModalOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">Edit Coupon</h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Coupon Code</Label>
              <Input
                name="code"
                value={formData.code}
                onChange={handleFormChange}
                placeholder="SUMMER25"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="Summer sale discount"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Discount Type</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value) =>
                  handleSelectChange("discount_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                {formData.discount_type === "percentage"
                  ? "Discount Value"
                  : "Discount Amount (₹)"}
              </Label>
              <Input
                type="number"
                name="discount_value"
                min="0"
                step="0.01"
                value={formData.discount_value}
                onChange={(e) =>
                  handleNumberChange("discount_value", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Minimum Order Value (₹)</Label>
            <Input
              type="number"
              name="min_order_value"
              min="0"
              step="0.01"
              value={formData.min_order_value}
              onChange={(e) =>
                handleNumberChange("min_order_value", e.target.value)
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date
                      ? format(formData.start_date, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date}
                    onSelect={(date) =>
                      setFormData({ ...formData, start_date: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date
                      ? format(formData.end_date, "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date}
                    onSelect={(date) =>
                      setFormData({ ...formData, end_date: date })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <span>Active</span>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
              <span className="text-sm text-muted-foreground">
                Make this coupon immediately active
              </span>
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading coupons...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Coupons Management
          </h2>
          <p className="text-muted-foreground">
            Create and manage discount coupons for your store
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Filter coupons by status or type
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search coupons..."
                className="w-full sm:w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type-filter">Discount Type</Label>
              <Select
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="type-filter">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allCoupons.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allCoupons.filter((coupon) => isCouponActive(coupon)).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Coupons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {allCoupons.filter((coupon) => !coupon.is_active).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coupons Table */}
      <Card id="coupons-table">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Coupons</CardTitle>
              <CardDescription>
                Showing {paginatedCoupons.length} of{" "}
                {filteredAndSortedCoupons.length} coupons
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Code
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Description
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("discount_type")}
                    >
                      <div className="flex items-center gap-1">
                        Type
                        {sortField === "discount_type" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </div>
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("discount_value")}
                    >
                      <div className="flex items-center gap-1">
                        Discount
                        {sortField === "discount_value" &&
                          (sortDirection === "asc" ? "↑" : "↓")}
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Validity
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Min. Order
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {paginatedCoupons.map((coupon) => (
                    <tr
                      key={coupon.coupon_id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="font-mono font-medium bg-muted px-2 py-1 rounded-md">
                            {coupon.code}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(coupon.code)}
                            className="h-6 w-6"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div
                          className="max-w-[200px] truncate"
                          title={coupon.description}
                        >
                          {coupon.description || "No description"}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={getTypeBadgeVariant(coupon.discount_type)}
                        >
                          {coupon.discount_type}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {formatDiscount(coupon)}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            {formatDate(coupon.start_date)}
                          </div>
                          <div className="text-muted-foreground">
                            to {formatDate(coupon.end_date)}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="text-sm">
                          ₹{parseFloat(coupon.min_order_value).toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge
                          variant={getStatusBadgeVariant(
                            coupon.is_active,
                            coupon.start_date,
                            coupon.end_date
                          )}
                        >
                          {getStatusText(
                            coupon.is_active,
                            coupon.start_date,
                            coupon.end_date
                          )}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditModal(coupon)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteModal(coupon)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedCoupons.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Percent className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No coupons found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? "Try adjusting your search query"
                    : "Get started by creating your first coupon"}
                </p>
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Coupon
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    if (pageNum < 1 || pageNum > totalPages) return null;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          isActive={currentPage === pageNum}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Coupon Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
          isAddModalOpen ? "block" : "hidden"
        }`}
      >
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4">Create New Coupon</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    placeholder="SUMMER25"
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateCode}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Summer sale discount"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) =>
                    handleSelectChange("discount_type", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  {formData.discount_type === "percentage"
                    ? "Discount Value"
                    : "Discount Amount (₹)"}
                </Label>
                <Input
                  type="number"
                  name="discount_value"
                  min="0"
                  step="0.01"
                  value={formData.discount_value}
                  onChange={(e) =>
                    handleNumberChange("discount_value", e.target.value)
                  }
                  required
                />
                {formData.discount_type === "percentage" && (
                  <p className="text-xs text-muted-foreground">
                    Enter percentage value (e.g., 10 for 10%)
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Minimum Order Value (₹)</Label>
              <Input
                type="number"
                name="min_order_value"
                min="0"
                step="0.01"
                value={formData.min_order_value}
                onChange={(e) =>
                  handleNumberChange("min_order_value", e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Minimum order amount required to use this coupon (0 for no
                minimum)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.start_date ? (
                        format(formData.start_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.start_date}
                      onSelect={(date) =>
                        setFormData({ ...formData, start_date: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.end_date ? (
                        format(formData.end_date, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.end_date}
                      onSelect={(date) =>
                        setFormData({ ...formData, end_date: date })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <span>Active</span>
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      is_active: checked,
                    })
                  }
                />
                <span className="text-sm text-muted-foreground">
                  Make this coupon immediately active
                </span>
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Create Coupon</Button>
            </div>
          </form>
        </div>
      </div>

      {/* Edit Modal */}
      <EditCouponModal />

      {/* Delete Modal */}
      <DeleteCouponModal />
    </div>
  );
}
