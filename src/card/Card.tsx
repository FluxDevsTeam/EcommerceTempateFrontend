// src/components/Card.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wish from './Wish';
import { addWishItem, deleteWishItem, getWishlistFromLocalStorage, WishData, addToWishlistLocalStorage, removeFromWishlistLocalStorage } from '../pages/orders/api';
import { CardProps, WishItem } from './types';
import { useAuth } from '../pages/auth/AuthContext';
import { useMediaQuery } from 'react-responsive';

const Card: React.FC<CardProps> = ({
  product,
  isInitiallyLiked,
  wishItemId: initialWishItemId,
  removeOnUnlike = false,
  onItemClick,
  isSuggested = false,
}) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [wishItemId, setWishItemId] = useState<number | null>(initialWishItemId ?? null);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  // Check local wishlist for non-authenticated users
  useEffect(() => {
    if (!isAuthenticated && !isInitiallyLiked) {
      const localWishlist = getWishlistFromLocalStorage();
      const isInLocalWishlist = localWishlist.some((item) => item.product.id === product.id);
      if (isInLocalWishlist) {
        setLiked(true);
        const localItem = localWishlist.find((item) => item.product.id === product.id);
        if (localItem) setWishItemId(localItem.id);
      }
    }
  }, [isAuthenticated, product.id, isInitiallyLiked]);

  // Queue for API calls
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

  const handleToggle = async () => {
    const wasLiked = liked;
    const previousWishItemId = wishItemId;

    // Optimistically update UI
    setLiked(!wasLiked);
    if (wasLiked) {
      setWishItemId(null);
      if (removeOnUnlike) setVisible(false);
    } else {
      setWishItemId(Date.now()); // Temporary ID for non-authenticated add
    }

    // Define the API operation
    const executeOperation = async () => {
      try {
        if (!isAuthenticated) {
          // Remove console.log
          if (wasLiked) {
            removeFromWishlistLocalStorage(product.id);
          } else {
            addToWishlistLocalStorage(product);
          }
          window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { 
              productId: product.id,
              fromSuggested: isSuggested 
            } 
          }));
        } else {
          if (wasLiked) {
            let actualWishItemId = previousWishItemId;
            if (!actualWishItemId) {
              try {
                const wishData = await WishData();
                const wishItem = wishData.results.find((item: WishItem) => item.product.id === product.id);
                actualWishItemId = wishItem ? wishItem.id : undefined;
                console.log('handleToggle: Fetched server wishItemId:', { actualWishItemId });
              } catch (error) {
                const localWishlist = getWishlistFromLocalStorage();
                const localItem = localWishlist.find(item => item.product.id === product.id);
                actualWishItemId = localItem?.id;
                console.warn('handleToggle: Failed to fetch server wishlist, using local:', { actualWishItemId });
              }
            }

            if (actualWishItemId) {
              await deleteWishItem(actualWishItemId, product.id);
              console.log('handleToggle: Deleted wishlist item:', { actualWishItemId });
              window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
                detail: { 
                  productId: product.id,
                  action: 'remove',
                  fromSuggested: isSuggested
                }
              }));
            } else {
              removeFromWishlistLocalStorage(product.id);
              console.log('handleToggle: Removed from local wishlist (fallback)');
            }
          } else {
            const newItem = await addWishItem(product);
            setWishItemId(newItem.id);
            console.log('handleToggle: Added wishlist item:', { newWishItemId: newItem.id });
          }
        }
      } catch (error) {
        console.error('handleToggle: Error:', error);
        setLiked(wasLiked);
        setWishItemId(previousWishItemId);
        if (removeOnUnlike && !wasLiked) setVisible(true);
        throw error; // Propagate error to queue
      }
    };

    // Enqueue operation for unlike, execute immediately for like
    if (wasLiked) {
      apiCallQueue.push(executeOperation);
      processQueue();
    } else {
      try {
        await executeOperation();
      } catch (error) {
        // Error handling already done in executeOperation
      }
    }
  };

  // Format price with thousand separators
  const formatPrice = (value: number) => {
    return value.toLocaleString('en-US');
  };

  if (!visible) return null;

  const handleProductClick = () => {
    if (onItemClick) {
      onItemClick(product.image1);
    }
    if (isSuggested) {
      navigate(`/suggested/${product.id}`);
    } else {
      navigate(`/product/item/${product.id}`);
    }
  };

  const is390pxAndAbove = useMediaQuery({ query: '(min-width: 390px)' });


  return (
    <div className="mb-2 cursor-pointer">
      <div className="relative w-full mb-4 overflow-hidden rounded-2xl">
        <img
          src={product.image1}
          alt={product.name}
          className={`w-[170px]  h-[170px] ${is390pxAndAbove ? "w-[130px] h-130px" : ""} rounded-2xl hover:scale-105 transition-transform duration-300 mx-auto lg:w-[160px] lg:h-[160px] xl:h-[220px] xl:w-[220px]`}
          onClick={handleProductClick}
        />
        <Wish
          color="red"
          liked={liked}
          onToggle={handleToggle}
        />
      </div>
      <p className="text-[15px] font-medium sm:text-[20px] capitalize lg:mx-2 mb-2 line-clamp-1">
        {product.name}
      </p>
      <div className="gap-2 lg:mx-2 sm:gap-4">
        {typeof product.price === 'number' && product.price > 0 && (
          <span className="text-[14px] sm:text-[20px]">
            ₦{formatPrice(product.price)}
          </span>
        )}

        <br />

        {typeof product.undiscounted_price === 'number' &&
          product.undiscounted_price > product.price && (
            <>
              <span className="text-[10px] sm:text-[20px] text-[#00000066] line-through">
                ₦{formatPrice(product.undiscounted_price)}
              </span>
              <span className="text-red-600 bg-red-100 font-semibold w-fit text-xs sm:text-sm rounded-full px-2 py-1 ml-2">
                -
                {Math.round(
                  ((product.undiscounted_price - product.price) /
                    product.undiscounted_price) *
                    100
                )}
                %
              </span>
            </>
          )}
      </div>
    </div>
  );
};

export default Card;