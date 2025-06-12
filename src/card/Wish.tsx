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
      className="absolute top-[-130px] right-2 text-[20px] xxs:top-[-130px] xxs:right-2 xxs:text-[22px] xs:top-[-140px] xs:right-3 xs:text-[24px] sm:top-[-160px] sm:text-[26px] md:top-[-125px] md:right-2 md:text-[28px] lg:top-[-160px] lg:right-2 lg:text-[28px] xl:top-[-210px] xl:right-3 xl:text-[32px] cursor-pointer"
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