/* @jsxRuntime classic */
import React, { useState, useEffect, useCallback, memo } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SuggestedCard from '@/card/SuggestedCard';
import { Product } from '@/card/types';
import { 
  fetchCartItems, 
  WishData, 
  getWishlistFromLocalStorage, 
  addWishItem, 
  deleteWishItem,
  addToWishlistLocalStorage,
  removeFromWishlistLocalStorage,
} from '@/pages/orders/api';
import { 
  fetchSuggestedProductsDetails, 
  fetchProductDetails 
} from '@/pages/homepage/api/apiService';
import { useAuth } from '@/pages/auth/AuthContext';
import { debounce } from 'lodash';
import { getLocalCart, LocalCartItem } from '../../utils/cartStorage';

interface SuggestedProps {
  onSuggestedItemClick?: (image: string) => void;
  subcategory_id?: number;
  second_subcategory_id?: number;
  excludeProductIds?: number[];
  isCartContext?: boolean;
  totalPages?: number;
  totalItems?: number;
}

const Suggested: React.FC<SuggestedProps> = memo(({
  onSuggestedItemClick,
  subcategory_id,
  second_subcategory_id,
  excludeProductIds = [],
  isCartContext = false,
  totalPages = 1,
  totalItems = 0,
}) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiCallQueue: (() => Promise<void>)[] = [];
  let isProcessingQueue = false;

  const processQueue = async () => {
    if (isProcessingQueue) return;
    isProcessingQueue = true;
    while (apiCallQueue.length > 0) {
      const nextCall = apiCallQueue.shift();
      if (nextCall) {
        try {
          await nextCall();
        } catch (error) {
          console.error('processQueue: Error processing queue item:', error);
        }
      }
    }
    isProcessingQueue = false;
  };

  const syncLocalWishlistToServer = useCallback(async () => {
    if (!isAuthenticated) return;
    const localWishlist = getWishlistFromLocalStorage();
    if (localWishlist.length === 0) return;

    try {
      for (const item of localWishlist) {
        await addWishItem(item.product);
      }
      localStorage.removeItem('wishlistItems');
      
    } catch (error) {
      console.error('syncLocalWishlistToServer: Error syncing wishlist:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      syncLocalWishlistToServer();
    }
  }, [isAuthenticated, syncLocalWishlistToServer]);

  const handleWishlistToggle = useCallback(async (productId: number, wishItemId: number | undefined, isLiked: boolean) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? { ...p, isInitiallyLiked: !isLiked, wishItemId: isLiked ? undefined : wishItemId || Date.now() }
          : p
      )
    );

    const executeOperation = async () => {
      try {
        if (!isAuthenticated) {
          if (isLiked) {
            removeFromWishlistLocalStorage(productId);
          } else {
            addToWishlistLocalStorage(product);
          }
          window.dispatchEvent(new CustomEvent('wishlistUpdated', { detail: { productId } }));
        } else {
          if (isLiked) {
            let actualWishItemId = wishItemId;
            try {
              const wishData = await WishData();
              const wishItem = wishData.results.find(item => item.product.id === productId);
              actualWishItemId = wishItem ? wishItem.id : undefined;
            } catch (error) {
              const localWishlist = getWishlistFromLocalStorage();
              const localItem = localWishlist.find(item => item.product.id === productId);
              actualWishItemId = localItem?.id;
            }

            if (actualWishItemId) {
              await deleteWishItem(actualWishItemId, productId);
            } else {
              removeFromWishlistLocalStorage(productId);
            }
          } else {
            const newItem = await addWishItem(product);
            setProducts(prevProducts =>
              prevProducts.map(p =>
                p.id === productId ? { ...p, isInitiallyLiked: true, wishItemId: newItem.id } : p
              )
            );
          }
        }
      } catch (error) {
        throw error;
      }
    };

    if (isLiked) {
      apiCallQueue.push(executeOperation);
      processQueue();
    } else {
      try {
        await executeOperation();
      } catch (error) {
      }
    }
  }, [isAuthenticated, products, setProducts, apiCallQueue, processQueue, addWishItem, deleteWishItem, removeFromWishlistLocalStorage, addToWishlistLocalStorage, WishData, getWishlistFromLocalStorage]);

  const fetchSuggestions = useCallback(debounce(async () => {
    setLoading(true);
    setError(null);

    try {
      let excludeIds: number[] = [...excludeProductIds];
      let wishlistProducts: Product[] = [];
      let cartProductIds: number[] = [];
      let cartProducts: Product[] = [];
      let wishlistItems: { id: number; product: Product }[] = [];

      const localCart = getLocalCart();

      if (isAuthenticated) {
        const JWT_TOKEN = localStorage.getItem('accessToken');
        if (JWT_TOKEN) {
          try {
            const cartData = await fetchCartItems();
            cartProductIds = cartData.results.map((item: any) => Number(item.product.id));

            const cartProductPromises = cartData.results.map((item: any) =>
              fetchProductDetails(item.product.id)
                .then(product => product || null)
                .catch(err => {
                  console.error('fetchSuggestions: Error fetching cart product:', { productId: item.product.id, error: err });
                  return null;
                })
            );
            cartProducts = (await Promise.all(cartProductPromises)).filter((p): p is Product => p !== null);

            const wishData = await WishData();
            wishlistItems = wishData.results;
            wishlistProducts = wishData.results.map((item: any) => item.product);
          } catch (authError) {
            console.error('fetchSuggestions: Error fetching server cart/wishlist:', authError);
            setError('Failed to load cart/wishlist data.');
            setLoading(false);
            return;
          }
        }
      } else {
        cartProductIds = localCart.map(item => Number(item.productId)).filter(id => !isNaN(id));

        const localCartPromises = localCart.map((item: LocalCartItem) => {
          if (!item.productId) {
            return Promise.resolve(null);
          }
          return fetchProductDetails(Number(item.productId))
            .then(product => product || null)
            .catch(err => {
              console.error('fetchSuggestions: Error fetching local cart product:', { productId: item.productId, error: err });
              return {
                id: item.productId,
                name: item.productName || 'Unknown Product',
                image: item.productImage || '/placeholder.jpg',
                price: Number(item.productPrice) || 0,
                undiscounted_price: Number(item.sizeUndiscountedPrice) || Number(item.discountedPrice) || 0,
                subcategory_id: item.subCategoryId || 0,
                sub_category: { id: item.subCategoryId || 0, name: item.subCategoryName || 'Unknown' },
              } as Product;
            });
        });
        cartProducts = (await Promise.all(localCartPromises)).filter((p): p is Product => p !== null);

        const localWishlist = getWishlistFromLocalStorage();
        wishlistItems = localWishlist;
        wishlistProducts = localWishlist.map(item => item.product);
      }

      excludeIds = [...new Set([...excludeIds, ...cartProductIds, ...wishlistProducts.map(p => p.id)])];

      let suggestedProducts: Product[] = [];
      let currentPage = 1;
      let hasMore = true;
      while (hasMore) {
        try {
          const params = {
            page: currentPage.toString(),
            page_size: '20',
            subcategory_id,
            second_subcategory_id,
          };
          const suggestedResponse = await fetchSuggestedProductsDetails(params);

          if (suggestedResponse.results && Array.isArray(suggestedResponse.results)) {
            suggestedProducts.push(...suggestedResponse.results);
          } else {
            break;
          }

          hasMore = !!suggestedResponse.next;
          currentPage++;
        } catch (suggestedError) {
          console.error('fetchSuggestions: Error fetching API suggestions:', suggestedError);
          break;
        }
      }

      suggestedProducts = suggestedProducts.filter(product => !excludeIds.includes(product.id));

      let allSuggestedProducts: Product[] = [];
      const minimumCount = 7;

      const uniqueProducts = new Map<number, Product>();
      // Add all Priority 1 products (suggested products) without limiting
      suggestedProducts.forEach(product => {
        uniqueProducts.set(product.id, product);
      });

      // If Priority 1 has fewer than 7 products, supplement with Priority 2 then Priority 3
      if (uniqueProducts.size < minimumCount) {
        const priority2Products = isCartContext ? wishlistProducts : cartProducts;
        priority2Products.forEach(product => {
          if (uniqueProducts.size < minimumCount && !uniqueProducts.has(product.id)) {
            uniqueProducts.set(product.id, product);
          }
        });

        // If still fewer than 7, supplement with Priority 3
        if (uniqueProducts.size < minimumCount) {
          const priority3Products = isCartContext ? cartProducts : wishlistProducts;
          priority3Products.forEach(product => {
            if (uniqueProducts.size < minimumCount && !uniqueProducts.has(product.id)) {
              uniqueProducts.set(product.id, product);
            }
          });
        }
      }

      allSuggestedProducts = Array.from(uniqueProducts.values());

      if (allSuggestedProducts.length === 0) {
        setError('No suggestions available');
        setLoading(false);
        return;
      }

      const productsWithStatus = allSuggestedProducts.map(product => {
        const wishItem = wishlistItems.find(item => item.product.id === product.id);
        const isInWishlist = wishlistProducts.some(wp => wp.id === product.id);
        return {
          ...product,
          isInitiallyLiked: isInWishlist,
          wishItemId: wishItem?.id,
          price: Number(product.price) || 0,
          undiscounted_price: Number(product.undiscounted_price) || 0,
        };
      });

      setProducts(productsWithStatus);
    } catch (err) {
      console.error('fetchSuggestions: Unexpected error:', err);
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, 500), [isAuthenticated, excludeProductIds, subcategory_id, second_subcategory_id, isCartContext]);

  useEffect(() => {
    fetchSuggestions();
    return () => {
      fetchSuggestions.cancel();
    };
  }, [fetchSuggestions]);

  const CustomPrevArrow = (props: any) => (
    <button
      {...props}
      className="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 z-10 items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
      aria-label="Previous"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5L7 12L15 19" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );

  const CustomNextArrow = (props: any) => (
    <button
      {...props}
      className="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 z-10 items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110"
      aria-label="Next"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5L17 12L9 19" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );

  const settings = {
    dots: true,
    infinite: products.length > 6,
    speed: 900,
    slidesToShow: 6,
    slidesToScroll: 5,
    arrows: products.length > 6,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          arrows: products.length > 4,
          infinite: products.length > 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          arrows: products.length > 3,
          infinite: products.length > 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          dots: false,
          slidesToShow: 2.1,
          slidesToScroll: 1.5,
          arrows: false,
          infinite: products.length > 2,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading suggestions...
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-gray-500">{error}</div>;
  }

  return (
    <div className="px-2 md:px-4 py-4 md:py-6">
      <h2 className="text-2xl md:text-3xl font-medium text-center mb-4 md:mb-6">
        You might also Like
      </h2>
      {products.length === 0 ? (
        <div className="text-center text-gray-500">No suggestions available.</div>
      ) : (
        <div className="suggested-slider-container">
          <Slider {...settings} className="mb-6 sm:mb-8">
            {products.map(item => (
              <div key={item.id} className="px-1">
                <SuggestedCard
                  product={item}
                  isInitiallyLiked={item.isInitiallyLiked}
                  wishItemId={item.wishItemId}
                  onItemClick={onSuggestedItemClick}
                  onWishlistToggle={handleWishlistToggle}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}
      <style jsx="true">{`
        .suggested-slider-container :global(.slick-track) {
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start;
          padding-left: 8px;
        }
        .suggested-slider-container :global(.slick-slide) {
          width: 160px !important;
          height: auto;
          margin-right: 8px;
        }
        .suggested-slider-container :global(.slick-list) {
          overflow: hidden;
        }
        .suggested-slider-container :global(.slick-prev),
        .suggested-slider-container :global(.slick-next) {
          width: 24px;
          height: 24px;
          z-index: 10;
          opacity: 0.8;
          transition: all 0.2s ease;
        }
        .suggested-slider-container :global(.slick-prev:hover),
        .suggested-slider-container :global(.slick-next:hover) {
          opacity: 1;
        }
        .suggested-slider-container :global(.slick-prev:before),
        .suggested-slider-container :global(.slick-next:before) {
          display: none;
        }
      `}</style>
    </div>
  );
});

Suggested.displayName = 'Suggested';

export default Suggested;