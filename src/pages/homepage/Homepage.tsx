import ImageGrid from "./components/ImageGrid";
import TopSelling from "./components/TopSelling";
import ImageSlider from "./components/ImageSlider";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "./api/apiService";
import { WishData } from "@/card/wishListApi"; // Import WishData
import { WishItem } from "@/card/types";
import { ProductAPIResponse } from "./types/data-types"; // Import WishItem type
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import banner from "/images/banner.png";

const Homepage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);

  // Fetch products
  const { data, isLoading, isError } = useQuery<ProductAPIResponse>({
    queryKey: ["myData"],
    queryFn: fetchProducts,
  });

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistRes = await WishData();
        setWishlistItems(wishlistRes);
      } catch (err) {
        console.error("Error loading wishlist:", err);
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (isLoading || wishlistLoading)
    return (
      <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
      </div>
    );

  if (isError) return <div>Error loading data.</div>;

  // Helper function to check if a product is in wishlist
  const getWishlistInfo = (productId: number) => {
    const matchedWish = wishlistItems.find(
      (item) => item.product.id === productId
    );
    return {
      isInitiallyLiked: !!matchedWish,
      wishItemId: matchedWish?.id,
    };
  };

  return (
    <div className="w-full min-h-full px-4 md:px-12 py-4 lg:px-28">
      {" "}
      {/* Hero Section */}{" "}
      
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 container mx-auto mb-6 mt-10 md:mt-6 md:place-items-center">
        {/* Image*/}
        <div className="w-full md:col-start-2 md:row-start-1 flex items-center justify-center">
          <div className="relative w-full flex justify-center">
            <img
              src={banner}
              alt="Banner image"
              className="w-full max-w-[280px] sm:max-w-xs lg:max-w-md object-contain mx-auto"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Link to="/shoe-category">
                <button className="bg-customBlue text-white rounded-full px-6 py-3 hover:brightness-90 transition-all duration-300">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Text Content*/}
        <div className="flex flex-col justify-center items-center md:items-center space-y-4 max-w-lg w-full px-4 md:col-start-1 ">
          <h1 className="text-xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Shop Smarter, Live Better - Find What You Love
          </h1>
          <p className="text-[#000000] font-medium text-sm md:text-base">
            Access exclusive deals, track orders and enjoy a seamless shopping
            experience
          </p>
        </div>
      </div>
      
      

      {/* Content Sections */}
      <div className="container mx-auto px-4 space-y-16 py-12">
        <ImageGrid
          product={data?.latest_items?.results ?? []}
          getWishlistInfo={getWishlistInfo}
        />
        <TopSelling
          product={data?.top_selling_items?.results ?? []}
          getWishlistInfo={getWishlistInfo}
        />
        <ImageSlider data={data?.latest_items?.results ?? []} />
      </div>
    </div>
  );
};

export default Homepage;
