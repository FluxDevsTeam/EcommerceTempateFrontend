import React, { useState } from "react";
import Wish from "./Wish";
import { addWishItem, deleteWishItem } from "./api";
import { CardProps, WishItem } from "./types";
import { useNavigate } from "react-router-dom";

const SuggestedCard: React.FC<CardProps> = ({
  product,
  isInitiallyLiked,
  wishItemId: initialWishItemId,
  removeOnUnlike = false,
  onItemClick,
}) => {
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [wishItemId, setWishItemId] = useState<number | null>(
    initialWishItemId ?? null
  );
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
      console.error("Error toggling wishlist:", error);
    }
  };

  if (!visible) return null;

  return (
    <div className="mb-3 cursor-pointer w-full ">
      <div className="relative w-full  ">
        <img
          src={product.image1}
          alt={product.name}
          className="max-w-full max-h-[500px] w-auto h-auto object-contain"
          onClick={() => {
            if (onItemClick) {
              onItemClick(product.image1);
            }
            navigate(`/suggested/${product.id}`);
          }}
        />
        <Wish color="red" liked={liked} onToggle={handleToggle} />
      </div>
      <div className="space-y-0.5 mt-3">
        <p className="text-md font-medium line-clamp-1">{product.name}</p>
        <div className="">
          {typeof product.price === "number" && product.price > 0 && (
            <span className="pr-2">₦{product.price}</span>
          )}

          <br />

          {typeof product.undiscounted_price === "number" &&
            product.undiscounted_price > 0 &&
            product.undiscounted_price > product.price && (
              <span className=" text-[#00000066] line-through pr-2">
                ₦{product.undiscounted_price}
              </span>
            )}

          {product.undiscounted_price > 0 &&
            product.undiscounted_price > product.price && (
              <span className="text-red-600 bg-red-100 font-semibold rounded-full px-2 text-sm py-1 w-fit">
                -
                {Math.round(
                  ((product.undiscounted_price - product.price) /
                    product.undiscounted_price) *
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
