import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { FaThList, FaTh, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// --- Reusing Interfaces from Product-List-Table-View ---
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
  undiscounted_price: number | null;
  price: number;
  default_size_id: number | null;
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
  production_days: number | null;
  sizes: Array<{
    id: number;
    size: string;
    quantity: number;
    undiscounted_price: number | null;
    price: string;
  }>;
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

const ProductsGrid: React.FC<ProductGridProps> = ({
  isVisible,
  onViewChange,
  currentView,
}) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 18;
  const [sortBy, setSortBy] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    productId: 0,
    productName: "",
  });
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
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

  // Fetch categories from the API
  const fetchCategories = async () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("Authentication error: No access token found.");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/api/v1/product/sub-category/?page_size=12`,
        {
          headers: {
            Authorization: `JWT ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Extract unique subcategories from the response
      const subcategories = data.results.map((item: any) => ({
        id: item.id,
        name: item.name, // Using the subcategory name
      }));
      setCategories(subcategories);
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

        // First fetch for price range calculation
        const response = await fetch(
          `${baseURL}/api/v1/product/item/?page_size=1000${baseQueryParams}`,
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch products");

        const data: ApiResponse = await response.json();

        // Calculate price range from filtered products
        const prices = data.results.map((product) => Number(product.price));
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        setDbPriceRange([minPrice, maxPrice]);
        if (priceRange[0] === 0 && priceRange[1] === 0) {
          setPriceRange([minPrice, maxPrice]);
        }

        // Fetch paginated results with fixed page size
        const paginatedResponse = await fetch(
          `${baseURL}/api/v1/product/item/?page=${page}&page_size=${ITEMS_PER_PAGE}${baseQueryParams}`,
          {
            headers: {
              Authorization: `JWT ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!paginatedResponse.ok) {
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
  }, [isVisible, currentPage, selectedCategory, sortBy, priceRange, baseURL]);

  useEffect(() => {
    if (priceRange[0] === 0 && priceRange[1] === 0) {
      setTempPriceRange([dbPriceRange[0], dbPriceRange[1]]);
    }
  }, [dbPriceRange]);

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

  const handlePageChange = (page: number) => {
    // Add checks to ensure page is within valid range if needed
    setCurrentPage(page);
  };

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

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  // --- Removed hardcoded productsGrid array ---
  // Updated getStatusColor based on is_available
  const getStockColor = (stock: number) => {
    return stock > 0
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-200 text-gray-800";
  };

  // Updated getStatusColor function
  const getStatusColor = (product: Product) => {
    if (!product.is_available) {
      return "text-gray-600 bg-gray-50"; // Unavailable items are gray
    }
    if (product.unlimited || product.total_quantity > 0) {
      return "text-green-600 bg-green-50"; // Available items are green
    }
    return "text-orange-600 bg-orange-50"; // Out of stock items are orange
  };

  // New getStatusText function
  const getStatusText = (product: Product) => {
    if (!product.is_available) {
      return "Unavailable";
    }
    if (product.unlimited || product.total_quantity > 0) {
      return "Available";
    }
    return "Out of Stock";
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
          {/* Modified Search Input to Category Dropdown */}
          <div className="relative w-full sm:max-w-xs mr-0 sm:mr-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-3 pr-8 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategoryForEdit(category);
                      setEditCategoryName(category.name);
                      setShowEditCategoryModal(true);
                    }}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                </option>
              ))}
            </select>
          </div>

          {/* Right Controls */}
          <div className="flex justify-between items-center w-full sm:w-auto">
            {/* Order By Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setSortBy("");
                    setShowPriceFilter(false);
                    setPriceRange([dbPriceRange[0], dbPriceRange[1]]);
                    setTempPriceRange([dbPriceRange[0], dbPriceRange[1]]);
                    setCurrentPage(1);
                  } else {
                    setSortBy(e.target.value);
                    if (e.target.value === "price_range") {
                      setShowPriceFilter(true);
                      setTempPriceRange([dbPriceRange[0], dbPriceRange[1]]);
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
      </div>

      {/* Loading and Error States */}
      {loading && (
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

      {/* Product grid display */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.image1}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() =>
                      navigate(`/admin/admin-products-details/${product.id}`)
                    }
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/path/to/placeholder-image.png";
                      target.alt = "Image not available";
                    }}
                  />
                  {/* Stock status badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        product
                      )}`}
                    >
                      {getStatusText(product)}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  {/* Product name */}
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>

                  {/* Price section */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₦ {product.price}
                      </span>
                      {/* {product.undiscounted_price &&
                        product.undiscounted_price > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            ₦{product.undiscounted_price}
                          </span>
                        )} */}
                    </div>
                    {/* {product.undiscounted_price &&
                      product.undiscounted_price > 0 && (
                        <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded">
                          -
                          {Math.round(
                            (product.undiscounted_price / product?.price) * 100
                          )}
                          %
                        </span>
                      )} */}
                  </div>

                  {/* Stock badge */}
                  <div className="mt-auto">
                    <span
                      className={`inline-block text-xs ${getStockColor(
                        product.total_quantity
                      )} px-2.5 py-1 rounded-full mb-3`}
                    >
                      {product.unlimited ? (
                        <span>Unlimited stock</span>
                      ) : (
                        <span>{product.total_quantity || "0"} in Stock</span>
                      )}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t">
                      <button
                        onClick={() =>
                          navigate(`/admin/products/edit/${product.id}`)
                        }
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors text-sm"
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors text-sm"
                      >
                        <FaTrash className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delete Confirmation Modal */}
          {deleteModalConfig.isOpen && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Confirm Delete
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete "
                  {deleteModalConfig.productName}"? This action cannot be
                  undone.
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

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalProducts)} of{" "}
              {totalProducts} entries
            </div>
            <div className="flex border rounded justify-center sm:justify-start">
              <button
                onClick={() => handlePageChange(1)}
                className="p-2 border-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1 || !prevPageUrl}
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-2 border-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1 || !prevPageUrl}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {/* Display current page info (simple version) */}
              <span className="px-4 py-2 border-r text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-2 border-r hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages || !nextPageUrl}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === totalPages || !nextPageUrl}
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
      {/* Add Edit Category Modal */}
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
  );
};

export default ProductsGrid;
