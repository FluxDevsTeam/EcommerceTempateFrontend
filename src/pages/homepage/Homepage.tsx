
import ImageGrid from "./components/ImageGrid";
import TopSelling from "./components/TopSelling";
import ImageSlider from "./components/ImageSlider";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./api/apiService";
import { WishData } from "@/card/wishListApi"; // Import WishData
import { WishItem } from "@/card/types";
import { ProductAPIResponse} from "./types/data-types"; // Import WishItem type
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import banner from '/images/banner.png'

const Homepage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Fetch products
  const { data, isLoading, isError } = useQuery<ProductAPIResponse>({
    queryKey: ['myData'],
    queryFn: fetchProducts
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

  if (isLoading || wishlistLoading) return (
    <div className="flex justify-center items-center py-10 text-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
    </div>
  );
  
  if (isError) return <div>Error loading data.</div>;

  // Helper function to check if a product is in wishlist
  const getWishlistInfo = (productId: number) => {
    const matchedWish = wishlistItems.find(item => item.product.id === productId);
    return {
      isInitiallyLiked: !!matchedWish,
      wishItemId: matchedWish?.id
    };
  };

  return (
    <div className="w-full min-h-full px-4 md:px-12 py-4 lg:px-28">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <div className="block md:hidden flex justify-center lg:justify-end mt-[20px]">
          <img 
            src={banner} 
            alt="Banner image" 
            className="w-full max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg object-contain"
          />
        </div>

        <div className="flex flex-col space-y-2 pt-3 md:pt-6 px-4 md:px-0">
          <h1 className='text-xl md:text-6xl font-bold leading-tight lg:leading-[63px] text-black'>
            Shop Smarter, Live Better - Find What You Love
          </h1>
          <p className='text-[#000000] font-medium text-base md:text-lg'>
            Access exclusive deals, track orders and enjoy a seamless shopping experience
          </p>
          <Link to='/shoe-category'>
            <button className="bg-customBlue text-white border rounded-full px-6 py-3 w-auto md:w-[210px] hover:brightness-90 transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
        
        <div className="hidden md:block flex justify-center lg:justify-en ">
          <img 
            src={banner} 
            alt="Banner image" 
            className="w-full max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg object-contain"
          />
        </div>
      </div>

      {/* Content Sections */}
      <div className="md:mt-3 md:space-y-10 ">
        <ImageGrid 
          product={data?.latest_items?.results ?? []} 
          getWishlistInfo={getWishlistInfo} 
        />
        <TopSelling 
          product={data?.top_selling_items?.results ?? []} 
          getWishlistInfo={getWishlistInfo}
        />
        <ImageSlider 
          data={data?.latest_items?.results ?? []} 
       
        />
      </div>
    </div>
  );
};

export default Homepage;