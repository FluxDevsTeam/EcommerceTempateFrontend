import React, { useState } from 'react';
import Wish from './Wish';
import { addWishItem, deleteWishItem } from './api';
import { CardProps, WishItem } from './types';

const Card: React.FC<CardProps> = ({
  product,
  isInitiallyLiked,
  wishItemId: initialWishItemId,
  removeOnUnlike = false, // Optional control for wishlist pages
}) => {
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [wishItemId, setWishItemId] = useState<number | null>(initialWishItemId ?? null);
  const [visible, setVisible] = useState(true);

  const handleToggle = async () => {
    try {
      if (liked && wishItemId) {
        await deleteWishItem(wishItemId);
        setWishItemId(null);
        setLiked(false);
        if (removeOnUnlike) {
          setVisible(false); // Only hide card if it's on wishlist page
        }
      } else {
        const newItem: WishItem = await addWishItem(product.id);
        setWishItemId(newItem.id);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  if (!visible) return null;

  return (
    <div className="mb-10">
      <div className="relative w-fit mb-4">
        <img
          src={product.image1}
          alt={product.name}
          className="rounded-2xl h-[180px] lg:h-[300px]"
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
      <div className="flex items-center gap-2 sm:gap-4">
        <span className="text-[14px] sm:text-[20px]">₦{product.price}</span>
        <span className="text-[10px] sm:text-[20px] text-[#00000066] line-through">
          ₦{product.undiscounted_price}
        </span>
        {product.undiscounted_price > 0 && product.undiscounted_price > product.price && (
          <span className="text-red-600 bg-red-100 font-semibold text-xs sm:text-sm flex items-center justify-center rounded-full px-2 py-1">
            -
            {Math.round(
              ((product.undiscounted_price - product.price) / product.undiscounted_price) * 100
            )}
            %
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;