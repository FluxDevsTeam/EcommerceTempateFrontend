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

  const productsToDisplay = data?.results || [];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 6,  // Default: show 6 on large screens
    slidesToScroll: 3,
    autoplaySpeed: 3000,
    arrows: true,
    swipeToSlide: true,
    draggable: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,  // Show 4 on tablets
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,  // Show 3 on small tablets
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,  // Show 2 on mobile
          slidesToScroll: 1,
          arrows: false,
        }
      }
    ]
  };
  
  return (
    <div className="px-4 md:px-8 py-6 md:py-8"> {/* Reduced padding */}
      <h2 className="text-2xl md:text-3xl font-medium text-center mb-4 md:mb-6"> {/* Smaller heading */}
        You might also Like
      </h2>
      
      <Slider {...settings} className="mb-6 sm:mb-8"> {/* Reduced margin */}
        {productsToDisplay.map((item) => {
          const price = parseFloat(item.price);
          const discountedPrice = parseFloat(item.discounted_price);
          const amountSaved = price - discountedPrice;

          return (
            <div key={item.id} className="px-1.5"> {/* Tighter spacing between slides */}
              <div
                className="group hover:shadow-md transition-shadow duration-300 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/suggested/${item.id}`)}
              >
                <div className="rounded-md relative">
                  <div>
                    <img
                      src={item.image1}
                      alt={item.name}
                      className="w-full h-[150px] md:h-[180px] object-cover" // Smaller image height
                    />
                    <button
                      className="absolute top-1.5 right-1.5 text-gray-600 hover:text-red-500 p-1.5 transition-colors duration-200"
                      aria-label="Add to favorites"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaRegHeart size={14} /> {/* Smaller icon */}
                    </button>
                  </div>
                </div>

                <div className="p-2 sm:p-3"> {/* Reduced padding */}
                  <h3 className="text-sm sm:text-base font-normal truncate"> {/* Smaller text */}
                    {item.name}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1"> {/* Tighter spacing */}
                    <span className="text-lg font-normal text-primary"> {/* Smaller price */}
                      ₦{discountedPrice.toFixed(0)}
                    </span>
                    <span className="text-gray-500 line-through text-sm">
                      ₦{price.toFixed(0)}
                    </span>
                    <span className="bg-red-200 text-[#FF3333] px-1.5 py-0.5 rounded-full text-xs">
                      ₦{amountSaved.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>

      <div className="flex justify-center items-center mt-6 sm:mt-8"> {/* Reduced margin */}
        <Link to="/categories">
          <button className="text-base font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary">
            View All
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Suggested;