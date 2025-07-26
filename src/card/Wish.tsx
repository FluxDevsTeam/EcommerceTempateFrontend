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
      className="absolute top-3 right-3 text-[30px] cursor-pointer z-10 hover:scale-110 transition-transform"
      onClick={onToggle}
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {liked ? (
        <FaHeart style={{ color: color }} />
      ) : (
        <FiHeart style={{ color: "black", fill: "white", stroke: "black", strokeWidth: "0.8" }} />
      )}
    </div>
  );
};

export default Wish;

const mobileSuggestedWish: React.FC<WishProps> = ({ color = "red", liked, onToggle }) => {
  return (
    <div
      className="absolute top-2 right-10 text-[24px] md:right-2 md:text-[28px] cursor-pointer"
      onClick={onToggle}
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {liked ? (
        <FaHeart style={{ color: color }} />
      ) : (
        <FiHeart style={{ color: "black", fill: "white", stroke: "black", strokeWidth: "0.8" }} />
      )}
    </div>
  );
};

export { mobileSuggestedWish };