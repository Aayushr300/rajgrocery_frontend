"use client";

import { useEffect, useState, useRef } from "react";
import GlobalApi from "@/app/_utils/GlobalApi";
import ProductItem from "@/app/_components/ProductItem";

export default function CategoryPage({ params }) {
  const { categoryName } = params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await GlobalApi.getProductByCategory(categoryName);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  // Drag / Swipe Handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    const offsetX = e.type === "mousedown" ? e.pageX : e.touches[0].pageX;
    setStartX(offsetX - carouselRef.current.offsetLeft);
    setScrollLeftStart(carouselRef.current.scrollLeft);
    e.preventDefault();
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const x = e.type === "mousemove" ? e.pageX : e.touches[0].pageX;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeftStart - walk;
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
  }, [isDragging, startX, scrollLeftStart]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products in {categoryName}</h1>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto scroll-snap-x scroll-smooth space-x-4 py-2 px-1 scrollbar-hide"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="flex-shrink-0 w-40 sm:w-44 md:w-48 lg:w-52 xl:w-56 snap-start transition-transform duration-300 ease-in-out transform hover:scale-102"
          >
            <ProductItem product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
