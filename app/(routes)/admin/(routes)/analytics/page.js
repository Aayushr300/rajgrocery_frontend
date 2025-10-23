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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  RefreshCw,
  ShoppingBag,
  Package,
  CreditCard,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";

// Mock data generation
const generateAnalyticsData = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const categories = [
    "Electronics",
    "Clothing",
    "Home & Kitchen",
    "Books",
    "Beauty",
  ];
  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
  ];
  const devices = ["Desktop", "Mobile", "Tablet"];

  // Generate revenue data
  const revenueData = months.map((month) => ({
    month,
    revenue: Math.floor(Math.random() * 100000) + 50000,
    orders: Math.floor(Math.random() * 500) + 200,
    visitors: Math.floor(Math.random() * 10000) + 5000,
  }));

  // Generate traffic sources
  const trafficSources = [
    {
      source: "Direct",
      visitors: Math.floor(Math.random() * 10000) + 5000,
      conversion: Math.random() * 5 + 2,
    },
    {
      source: "Google",
      visitors: Math.floor(Math.random() * 8000) + 4000,
      conversion: Math.random() * 6 + 1,
    },
    {
      source: "Facebook",
      visitors: Math.floor(Math.random() * 6000) + 3000,
      conversion: Math.random() * 4 + 1,
    },
    {
      source: "Instagram",
      visitors: Math.floor(Math.random() * 4000) + 2000,
      conversion: Math.random() * 7 + 2,
    },
    {
      source: "Twitter",
      visitors: Math.floor(Math.random() * 3000) + 1000,
      conversion: Math.random() * 3 + 1,
    },
  ];

  // Generate product performance
  const productPerformance = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    sales: Math.floor(Math.random() * 500) + 100,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    stock: Math.floor(Math.random() * 200) + 50,
  }));

  // Generate geographical data
  const geographicalData = countries.map((country) => ({
    country,
    visitors: Math.floor(Math.random() * 8000) + 2000,
    revenue: Math.floor(Math.random() * 80000) + 20000,
    conversion: Math.random() * 6 + 1,
  }));

  // Generate device data
  const deviceData = devices.map((device) => ({
    device,
    visitors: Math.floor(Math.random() * 12000) + 3000,
    conversion: Math.random() * 5 + 1.5,
    revenue: Math.floor(Math.random() * 90000) + 30000,
  }));

  // Generate real-time data
  const realTimeData = {
    currentVisitors: Math.floor(Math.random() * 100) + 50,
    activeCarts: Math.floor(Math.random() * 30) + 10,
    ordersLastHour: Math.floor(Math.random() * 15) + 5,
    revenueToday: Math.floor(Math.random() * 50000) + 20000,
  };

  return {
    revenueData,
    trafficSources,
    productPerformance,
    geographicalData,
    deviceData,
    realTimeData,
    summary: {
      totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
      totalOrders: revenueData.reduce((sum, item) => sum + item.orders, 0),
      totalVisitors: revenueData.reduce((sum, item) => sum + item.visitors, 0),
      conversionRate: (
        (revenueData.reduce((sum, item) => sum + item.orders, 0) /
          revenueData.reduce((sum, item) => sum + item.visitors, 0)) *
        100
      ).toFixed(2),
      avgOrderValue: (
        revenueData.reduce((sum, item) => sum + item.revenue, 0) /
        revenueData.reduce((sum, item) => sum + item.orders, 0)
      ).toFixed(2),
    },
  };
};

