import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaPlus,
  FaThList,
  FaTh,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

interface ProductTableProps {
  isVisible: boolean;
  onViewChange: (mode: "grid" | "list") => void;
  currentView: "grid" | "list";
}

const ProductListTableView: React.FC<ProductTableProps> = ({
  isVisible,
  onViewChange,
  currentView,
}) => {

  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  const productsListTable = [
    {
      id: "12594",
      date: "Dec 1, 2021",
      name: "Classic White T-Shirt",
      category: "Clothes",
      price: "$847.69",
      status: "Active",
    },
    {
      id: "12490",
      date: "Nov 15, 2021",
      name: "Leather Wallet",
      category: "Accessories",
      price: "$477.14",
      status: "Out of Stock",
    },
    {
      id: "12306",
      date: "Nov 02, 2021",
      name: "Wireless Earbuds",
      category: "Electronics",
      price: "$477.14",
      status: "Out of Stock",
    },
    {
      id: "12356",
      date: "Nov 02, 2021",
      name: "Denim Jeans",
      category: "Clothing",
      price: "$477.14",
      status: "Active",
    },
    {
      id: "45735",
      date: "Nov 02, 2021",
      name: "Stainless Water Bottle",
      category: "Kitchen",
      price: "$477.14",
      status: "Active",
    },
    {
      id: "79534",
      date: "Nov 02, 2021",
      name: "Smart Watch",
      category: "Electronics",
      price: "$477.14",
      status: "Active",
    },
    {
      id: "07564",
      date: "Nov 02, 2021",
      name: "Running Shoes",
      category: "Footwear",
      price: "$477.14",
      status: "Out of Stock",
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

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openPopoverId !== null &&
        !(event.target as Element).closest(".action-popover")
      ) {
        setOpenPopoverId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openPopoverId]);

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
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
          onClick={() => navigate("/admin/add-new-product")}
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
          <select className="w-fit sm:w-auto px-3 py-2 border rounded-lg text-sm focus:outline-none sm:mb-0 mr-4">
            <option>Sort by</option>
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

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Product Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="text-xs bg-transparent w-full"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {productsListTable.map((product, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{product.id}</td>
                <td className="px-4 py-3">{product.date}</td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 relative">
                  <button
                    className="text-gray-600 hover:text-black action-popover"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenPopoverId(openPopoverId === index ? null : index);
                    }}
                  >
                    <HiDotsHorizontal />
                  </button>

                  {openPopoverId === index && (
                    <div className="absolute border right-full top-0 mt-1 mr-2 w-24 bg-white rounded shadow-lg z-50 action-popover">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        // onClick={() => {
                        //   navigate(`/admin/products/edit/${product.id}`);
                        //   setOpenPopoverId(null);
                        // }}
                  onClick={() => navigate(`/admin/products/edit/${product.id}`)}

                      >
                        <FaEdit className="mr-2" /> Edit
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center">
                        <FaTrash className="mr-2" /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={`flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0`}>
        <div className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
          Showing 1 to {productsListTable.length} of {productsListTable.length}{" "}
          entries
        </div>
        <div className="flex space-x-1 justify-center sm:justify-start w-full sm:w-auto">
          {[1, 2, 3, 4, 5, 6, 7].map((page) => (
            <button
              key={page}
              className={`px-3 py-1 rounded ${
                page === 1 ? "bg-blue-500 text-white" : "text-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListTableView;
