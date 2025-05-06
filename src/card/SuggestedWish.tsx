import React from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

interface WishProps {
  color?: string;
  liked: boolean;
  onToggle: () => void;
}

const SuggestedWish: React.FC<WishProps> = ({ color = "red", liked, onToggle }) => {
  return (
    <div
      className="absolute top-2 right-2   cursor-pointer"
      onClick={onToggle}
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {liked ? (
        <FaHeart className="w-2 h-2" style={{ color: color }} />
      ) : (
        <FiHeart className="w-2 h-2" style={{ color: "black" }} />
      )}
    </div>
  );
};

export default SuggestedWish;
