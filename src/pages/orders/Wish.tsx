import React, { useState } from "react";
import { FiHeart } from "react-icons/fi"; // Unfilled heart
import { FaHeart } from "react-icons/fa"; // Filled heart

interface WishProps {
  color?: string;
  defaultLiked?: boolean;
}

const Wish: React.FC<WishProps> = ({ color = "red", defaultLiked = false }) => {
  const [isClick, setIsClick] = useState(defaultLiked);

  return (
    <div
      className="absolute top-2 right-2 text-[23px] sm:text-[30px] cursor-pointer"
      onClick={() => setIsClick(!isClick)}
    >
      {isClick ? (
        <FaHeart style={{ color: color }} /> // Red filled heart when clicked
      ) : (
        <FiHeart style={{ color: "black" }} /> // Black unfilled heart when not clicked
      )}
    </div>
  );
};

export default Wish;
