import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaTh, FaThList } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import PaginatedDropdown from "../components/PaginatedDropdown";

// Use the same interfaces from Product-List-Table-View
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
  total_quantity: number;
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
  unlimited: boolean;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

interface ProductGridProps {
  isVisible: boolean;
  onViewChange: (mode: "grid" | "list") => void;
  currentView: "grid" | "list";
}

const ProductGrid: React.FC<ProductGridProps> = ({
  isVisible,
  onViewChange,
  currentView,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(18); // Changed from 30 to 18
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
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [dbPriceRange, setDbPriceRange] = useState<[number, number]>([0, 0]);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0, 0,
  ]);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState(false);

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
        // Build base URL with filters
        let baseQueryParams = "";
        if (selectedCategory) {
          baseQueryParams += `&sub_category=${selectedCategory}`;
        }
        if (sortBy) {
          if (sortBy === "price_range") {
            baseQueryParams += `&min_price=${priceRange[0]}&max_price=${priceRange[1]}`;
          } else if (sortBy === "out_of_stock") {
            // Don't add any params here - we'll filter after fetching
          } else {
            const [param, value] = sortBy.split("=");
            baseQueryParams += `&${param}=${value}`;
          }
        }

        // For price range calculation, use a separate endpoint or larger page size
        const priceRangeResponse = await fetch(
          `${baseURL}/api/v1/product/item/?page_size=1000${baseQueryParams}`,
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!priceRangeResponse.ok) throw new Error("Failed to fetch products");

        const priceRangeData: ApiResponse = await priceRangeResponse.json();

        // Calculate price range from all filtered products
        const prices = priceRangeData.results.map((product) =>
          Number(product.price)
        );
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        setDbPriceRange([minPrice, maxPrice]);
        if (priceRange[0] === 0 && priceRange[1] === 0) {
          setPriceRange([minPrice, maxPrice]);
        }

        // Always use fixed page size of 18 for paginated results
        const paginatedResponse = await fetch(
          `${baseURL}/api/v1/product/item/?page=${page}&page_size=18${baseQueryParams}`,
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!paginatedResponse.ok) {
          let errorBody;
          try {
            errorBody = await paginatedResponse.json();
          } catch (e) {
            errorBody = await paginatedResponse.text();
          }
          console.error(
            `HTTP error fetching products! status: ${paginatedResponse.status}, body:`,
            errorBody
          );
          setError(`Failed to load products: ${paginatedResponse.statusText}`);
          throw new Error(`HTTP error! status: ${paginatedResponse.status}`);
        }

        const paginatedData: ApiResponse = await paginatedResponse.json();

        // Filter for out of stock items if that option is selected
        let filteredResults = paginatedData.results;
        if (sortBy === "out_of_stock") {
          filteredResults = paginatedData.results.filter(
            (product) =>
              !product.unlimited &&
              (!product.total_quantity || product.total_quantity === 0) &&
              product.is_available // Only include available items that have 0 quantity
          );
        }

        setProducts(filteredResults || []);
        setTotalProducts(filteredResults.length || 0);
        setNextPageUrl(paginatedData.next);
        setPrevPageUrl(paginatedData.previous);
      } catch (err) {
        console.error("Failed to fetch price range:", err);
        setError(
          err instanceof Error
            ? err.message
            : "An unknown error occurred while fetching products."
        );
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchProducts(currentPage);
    }
  }, [isVisible, currentPage, selectedCategory, sortBy, priceRange, baseURL]); // Remove priceRange from dependencies

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
  const filteredProducts = products.filter((product) => {
    if (selectedStatus === "All") return true;
    return getStatusText(product) === selectedStatus;
  });

  const getStatusColor = (product: Product) => {
    if (!product.is_available) {
      return "text-gray-600 bg-gray-50";
    }
    if (product.unlimited || product.total_quantity > 0) {
      return "text-green-600 bg-green-50";
    }
    return "text-orange-600 bg-orange-50";
  };

  const getStatusText = (product: Product) => {
    if (!product.is_available) {
      return "Unavailable";
    }
    if (product.unlimited || product.total_quantity > 0) {
      return "Available";
    }
    return "Out of Stock";
  };

  const formatDate = (dateString: string) => {
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
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-row justify-between items-center mb-6">
          <h2
            style={{ fontSize: "clamp(14px, 3vw, 22px)" }}
            className="font-semibold text-gray-800"
          >
            My Products List
          </h2>

          <div className="flex gap-2">
            <button
              className="flex items-center justify-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-fit"
              onClick={() => navigate("/admin/admin-categories")}
            >
              <span className="text-sm whitespace-nowrap">Category</span>
            </button>
            <button
              className="flex items-center justify-center space-x-2 bg-gray-700 text-white px-2 py-2 rounded-lg hover:bg-blue-600 transition-colors w-fit"
              onClick={() => navigate("/admin/add-new-product")}
            >
              <FaPlus style={{ fontSize: "clamp(1px, 3vw, 15px)" }} />
              <span
                style={{ fontSize: "clamp(9px, 3vw, 14px)" }}
                className="hidden md:inline-block"
              >
                Add New Product
              </span>
              <span
                style={{ fontSize: "clamp(9px, 3vw, 14px)" }}
                className="inline-block md:hidden"
              >
                Add Product
              </span>
            </button>
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          {/* Category Dropdown */}
          <div className="relative w-full sm:max-w-xs mr-0 sm:mr-4">
            <PaginatedDropdown
              options={categories}
              value={selectedCategory}
              onChange={(value) => setSelectedCategory(String(value))}
              placeholder="All Categories"
              className="w-full"
            />
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
                      Price Range: ₦{tempPriceRange[0].toLocaleString()} - ₦
                      {tempPriceRange[1].toLocaleString()}
                    </label>
                    <div className="relative h-8">
                      {/* Base track */}
                      <div className="absolute w-full top-3 h-2 bg-gray-200 rounded-full"></div>

                      {/* Active track */}
                      <div
                        className="absolute top-3 h-2 bg-blue-500 rounded-full"
                        style={{
                          left: `${
                            ((tempPriceRange[0] - dbPriceRange[0]) /
                              (dbPriceRange[1] - dbPriceRange[0])) *
                            100
                          }%`,
                          width: `${
                            ((tempPriceRange[1] - tempPriceRange[0]) /
                              (dbPriceRange[1] - dbPriceRange[0])) *
                            100
                          }%`,
                        }}
                      ></div>

                      {/* Range inputs */}
                      <div className="relative">
                        <input
                          type="range"
                          min={dbPriceRange[0]}
                          max={dbPriceRange[1]}
                          value={tempPriceRange[0]}
                          onChange={(e) => {
                            const value = Math.min(
                              Number(e.target.value),
                              tempPriceRange[1] - 1
                            );
                            setTempPriceRange([value, tempPriceRange[1]]);
                          }}
                          className="absolute w-full h-8 appearance-none bg-transparent [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 hover:[&::-webkit-slider-thumb]:border-blue-600"
                        />
                        <input
                          type="range"
                          min={dbPriceRange[0]}
                          max={dbPriceRange[1]}
                          value={tempPriceRange[1]}
                          onChange={(e) => {
                            const value = Math.max(
                              Number(e.target.value),
                              tempPriceRange[0] + 1
                            );
                            setTempPriceRange([tempPriceRange[0], value]);
                          }}
                          className="absolute w-full h-8 appearance-none bg-transparent [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-30 hover:[&::-webkit-slider-thumb]:border-blue-600"
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

        {/* Updated Grid Layout */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center p-4 text-red-500">Error: {error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 group"
              >
                {/* Product Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image1}
                    alt={product.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.jpg";
                    }}
                  />
                  {/* Enhanced Status Badge */}
                  <span
                    className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(
                      product
                    )}`}
                  >
                    {getStatusText(product)}
                  </span>

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/admin/admin-products-details/${product.id}`)
                      }
                      className="p-2 bg-white rounded-full hover:bg-green-500 hover:text-white transition-colors"
                      title="View Details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product.id}`)
                      }
                      className="p-2 bg-white rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                      title="Edit Product"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete Product"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">
                      {product.sub_category?.category?.name || "N/A"}
                    </p>
                    <h3 className="font-medium text-gray-900 line-clamp-1 text-sm">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex justify-center">
                    {/* <div className="flex flex-col">
                      <span className="text-sm font-semibold text-blue-600">
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                      {product.discounted_price && (
                        <span className="text-xs text-gray-400 line-through">
                          ₦{Number(product.discounted_price).toLocaleString()}
                        </span>
                      )}
                    </div> */}
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {product.unlimited
                        ? "∞ Unlimited"
                        : `${product.total_quantity || "0"} in stock`}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && !loading && (
              <div className="col-span-full text-center py-8 text-gray-500">
                No products found matching the criteria.
              </div>
            )}
          </div>
        )}

        {/* Pagination Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-4 sm:space-y-0">
          <div className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
            {totalProducts} entries
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
                      {page}
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

export default ProductGrid;
