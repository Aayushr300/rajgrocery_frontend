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
  Mail,
  Phone,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  MoreHorizontal,
} from "lucide-react";
import CustomerDetailsModal from "../../_components/customers/customer-details-modal";
import EditCustomerModal from "../../_components/customers/edit-customer-modal";

// Generate mock customers data
const generateCustomers = () => {
  const statuses = ["active", "inactive", "suspended"];
  const tiers = ["regular", "silver", "gold", "platinum"];
  const locations = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Kolkata",
    "Hyderabad",
    "Pune",
    "Ahmedabad",
  ];

  const customers = [];
  for (let i = 1; i <= 250; i++) {
    const signupDate = new Date(
      Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000
    );
    const lastActive = new Date(
      Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
    );
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const tier = tiers[Math.floor(Math.random() * tiers.length)];
    const ordersCount = Math.floor(Math.random() * 50);
    const totalSpent = parseFloat(
      (ordersCount * (Math.random() * 500 + 50)).toFixed(2)
    );

    const customer = {
      id: `CUST${1000 + i}`,
      name: `Customer ${i}`,
      email: `customer${i}@example.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 1000000000)}`,
      status,
      tier,
      location: locations[Math.floor(Math.random() * locations.length)],
      signupDate,
      lastActive,
      ordersCount,
      totalSpent,
      addresses: [
        {
          type: "home",
          address: `${Math.floor(Math.random() * 100)}${
            i % 2 === 0 ? "A" : "B"
          }, Street Name, ${
            locations[Math.floor(Math.random() * locations.length)]
          } - ${Math.floor(100000 + Math.random() * 900000)}`,
          isDefault: true,
        },
        {
          type: "work",
          address: `${Math.floor(Math.random() * 100)}${
            i % 2 === 0 ? "C" : "D"
          }, Office Street, ${
            locations[Math.floor(Math.random() * locations.length)]
          } - ${Math.floor(100000 + Math.random() * 900000)}`,
          isDefault: false,
        },
      ],
    };

    customers.push(customer);
  }

  return customers.sort((a, b) => b.signupDate - a.signupDate); // Sort by signup date, newest first
};

const ITEMS_PER_PAGE = 10;

export default function CustomersPage() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortField, setSortField] = useState("signupDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Initialize customers
  useEffect(() => {
    const customers = generateCustomers();
    setAllCustomers(customers);
  }, []);

  // Get unique locations for filter
  const locations = useMemo(() => {
    const uniqueLocations = [
      ...new Set(allCustomers.map((customer) => customer.location)),
    ];
    return uniqueLocations.sort();
  }, [allCustomers]);

  // Filter and sort customers
  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = allCustomers.filter((customer) => {
      const matchesSearch =
        customer.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;
      const matchesTier = tierFilter === "all" || customer.tier === tierFilter;
      const matchesLocation =
        locationFilter === "all" || customer.location === locationFilter;

      return matchesSearch && matchesStatus && matchesTier && matchesLocation;
    });

    // Sort customers
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    allCustomers,
    searchQuery,
    statusFilter,
    tierFilter,
    locationFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCustomers = filteredAndSortedCustomers.slice(
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

  const handleEditCustomer = (updatedCustomer) => {
    setAllCustomers((prev) =>
      prev.map((customer) =>
        customer.id === updatedCustomer.id
          ? { ...customer, ...updatedCustomer }
          : customer
      )
    );
    setIsEditModalOpen(false);
    setSelectedCustomer(null);
  };

  const openDetailsModal = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const openEditModal = (customer) => {
    setSelectedCustomer(customer);
    setIsEditModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      document
        .getElementById("customers-table")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      case "suspended":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTierBadgeVariant = (tier) => {
    switch (tier) {
      case "regular":
        return "secondary";
      case "silver":
        return "default";
      case "gold":
        return "default";
      case "platinum":
        return "success";
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Customers Management
          </h2>
          <p className="text-muted-foreground">
            Manage your customer database and view customer details
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
                Filter customers by status, tier, or location
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search customers..."
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
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier-filter">Tier</Label>
              <Select
                value={tierFilter}
                onValueChange={(value) => {
                  setTierFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="tier-filter">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location-filter">Location</Label>
              <Select
                value={locationFilter}
                onValueChange={(value) => {
                  setLocationFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger id="location-filter">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card id="customers-table">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Showing {paginatedCustomers.length} of{" "}
                {filteredAndSortedCustomers.length} customers
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
                        Customer ID
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
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        {sortField === "name" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Contact
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Tier
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("ordersCount")}
                    >
                      <div className="flex items-center gap-1">
                        Orders
                        {sortField === "ordersCount" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("totalSpent")}
                    >
                      <div className="flex items-center gap-1">
                        Total Spent
                        {sortField === "totalSpent" &&
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
                  {paginatedCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle font-mono font-medium">
                        {customer.id}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {customer.location}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={getStatusBadgeVariant(customer.status)}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant={getTierBadgeVariant(customer.tier)}>
                          {customer.tier}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {customer.ordersCount}
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {formatCurrency(customer.totalSpent)}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDetailsModal(customer)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditModal(customer)}
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

            {paginatedCustomers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No customers found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setTierFilter("all");
                    setLocationFilter("all");
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

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <CustomerDetailsModal
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
          customer={selectedCustomer}
        />
      )}

      {/* Edit Customer Modal */}
      {selectedCustomer && (
        <EditCustomerModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          customer={selectedCustomer}
          onSave={handleEditCustomer}
        />
      )}
    </div>
  );
}
