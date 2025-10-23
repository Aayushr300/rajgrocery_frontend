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
import { Truck, Download, Printer } from "lucide-react";

export default function OrderDetailsModal({ open, onOpenChange, order }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - {order.id}</DialogTitle>
          <DialogDescription>
            Order placed on {formatDate(order.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Order Status</h3>
              <Badge
                variant={getStatusBadgeVariant(order.status)}
                className="text-sm"
              >
                {order.status.replace(/-/g, " ")}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Payment Information</h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant={getPaymentStatusBadgeVariant(order.payment.status)}
                >
                  {order.payment.status}
                </Badge>
                <span className="text-sm">via {order.payment.method}</span>
              </div>
              <div className="text-sm font-medium">
                Amount: ₹{order.payment.amount.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-2">
            <h3 className="font-medium">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-muted-foreground">{order.customer.email}</p>
                <p className="text-muted-foreground">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="space-y-2">
            <h3 className="font-medium">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Shipping Address</p>
                <p className="text-muted-foreground">
                  {order.shipping.address}
                </p>
              </div>
              <div>
                <p className="font-medium">Shipping Method</p>
                <p className="text-muted-foreground">
                  {order.shipping.carrier}
                </p>
                {order.shipping.trackingId && (
                  <p className="text-muted-foreground">
                    Tracking ID: {order.shipping.trackingId}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <h3 className="font-medium">Order Items</h3>
            <div className="border rounded-lg divide-y">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center p-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="ml-4 font-medium">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2">
            <h3 className="font-medium">Order Summary</h3>
            <div className="border rounded-lg p-4 text-sm">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Tax</span>
                <span>₹{(order.total * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t font-medium">
                <span>Total</span>
                <span>₹{(order.total * 1.18).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
