// Wishlist.tsx
import { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import Card from "@/card/Card";
import { WishlistData } from "./api";
import Suggested from "../../components/products/Suggested";
import { SubCategory } from "@/card/types";interface WishItem {
  id: number;
  product: {
    id: number;
    name: string;
    image1: string;
    price: number;
    undiscounted_price: number;
    sub_category?: SubCategory | null;
    unlimited?: boolean;
  };
}const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const removeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialExcludeIds = useRef<number[]>([]);
  const pageSize = 16;  // Combine both fetch functions into one
  const fetchWishlist = async (page: number) => {
    try {
      setLoading(true);
      const data = await WishlistData(page, pageSize);
      setWishlistItems(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / pageSize));
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setWishlistItems([]);
        setTotalPages(1);
        setCurrentPage(1);
      } else {
        console.error('Error fetching wishlist:', err);
        setError('Failed to load wishlist.');
      }
    } finally {
      setLoading(false);
    }
  };  // Single useEffect for initial load and page changes
  useEffect(() => {
    fetchWishlist(currentPage);
  }, [currentPage]);  const stableSuggestedParams = useRef({
    subCategoryId: undefined as number | undefined,
    secondSubCategoryId: undefined as number | undefined,
    excludeProductIds: [] as number[]
  });  // Replace getSubCategoryParams with this optimized version
  const getSubCategoryParams = useMemo(() => {
    if (wishlistItems.length === 0) {
      return stableSuggestedParams.current;
    }

    // Only calculate new params if they haven't been set yet
    if (stableSuggestedParams.current.excludeProductIds.length === 0) {
      const subCategoryCounts: { [key: number]: number } = {};
      const productIds: number[] = [];
      
      wishlistItems.forEach((item) => {
        productIds.push(item.product.id);
        if (item.product.sub_category?.id && typeof item.product.sub_category.id === 'number') {
          const subCatId = item.product.sub_category.id;
          subCategoryCounts[subCatId] = (subCategoryCounts[subCatId] || 0) + 1;
        }
      });

      const sortedSubCategories = Object.entries(subCategoryCounts)
        .map(([id, count]) => ({ id: Number(id), count }))
        .sort((a, b) => b.count - a.count || a.id - b.id);

      stableSuggestedParams.current = {
        subCategoryId: sortedSubCategories[0]?.id,
        secondSubCategoryId: sortedSubCategories[1]?.id,
        excludeProductIds: productIds
      };
    }

    return stableSuggestedParams.current;
  }, [wishlistItems.length]);  const { subCategoryId, secondSubCategoryId, excludeProductIds } = getSubCategoryParams;  // Pagination navigation
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of page
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };  // Remove the redundant useEffect that was fetching again on page changes
  // Keep initial excludeProductIds stable
  useEffect(() => {
    if (wishlistItems.length > 0 && !initialExcludeIds.current.length) {
      const productIds = wishlistItems.map(item => item.product.id);
      initialExcludeIds.current = productIds;
    }
  }, []); // Empty dependency array to only run once
  // Keep track of added items to prevent duplicates
  const addedItemsRef = useRef(new Set<number>());

  useEffect(() => {
    const handleWishlistUpdate = async (event: CustomEvent) => {
      const action = event.detail?.action;
      const isRemove = action === 'remove';

      if (action === 'add' && event.detail?.newItem && currentPage === 1) {
        const newItem = event.detail.newItem;
        
        // Check if item was already added
        if (addedItemsRef.current.has(newItem.product.id)) {
          return;
        }
        addedItemsRef.current.add(newItem.product.id);

        setWishlistItems(prev => {
          // Don't add if already exists
          if (prev.some(item => item.product.id === newItem.product.id)) {
            return prev;
          }
          
          // Add to beginning, maintain page size
          if (prev.length >= pageSize) {
            return [{ ...newItem, id: `${newItem.id}_${Date.now()}` }, ...prev.slice(0, pageSize - 1)];
          }
          return [{ ...newItem, id: `${newItem.id}_${Date.now()}` }, ...prev];
        });

        // Just update total pages count
        const data = await WishlistData(1, pageSize);
        setTotalPages(Math.ceil(data.count / pageSize));
        return;
      }

      // For remove actions
      if (isRemove) {
        const productId = event.detail?.productId;
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 2000);

        try {
          // First remove the item locally
          setWishlistItems(prev => prev.filter(item => item.product.id !== productId));

          // Get fresh data to update counts
          try {
            const freshData = await WishlistData(1, pageSize);
            const newTotalPages = Math.max(1, Math.ceil(freshData.count / pageSize));
            
            // If current page would be empty and it's not page 1
            if (currentPage > newTotalPages && currentPage > 1) {
              setCurrentPage(newTotalPages);
              const newPageData = await WishlistData(newTotalPages, pageSize);
              setWishlistItems(newPageData.results || []);
            } else if (currentPage <= newTotalPages) {
              // Only fetch current page data if it still exists
              const currentPageData = await WishlistData(currentPage, pageSize);
              setWishlistItems(currentPageData.results || []);
            }
            
            setTotalPages(newTotalPages);
          } catch (err: any) {
            // Handle 404 by showing empty state if no items left
            if (err?.response?.status === 404) {
              setWishlistItems([]);
              setTotalPages(1);
              setCurrentPage(1);
            } else {
              console.error('Error updating wishlist:', err);
            }
          }
        } catch (err) {
          console.error('Error handling item removal:', err);
        }
      }
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate as EventListener);
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate as EventListener);
      if (removeTimeoutRef.current) {
        clearTimeout(removeTimeoutRef.current);
      }
    };
  }, [currentPage, pageSize, totalPages]);

  if (loading) {
    return <p className="p-10 text-center">Loading wishlist...</p>;
  }  if (error) {
    return <p className="p-10 text-center text-red-500">{error}</p>;
  }  return (
    <div className="mt-8 md:mt-0 md:pt-0 p-4 sm:p-14">
      <h2 className="text-3xl font-semibold capitalize tracking mb-4 sm:mb-8">
        Wishlist
      </h2>

  {wishlistItems.length === 0 ? (
    <div className="text-center py-16">
      <h2 className="text-2xl font-medium text-gray-600 mb-4">
        No Items In Wishlist
      </h2>
      <Link
        to="/products"
        className="inline-block bg-customBlue text-white py-3 px-8 rounded-full  transition-colors"
      >
        Continue Browsing Our Products
      </Link>
    </div>
  ) : (
    <div className="grid grid-cols-2 sm:grid-cols-4 px-4 sm:gap-8 mb-8 md:space-x-8 space-x-0 sm:mb-16">
      {wishlistItems.map((item) => (
        <Card
          key={typeof item.id === 'string' ? item.id : `${item.id}_${item.product.id}`}
          product={item.product}
          isInitiallyLiked={true}
          wishItemId={typeof item.id === 'string' ? parseInt(item.id) : item.id}
          removeOnUnlike={true}
        />
      ))}
    </div>
  )}

  {/* Pagination controls */}
  {totalPages > 1 && (
    <div className="flex justify-center space-x-2 mt-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 rounded ${
            currentPage === page ? 'bg-black text-white' : 'bg-gray-200'
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )}

  <Suggested
    key={`suggested-${stableSuggestedParams.current.subCategoryId}-${stableSuggestedParams.current.secondSubCategoryId}`}
    subcategory_id={stableSuggestedParams.current.subCategoryId}
    second_subcategory_id={stableSuggestedParams.current.secondSubCategoryId}
    excludeProductIds={stableSuggestedParams.current.excludeProductIds}
  />

  {/* Success Modal */}
  {showSuccessModal && (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
      Item successfully removed from wishlist
    </div>
  )}
</div>

  );
};export default Wishlist;

