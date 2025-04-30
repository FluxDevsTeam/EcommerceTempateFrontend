
import { ProductItem } from "../types/data-types";
import { Link, useNavigate } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";

interface LatestItemsProps {
  data: ProductItem[];
}

const ImageGrid: React.FC<LatestItemsProps> = ({ data }) => {
  const navigate = useNavigate(); 

   

  return (
    <div className="px-6 md:px-3 py-8 md:py-12 space-y-5">
     
      <p className="text-5xl font-medium  flex justify-center ">Latest Items</p>
    

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 sm:mb-16">
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
          <span className="text-xl font-normal leading-[100%] text-primary">
          ₦{discountedPrice.toFixed(0)}
          </span>
          <span className="text-gray-500 line-through text-xl sm:text-xl">
          ₦ {price.toFixed(0)}
          </span>
          <span className="bg-red-200 text-[#FF3333] px-2 py-1 rounded-full text-xs sm:text-sm">
          ₦ {amountSaved.toFixed(0)}
          </span>
        </div>
      </div>
          </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center mt-6 sm:mt-8">
     <Link to='/categories'> 
      <button className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary">
          View All
        </button>
       </Link> 
      </div>
    </div>
  );
};

export default ImageGrid;
