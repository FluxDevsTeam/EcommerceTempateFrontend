import React, { useState } from 'react';
import Wish from './Wish';
import { addWishItem, deleteWishItem } from './api';
import { CardProps, WishItem } from './types';
import { useNavigate } from 'react-router-dom';


const Card: React.FC<CardProps> = ({
  product,
  isInitiallyLiked,
  wishItemId: initialWishItemId,
  removeOnUnlike = false, // Optional control for wishlist pages
  isSuggested = false,
}) => {
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [wishItemId, setWishItemId] = useState<number | null>(initialWishItemId ?? null);
  const [visible, setVisible] = useState(true);
const navigate = useNavigate();
const handleToggle = async () => {
  try {
    const storedWishList = JSON.parse(localStorage.getItem('wishlist') || '[]');

    if (liked && wishItemId) {
      setLiked(false);
      localStorage.setItem(
        'wishlist',
        JSON.stringify(storedWishList.filter((id: number) => id !== product.id))
      );

      await deleteWishItem(wishItemId);
      setWishItemId(null);

      if (removeOnUnlike) setVisible(false);
    } else {
      setLiked(true);
      localStorage.setItem('wishlist', JSON.stringify([...storedWishList, product.id]));

      const newItem: WishItem = await addWishItem(product.id);
      setWishItemId(newItem.id);
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
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
      <div className="relative w-fit mb-4">
        <img
          src={product.image1}
          alt={product.name}
          className="rounded-2xl w-auto h-[200px] lg:h-[250px] "
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
      <div className="flex items-center gap-2 sm:gap-4">
        {typeof product.price === "number" && product.price > 0 && (
          <span className="text-[14px] sm:text-[20px]">
            ₦{product.price}
          </span>
        )}

        {typeof product.undiscounted_price === "number" &&
          parseInt(product.undiscounted_price) > parseInt(product.price) && (
            <>
              <span className="text-[10px] sm:text-[20px] text-[#00000066] line-through">
                ₦{product.undiscounted_price}
              </span>
              <span className="text-red-600 bg-red-100 font-semibold text-xs sm:text-sm flex items-center justify-center rounded-full px-2 py-1">
                -
                {Math.round(
                  ((product.undiscounted_price - parseInt(product.price)) /
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