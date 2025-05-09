import React from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

interface WishProps {
  color?: string;
  liked?: boolean;
  onToggle: () => void;
}

const Wish: React.FC<WishProps> = ({ color = "red", liked, onToggle }) => {
  return (
    <div
      className="absolute top-2 right-2 text-[23px] sm:text-[30px] cursor-pointer"
      onClick={onToggle}
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {liked ? (
        <FaHeart style={{ color: color }} />
      ) : (
        <FiHeart style={{ color: "black" }} />
      )}
    </div>
  );
};

export default Wish;
