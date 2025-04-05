import React, { useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";


const Wish: React.FC = () => {
  const [isClick, setIsClick] = useState(false);

  return (
    <div className="absolute top-2 right-2"
      onClick={() => setIsClick(!isClick)}
      style={{ cursor: "pointer", fontSize: "30px" }}
    >
      {isClick ? (
        <FaHeart style={{ color: "black" }} /> // Solid black heart on hover
      ) : (
        <FiHeart style={{ color: "black" }} /> // Outline heart by default
      )}
    </div>
  );
};

export default Wish;
