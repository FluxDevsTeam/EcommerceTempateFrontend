import React, { useState, useEffect } from "react";
import { mobileSuggestedWish as MobileSuggestedWish } from "./Wish";
import { 
  addWishItem, 
  deleteWishItem, 
  getWishlistFromLocalStorage, 
  addToWishlistLocalStorage, 
  removeFromWishlistLocalStorage 
} from "@/pages/orders/api";
import { CardProps, WishItem } from "./types";
import { useNavigate } from "react-router-dom";

const SuggestedCard: React.FC<CardProps> = ({
  product,
  isInitiallyLiked,
  wishItemId: initialWishItemId,
  removeOnUnlike = false,
  onItemClick,
  onWishlistToggle,
}) => {
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [wishItemId, setWishItemId] = useState<number | null>(initialWishItemId ?? null);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  // Sync with local storage for non-logged-in users or server fallback
  useEffect(() => {
    if (!accessToken || !liked) return;
    const localWishlist = getWishlistFromLocalStorage();
    const isInLocalWishlist = localWishlist.some(item => item.product.id === product.id);
    const localWishItem = localWishlist.find(item => item.product.id === product.id);
    
    if (isInLocalWishlist && localWishItem?.id !== wishItemId) {
      setWishItemId(localWishItem?.id ?? null);
    } else if (!isInLocalWishlist && !accessToken && liked) {
      setLiked(false);
      setWishItemId(null);
    }
  }, [product.id, liked, wishItemId, accessToken]);

  const handleToggle = async () => {
    const wasLiked = liked;
    const previousWishItemId = wishItemId;

    // Optimistically update UI
    setLiked(!wasLiked);
    if (wasLiked) {
      setWishItemId(null);
      if (removeOnUnlike) setVisible(false);
    } else {
      setWishItemId(Date.now()); // Temporary ID for optimistic update
    }

    try {
      if (!accessToken) {
        if (wasLiked) {
          removeFromWishlistLocalStorage(product.id);
        } else {
          addToWishlistLocalStorage(product);
        }
        window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
          detail: { 
            productId: product.id,
            action: wasLiked ? 'remove' : 'add',
            fromSuggested: true,
            newItem: !wasLiked ? {
              id: Date.now(), // Temporary ID
              product: {
                ...product,
                id: product.id
              }
            } : undefined
          }
        }));
      } else {
        if (wasLiked && previousWishItemId) {
          await deleteWishItem(previousWishItemId, product.id);
          window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { 
              productId: product.id,
              action: 'remove',
              fromSuggested: true
            }
          }));
        } else {
          const newItem = await addWishItem(product);
          setWishItemId(newItem.id);
          window.dispatchEvent(new CustomEvent('wishlistUpdated', { 
            detail: { 
              productId: product.id,
              action: 'add',
              fromSuggested: true,
              newItem: newItem
            }
          }));
        }
      }
    } catch (error) {
      console.error('SuggestedCard: Error toggling wishlist:', error, { productId: product.id, wasLiked, previousWishItemId });
      // Revert UI on error
      setLiked(wasLiked);
      setWishItemId(previousWishItemId);
      if (removeOnUnlike && !wasLiked) setVisible(true);

      // Revert local storage on error for non-logged-in users
      if (!accessToken) {
        
        if (wasLiked) {
          addToWishlistLocalStorage(product);
        } else {
          removeFromWishlistLocalStorage(product.id);
        }
      }
    }
  };

  // Format price with thousand separators
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US');
  };

  if (!visible) return null;

  return (
    <div className="w-[150px] h-[150px] mb-10 md:pb2 cursor-pointer">
      <div className="relative mb-2 overflow-hidden rounded-lg">
        <img
          src={product.image1}
          alt={product.name}
          className={`w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-lg hover:scale-105 transition-transform duration-300`}
          onClick={() => {
            if (onItemClick) {
              onItemClick(product.image1);
            }
            navigate(`/suggested/${product.id}`);
          }}
        />
        <MobileSuggestedWish color="red" liked={liked} onToggle={handleToggle} />
      </div>
      <div className="space-y-0">
        <p className="text-sm font-medium line-clamp-1">{product.name}</p>
        <div className="flex flex-col gap-0">
          {typeof product.price === 'number' && product.price > 0 && (
            <span className="text-sm font-semibold">₦{formatPrice(product.price)}</span>
          )}
          {typeof product.undiscounted_price === 'number' &&
            product.undiscounted_price > 0 &&
            product.undiscounted_price > product.price && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-[#666] line-through">
                  ₦{formatPrice(product.undiscounted_price)}
                </span>
                <span className="text-red-600 bg-red-100 font-semibold text-xs rounded-full px-1 py-0.5">
                  -{Math.round(((product.undiscounted_price - product.price) / product.undiscounted_price) * 100)}%
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SuggestedCard;