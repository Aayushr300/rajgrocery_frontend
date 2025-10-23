"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  Upload,
  Download,
  RefreshCw,
  Shield,
  Mail,
  CreditCard,
  Truck,
  Globe,
  FileText,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Mock settings data - in real app, this would come from API
  const mockSettings = {
    general: {
      siteName: "MyShop",
      siteDescription: "Your favorite online store",
      adminEmail: "admin@myshop.com",
      timezone: "Asia/Kolkata",
      dateFormat: "DD/MM/YYYY",
      itemsPerPage: 20,
      maintenanceMode: false,
    },
    payment: {
      currency: "INR",
      currencySymbol: "₹",
      paymentMethods: ["card", "upi", "netbanking", "cod"],
      defaultPaymentMethod: "card",
      testMode: true,
      razorpayKey: "",
      razorpaySecret: "",
    },
    shipping: {
      shippingMethods: ["standard", "express", "free"],
      defaultShippingMethod: "standard",
      freeShippingThreshold: 999,
      shippingCost: 49,
      expressShippingCost: 99,
      estimatedDeliveryDays: {
        standard: "3-5",
        express: "1-2",
        free: "4-7",
      },
    },
    email: {
      smtpHost: "smtp.gmail.com",
      smtpPort: 587,
      smtpUsername: "",
      smtpPassword: "",
      fromEmail: "noreply@myshop.com",
      fromName: "MyShop",
      orderConfirmation: true,
      shippingNotification: true,
      newsletter: true,
    },
    appearance: {
      theme: "light",
      primaryColor: "#3b82f6",
      secondaryColor: "#64748b",
      logo: "/logo.png",
      favicon: "/favicon.ico",
      homepageLayout: "grid",
      productPageLayout: "standard",
    },
    security: {
      requireLogin: false,
      strongPasswords: true,
      loginAttempts: 5,
      sessionTimeout: 24,
      twoFactorAuth: false,
      ipWhitelist: [],
      recaptcha: false,
      recaptchaKey: "",
    },
    notifications: {
      newOrder: true,
      lowStock: true,
      newCustomer: true,
      newsletterSignup: false,
      orderStatusChange: true,
      notificationEmail: "admin@myshop.com",
      smsNotifications: false,
      pushNotifications: false,
    },
    taxes: {
      enableTaxes: true,
      taxType: "inclusive", // inclusive or exclusive
      defaultTaxRate: 18,
      taxRates: [
        { name: "Standard", rate: 18, countries: ["IN"] },
        {
          name: "Reduced",
          rate: 12,
          countries: ["IN"],
          products: ["books", "food"],
        },
        { name: "Zero", rate: 0, countries: ["IN"], products: ["exports"] },
      ],
    },
  };

  useEffect(() => {
    // Simulate loading settings from API
    setTimeout(() => {
      setSettings(mockSettings);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSave = async (section) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Saving settings:", settings[section]);
    setIsSaving(false);
    // Show success message
  };

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayChange = (section, field, index, value) => {
    setSettings((prev) => {
      const newArray = [...prev[section][field]];
      newArray[index] = value;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray,
        },
      };
    });
  };

  const addArrayItem = (section, field, defaultValue = "") => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], defaultValue],
      },
    }));
  };

  const removeArrayItem = (section, field, index) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index),
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Configure your store settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-6">
          <TabsTrigger value="general">
            <Globe className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="h-4 w-4 mr-2" />
            Shipping
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <FileText className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Mail className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic store information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) =>
                      handleInputChange("general", "siteName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.general.adminEmail}
                    onChange={(e) =>
                      handleInputChange("general", "adminEmail", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) =>
                    handleInputChange(
                      "general",
                      "siteDescription",
                      e.target.value
                    )
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) =>
                      handleInputChange("general", "timezone", value)
                    }
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="Europe/London">GMT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) =>
                      handleInputChange("general", "dateFormat", value)
                    }
                  >
                    <SelectTrigger id="dateFormat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="itemsPerPage">Items Per Page</Label>
                  <Input
                    id="itemsPerPage"
                    type="number"
                    min="10"
                    max="100"
                    value={settings.general.itemsPerPage}
                    onChange={(e) =>
                      handleInputChange(
                        "general",
                        "itemsPerPage",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="maintenanceMode" className="text-base">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, your store will be temporarily unavailable to
                    visitors
                  </p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) =>
                    handleInputChange("general", "maintenanceMode", checked)
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("general")}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment methods and gateway settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={settings.payment.currency}
                    onValueChange={(value) =>
                      handleInputChange("payment", "currency", value)
                    }
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultPaymentMethod">
                    Default Payment Method
                  </Label>
                  <Select
                    value={settings.payment.defaultPaymentMethod}
                    onValueChange={(value) =>
                      handleInputChange(
                        "payment",
                        "defaultPaymentMethod",
                        value
                      )
                    }
                  >
                    <SelectTrigger id="defaultPaymentMethod">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Enabled Payment Methods</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["card", "upi", "netbanking", "cod"].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`payment-${method}`}
                        checked={settings.payment.paymentMethods.includes(
                          method
                        )}
                        onChange={(e) => {
                          const newMethods = e.target.checked
                            ? [...settings.payment.paymentMethods, method]
                            : settings.payment.paymentMethods.filter(
                                (m) => m !== method
                              );
                          handleInputChange(
                            "payment",
                            "paymentMethods",
                            newMethods
                          );
                        }}
                        className="rounded border-gray-300"
                      />
                      <Label
                        htmlFor={`payment-${method}`}
                        className="text-sm font-normal capitalize"
                      >
                        {method === "cod" ? "Cash on Delivery" : method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="testMode" className="text-base">
                    Test Mode
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Enable test mode for payment processing (no real
                    transactions)
                  </p>
                </div>
                <Switch
                  id="testMode"
                  checked={settings.payment.testMode}
                  onCheckedChange={(checked) =>
                    handleInputChange("payment", "testMode", checked)
                  }
                />
              </div>

              {!settings.payment.testMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="razorpayKey">Razorpay Key</Label>
                    <Input
                      id="razorpayKey"
                      type="password"
                      value={settings.payment.razorpayKey}
                      onChange={(e) =>
                        handleInputChange(
                          "payment",
                          "razorpayKey",
                          e.target.value
                        )
                      }
                      placeholder="rzp_test_xxxxxxxxxxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="razorpaySecret">Razorpay Secret</Label>
                    <Input
                      id="razorpaySecret"
                      type="password"
                      value={settings.payment.razorpaySecret}
                      onChange={(e) =>
                        handleInputChange(
                          "payment",
                          "razorpaySecret",
                          e.target.value
                        )
                      }
                      placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("payment")}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Payment Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>
                Configure shipping methods and costs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultShippingMethod">
                    Default Shipping Method
                  </Label>
                  <Select
                    value={settings.shipping.defaultShippingMethod}
                    onValueChange={(value) =>
                      handleInputChange(
                        "shipping",
                        "defaultShippingMethod",
                        value
                      )
                    }
                  >
                    <SelectTrigger id="defaultShippingMethod">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">
                        Standard Shipping
                      </SelectItem>
                      <SelectItem value="express">Express Shipping</SelectItem>
                      <SelectItem value="free">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">
                    Free Shipping Threshold (₹)
                  </Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    min="0"
                    value={settings.shipping.freeShippingThreshold}
                    onChange={(e) =>
                      handleInputChange(
                        "shipping",
                        "freeShippingThreshold",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shippingCost">
                    Standard Shipping Cost (₹)
                  </Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    min="0"
                    value={settings.shipping.shippingCost}
                    onChange={(e) =>
                      handleInputChange(
                        "shipping",
                        "shippingCost",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expressShippingCost">
                    Express Shipping Cost (₹)
                  </Label>
                  <Input
                    id="expressShippingCost"
                    type="number"
                    min="0"
                    value={settings.shipping.expressShippingCost}
                    onChange={(e) =>
                      handleInputChange(
                        "shipping",
                        "expressShippingCost",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estimated Delivery Times</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="standardDelivery">
                      Standard Shipping (days)
                    </Label>
                    <Input
                      id="standardDelivery"
                      value={settings.shipping.estimatedDeliveryDays.standard}
                      onChange={(e) =>
                        handleInputChange("shipping", "estimatedDeliveryDays", {
                          ...settings.shipping.estimatedDeliveryDays,
                          standard: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expressDelivery">
                      Express Shipping (days)
                    </Label>
                    <Input
                      id="expressDelivery"
                      value={settings.shipping.estimatedDeliveryDays.express}
                      onChange={(e) =>
                        handleInputChange("shipping", "estimatedDeliveryDays", {
                          ...settings.shipping.estimatedDeliveryDays,
                          express: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freeDelivery">Free Shipping (days)</Label>
                    <Input
                      id="freeDelivery"
                      value={settings.shipping.estimatedDeliveryDays.free}
                      onChange={(e) =>
                        handleInputChange("shipping", "estimatedDeliveryDays", {
                          ...settings.shipping.estimatedDeliveryDays,
                          free: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => handleSave("shipping")}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Shipping Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add more tabs for Email, Appearance, Security, Notifications following the same pattern */}
      </Tabs>
    </div>
  );
}
