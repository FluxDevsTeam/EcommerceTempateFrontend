import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { FaSearch, FaThList, FaTh, FaPlus } from "react-icons/fa";
import { Navigate, useNavigate } from "react-router-dom";

interface ProductGridProps {
  isVisible: boolean;
  onViewChange: (mode: "grid" | "list") => void;
  currentView: "grid" | "list";
}

const ProductsGrid: React.FC<ProductGridProps> = ({ 
  isVisible, 
  onViewChange,
  currentView 
}) => {


  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const productsGrid = [
    {
      id: 1,
      name: "Gradient Graphic T-shirt",
      price: 212,
      image: `https://th.bing.com/th?q=Gradient+Color+Shirt+Black+and+Green&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-GB&cc=GB&setlang=en&adlt=moderate&t=1&mw=247`,
      discount: 15,
      originalPrice: 300,
      status: "Active",
      stock: 2,
    },
    {
      id: 2,
      name: "Polo with Contrast Trims",
      price: 212,
      image:
        "https://th.bing.com/th/id/OIP.GuOfRbgNi7aCQug2U_T3ywHaIa?w=205&h=233&c=7&r=0&o=5&pid=1.7",
      status: "None",
      stock: 0,
    },
    {
      id: 3,
      name: "Black Striped T-shirt",
      price: 120,
      originalPrice: 150,
      image:
        "https://th.bing.com/th/id/OIP._OTpp91FGf3h-FdksLC-6wHaHl?w=205&h=209&c=7&r=0&o=5&pid=1.7",
      status: "None",
      stock: 0,
    },
    {
      id: 4,
      name: "Black Striped T-shirt",
      price: 120,
      originalPrice: 150,
      discount: 30,
      image:
        "https://th.bing.com/th/id/OIP.isIzC64ISx8G8jPpKeiPRwHaHa?w=184&h=184&c=7&r=0&o=5&pid=1.7",
      status: "Active",
      stock: 14,
    },
    {
      id: 5,
      name: "Black Striped T-shirt",
      price: 120,
      originalPrice: 150,
      image: `https://th.bing.com/th/id/OIP.mDCQm5jis2bXadCV7LLLwwHaLI?w=141&h=213&c=7&r=0&o=5&pid=1.7`,
      status: "Active",
      stock: 8,
    },
    {
      id: 6,
      name: "Black Striped T-shirt",
      price: 120,
      originalPrice: 240,
      discount: 50,
      image: `https://th.bing.com/th/id/OIP.pLy_d4q6NSl8Y5__dojzWAHaHa?w=205&h=205&c=7&r=0&o=5&pid=1.7`,
      status: "None",
      stock: 0,
    },
    {
      id: 7,
      name: "Black Striped T-shirt",
      price: 120,
      originalPrice: 150,
      image: `https://th.bing.com/th/id/OIP.dkNJ_ODZxla-khcYAQ6t8QHaLH?w=156&h=192&c=7&r=0&o=5&pid=1.7`,
      status: "Active",
      stock: 5,
    },
    {
      id: 8,
      name: "Black Striped T-shirt",
      price: 120,
      originalPrice: 150,
      image: `https://th.bing.com/th/id/OIP.mxALY9ebC8FBKs-t3z1z1AHaLH?w=156&h=180&c=7&r=0&o=5&pid=1.7`,

      status: "Active",
      stock: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-50";
      case "Out of Stock":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (!isVisible) return null;

  return (
    <div className="w-full">
      {/* Header and Controls */}
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
        {/* Page Header with Add Product Button */}
        <div className="flex flex-row justify-between items-center mb-6">
          <h2
            style={{ fontSize: "clamp(14px, 3vw, 22px)" }}
            className="font-semibold text-gray-800"
          >
            My Products List
          </h2>

          <button 
                className="flex items-center justify-center space-x-2 bg-gray-700 text-white px-2 py-2 rounded-lg hover:bg-blue-600 transition-colors w-fit"
                onClick={() => navigate('/admin/add-new-product')}
              >
                <FaPlus style={{ fontSize: "clamp(1px, 3vw, 15px)" }} />
                <span
                  style={{ fontSize: "clamp(11px, 3vw, 14px)" }}
                  className="hidden md:inline-block"
                >
                  Add New Product
                </span>
              </button>
        </div>

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-xs mr-0 sm:mr-4">
            <input
              type="text"
              placeholder="Search for Category"
              className="w-full pl-8 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-2.5 top-3.5 text-gray-400" />
          </div>

          {/* Right Controls */}
          <div className="flex justify-between items-center w-full sm:w-auto">
            {/* Sort Dropdown */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-fit sm:w-auto px-3 py-2 border rounded-lg text-sm focus:outline-none sm:mb-0 mr-4"
            >
              <option value="">Sort by</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>

            {/* View Mode Toggles */}
            <div className="flex border rounded-lg">
              <button
                className={`p-2 ${currentView === "list" ? "bg-gray-100" : ""}`}
                onClick={() => onViewChange("list")}
              >
                <FaThList />
              </button>
              <button
                className={`p-2 ${currentView === "grid" ? "bg-gray-100" : ""}`}
                onClick={() => onViewChange("grid")}
              >
                <FaTh />
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Product grid display */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-5">
        {productsGrid.map((product) => (
          // container holding product
          <div
            key={product.id}
            className="bg-gray-50 rounded-lg relative px-2 py-3"
          >
            <div className="relative h-40 bg-white rounded-lg mb-4 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full bg- max-w-full object-contain"
              />

              {/* stock status notification */}
              <div className="absolute top-1 right-2 flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    product.status === "Active"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                ></span>
                <span
                  style={{ fontSize: "clamp(3px, 3vw, 13.5px)" }}
                  className={`px-2 py-0.5 rounded-full ${
                    product.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {product.status}
                </span>
              </div>
            </div>

            {/* product name */}
            <h3
              style={{ fontSize: "clamp(13px, 3vw, 19px)" }}
              className="font-medium"
            >
              {product.name}
            </h3>

            {/* money */}
            <div
              style={{ fontSize: "clamp(12px, 3vw, 18px)" }}
              className="flex items-center mt-2"
            >
              <span className="font-bold">${product.price}</span>
              {product.originalPrice && (
                <>
                  <span
                    // style={{ fontSize: "clamp(13px, 3vw, 34px)" }}
                    className="text-gray-400 line-through ml-2"
                  >
                    ${product.originalPrice}
                  </span>
                  {product.discount && (
                    <span
                      style={{ fontSize: "clamp(6px, 3vw, 15px)" }}
                      className="bg-red-100 text-red-500 px-1 py-[2px] ml-2 rounded"
                    >
                      -{product.discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* stock status */}
            <div className="items-center justify-between mt-3">
              <span
                style={{ fontSize: "clamp(10px, 3vw, 11.5px)" }}
                className={`px-2 py-0.5 rounded-full ${
                  product.stock > 0
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {product.stock} left in Stock
              </span>

              {/* edit and delete */}
              <div
                style={{ fontSize: "clamp(11px, 3vw, 13.5px)" }}
                className="flex items-center gap-2 mt-3"
              >
                <button 
                  className="text-gray-600 hover:text-black flex items-center"
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                >
                  <FiEdit className="h-3 w-3" />
                  <span className="ml-1">Edit</span>
                </button>
                <button className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="hide-grid grid-cols-1 sm:grid-cols-2 items-center gap-4 mt-4 px-1">
        <div className="grid grid-flow-col auto-cols-max border rounded justify-center sm:justify-start">
          <button
            onClick={() => handlePageChange(1)}
            className="p-2 border-r hover:bg-gray-100 hidden sm:block"
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            className="p-2 border-r hover:bg-gray-100"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {[1, 2, 3, 4].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 ${
                currentPage === page
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              } border-r hidden sm:block`}
            >
              {page}
            </button>
          ))}

          <span className="px-2 py-1 border-r sm:inline hidden">.....</span>
          <span className="px-2 py-1 sm:hidden">Page {currentPage} of 10</span>

          <button
            onClick={() => handlePageChange(Math.min(10, currentPage + 1))}
            className="p-2 border-r hover:bg-gray-100"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => handlePageChange(10)}
            className="p-2 hover:bg-gray-100 hidden sm:block"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;