// Simple chart components (in a real app, you'd use a charting library)
const BarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="flex items-end justify-between h-[200px] gap-2 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
            style={{ height: `${(item.value / maxValue) * 150}px` }}
          />
          <span className="text-xs mt-2 text-muted-foreground">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PieChart = ({ data, height = 200 }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulated = 0;

  return (
    <div className="relative w-[200px] h-[200px] mx-auto">
      {data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const rotation = (accumulated / total) * 360;
        accumulated += item.value;

        return (
          <div
            key={index}
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: `conic-gradient(${item.color} 0% ${percentage}%, transparent ${percentage}% 100%)`,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        );
      })}
      <div className="absolute inset-8 bg-white rounded-full flex items-center justify-center">
        <span className="text-sm font-medium">{total}</span>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setData(generateAnalyticsData());
      setIsLoading(false);
    }, 1000);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading analytics data...</span>
      </div>
    );
  }

  const {
    summary,
    revenueData,
    trafficSources,
    productPerformance,
    geographicalData,
    deviceData,
    realTimeData,
  } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track and analyze your store performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={loadData} disabled={isLoading}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Eye className="h-4 w-4 mr-2" />
              Live Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeData.currentVisitors}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently browsing your store
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Active Carts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{realTimeData.activeCarts}</div>
            <p className="text-xs text-muted-foreground">
              Items in shopping carts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Orders (1h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeData.ordersLastHour}
            </div>
            <p className="text-xs text-muted-foreground">Placed in last hour</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Today's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{realTimeData.revenueToday.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Revenue generated today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Revenue performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={revenueData.map((item) => ({
                    label: item.month,
                    value: item.revenue,
                  }))}
                />
                <div className="flex justify-between mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ₹{summary.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Revenue
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {summary.totalOrders}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Orders
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      ₹{summary.avgOrderValue}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg. Order Value
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Overview</CardTitle>
                <CardDescription>Visitor statistics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={revenueData.map((item) => ({
                    label: item.month,
                    value: item.visitors,
                  }))}
                />
                <div className="flex justify-between mt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {summary.totalVisitors.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Visitors
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {summary.conversionRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Conversion Rate
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {(
                        summary.totalVisitors / revenueData.length
                      ).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg. Daily Visitors
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors come from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.map((source, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-3 ${
                            index === 0
                              ? "bg-blue-500"
                              : index === 1
                              ? "bg-green-500"
                              : index === 2
                              ? "bg-purple-500"
                              : index === 3
                              ? "bg-pink-500"
                              : "bg-yellow-500"
                          }`}
                        />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {source.visitors.toLocaleString()} visitors
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {source.conversion.toFixed(1)}% conversion
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>
                  Visitor devices and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceData.map((device, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center">
                        {device.device === "Desktop" ? (
                          <Monitor className="h-5 w-5 mr-3" />
                        ) : device.device === "Mobile" ? (
                          <Smartphone className="h-5 w-5 mr-3" />
                        ) : (
                          <Tablet className="h-5 w-5 mr-3" />
                        )}
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {device.visitors.toLocaleString()} visitors
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ₹{device.revenue.toLocaleString()} revenue
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>
                Detailed sales metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    ₹{summary.totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Revenue
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {summary.totalOrders}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Orders
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    ₹{summary.avgOrderValue}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg. Order Value
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">
                    {summary.conversionRate}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Conversion Rate
                  </div>
                </div>
              </div>

              <BarChart
                data={revenueData.map((item) => ({
                  label: item.month,
                  value: item.revenue,
                }))}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Top performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Product</th>
                      <th className="text-left p-4">Category</th>
                      <th className="text-right p-4">Sales</th>
                      <th className="text-right p-4">Revenue</th>
                      <th className="text-right p-4">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productPerformance.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="p-4 font-medium">{product.name}</td>
                        <td className="p-4">
                          <Badge variant="outline">{product.category}</Badge>
                        </td>
                        <td className="p-4 text-right">{product.sales}</td>
                        <td className="p-4 text-right">
                          ₹{product.revenue.toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <span
                            className={
                              product.stock < 20
                                ? "text-red-500"
                                : "text-green-500"
                            }
                          >
                            {product.stock}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Geography Tab */}
        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle>Geographical Distribution</CardTitle>
              <CardDescription>
                Visitor and revenue distribution by country
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">
                    Top Countries by Revenue
                  </h3>
                  <div className="space-y-3">
                    {geographicalData
                      .sort((a, b) => b.revenue - a.revenue)
                      .map((country, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">
                              {country.country}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              ₹{country.revenue.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {country.visitors.toLocaleString()} visitors
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">
                    Conversion Rates by Country
                  </h3>
                  <div className="space-y-3">
                    {geographicalData
                      .sort((a, b) => b.conversion - a.conversion)
                      .map((country, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="font-medium">
                              {country.country}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {country.conversion.toFixed(1)}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {country.visitors.toLocaleString()} visitors
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">
              ₹{summary.totalRevenue.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <ShoppingCart className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{summary.totalOrders}</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">
              {summary.totalVisitors.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Visitors</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <BarChart3 className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{summary.conversionRate}%</div>
            <p className="text-sm text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <CreditCard className="h-6 w-6 mx-auto mb-2 text-red-500" />
            <div className="text-2xl font-bold">₹{summary.avgOrderValue}</div>
            <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
