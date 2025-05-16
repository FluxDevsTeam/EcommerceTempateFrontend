import React, { useState } from 'react';
import Wish from './Wish';
import { addWishItem, deleteWishItem } from './api';
import { CardProps, WishItem } from './types';
import { useNavigate } from 'react-router-dom';

const SuggestedCard: React.FC<CardProps> = ({
  product,
  isInitiallyLiked,
  wishItemId: initialWishItemId,
  removeOnUnlike = false,
  onItemClick 
  
}) => {
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [wishItemId, setWishItemId] = useState<number | null>(initialWishItemId ?? null);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  const handleToggle = async () => {
    try {
      if (liked && wishItemId) {
        await deleteWishItem(wishItemId);
        setWishItemId(null);
        setLiked(false);
        if (removeOnUnlike) setVisible(false);
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
    <div className="mb-3 cursor-pointer w-full ">
      <div className="relative w-full  ">
        <img
          src={product.image1}
          alt={product.name}
          className="rounded-lg w-[90px] h-[120px] md:h-[180px] md:h-[300px] object-cover"
           onClick={() => {
            if (onItemClick) {
              onItemClick(product.image1); 
            }
            navigate(`/suggested/${product.id}`);
          }}
        />
        <Wish
          color="red"
          liked={liked}
          onToggle={handleToggle}
        />
      </div>
      <div className="space-y-0.5">
        <p className="text-md font-medium line-clamp-1">
          {product.name}
        </p>
       <div className="flex items-center gap-2 sm:gap-4">
  {typeof product.price === "number" && product.price > 0 && (
    <span className="text-[14px] sm:text-[20px]">
      ₦{product.price}
    </span>
  )}

  {typeof product.undiscounted_price === "number" &&
    product.undiscounted_price > 0 &&
    product.undiscounted_price > product.price && (
      <span className="text-[10px] sm:text-[20px] text-[#00000066] line-through">
        ₦{product.undiscounted_price}
      </span>
  )}

  {product.undiscounted_price > 0 &&
    product.undiscounted_price > product.price && (
      <span className="text-red-600 bg-red-100 font-semibold text-xs sm:text-sm flex items-center justify-center rounded-full px-2 py-1">
        -
        {Math.round(
          (product.undiscounted_price - product.price) /
            product.undiscounted_price *
            100
        )}
        %
      </span>
  )}
</div>

      </div>
    </div>
  );
};

export default SuggestedCard;