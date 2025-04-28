import { FaRegHeart } from "react-icons/fa";
import { useNavigate ,Link} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/pages/homepage/api/apiService";
import { ProductAPIResponse } from "@/pages/homepage/types/data-types";

const Suggested: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useQuery<ProductAPIResponse>({
    queryKey: ['myData'],
    queryFn: fetchProducts
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  // Choose which products to display (latest or top selling)
  const productsToDisplay = data?.latest_items?.results || [];

  return (
    <div className="px-4 sm:px-6 py-8 md:py-12">
        <h2 className="text-3xl md:text-4xl  font-medium leading-tight text-center mb-6 sm:mb-8 md:mb-10">
        You might also Like
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 sm:mb-16">
        {productsToDisplay.map((item) => {
          const price = parseFloat(item.price);
          const discountedPrice = parseFloat(item.discounted_price);
          const amountSaved = price - discountedPrice;

          return (
            <div
              key={item.id}
              className="group hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => navigate(`/product/item/${item.id}`)}
            >
              <div className="bg-[#F0EEED] rounded-lg p-14 relative">
                <div>
                  <img
                    src={item.image1}
                    alt={item.name}
                    className="w-full h-[150px] shadow-lg object-cover"
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
                <h3 className="text-xl uppercase leading-[100%] sm:text-lg font-normal text-gray-800 truncate">
                  {item.name}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
                  <span className="text-2xl sm:text-xl font-normal leading-[100%] text-primary">
                    NGN{discountedPrice.toFixed(0)}
                  </span>
                  <span className="text-gray-500 line-through text-2xl sm:text-xl">
                    NGN{price.toFixed(0)}
                  </span>
                  <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs sm:text-sm">
                    NGN{amountSaved.toFixed(0)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center mt-8 sm:mt-10">
      <Link to ='/categories'>  <button className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary">
          View All
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Suggested;