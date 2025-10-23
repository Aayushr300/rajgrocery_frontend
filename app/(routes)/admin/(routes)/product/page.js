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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import AddProductModal from "../../_components/Product/add-product-modal";
import EditProductModal from "../../_components/Product/edit-product-modal";
import DeleteProductModal from "../../_components/Product/delete-product-modal";
import AddCategoriesModal from "../../_components/Product/add-categories-modal";

import { toast } from "sonner";

const BACKEND_API = process.env.NEXT_PUBLIC_API_URL;

// Generate mock data for 500+ products
const generateProducts = () => {
  const categories = [
    "Electronics",
    "Clothing",
    "Home",
    "Kitchen",
    "Sports",
    "Beauty",
    "Books",
    "Toys",
  ];

  const statuses = ["in stock", "out of stock", "low stock"];

  const products = [];
  for (let i = 1; i <= 550; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const stock = Math.floor(Math.random() * 200);
    let status = "in stock";
    if (stock === 0) status = "out of stock";
    else if (stock < 10) status = "low stock";

    products.push({
      id: i,
      name: `Product ${i}`,
      category,
      price: parseFloat((Math.random() * 200 + 10).toFixed(2)),
      stock,
      status,
      image: "/placeholder-product.jpg",
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    });
  }

  return products;
};

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);

  const [allProducts, setAllProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  // Initialize products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/admin/get-products",
          {
            method: "GET",
            credentials: "include", // if using cookies/session
          }
        );
        const data = await response.json();
        setAllProducts(data); // depends on your backend response structure
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/v1/admin/get-categories",
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (data) {
          setCategories(data); // <-- only the categories array
        } else {
          console.error("Error fetching categories:", data.error);
        }
      } catch (err) {
        console.error("API error:", err);
      }
    };

    fetchCategories();
  }, []);

  console.log("Categories:", categories);

  console.log("Categories:", allProducts);
  {
    loading ? (
      <p>Loading categories...</p>
    ) : (
      <ul>
        {categories.map((cat) => (
          <li key={cat.category_id}>{cat.name}</li>
        ))}
      </ul>
    );
  }

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"
          ? product.is_active === 1
          : product.is_active === 0);

      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort products
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
    allProducts,
    searchQuery,
    categoryFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const totalPages = Math.ceil(
    filteredAndSortedProducts.length / ITEMS_PER_PAGE
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      console.log("FormData before sending:");
      for (let [key, value] of newProduct.entries()) {
        console.log(key, value);
      }

      const response = await fetch(
        "http://localhost:5000/api/v1/admin/add-product",
        {
          method: "POST",
          body: newProduct,
          // No need to set 'Content-Type', browser sets it automatically for FormData
          credentials: "include", // if using cookies/session
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Product added successfully!");
      } else {
        toast.error(
          "Failed to add product: " + (data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error uploading product:", err);
      toast.error("Error uploading product: " + err.message);
    }
  };

  // Save category to backend
  const handleSaveCategory = async (formData) => {
    try {
      // formData is already a FormData object (from AddCategoryModal)
      const res = await fetch(`${BACKEND_API}/admin/categories`, {
        method: "POST",
        body: formData, // 👈 don't stringify
        credentials: "include",
      });

      console.log("Response status:", res.status);

      const data = await res.json();

      if (data.success) {
        toast.success("New Category Added");
        setIsAddCategoryModalOpen(false);
        // Optionally, update category list here:
        // setCategories((prev) => [...prev, data.category]);
      } else {
        console.error("Error saving category:", data.message || data.error);
        toast.error(data.message || "Failed to add category");
      }
    } catch (err) {
      console.error("API error:", err);
      toast.error("An unexpected error occurred");
    }
  };

  const handleEditProduct = async (updatedProduct) => {
    try {
      console.log("Sending product data:", updatedProduct);

      const response = await fetch(
        `${BACKEND_API}/admin/update-product/${updatedProduct.product_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // if using cookies/session
          body: JSON.stringify(updatedProduct),
        }
      );

      const data = await response.json();
      console.log("Update response data:", data);
      if (data.message) {
        toast.success(data.message || "Product updated successfully!");
        // Optionally update local state
        setAllProducts((prev) =>
          prev.map((p) =>
            p.product_id === updatedProduct.product_id
              ? { ...p, ...updatedProduct }
              : p
          )
        );
      } else {
        toast.error(
          "Failed to update product: " + (data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Error updating product: " + err.message);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(
        `${BACKEND_API}/admin/delete-product/${selectedProduct.product_id}`,
        {
          method: "DELETE",
          credentials: "include", // if using cookies/session
        }
      );

      console.log("Delete response status:", response);
      const data = await response.json();

      if (response.status === 200) {
        toast.success("Product deleted successfully!");
        // Update local state
        setAllProducts((prev) =>
          prev.filter((product) => product.id !== selectedProduct.id)
        );
      } else {
        toast.error(
          "Failed to delete product: " + (data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Error deleting product: " + err.message);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of table
      document
        .getElementById("products-table")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 md:gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Products Management
          </h2>
          <p className="text-muted-foreground">
            Managing {allProducts.length} products with advanced filtering
          </p>
        </div>

        <Button
          onClick={() => setIsAddCategoryModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Categories
        </Button>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Filters</CardTitle>
              <CardDescription>Narrow down your product list</CardDescription>
            </div>
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full sm:w-[300px] pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-auto">
              <Label htmlFor="category-filter">Category</Label>
              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger
                  id="category-filter"
                  className="w-full sm:w-[200px]"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.category_id}
                      value={category.name}
                    >
                      <div className="flex items-center gap-2">
                        {category.image_url && (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-6 h-6 rounded object-cover"
                          />
                        )}
                        <span>{category.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Label htmlFor="status-filter">Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger
                  id="status-filter"
                  className="w-full sm:w-[180px]"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in stock">In Stock</SelectItem>
                  <SelectItem value="out of stock">Out of Stock</SelectItem>
                  <SelectItem value="low stock">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card id="products-table">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Showing {paginatedProducts.length} of{" "}
                {filteredAndSortedProducts.length} products
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
                        ID
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
                        Product
                        {sortField === "name" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-1">
                        Category
                        {sortField === "category" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-1">
                        Status
                        {sortField === "status" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center gap-1">
                        Mrp Price
                        {sortField === "price" &&
                          (sortDirection === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer">
                      {" "}
                      <div className="flex items-center gap-1">
                        Selling Price
                      </div>
                    </th>
                    <th
                      className="h-12 px-4 text-left align-middle font-medium text-muted-foreground cursor-pointer"
                      onClick={() => handleSort("stock")}
                    >
                      <div className="flex items-center gap-1">
                        Stock
                        {sortField === "stock" &&
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
                  {paginatedProducts.map((product) => (
                    <tr
                      key={product.product_id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-mono">
                        {product.product_id}
                      </td>

                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="font-medium">{product.name}</div>
                        </div>
                      </td>

                      <td className="p-4 align-middle">{product.category}</td>

                      <td className="p-4 align-middle">
                        <div
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors`}
                        >
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                              product.is_active
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }`}
                          >
                            {product.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </td>

                      <td className="p-4 align-middle">₹{product.mrp}</td>
                      <td className="p-4 align-middle">
                        ₹{product.selling_price}
                      </td>
                      <td className="p-4 align-middle">{product.stock}</td>

                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditModal(product)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openDeleteModal(product)}
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

            {paginatedProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <Filter className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No products found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setStatusFilter("all");
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

      {/* Add Product Modal */}
      <AddProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAddProduct}
        categories={categories}
      />

      {/* Add Categories Modal */}
      <AddCategoriesModal
        open={isAddCategoryModalOpen}
        onOpenChange={setIsAddCategoryModalOpen}
        onSave={handleSaveCategory}
      />

      {/* Edit Product Modal */}
      {selectedProduct && (
        <EditProductModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          product={selectedProduct}
          onSave={handleEditProduct}
          categories={categories}
        />
      )}

      {/* Delete Product Modal */}
      {selectedProduct && (
        <DeleteProductModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          product={selectedProduct}
          onConfirm={handleDeleteProduct}
        />
      )}
    </div>
  );
}
