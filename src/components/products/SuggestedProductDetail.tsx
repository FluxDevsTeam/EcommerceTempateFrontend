import {Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSuggestedProducts } from "@/pages/homepage/api/apiService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SuggestedCard from "@/card/SuggestedCard";

const SuggestedProductDetails: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
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
    slidesToShow: 6,
    slidesToScroll: 4,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1.5, // Show 2.5 items
          arrows: false,
          infinite: true,
          centerMode: true, // Enables partial item visibility
          centerPadding: '5%', // Creates space for partial items
          swipeToSlide: true, // Allows smooth manual scrolling
          draggable: true, // Enables touch scrolling
          touchThreshold: 10, // Makes touch scrolling more sensitive
        }
      }
    ]
  };
  
  
  return (
    <div className="px-2 md:px-4 py-4 md:py-6">
      <h2 className="text-2xl md:text-3xl font-medium text-center mb-4 md:mb-6">
        You might also Like
      </h2>
      
      <Slider {...settings} className="mb-6 sm:mb-8">
        {productsToDisplay.map((item) => (
          <div key={item.id} className="px-1"> {/* Add padding between slides */}
            <div className="md:transform scale-90 md:hover:scale-95 md:transition-transform md:duration-200"> {/* Scale down the card */}
              <SuggestedCard product={item} />
            </div>
          </div>
        ))}
      </Slider>

      <div className="flex justify-center items-center mt-4 sm:mt-6">
        <Link to="/categories">
          <button className="text-sm font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary">
            View All
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SuggestedProductDetails;