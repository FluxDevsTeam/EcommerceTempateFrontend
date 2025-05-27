import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaThList,
  FaTh,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import PaginatedDropdown from "./PaginatedDropdown";
import type { Product } from "../utils/productUtils";
import { fetchProducts } from "../utils/productUtils";
import { formatCurrency, formatNumberWithCommas } from "../../../utils/formatting";

// Define interfaces for auxiliary data structures
interface Category {
  id: number;
  name: string;
}

interface ProductTableProps{
  isVisible: boolean;
  onViewChange: (mode: "grid" | "list") => void;
  currentView: "grid" | "list";
}

// Helper functions that were previously imported
function getStatusColor(product: Product) {
  if (!product.is_available) {
    return "text-gray-600 bg-gray-50"; // Unavailable items are gray
  }
  if (product.unlimited || product.total_quantity > 0) {
    return "text-green-600 bg-green-50"; // Available items are green
  }
  return "text-orange-600 bg-orange-50"; // Out of stock items are orange
}

function getStatusText(product: Product) {
  if (!product.is_available) {
    return "Unavailable";
  }
  if (product.unlimited || product.total_quantity > 0) {
    return "Available";
  }
  return "Out of Stock";
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
}

const ProductListTableView: React.FC<ProductTableProps> = ({
  isVisible,
  onViewChange,
  currentView,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(20);
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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [dbPriceRange, setDbPriceRange] = useState<[number, number]>([0, 1000]); // Initial broad range, will be updated
const [isDbPriceRangeInitialized, setIsDbPriceRangeInitialized] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([0, 1000]);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const filters = {
          sub_category: selectedCategory,
          ...(sortBy === "price_range"
            ? {
                min_price: String(priceRange[0]),
                max_price: String(priceRange[1]),
              }
            : sortBy !== "out_of_stock"
            ? Object.fromEntries([sortBy.split("=")])
            : {}),
        };

        const data = await fetchProducts(
          searchQuery,
          currentPage,
          itemsPerPage,
          filters
        );
        setProducts(data.results);
        setTotalProducts(data.count);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch products"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isVisible && isDbPriceRangeInitialized) { // Only load products if dbPriceRange is initialized
      if (searchQuery) setCurrentPage(1);
      loadProducts();
    }
  }, [
    isVisible,
    currentPage,
    selectedCategory,
    sortBy,
    priceRange,
    searchQuery,
    isDbPriceRangeInitialized, // Add as dependency
  ]);

  // Effect to fetch initial min/max prices for the slider
  useEffect(() => {
    const fetchMinMaxPrices = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Authentication error: No access token for fetching price range.");
        setIsDbPriceRangeInitialized(true); // Allow product loading even if price range fetch fails
        return;
      }
      try {
        // Fetch all products to determine min/max prices from their sizes
        // This might need to handle pagination if the API returns paginated results for all items
        // For simplicity, assuming a single call or a manageable number of pages
        let allProducts: any[] = [];
        let nextPage = `${baseURL}/api/v1/product/item/?page_size=100`; // Fetch 100 items per page

        while (nextPage) {
          const response = await fetch(nextPage, {
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch products for price range: ${response.statusText}`);
          }
          const data = await response.json();
          allProducts = allProducts.concat(data.results);
          nextPage = data.next;
        }

        if (allProducts.length === 0) {
          setDbPriceRange([0, 1000]); // Default if no products
          setTempPriceRange([0, 1000]);
          setIsDbPriceRangeInitialized(true);
          return;
        }

        let minPrice = Infinity;
        let maxPrice = -Infinity;

        allProducts.forEach(product => {
          if (product.sizes && product.sizes.length > 0) {
            product.sizes.forEach((size: any) => {
              const price = parseFloat(size.price);
              if (!isNaN(price)) {
                if (price < minPrice) minPrice = price;
                if (price > maxPrice) maxPrice = price;
              }
            });
          } else {
            // Fallback to product-level price if sizes are not available or empty
            const productPrice = parseFloat(product.price);
            if (!isNaN(productPrice)) {
              if (productPrice < minPrice) minPrice = productPrice;
              if (productPrice > maxPrice) maxPrice = productPrice;
            }
          }
        });
        
        if (minPrice === Infinity || maxPrice === -Infinity) { // If no valid prices found
            minPrice = 0;
            maxPrice = 1000;
        }
        if (minPrice === maxPrice) { // If all items have the same price, or only one item
            maxPrice = minPrice + 100; // Add a small range for the slider
        }


        setDbPriceRange([minPrice, maxPrice]);
        setTempPriceRange([minPrice, maxPrice]); // Initialize temp range with actual db range
        setPriceRange([minPrice, maxPrice]); // Also initialize applied priceRange

      } catch (err) {
        console.error("Error fetching min/max prices:", err);
        setError("Failed to load price range data. Using default.");
        // Fallback to a default range if API call fails
        setDbPriceRange([0, 1000]);
        setTempPriceRange([0, 1000]);
      } finally {
        setIsDbPriceRangeInitialized(true);
      }
    };

    if (isVisible) {
        fetchMinMaxPrices();
    }
  }, [isVisible, baseURL]);


  // Fetch categories from the API

  // Fetch categories from the API
  const fetchCategories = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("Authentication error: No access token found.");
      return;
    }

    try {
      // First fetch to get total count
      const initialResponse = await fetch(
        `${baseURL}/api/v1/product/sub-category/`,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!initialResponse.ok) {
        throw new Error(`HTTP error! status: ${initialResponse.status}`);
      }

      const initialData = await initialResponse.json();
      const totalItems = initialData.count;
      const itemsPerPage = 10;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      // Fetch all pages in parallel
      const fetchPromises = [];
      for (let page = 1; page <= totalPages; page++) {
        fetchPromises.push(
          fetch(`${baseURL}/api/v1/product/sub-category/?page=${page}`, {
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          }).then((response) => response.json())
        );
      }

      // Wait for all requests to complete
      const responses = await Promise.all(fetchPromises);

      // Combine all results
      const allCategories = responses.reduce((acc, response) => {
        return [...acc, ...response.results];
      }, []);

      setCategories(allCategories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch categories"
      );
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [baseURL]);

  // Update useEffect to properly set the initial tempPriceRange and priceRange
  useEffect(() => {
    if (dbPriceRange[0] !== 0 || dbPriceRange[1] !== 0) {
      setTempPriceRange([dbPriceRange[0], dbPriceRange[1]]);
      // Only set priceRange if it hasn't been set yet
      if (priceRange[0] === 0 && priceRange[1] === 0) {
        setPriceRange([dbPriceRange[0], dbPriceRange[1]]);
      }
    }
  }, [dbPriceRange]);

  // Filter products based on selected status
  const filterProducts = (products: Product[]) => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        selectedStatus === "All" || getStatusText(product) === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const filteredProducts = filterProducts(products);

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
      setError(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || !selectedCategoryForEdit) return;
    setEditingCategory(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `${baseURL}/api/v1/product/category/${selectedCategoryForEdit.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `JWT ${accessToken}`,
          },
          body: JSON.stringify({ name: editCategoryName }),
        }
      );

      if (!response.ok) throw new Error("Failed to edit category");

      // Refresh categories
      await fetchCategories();
      setEditCategoryName("");
      setShowEditCategoryModal(false);
      setSelectedCategoryForEdit(null);
    } catch (error) {
      console.error("Error editing category:", error);
      setError("Failed to edit category");
    } finally {
      setEditingCategory(false);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-3 sm:space-y-0">
  <h2
    style={{ fontSize: "clamp(12px, 3vw, 18px)" }}
    className="font-semibold text-gray-800 text-center sm:text-left"
  >
    My Products List
  </h2>

  <div className="flex flex-wrap justify-center sm:justify-end gap-1 sm:gap-2">
    <button
      className="flex items-center justify-center space-x-1 sm:space-x-2 bg-gray-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors w-fit text-xs sm:text-sm"
      onClick={() => navigate("/admin/admin-categories")}
    >
      <span className="whitespace-nowrap">Category</span>
    </button>
    <button
      className="flex items-center justify-center space-x-1 sm:space-x-2 bg-gray-700 text-white px-2 sm:px-2 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition-colors w-fit text-xs sm:text-sm"
      onClick={() => navigate("/admin/add-new-product")}
    >
      <FaPlus style={{ fontSize: "clamp(8px, 2vw, 12px)" }} />
      <span
        style={{ fontSize: "clamp(8px, 2vw, 12px)" }}
        className="hidden sm:inline-block"
      >
        Add New Product
      </span>
      <span
        style={{ fontSize: "clamp(8px, 2vw, 12px)" }}
        className="inline-block sm:hidden"
      >
        Add Product
      </span>
    </button>
    <button
      onClick={() => navigate("/admin/products/Prioritize")}
      className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs sm:text-sm whitespace-nowrap"
    >
      Product Prioritization
    </button>
  </div>
</div>

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row w-full gap-4">
            {/* Category Dropdown */}
            <div className="relative w-full sm:max-w-xs">
              <PaginatedDropdown
                options={categories}
                value={selectedCategory}
                onChange={(value) => setSelectedCategory(String(value))}
                placeholder="All Sub-Categories"
                className="w-full"
              />
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex justify-between items-center w-full sm:w-auto">
            {/* Order By Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  if (e.target.value === "") {
                    // Reset everything to default when selecting "Order By"
                    setSortBy("");
                    setShowPriceFilter(false);
                    setPriceRange([dbPriceRange[0], dbPriceRange[1]]);
                    setTempPriceRange([dbPriceRange[0], dbPriceRange[1]]);
                    setCurrentPage(1);
                  } else {
                    setSortBy(e.target.value);
                    if (e.target.value === "price_range") {
                      setShowPriceFilter(true);
                      setTempPriceRange([dbPriceRange[0], dbPriceRange[1]]); // Reset to current DB range
                    } else {
                      setShowPriceFilter(false);
                    }
                  }
                }}
                className="w-fit sm:w-auto px-3 py-2 border rounded-lg text-sm focus:outline-none sm:mb-0 mr-4"
              >
                <option value="">Order By</option>
                <option value="price_range">Price Range</option>
                <option value="is_available=true">Available Items</option>
                <option value="is_available=false">Unavailable Items</option>
                <option value="out_of_stock">Out of Stock Items</option>
                <option value="latest_item=true">Latest Items</option>
                <option value="latest_item=false">Non-Latest Items</option>
                <option value="top_selling_items=true">Top Selling</option>
                <option value="top_selling_items=false">Non-Top Selling</option>
                <option value="discount=true">Discounted Items</option>
                <option value="discount=false">Non-Discounted Items</option>
              </select>

              {showPriceFilter && (
                <div className="absolute z-50 mt-2 p-6 bg-white border rounded-lg shadow-lg w-80">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Price Range: {formatCurrency(tempPriceRange[0])} - {formatCurrency(tempPriceRange[1])}
                    </label>
                    <div className="relative h-8">
                    {/* Custom Two-Handle Slider */}
                    <div className="relative w-full h-full flex items-center">
                      {/* Track */}
                      <div className="absolute w-full h-2 bg-gray-200 rounded-full top-1/2 -translate-y-1/2"></div>
                      {/* Highlighted Range */}
                      <div
                        className="absolute h-2 bg-blue-500 rounded-full top-1/2 -translate-y-1/2"
                        style={{
                          left: `${dbPriceRange[1] === dbPriceRange[0] ? 0 : ((tempPriceRange[0] - dbPriceRange[0]) / (dbPriceRange[1] - dbPriceRange[0])) * 100}%`,
                          width: `${dbPriceRange[1] === dbPriceRange[0] ? 100 : ((tempPriceRange[1] - tempPriceRange[0]) / (dbPriceRange[1] - dbPriceRange[0])) * 100}%`,
                        }}
                      ></div>
                      {/* Min Handle */}
                      <input
                        type="range"
                        min={dbPriceRange[0]}
                        max={dbPriceRange[1]}
                        value={tempPriceRange[0]}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          // Ensure min handle doesn't cross max handle, allowing a minimum gap (e.g., 1 unit)
                          const newMin = Math.min(value, tempPriceRange[1] - (dbPriceRange[1] > dbPriceRange[0] ? 1 : 0));
                          setTempPriceRange([newMin, tempPriceRange[1]]);
                        }}
                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 hover:[&::-webkit-slider-thumb]:border-blue-600"
                        style={{ zIndex: tempPriceRange[0] > (dbPriceRange[1] - dbPriceRange[0]) / 2 ? 5 : 4 }} // Higher z-index if closer to end
                      />
                      {/* Max Handle */}
                      <input
                        type="range"
                        min={dbPriceRange[0]}
                        max={dbPriceRange[1]}
                        value={tempPriceRange[1]}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          // Ensure max handle doesn't cross min handle, allowing a minimum gap (e.g., 1 unit)
                          const newMax = Math.max(value, tempPriceRange[0] + (dbPriceRange[1] > dbPriceRange[0] ? 1 : 0));
                          setTempPriceRange([tempPriceRange[0], newMax]);
                        }}
                        className="absolute w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 hover:[&::-webkit-slider-thumb]:border-blue-600"
                        style={{ zIndex: tempPriceRange[1] < (dbPriceRange[1] - dbPriceRange[0]) / 2 ? 5 : 4 }} // Higher z-index if closer to start
                      />
                    </div>
                  </div>
                    {/* Number inputs */}
                    <div className="flex justify-between mt-8">
                      <div className="relative w-32">
                        <span className="absolute -top-5 left-0 text-xs text-gray-500">
                          Min Price
                        </span>
                        <input
                          type="number"
                          value={tempPriceRange[0]}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (
                              value >= dbPriceRange[0] &&
                              value < tempPriceRange[1]
                            ) {
                              setTempPriceRange([value, tempPriceRange[1]]);
                            }
                          }}
                          className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="relative w-32">
                        <span className="absolute -top-5 left-0 text-xs text-gray-500">
                          Max Price
                        </span>
                        <input
                          type="number"
                          value={tempPriceRange[1]}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (
                              value <= dbPriceRange[1] &&
                              value > tempPriceRange[0]
                            ) {
                              setTempPriceRange([tempPriceRange[0], value]);
                            }
                          }}
                          className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    {/* Apply button */}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => {
                          setPriceRange(tempPriceRange);
                          setCurrentPage(1);
                          setShowPriceFilter(false); // Add this line to close the dropdown
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Apply Filter
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
          {loading && ( // loader
            <div>
              <div className="relative flex w-64 animate-pulse gap-2 p-4">
                <div className="h-12 w-12 rounded-full bg-slate-400"></div>
                <div className="flex-1">
                  <div className="mb-1 h-5 w-3/5 rounded-lg bg-slate-400 text-lg"></div>
                  <div className="h-5 w-[90%] rounded-lg bg-slate-400 text-sm"></div>
                </div>
                <div className="absolute bottom-5 right-0 h-4 w-4 rounded-full bg-slate-400"></div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-center p-4 text-red-500">Error: {error}</div>
          )}
          {!loading && !error && (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-xs text-gray-600 uppercase">
                <tr>
                  <th className="px-4 py-3">No</th>
                  {/* <th className="px-4 py-3">ID</th> */}
                  <th className="px-4 py-3">Date Created</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Total Quantity</th>
                  <th className="px-4 py-3 min-w-[120px] whitespace-nowrap">
                    Price
                  </th>
                  <th className="px-4 py-3">Production Days</th>
                  <th className="px-4 py-3">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="text-xs bg-transparent w-full focus:outline-none"
                    >
                      <option value="All">All Status</option>
                      <option value="Available">Available</option>
                      <option value="Unavailable">Unavailable</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/admin-products-details/${product.id}`)
                    }
                  >
                    <td className="px-4 py-3">
                      {formatNumberWithCommas((currentPage - 1) * itemsPerPage + index + 1)}
                    </td>
                    {/* <td className="px-4 py-3">{product.id}</td> */}
                    <td className="px-4 py-3">
                      {formatDate(product.date_created)}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm font-medium text-gray-900">
                      <div className="line-clamp-2">{product.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      {product.sub_category?.category?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {product.unlimited ? (
                        <span className="text-blue-600">Unlimited</span>
                      ) : (
                        <span>{formatNumberWithCommas(product.total_quantity || 0)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 min-w-[120px] whitespace-nowrap">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3 min-w-[120px] whitespace-nowrap">
                      {formatNumberWithCommas(product.production_days || 0)} days
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          product
                        )}`}
                      >
                        {getStatusText(product)}
                      </span>
                    </td>
                    <td className="px-4 py-3 relative">
                      <button
                        className="text-gray-600 hover:text-black action-popover"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Use product.id for popover state if IDs are unique and stable numbers
                          setOpenPopoverId(
                            openPopoverId === product.id ? null : product.id
                          );
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
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No products found matching the criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Update Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
            Showing {formatNumberWithCommas((currentPage - 1) * itemsPerPage + 1)} to{" "}
            {formatNumberWithCommas(Math.min(currentPage * itemsPerPage, totalProducts))} of{" "}
            {formatNumberWithCommas(totalProducts)} entries
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
              onClick={() => setCurrentPage((curr) => curr - 1)}
              disabled={currentPage === 1 || !prevPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {Array.from(
                { length: Math.ceil(totalProducts / itemsPerPage) },
                (_, i) => i + 1
              )
                .filter((page) => {
                  const currentPageRange = 2;
                  return (
                    page === 1 ||
                    page === Math.ceil(totalProducts / itemsPerPage) ||
                    (page >= currentPage - currentPageRange &&
                      page <= currentPage + currentPageRange)
                  );
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
                          ? "bg-blue-500 text-white"
                          : "border hover:bg-gray-50"
                      }`}
                    >
                      {formatNumberWithCommas(page)}
                    </button>
                  </React.Fragment>
                ))}
            </div>

            <button
              onClick={() => setCurrentPage((curr) => curr + 1)}
              disabled={!nextPageUrl}
              className="px-3 py-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.ceil(totalProducts / itemsPerPage))
              }
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
                Are you sure you want to delete "{deleteModalConfig.productName}
                "? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() =>
                    setDeleteModalConfig({
                      isOpen: false,
                      productId: 0,
                      productName: "",
                    })
                  }
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

        {/* Edit Category Modal */}
        {showEditCategoryModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Category
              </h3>
              <input
                type="text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                placeholder="Enter new category name"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowEditCategoryModal(false);
                    setSelectedCategoryForEdit(null);
                    setEditCategoryName("");
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  disabled={editingCategory}
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCategory}
                  className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={editingCategory}
                >
                  {editingCategory ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListTableView;
