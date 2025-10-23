"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
function CategoryList() {
  const [categories, setCategory] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/get-categories`);

        setCategory(response.data.data);
      } catch (err) {
        console.log("Error", err);
      }
    };

    fetchCategories();
  }, []);

  console.log("Categories Data", categories);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Shop By Category
      </h2>
      <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-6">
        {categories.map((category) => (
          <Link
            href={`/category/${category.name.replace(/\s+/g, "-")}`}
            key={category.category_id}
            className="flex flex-col items-center min-w-[70px] group"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-2 group-hover:shadow-md transition-all duration-200">
              <div className="relative w-8 h-8 md:w-10 md:h-10">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <span
              className={`text-xs font-medium ${category.color} text-center mt-1 group-hover:text-gray-800 transition-colors`}
            >
              {category.name}
            </span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default CategoryList;
