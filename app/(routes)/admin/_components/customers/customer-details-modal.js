"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  CreditCard,
  Package,
} from "lucide-react";

export default function CustomerDetailsModal({ open, onOpenChange, customer }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customer Details - {customer.name}</DialogTitle>
          <DialogDescription>
            Customer since {formatDate(customer.signupDate)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </h3>
              <div className="text-sm">
                <div className="font-medium">{customer.name}</div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {customer.phone}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {customer.location}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Account Details
              </h3>
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <span>Status:</span>
                  <Badge variant={getStatusBadgeVariant(customer.status)}>
                    {customer.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Tier:</span>
                  <Badge variant={getTierBadgeVariant(customer.tier)}>
                    {customer.tier}
                  </Badge>
                </div>
                <div>Last active: {formatDate(customer.lastActive)}</div>
                <div>Member since: {formatDate(customer.signupDate)}</div>
              </div>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Statistics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">{customer.ordersCount}</div>
                <div className="text-sm text-muted-foreground">
                  Total Orders
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {formatCurrency(customer.totalSpent)}
                </div>
                <div className="text-sm text-muted-foreground">Total Spent</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {customer.ordersCount > 0
                    ? formatCurrency(customer.totalSpent / customer.ordersCount)
                    : "₹0"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Avg. Order Value
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {customer.ordersCount > 0
                    ? Math.floor(customer.totalSpent / customer.ordersCount)
                    : "0"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Days Since Last Order
                </div>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Addresses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.addresses.map((address, index) => (
                <div key={index} className="border rounded-lg p-4 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{address.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity (placeholder) */}
          <div className="space-y-2">
            <h3 className="font-medium">Recent Activity</h3>
            <div className="border rounded-lg p-4 text-sm text-center text-muted-foreground">
              Recent orders and activity would be displayed here
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Contact Customer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
