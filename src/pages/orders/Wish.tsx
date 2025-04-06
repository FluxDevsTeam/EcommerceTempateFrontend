import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

interface WishProps {
  color?: string; // Optional color prop
}

const Wish: React.FC<WishProps> = ({ color = "black" }) => {
  const [isClick, setIsClick] = useState(false);

  return (
    <div
      className="absolute top-2 right-2"
      onClick={() => setIsClick(!isClick)}
      style={{ cursor: "pointer", fontSize: "30px" }}
    >
      {isClick ? (
        <FaHeart style={{ color }} />
      ) : (
        <FiHeart style={{ color }} />
      )}
    </div>
  );
};

export default Wish;
