import React from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/api-types';

type ProductCardProps = {
  item: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const price = parseFloat(item.price);
  const discountedPrice = parseFloat(item.discounted_price);
  const amountSaved = price - discountedPrice;

  return (
    <div
      key={item.id}
      className="relative group hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer"
      onClick={() => navigate(`/product/item/${item.id}`)}
    >
      <div className="rounded-lg p-8 relative">
        <div>
          <img
            src={item.image1}
            alt={item.name}
            className="w-full h-auto object-cover bg-[#F0EEED]"
          />
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-red-500 p-2 transition-colors duration-200"
            aria-label="Add to favorites"
          >
            <FaRegHeart size={15} />
          </button>
        </div>
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-800 truncate">
          {item.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
          <span className="text-lg sm:text-xl font-bold text-primary">
            NGN{discountedPrice.toFixed(2)}
          </span>
          <span className="text-gray-500 line-through text-sm sm:text-base">
            NGN{price.toFixed(2)}
          </span>
          <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs sm:text-sm">
            You save NGN{amountSaved.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
