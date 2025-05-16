import ImageGrid from "./components/ImageGrid";
import TopSelling from "./components/TopSelling";
import ImageSlider from "./components/ImageSlider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "./api/apiService";
import { WishData } from "@/card/wishListApi";
import { WishItem } from "@/card/types";
import { ProductAPIResponse, ProductItem } from "./types/data-types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import banner from '/images/banner.png';

const Homepage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [latestItems, setLatestItems] = useState<ProductItem[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
const [currentTopSellingPage, setCurrentTopSellingPage] = useState(1);
const [topSellingItems, setTopSellingItems] = useState<ProductItem[]>([]);
const [hasMoreTopSellingItems, setHasMoreTopSellingItems] = useState(true);
const [isLoadingMoreTopSelling, setIsLoadingMoreTopSelling] = useState(false);


  
  const queryClient = useQueryClient();

  // Initial products fetch
  const { data, isLoading, isError } = useQuery<ProductAPIResponse>({
    queryKey: ['products', 1],
    queryFn: () => fetchProducts(1),
    onSuccess: (data) => {
      if (data?.latest_items?.results) {
        setLatestItems(data.latest_items.results);
        setHasMoreItems(data.latest_items.results.length === 16);
      }
       if (data?.top_selling_items?.results) {
    setTopSellingItems(data.top_selling_items.results);
    setHasMoreTopSellingItems(data.top_selling_items.results.length === 16);
  }
    }
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

  // Make sure latestItems is populated from data if it's empty
  useEffect(() => {
    if (data?.latest_items?.results && latestItems.length === 0) {
      setLatestItems(data.latest_items.results);
      setHasMoreItems(data.latest_items.results.length === 16);
    }
     if (data?.top_selling_items?.results && topSellingItems.length === 0) {
      setTopSellingItems(data.top_selling_items.results);
      setHasMoreItems(data.top_selling_items.results.length === 16);
    }
  }, [data, latestItems.length , topSellingItems.length] );

 
  // Function to load more items
  const loadMoreItems = async () => {
    if (!hasMoreItems || isLoadingMore) return;
    
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    
    try {
      const newData = await fetchProducts(nextPage);
      if (newData?.latest_items?.results) {
        setLatestItems(prevItems => [...prevItems, ...newData.latest_items.results]);
        setHasMoreItems(newData.latest_items.results.length === 16);
        setCurrentPage(nextPage);
        queryClient.setQueryData(['products', nextPage], newData);
      } else {
        setHasMoreItems(false);
      }
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreTopSellingItems = async () => {
  if (!hasMoreTopSellingItems || isLoadingMoreTopSelling) return;
  
  setIsLoadingMoreTopSelling(true);
  const nextPage = currentTopSellingPage + 1;
  
  try {
    const newData = await fetchProducts(nextPage);
    if (newData?.top_selling_items?.results) {
      setTopSellingItems(prevItems => [...prevItems, ...newData.top_selling_items.results]);
      setHasMoreTopSellingItems(newData.top_selling_items.results.length === 16);
      setCurrentTopSellingPage(nextPage);
      queryClient.setQueryData(['products', nextPage], newData);
    } else {
      setHasMoreTopSellingItems(false);
    }
  } catch (error) {
    console.error('Error loading more top selling items:', error);
  } finally {
    setIsLoadingMoreTopSelling(false);
  }
};


  if (isLoading || wishlistLoading) return (
    <div className="flex justify-center items-center py-10 text-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
      Loading...
    </div>
  );
  
  if (isError) return <div className="text-center py-10 text-red-500">Error loading data. Please try again.</div>;

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

        <div className="flex flex-col items-center text-center md:text-left md:items-start space-y-2 pt-3 md:pt-6 px-4 md:px-0">
          <h1 className='text-xl md:text-6xl font-bold leading-tight lg:leading-[63px] text-black'>
            Shop Smarter, Live Better - Find What You Love
          </h1>
          <p className='text-[#000000] font-medium text-base md:text-lg '>
            Access exclusive deals, track orders and enjoy a seamless shopping experience
          </p>
          <Link to='/shoe-category'>
            <button className="bg-customBlue text-white border rounded-full px-6 py-3 w-auto md:w-[210px] hover:brightness-90 transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
        
        <div className="hidden md:block flex justify-center lg:justify-end">
          <img 
            src={banner} 
            alt="Banner image" 
            className="w-full max-w-[280px] sm:max-w-xs md:max-w-md lg:max-w-lg object-contain"
          />
        </div>
      </div>

      {/* Content Sections */}
      <div className="md:mt-3 md:space-y-10">
        {latestItems.length > 0 && (
          <ImageGrid 
            product={latestItems} 
            getWishlistInfo={getWishlistInfo}
            hasMoreItems={hasMoreItems}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMoreItems}
          />
        )}
        {topSellingItems.length > 0 && (
  <TopSelling 
    product={topSellingItems} 
    getWishlistInfo={getWishlistInfo}
    hasMoreItems={hasMoreTopSellingItems}
    isLoadingMore={isLoadingMoreTopSelling}
    onLoadMore={loadMoreTopSellingItems}
  />
)}
        
   <ImageSlider 
    data={latestItems} 
          />
    
      </div>
    </div>
  );
};

export default Homepage;