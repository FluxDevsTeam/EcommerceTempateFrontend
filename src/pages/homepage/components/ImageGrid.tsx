import { FaRegHeart } from "react-icons/fa";
import Products from "./products";
import { ProductItem } from "../types/data-types";
import { useNavigate } from "react-router-dom";

interface LatestItemsProps {
  data: ProductItem[];
}

const ImageGrid: React.FC<LatestItemsProps> = ({ data }) => {
  const navigate = useNavigate(); 
  return (
    <div>
      <div className="mb-6 sm:mb-8 md:mb-10">
        <Products />
      </div>

      <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((item) => {
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
              <div className="bg-[#F0EEED] rounded-lg p-8 relative">
                <div>
                  <img
                    src={item.image1}
                    alt={item.name}
                    className="w-full h-auto aspect-square object-cover"
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
                     NGN{amountSaved.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center mt-6 sm:mt-8">
        <button className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary">
          View All
        </button>
      </div>
    </div>
  );
};

export default ImageGrid;
