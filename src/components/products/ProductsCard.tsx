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
    className="group hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer"
    onClick={() =>
      navigate(`/product/item/${item.id}`)
    }
  >
    <div className=" rounded-lg relative">
      <div>
        <img
          src={item.image1}
          alt={item.name}
          className="w-full h-[200px] md:h-[300px] shadow-lg   object-cover"
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
<h3 className="text-base leading-[100%]  sm:text-lg font-normal truncate">
  {item.name}
</h3>
<div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
  <span className="text-xl  font-normal leading-[100%] text-primary">
  ₦{discountedPrice.toFixed(0)}
  </span>
  <span className="text-gray-500 line-through text-xl sm:text-xl ">
  ₦{price.toFixed(0)}
  </span>
  <span className="bg-red-200 text-[#FF3333] px-2 py-1 rounded-full text-xs sm:text-sm">
  ₦ {amountSaved.toFixed(0)}
  </span>
</div>
</div>
  </div>
  );
};

export default ProductCard;
