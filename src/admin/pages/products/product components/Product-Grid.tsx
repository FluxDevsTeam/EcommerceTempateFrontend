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
  const [sortBy, setSortBy] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [deleteModalConfig, setDeleteModalConfig] = useState({
    isOpen: false,
    productId: 0,
    productName: "",
  });

  const baseURL = `https://ecommercetemplate.pythonanywhere.com`;

  // Fetch categories from the API
  useEffect(() => {
    const fetchCategories = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setError("Authentication error: No access token found.");
        return;
      }

      try {
        const response = await fetch(
          `${baseURL}/api/v1/product/sub-category/`,
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

      // Construct the URL with pagination and category filter
      let url = `${baseURL}/api/v1/product/item/?page=${page}`;
      if (selectedCategory) {
        url += `&sub_category=${selectedCategory}`;
      }

      try {
        const response = await fetch(url, {
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
        // Infer items per page from the first fetch if possible
        if (page === 1 && data.results.length > 0) {
          // This is an approximation, might need adjustment if API behavior varies
          setItemsPerPage(data.results.length);
        }
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
  }, [isVisible, currentPage, selectedCategory, baseURL]); // Added selectedCategory as dependency

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
      setError(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // --- Removed hardcoded productsGrid array ---

  // Updated getStatusColor based on is_available
  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable
      ? "text-green-600 bg-green-100" // Adjusted background for visibility
      : "text-orange-600 bg-orange-100"; // Adjusted background for visibility
  };

  const getStockColor = (stock: number) => {
    return stock > 0
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-200 text-gray-800";
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
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.image1}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/path/to/placeholder-image.png";
                      target.alt = "Image not available";
                    }}
                  />
                  {/* Stock status badge */}
                  <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        product.is_available ? "bg-green-500" : "bg-orange-500"
                      }`}
                    ></span>
                    <span
                      style={{ fontSize: "clamp(10px, 2vw, 12px)" }}
                      className={`px-2 py-0.5 rounded-full ${getStatusColor(
                        product.is_available
                      )}`}
                    >
                      {product.is_available ? "Available" : "Out of Stock"}
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
                        $
                        {product.discounted_price &&
                        parseFloat(product.discounted_price) > 0
                          ? (
                              parseFloat(product.price) -
                              parseFloat(product.discounted_price)
                            ).toFixed(2)
                          : parseFloat(product.price).toFixed(2)}
                      </span>
                      {product.discounted_price &&
                        parseFloat(product.discounted_price) > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                        )}
                    </div>
                    {product.discounted_price &&
                      parseFloat(product.discounted_price) > 0 && (
                        <span className="bg-red-50 text-red-600 text-xs font-medium px-2 py-1 rounded">
                          -
                          {Math.round(
                            (parseFloat(product.discounted_price) /
                              parseFloat(product.price)) *
                              100
                          )}
                          %
                        </span>
                      )}
                  </div>

                  {/* Stock badge */}
                  <div className="mt-auto">
                    <span
                      className={`inline-block text-xs ${getStockColor(
                        product.total_quantity
                      )} px-2.5 py-1 rounded-full mb-3`}
                    >
                      {product.total_quantity} in Stock
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
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors text-sm"
                      >
                        <FaTrash className="h-3 w-3" />
                        <span>Delete</span>
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

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
            <div className="text-sm text-gray-600 text-center sm:text-left w-full sm:w-auto">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalProducts)} of{" "}
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
    </div>
  );
};

export default ProductsGrid;
