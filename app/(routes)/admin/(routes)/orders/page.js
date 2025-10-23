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
import {
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  Download,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import OrderDetailsModal from "../../_components/Orders/order-details-modal";
import UpdateStatusModal from "../../_components/Orders/update-status-modal";

// Generate mock orders data
const generateOrders = () => {
  const statuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out-for-delivery",
    "delivered",
    "cancelled",
    "returned",
    "refunded",
  ];
  const paymentMethods = [
    "Credit Card",
    "Debit Card",
    "UPI",
    "Net Banking",
    "Cash on Delivery",
  ];
  const paymentStatuses = ["pending", "completed", "failed", "refunded"];

  const orders = [];
  for (let i = 1; i <= 150; i++) {
    const orderDate = new Date(
      Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000
    );
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const paymentStatus =
      paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    const itemsCount = Math.floor(Math.random() * 5) + 1;

    const order = {
      id: `ORD${1000 + i}`,
      customer: {
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `+91 ${Math.floor(9000000000 + Math.random() * 1000000000)}`,
      },
      date: orderDate,
      status,
      payment: {
        method:
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        status: paymentStatus,
        amount: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
      },
      shipping: {
        address: `${Math.floor(Math.random() * 100)}${
          i % 2 === 0 ? "A" : "B"
        }, Street Name, City, State - ${Math.floor(
          100000 + Math.random() * 900000
        )}`,
        carrier: i % 3 === 0 ? "Delhivery" : i % 3 === 1 ? "Bluedart" : "FedEx",
        trackingId: `TRK${Math.floor(10000000 + Math.random() * 90000000)}`,
      },
      items: Array.from({ length: itemsCount }, (_, idx) => ({
        id: `ITEM${i}${idx}`,
        name: `Product ${i}${idx}`,
        price: parseFloat((Math.random() * 1000 + 10).toFixed(2)),
        quantity: Math.floor(Math.random() * 3) + 1,
        image: "/placeholder-product.jpg",
      })),
      total: 0,
    };

    // Calculate total
    order.total = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    orders.push(order);
  }

  return orders.sort((a, b) => b.date - a.date); // Sort by date, newest first
};

const ITEMS_PER_PAGE = 10;

export default function OrdersPage() {
  const [allOrders, setAllOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Initialize orders
  useEffect(() => {
    const orders = generateOrders();
    setAllOrders(orders);
  }, []);

  // Filter and sort orders
  const filteredAndSortedOrders = useMemo(() => {
    let filtered = allOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.email
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        order.customer.phone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        order.payment.status === paymentStatusFilter;

      // Date filtering
      let matchesDate = true;
      if (dateFilter !== "all") {
        const today = new Date();
        const orderDate = new Date(order.date);

        switch (dateFilter) {
          case "today":
            matchesDate = orderDate.toDateString() === today.toDateString();
            break;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            matchesDate = orderDate >= weekAgo;
            break;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            matchesDate = orderDate >= monthAgo;
            break;
          default:
            matchesDate = true;
        }
      }

      return (
        matchesSearch && matchesStatus && matchesPaymentStatus && matchesDate
      );
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue, bValue;

      if (sortField === "date") {
        aValue = a.date;
        bValue = b.date;
      } else if (sortField === "total") {
        aValue = a.total;
        bValue = b.total;
      } else if (sortField === "customer") {
        aValue = a.customer.name;
        bValue = b.customer.name;
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    allOrders,
    searchQuery,
    statusFilter,
    paymentStatusFilter,
    dateFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredAndSortedOrders.slice(
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

  const handleUpdateStatus = (orderId, newStatus) => {
    setAllOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setIsStatusModalOpen(false);
    setSelectedOrder(null);
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setIsStatusModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document
        .getElementById("orders-table")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "processing":
        return "default";
      case "shipped":
        return "default";
      case "out-for-delivery":
        return "default";
      case "delivered":
        return "success";
      case "cancelled":
        return "destructive";
      case "returned":
        return "destructive";
      case "refunded":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getPaymentStatusBadgeVariant = (status) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "completed":
        return "success";
      case "failed":
        return "destructive";
      case "refunded":
        return "destructive";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Orders Management
          </h2>
          <p className="text-muted-foreground">
            Manage customer orders and track order status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Filter orders by status, payment, or date
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status-filter">Order Status</Label>
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="out-for-delivery">
                    Out for Delivery
                  </SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-filter">Payment Status</Label>
              <Select
                value={paymentStatusFilter}
                onValueChange={(value) => {
                  setPaymentStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="payment-filter">
                  <SelectValue placeholder="Select payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-filter">Date Range</Label>
              <Select
                value={dateFilter}
                onValueChange={(value) => {
                  setDateFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="date-filter">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card id="orders-table">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                Showing {paginatedOrders.length} of{" "}
                {filteredAndSortedOrders.length} orders
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
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-1">
                        Order ID
                        {sortField === "id" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("customer")}
                    >
                      <div className="flex items-center gap-1">
                        Customer
                        {sortField === "customer" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {sortField === "date" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Payment
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center gap-1">
                        Total
                        {sortField === "total" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {paginatedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle font-mono font-medium">
                        {order.id}
                      </td>
                      <td className="p-4 align-middle">
                        <div>
                          <div className="font-medium">
                            {order.customer.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.customer.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        {formatDate(order.date)}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.replace(/-/g, " ")}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={getPaymentStatusBadgeVariant(
                              order.payment.status
                            )}
                          >
                            {order.payment.status}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {order.payment.method}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle font-medium">
                        ₹{order.total.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDetailsModal(order)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openStatusModal(order)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {paginatedOrders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Filter className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No orders found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setPaymentStatusFilter("all");
                    setDateFilter("all");
                  }}
                >
                  Clear Filters
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

                  {/* Show first page and ellipsis if needed */}
                  {currentPage > 3 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => handlePageChange(1)}>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage > 4 && (
                        <PaginationItem>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {/* Show page numbers around current page */}
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

                  {/* Show last page and ellipsis if needed */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <PaginationItem>
                          <span className="px-2">...</span>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

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

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          order={selectedOrder}
        />
      )}

      {/* Update Status Modal */}
      {selectedOrder && (
        <UpdateStatusModal
          open={isStatusModalOpen}
          onOpenChange={setIsStatusModalOpen}
          order={selectedOrder}
          onUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
}
