"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductItem from "./ProductItem";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

function Products() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [visibleCategories, setVisibleCategories] = useState(3);
  const carouselRefs = useRef({});
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("");

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/get-products`);
        setProducts(response.data.products); // Assuming API returns array of products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  console.log("Products", products);
  // Group products by category
  const groupedProducts = products.reduce((acc, prod) => {
    const categoryName = prod.category || ` ${prod.category_name}`;
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(prod);
    return acc;
  }, {});

  const navigateToCategory = (categoryName) => {
    router.push(`/category/${encodeURIComponent(categoryName)}`);
  };

  const showMoreCategories = () => {
    setVisibleCategories((prev) =>
      Math.min(prev + 2, Object.keys(groupedProducts).length)
    );
  };

  // Drag/Swipe handlers
  const handleDragStart = (categoryName, e) => {
    setIsDragging(true);
    setCurrentCategory(categoryName);

    const offsetX = e.type === "mousedown" ? e.pageX : e.touches[0].pageX;
    setStartX(offsetX - carouselRefs.current[categoryName].offsetLeft);
    setScrollLeftStart(carouselRefs.current[categoryName].scrollLeft);

    e.preventDefault();
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleDragMove = (e) => {
    if (!isDragging || !currentCategory) return;

    const x = e.type === "mousemove" ? e.pageX : e.touches[0].pageX;
    const walk = (x - startX) * 2;
    carouselRefs.current[currentCategory].scrollLeft = scrollLeftStart - walk;
    e.preventDefault();
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("touchmove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [isDragging, currentCategory, startX, scrollLeftStart]);

  return (
    <div className="mt-5 md:mt-10 px-4 md:px-8">
      <h2 className="text-green-600 font-bold text-2xl md:text-3xl mb-6 md:mb-8">
        Our Popular Products
      </h2>

      {Object.entries(groupedProducts)
        .slice(0, visibleCategories)
        .map(([categoryName, productsInCategory]) => (
          <div key={categoryName} className="mb-10 md:mb-14">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl md:text-2xl font-semibold text-gray-800">
                {categoryName}
              </h3>
              <button
                onClick={() => navigateToCategory(categoryName)}
                className="text-green-600 hover:text-green-800 text-sm md:text-base font-medium"
              >
                View All
              </button>
            </div>

            {/* Carousel Row */}
            <div
              ref={(el) => (carouselRefs.current[categoryName] = el)}
              className="flex overflow-x-auto scroll-snap-x scroll-smooth space-x-4 py-2 px-1 scrollbar-hide"
              onMouseDown={(e) => handleDragStart(categoryName, e)}
              onTouchStart={(e) => handleDragStart(categoryName, e)}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {productsInCategory.map((product) => (
                <div
                  key={product.product_id}
                  className="flex-shrink-0 w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56 snap-start transition-transform duration-300 ease-in-out transform hover:scale-102"
                >
                  <ProductItem product={product} />
                </div>
              ))}
            </div>
          </div>
        ))}

      {visibleCategories < Object.keys(groupedProducts).length && (
        <div className="text-center mt-8">
          <button
            onClick={showMoreCategories}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
          >
            Load More Categories
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
