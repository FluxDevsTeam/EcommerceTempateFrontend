import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSuggestedProducts} from "@/pages/homepage/api/apiService";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SuggestedCard from "@/card/SuggestedCard";
import { useState, useEffect } from "react";
import { WishItem } from "@/card/types";
import { WishData } from "@/card/wishListApi";

const Suggested: React.FC<{ onSuggestedItemClick?: (image: string) => void }> = ({ 
  onSuggestedItemClick 
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Fetch suggested products
  const { data, isLoading, isError } = useQuery({
    queryKey: ['Suggested'],
    queryFn: fetchSuggestedProducts
  });

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistRes = await WishData();
        setWishlistItems(wishlistRes);
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (isLoading || wishlistLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading data.</div>;

  const productsToDisplay = data?.results || [];

  // Helper function to check if a product is in wishlist
  const getWishlistInfo = (productId: number) => {
    const matchedWish = wishlistItems.find(item => item.product.id === productId);
    return {
      isInitiallyLiked: !!matchedWish,
      wishItemId: matchedWish?.id
    };
  };

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
          slidesToShow: 1.8, 
          arrows: false,
          centerMode: true,
          centerPadding: '10%', 
          swipeToSlide: true,
          draggable: true,
          touchThreshold: 10,
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
        {productsToDisplay.map((item) => {
          const wishlistInfo = getWishlistInfo(item.id);
          return (
            <div key={item.id} className="px-1">
              <div className="transform scale-90 hover:scale-95 transition-transform duration-200 md:scale-100">
                <SuggestedCard 
                  product={item} 
                  className="text-sm"
                  isInitiallyLiked={wishlistInfo.isInitiallyLiked}
                  wishItemId={wishlistInfo.wishItemId}
                   onItemClick={onSuggestedItemClick}
                />
              </div>
            </div>
          );
        })}
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

export default Suggested;