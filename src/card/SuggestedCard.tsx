import React, { useState } from 'react';
import Wish from './Wish';
import { addWishItem, deleteWishItem } from './api';
import { CardProps, WishItem } from './types';
import { useNavigate } from 'react-router-dom';

const SuggestedCard: React.FC<CardProps> = ({
  product,
  isInitiallyLiked,
  wishItemId: initialWishItemId,
  removeOnUnlike = false
  
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
          className="rounded-lg w-[90px] h-[90px] md:h-[180px] md::h-[300px] object-cover"
          onClick={() => navigate(`/suggested/${product.id}`)}
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
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-md font-medium">₦{product.price}</span>
          {product.undiscounted_price > 0 && product.undiscounted_price > product.price && (
            <>
              <span className="text-md text-gray-400 line-through">
                ₦{product.undiscounted_price}
              </span>
              <span className="text-red-600 bg-red-100 text-xs px-1 rounded">
                -{Math.round(
                  (product.undiscounted_price - product.price) / product.undiscounted_price * 100
                )}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestedCard;