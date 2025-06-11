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
      className="absolute top-2 right-2 xl:top-3 xl:right-8 text-[30px] sm:text-[32px] cursor-pointer"
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