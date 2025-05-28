import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { IoSearch, IoRemoveCircleOutline, IoEllipsisVertical } from 'react-icons/io5';
import { CustomModal } from '../components/CustomModal';
import { ConfirmModal } from '../components/ConfirmModal';

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

interface DragItem {
  type: string;
  index?: number;
  result?: SearchResult;
}

interface Product {
  id: string;
  name: string;
  image1: string | null;
  top_selling_items: boolean;
  top_selling_position: number | null;
  latest_item: boolean;
  latest_item_position: number | null;
}

interface SearchResult {
  id: string;
  name: string;
  image1: string | null;
  top_selling_items?: boolean;
  top_selling_position?: number | null;
  latest_item?: boolean;
  latest_item_position?: number | null;
}

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'confirm';
  onConfirm?: () => void;
}

const SkeletonCard: React.FC = () => (
  <div className="bg-white p-2 sm:p-3 rounded-xl shadow-sm animate-pulse border border-gray-100">
    <div className="w-full h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg mb-2" />
    <div className="h-3 sm:h-4 bg-gray-100 rounded w-3/4" />
    <div className="h-2 sm:h-3 bg-gray-100 rounded w-1/2 mt-1 sm:mt-2" />
  </div>
);

const ProductPrioritization: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'top_selling' | 'latest'>('top_selling');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
  });
  const [excludeOther, setExcludeOther] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setModalConfig({
        isOpen: true,
        title: 'Authentication Error',
        message: 'Please login again.',
        type: 'error',
      });
      return null;
    }
    return {
      Authorization: `JWT ${accessToken}`,
      'Content-Type': 'application/json',
    };
  };

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?page_size=50`,
        { headers }
      );

      if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);

      const data = await response.json();
      const filteredProducts = data.results.filter((product: Product) =>
        excludeOther
          ? activeTab === 'top_selling'
            ? !product.latest_item && product.latest_item_position === null
            : !product.top_selling_items && product.top_selling_position === null
          : true
      );
      const sortedProducts = filteredProducts.sort((a: Product, b: Product) => {
        const posA = activeTab === 'top_selling' ? a.top_selling_position : a.latest_item_position;
        const posB = activeTab === 'top_selling' ? b.top_selling_position : b.latest_item_position;
        const flagA = activeTab === 'top_selling' ? a.top_selling_items : a.latest_item;
        const flagB = activeTab === 'top_selling' ? b.top_selling_items : b.latest_item;

        if (flagA && !flagB) return -1;
        if (!flagA && flagB) return 1;
        if (posA !== null && posB !== null) return posA - posB;
        if (posA !== null) return -1;
        if (posB !== null) return 1;
        return 0;
      });
      setProducts(sortedProducts);
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to load products.',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, excludeOther]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const headers = getAuthHeaders();
      if (!headers) return;

      try {
        const response = await fetch(
          `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/admin-search/?search=${encodeURIComponent(query)}`,
          { headers }
        );

        if (!response.ok) throw new Error(`Search failed: ${response.status}`);

        const data = await response.json();
        const filteredResults = (data.results || []).filter((result: SearchResult) => {
          const product = products.find(p => p.id === result.id) || result;
          return excludeOther
            ? activeTab === 'top_selling'
              ? !product.latest_item && product.latest_item_position === null
              : !product.top_selling_items && product.top_selling_position === null
            : true;
        });
        setSearchResults(filteredResults);
      } catch (error) {
        setModalConfig({
          isOpen: true,
          title: 'Search Error',
          message: error instanceof Error ? error.message : 'Failed to search products.',
          type: 'error',
        });
      } finally {
        setIsSearching(false);
      }
    }, 1000),
    [activeTab, excludeOther, products]
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const fetchAllProducts = async () => {
    const headers = getAuthHeaders();
    if (!headers) return [];

    let allProducts: Product[] = [];
    let nextPage: string | null = `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?page_size=100`;

    try {
      while (nextPage) {
        const response = await fetch(nextPage, { headers });
        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        const data = await response.json();
        allProducts = [...allProducts, ...data.results];
        nextPage = data.next;
      }
      return allProducts;
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to fetch all products.',
        type: 'error',
      });
      return [];
    }
  };

  const updateProductOrder = async (updatedProducts: Product[], showModal = true) => {
    setIsSaving(true);
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const allProducts = await fetchAllProducts();
      if (!allProducts.length) throw new Error('No products fetched');

      const positionField = activeTab === 'top_selling' ? 'top_selling_position' : 'latest_item_position';
      const flagField = activeTab === 'top_selling' ? 'top_selling_items' : 'latest_item';

      for (const product of allProducts) {
        if (!updatedProducts.some(p => p.id === product.id)) {
          await fetch(
            `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${product.id}/`,
            {
              method: 'PATCH',
              headers,
              body: JSON.stringify({
                [flagField]: false,
                [positionField]: null,
              }),
            }
          );
        }
      }

      for (const [index, product] of updatedProducts.entries()) {
        const newPosition = index < 50 ? index + 1 : null;
        if (product[positionField] !== newPosition) {
          const response = await fetch(
            `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${product.id}/`,
            {
              method: 'PATCH',
              headers,
              body: JSON.stringify({
                [flagField]: newPosition !== null,
                [positionField]: newPosition,
              }),
            }
          );
          if (!response.ok) throw new Error(`Failed to update product ${product.id}`);
        }
      }

      if (showModal) {
        setModalConfig({
          isOpen: true,
          title: 'Success',
          message: 'Prioritization updated successfully!',
          type: 'success',
        });
      }
      await fetchProducts();
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update prioritization.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const removeProduct = async (productId: string) => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const positionField = activeTab === 'top_selling' ? 'top_selling_position' : 'latest_item_position';
      const flagField = activeTab === 'top_selling' ? 'top_selling_items' : 'latest_item';
      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${productId}/`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            [flagField]: false,
            [positionField]: null,
          }),
        }
      );

      if (!response.ok) throw new Error(`Failed to remove product ${productId}`);

      setModalConfig({
        isOpen: true,
        title: 'Success',
        message: 'Product removed successfully.',
        type: 'success',
      });
      await fetchProducts();
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to remove product.',
        type: 'error',
      });
    }
  };

  const resetAllProducts = async () => {
    setIsResetting(true);
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const allProducts = await fetchAllProducts();
      if (!allProducts.length) throw new Error('No products fetched');

      const positionField = activeTab === 'top_selling' ? 'top_selling_position' : 'latest_item_position';
      const flagField = activeTab === 'top_selling' ? 'top_selling_items' : 'latest_item';

      for (const product of allProducts) {
        const response = await fetch(
          `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${product.id}/`,
          {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              [flagField]: false,
              [positionField]: null,
            }),
          }
        );
        if (!response.ok) throw new Error(`Failed to reset product ${product.id}`);
      }

      setModalConfig({
        isOpen: true,
        title: 'Success',
        message: `All ${activeTab === 'top_selling' ? 'Top Selling' : 'Latest'} positions reset.`,
        type: 'success',
      });
      await fetchProducts();
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to reset products.',
        type: 'error',
      });
    } finally {
      setIsResetting(false);
    }
  };

  const confirmReset = () => {
    setModalConfig({
      isOpen: true,
      title: 'Confirm Reset',
      message: `Are you sure you want to reset all ${activeTab === 'top_selling' ? 'Top Selling' : 'Latest'} positions?`,
      type: 'confirm',
      onConfirm: () => {
        setModalConfig({ ...modalConfig, isOpen: false });
        resetAllProducts();
        setIsDropdownOpen(false);
      },
    });
  };

  const moveProduct = (dragIndex: number, hoverIndex: number) => {
    const draggedProduct = products[dragIndex];
    const newProducts = [...products];
    newProducts.splice(dragIndex, 1);
    newProducts.splice(hoverIndex, 0, draggedProduct);
    setProducts(newProducts);
  };

  const addProductFromSearch = async (result: SearchResult) => {
    if (products.some((p) => p.id === result.id)) {
      setModalConfig({
        isOpen: true,
        title: 'Warning',
        message: 'Product already in the list.',
        type: 'error',
      });
      return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const positionField = activeTab === 'top_selling' ? 'top_selling_position' : 'latest_item_position';
      const flagField = activeTab === 'top_selling' ? 'top_selling_items' : 'latest_item';
      const newPosition = products.filter((p) => p[positionField] !== null).length < 50 ? products.length + 1 : null;

      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/${result.id}/`,
        {
          method: 'PATCH',
          headers,
          body: JSON.stringify({
            [flagField]: newPosition !== null,
            [positionField]: newPosition,
          }),
        }
      );

      if (!response.ok) throw new Error(`Failed to add product ${result.id}`);

      const newProduct: Product = {
        ...result,
        top_selling_items: activeTab === 'top_selling' && newPosition !== null,
        top_selling_position: activeTab === 'top_selling' ? newPosition : null,
        latest_item: activeTab === 'latest' && newPosition !== null,
        latest_item_position: activeTab === 'latest' ? newPosition : null,
      };
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      setSearchResults(searchResults.filter((r) => r.id !== result.id));
      setSearchQuery('');
      await updateProductOrder(updatedProducts, false);
    } catch (error) {
      setModalConfig({
        isOpen: true,
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to add product.',
        type: 'error',
      });
    }
  };

  const ProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => {
    const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
      type: 'PRODUCT',
      item: { type: 'PRODUCT', index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop<DragItem>({
      accept: ['PRODUCT', 'SEARCH_RESULT'],
      drop: (item) => {
        if (item.type === 'SEARCH_RESULT' && item.result) {
          addProductFromSearch(item.result);
        } else if (item.type === 'PRODUCT' && item.index !== undefined && item.index !== index) {
          moveProduct(item.index, index);
          updateProductOrder(products);
        }
      },
      hover: (item) => {
        if (item.type === 'PRODUCT' && item.index !== undefined && item.index !== index) {
          moveProduct(item.index, index);
          item.index = index;
        }
      },
    });

    const isDualStatus =
      activeTab === 'top_selling'
        ? product.latest_item || product.latest_item_position !== null
        : product.top_selling_items || product.top_selling_position !== null;

    return (
      <div
        ref={(node) => drag(drop(node))}
        className={`bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 relative group hover:shadow-md hover:-translate-y-1 ${
          isDragging ? 'opacity-70 scale-105 shadow-lg rotate-2 border-dashed border-blue-300' : ''
        }`}
      >
        <button
          onClick={() => removeProduct(product.id)}
          className="absolute top-1 sm:top-2 right-1 sm:right-2 text-gray-500 hover:text-red-600 transition-colors z-10"
          title="Remove from list"
        >
          <IoRemoveCircleOutline className="size-3.5 sm:size-4" />
        </button>
        {isDualStatus && (
          <span
            className={`absolute top-5 sm:top-7 right-1 sm:right-2 text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full ${
              activeTab === 'top_selling' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {activeTab === 'top_selling' ? 'Latest' : 'Top Selling'}
          </span>
        )}
        <div className="w-full h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg mb-2 overflow-hidden">
          <img
            src={product.image1 || 'https://via.placeholder.com/100'}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{product.name}</p>
        <p className="text-xs text-gray-500">
          Position: {product[activeTab === 'top_selling' ? 'top_selling_position' : 'latest_item_position'] ?? 'N/A'}
        </p>
      </div>
    );
  };

  const SearchResultCard: React.FC<{ result: SearchResult }> = ({ result }) => {
    const [{ isDragging }, drag] = useDrag<DragItem, unknown, { isDragging: boolean }>({
      type: 'SEARCH_RESULT',
      item: { type: 'SEARCH_RESULT', result },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`bg-white p-2 sm:p-3 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 group hover:shadow-md hover:-translate-y-1 ${
          isDragging ? 'opacity-70 scale-105 shadow-lg rotate-2 border-dashed border-blue-300' : ''
        }`}
      >
        <div className="w-full h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg mb-2 overflow-hidden">
          <img
            src={result.image1 || 'https://via.placeholder.com/100'}
            alt={result.name}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">{result.name}</p>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans relative">
        {(isSaving || isResetting) && (
          <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
            <svg className="animate-spin h-8 w-8 text-gray-500" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
              />
            </svg>
          </div>
        )}
        <div className="max-w-7xl mx-auto p-3 sm:p-6 lg:p-8">
          <div className="sticky top-0 bg-white shadow-md rounded-2xl p-3 sm:p-6 z-10 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
                Product Prioritization
              </h1>
              {/* <button
                onClick={() => navigate('/admin/products')}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-lg text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all text-sm sm:text-base"
              >
                Back to Products
              </button> */}
            </div>
            <div className="flex space-x-2 sm:space-x-4">
              {['top_selling', 'latest'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as 'top_selling' | 'latest');
                    setExcludeOther(false);
                    setSearchQuery('');
                    setSearchResults([]);
                    setIsDropdownOpen(false);
                  }}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium relative transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {tab === 'top_selling' ? 'Top Selling Items' : 'Latest Items'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base"
                />
                <IoSearch className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                {isSearching && (
                  <span className="absolute right-8 sm:right-10 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    Searching...
                  </span>
                )}
              </div>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-600 text-red-600 rounded-lg hover:from-red-100 hover:to-red-200 transition-all text-sm sm:text-base w-full sm:w-auto"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setExcludeOther(!excludeOther)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all text-sm sm:text-base flex-1 sm:flex-none"
              >
                {excludeOther
                  ? 'Show All Items'
                  : `Exclude ${activeTab === 'top_selling' ? 'Latest' : 'Top Selling'} Items`}
              </button>
              <div className="relative sm:hidden">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isResetting}
                  className={`px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-200 transition-all ${
                    isResetting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  aria-label="Toggle actions menu"
                >
                  <IoEllipsisVertical size={16} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {isResetting && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                        <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                          />
                        </svg>
                      </div>
                    )}
                    <button
                      onClick={confirmReset}
                      disabled={isSaving || isLoading || isResetting}
                      className={`w-full px-4 py-2 text-sm text-white flex items-center space-x-2 ${
                        isSaving || isLoading || isResetting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      } rounded-lg`}
                    >
                      {isResetting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                            />
                          </svg>
                          <span>Resetting...</span>
                        </>
                      ) : (
                        <span>Reset All</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={confirmReset}
                disabled={isSaving || isLoading || isResetting}
                className={`hidden sm:flex px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all text-base items-center space-x-2 ${
                  isSaving || isLoading || isResetting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isResetting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                      />
                    </svg>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Reset All</span>
                )}
              </button>
            </div>
          </div>

          {searchResults.length > 0 && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Search Results</h3>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="text-xs sm:text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4">
                {searchResults.map((result) => (
                  <SearchResultCard key={result.id} result={result} />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4">
            {isLoading ? (
              Array(8)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} />)
            ) : products.length === 0 ? (
              <p className="col-span-full text-center text-gray-600 text-sm sm:text-base">No products found.</p>
            ) : (
              products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            )}
          </div>

          <div className="flex justify-end mt-4 sm:mt-6">
            <button
              onClick={() => updateProductOrder(products)}
              disabled={isLoading || isSaving || isResetting || products.length === 0}
              className={`px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all text-sm sm:text-base flex items-center space-x-2 w-full sm:w-auto ${
                isLoading || isSaving || isResetting || products.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 sm:h-5 w-4 sm:w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                    />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Prioritization</span>
              )}
            </button>
          </div>

          {modalConfig.type === 'confirm' ? (
            <ConfirmModal
              isOpen={modalConfig.isOpen}
              onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
              onConfirm={modalConfig.onConfirm || (() => {})}
              title={modalConfig.title}
              message={modalConfig.message}
            />
          ) : (
            <CustomModal
              isOpen={modalConfig.isOpen}
              onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
              title={modalConfig.title}
              message={modalConfig.message}
              type={modalConfig.type as 'success' | 'error'}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
};

export default ProductPrioritization;