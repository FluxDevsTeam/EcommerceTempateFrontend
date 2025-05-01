import { FaRegHeart } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSuggestedProducts } from "@/pages/homepage/api/apiService";
import { ProductAPIResponse } from "@/pages/homepage/types/data-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Suggested: React.FC = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, isError } = useQuery<ProductAPIResponse>({
    queryKey: ['Suggested'],
    queryFn: fetchSuggestedProducts
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  // Choose which products to display (latest or top selling)
  const productsToDisplay = data?.results || [];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplaySpeed: 3000,
    arrows: true, // Show next/prev arrows
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false // Hide arrows on small devices if you prefer
        }
      }
    ]
  };
  
  return (
    <div className="px-6 md:px-14 py-8 md:py-12">
      <h2 className="text-3xl md:text-4xl font-medium leading-tight text-center mb-6 sm:mb-8 md:mb-10">
        You might also Like
      </h2>
      
      <Slider {...settings} className="mb-8 sm:mb-16">
        {productsToDisplay.map((item) => {
          const price = parseFloat(item.price);
          const discountedPrice = parseFloat(item.discounted_price);
          const amountSaved = price - discountedPrice;

          return (
            <div key={item.id} className="px-2"> {/* Add padding between slides */}
              <div
                className="group hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/suggested/${item.id}`)}
              >
                <div className="rounded-lg relative">
                  <div>
                    <img
                      src={item.image1}
                      alt={item.name}
                      className="w-full h-[200px] md:h-[300px] shadow-lg object-cover"
                    />
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-red-500 p-2 transition-colors duration-200"
                      aria-label="Add to favorites"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add favorite functionality here
                      }}
                    >
                      <FaRegHeart size={15} />
                    </button>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-base leading-[100%] sm:text-lg font-normal truncate">
                    {item.name}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
                    <span className="text-xl font-normal leading-[100%] text-primary">
                      ₦{discountedPrice.toFixed(0)}
                    </span>
                    <span className="text-gray-500 line-through text-xl sm:text-xl">
                      ₦{price.toFixed(0)}
                    </span>
                    <span className="bg-red-200 text-[#FF3333] px-2 py-1 rounded-full text-xs sm:text-sm">
                      ₦{amountSaved.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>

      <div className="flex justify-center items-center mt-8 sm:mt-10">
        <Link to="/categories">
          <button className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary">
            View All
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Suggested;