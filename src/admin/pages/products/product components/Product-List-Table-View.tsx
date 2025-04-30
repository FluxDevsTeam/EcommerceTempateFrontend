import React, { useState, useEffect } from "react";
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

// Define interfaces for the product data structure based on the API response
interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category: Category;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  total_quantity: number; // Assuming this might be relevant later
  sub_category: SubCategory;
  colour: string;
  image1: string;
  image2: string | null;
  image3: string | null;
  discounted_price: string | null;
  price: string;
  is_available: boolean;
  latest_item: boolean;
  latest_item_position: number | null;
  dimensional_size: string | null;
  weight: string | null;
  top_selling_items: boolean;
  top_selling_position: number | null;
  date_created: string;
  date_updated: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}


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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Assuming 10 items per page, adjust as needed
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    productId: 0,
    productName: "",
  });

  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async (page: number) => {
      setLoading(true);
      setError(null);
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setError("Authentication error: No access token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${baseURL}/api/v1/product/item/?page=${page}`, {
          method: "GET",
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          let errorBody;
          try {
            errorBody = await response.json();
          } catch (e) {
            errorBody = await response.text();
          }
          console.error(
            `HTTP error fetching products! status: ${response.status}, body:`,
            errorBody
          );
          setError(`Failed to load products: ${response.statusText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        console.log(`Products fetched (Page ${page}):`, data);
        setProducts(data.results || []);
        setTotalProducts(data.count || 0);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching products."
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchProducts(currentPage);
    }
  }, [isVisible, currentPage, baseURL]); // Added currentPage as dependency


  // Filter products based on selected status
  const filteredProducts = products.filter(product => {
    if (selectedStatus === "All") return true;
    const availabilityStatus = product.is_available ? "Available" : "Out of Stock";
    return availabilityStatus === selectedStatus;
  });


  // Updated getStatusColor based on is_available
  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable
      ? "text-green-600 bg-green-50"
      : "text-orange-600 bg-orange-50";
  };

  // Format date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
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

  const handleDelete = async (productId: number, productName: string) => {
    setDeleteModalConfig({
      isOpen: true,
      productId,
      productName,
    });
  };

  const confirmDelete = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setError("Authentication error: No access token found.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/api/v1/product/item/${deleteModalConfig.productId}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `JWT ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.statusText}`);
      }

      // Refresh the products list
      const updatedProducts = products.filter(
        (product) => product.id !== deleteModalConfig.productId
      );
      setProducts(updatedProducts);
      setTotalProducts(totalProducts - 1);
      
      // Close the modal
      setDeleteModalConfig({
        isOpen: false,
        productId: 0,
        productName: "",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

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
        {loading && // loader
              <div>
                <div className="relative flex w-64 animate-pulse gap-2 p-4">
                  <div className="h-12 w-12 rounded-full bg-slate-400"></div>
                  <div className="flex-1">
                    <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
                    <div className="h-5 w-[90%] rounded-lg bg-slate-400 text-sm"></div>
                  </div>
                  <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-400"></div>
                </div>
              </div>}
        {error && <div className="text-center p-4 text-red-500">Error: {error}</div>}
        {!loading && !error && (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
              <tr>
                <th className="px-4 py-3">No</th>
                {/* <th className="px-4 py-3">ID</th> */}
                <th className="px-4 py-3">Date Created</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="text-xs bg-transparent w-full focus:outline-none"
                  >
                    <option value="All">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{((currentPage - 1) * itemsPerPage) + index + 1}</td>
                  {/* <td className="px-4 py-3">{product.id}</td> */}
                  <td className="px-4 py-3">{formatDate(product.date_created)}</td>
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">{product.sub_category?.category?.name || 'N/A'}</td>
                  <td className="px-4 py-3">${product.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        product.is_available
                      )}`}
                    >
                      {product.is_available ? "Available" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      className="text-gray-600 hover:text-black action-popover"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Use product.id for popover state if IDs are unique and stable numbers
                        setOpenPopoverId(openPopoverId === product.id ? null : product.id);
                      }}
                    >
                      <HiDotsHorizontal />
                    </button>

                    {openPopoverId === product.id && ( // Check against product.id
                      <div className="absolute border right-full top-0 mt-1 mr-2 w-24 bg-white rounded shadow-lg z-50 action-popover">
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                          onClick={() => {
                              navigate(`/admin/products/edit/${product.id}`);
                              setOpenPopoverId(null); // Close popover on navigate
                          }}
                        >
                          <FaEdit className="mr-2" /> Edit
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                          onClick={() => {
                            handleDelete(product.id, product.name);
                            setOpenPopoverId(null);
                          }}
                        >
                          <FaTrash className="mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
               {filteredProducts.length === 0 && !loading && (
                 <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">No products found matching the criteria.</td>
                 </tr>
               )}
            </tbody>
          </table>
        )}
      </div>

      {/* Update Pagination Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
        <div className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} entries
        </div>
        <div className="flex items-center gap-2 justify-center sm:justify-start">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || !prevPageUrl}
            className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage(curr => curr - 1)}
            disabled={currentPage === 1 || !prevPageUrl}
            className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          <div className="flex gap-1">
            {Array.from({ length: Math.ceil(totalProducts / itemsPerPage) }, (_, i) => i + 1)
              .filter(page => {
                const currentPageRange = 2;
                return page === 1 || 
                       page === Math.ceil(totalProducts / itemsPerPage) ||
                       (page >= currentPage - currentPageRange && 
                        page <= currentPage + currentPageRange);
              })
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && (
                    <span className="px-2">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? 'bg-blue-500 text-white'
                        : 'border hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
          </div>

          <button
            onClick={() => setCurrentPage(curr => curr + 1)}
            disabled={!nextPageUrl}
            className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(Math.ceil(totalProducts / itemsPerPage))}
            disabled={!nextPageUrl}
            className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalConfig.isOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModalConfig.productName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModalConfig({
                  isOpen: false,
                  productId: 0,
                  productName: "",
                })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListTableView;
