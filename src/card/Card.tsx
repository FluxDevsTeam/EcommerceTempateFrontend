import React, { useState, useEffect } from 'react';
import Wish from './Wish';
import { addWishItem, deleteWishItem, getWishlistFromLocalStorage } from '../pages/orders/api';
import { CardProps, WishItem as ApiWishItem } from './types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../pages/auth/AuthContext';


const Card: React.FC<CardProps> = ({
  product,
  isInitiallyLiked,
  wishItemId: initialWishItemId,
  removeOnUnlike = false, // Optional control for wishlist pages
  isSuggested = false,
}) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [wishItemId, setWishItemId] = useState<number | null>(initialWishItemId ?? null);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isInitiallyLiked) {
      const localWishlist = getWishlistFromLocalStorage();
      const isInLocalWishlist = localWishlist.some(item => item.product.id === product.id);
      if (isInLocalWishlist) {
        setLiked(true);
        const localItem = localWishlist.find(item => item.product.id === product.id);
        if (localItem) setWishItemId(localItem.id);
      }
    }
  }, [isAuthenticated, product.id, isInitiallyLiked]);

  const handleToggle = async () => {
    try {
      if (liked) {
        setLiked(false);
        if (isAuthenticated && wishItemId) {
          await deleteWishItem(wishItemId);
        } else if (!isAuthenticated) {
          await deleteWishItem(wishItemId ?? 0, product.id);
        }
        setWishItemId(null);
        if (removeOnUnlike) setVisible(false);
      } else {
        setLiked(true);
        let newItem: ApiWishItem;
        if (isAuthenticated) {
          newItem = await addWishItem(product.id);
        } else {
          newItem = await addWishItem(product);
        }
        setWishItemId(newItem.id);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      setLiked(!liked);
    }
  };

  if (!visible) return null;

  const handleProductClick = () => {
    if (isSuggested) {
      navigate(`/suggested/${product.id}`);
    } else {
      navigate(`/product/item/${product.id}`);
    }
  };


  return (
    <div className="mb-10 cursor-pointer "    
   >
      <div className="relative w-fit mb-4 rounded-lg">
        <img
          src={product.image1}
          alt={product.name}
          className="rounded-2xl md:w-auto h-[150px] lg:h-[220px]"
          onClick={handleProductClick}
        />
        <Wish
          color="red"
          liked={liked}
          onToggle={handleToggle}
        />
      </div>
      <p className="text-[15px] font-medium sm:text-[20px] capitalize mb-2 line-clamp-1">
        {product.name}
      </p>
      <div className="gap-2 sm:gap-4">
        {typeof product.price === "number" && product.price > 0 && (
          <span className="text-[14px] sm:text-[20px]">
            ₦{product.price}
          </span>
        )}

        <br/>

        {typeof product.undiscounted_price === "number" &&
          product.undiscounted_price > product.price && (
            <>
              <span className="text-[10px] sm:text-[20px] text-[#00000066] line-through">
                ₦{product.undiscounted_price}
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