import ImageGrid from "../homepage/components/ImageGrid";
import TopSelling from "../homepage/components/TopSelling";
import ImageSlider from "../homepage/components/ImageSlider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProducts, fetchSliderItems } from "../homepage/api/apiService";
import { WishData } from "../orders/api";
import type { WishItem } from "../orders/types";

import { ProductAPIResponse, ProductItem } from "../homepage/types/data-types";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import banner from "/images/banner.png";

const getPageSize = () => (window.innerWidth < 768 ? 10 : 12); // md breakpoint

const Homepage = () => {
  const [pageSize, setPageSize] = useState(getPageSize());
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
  const [sliderItems, setSliderItems] = useState<ProductItem[]>([]);
  const [sliderLoading, setSliderLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const handleResize = () => {
      setPageSize(getPageSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect to reset state when pageSize changes
  useEffect(() => {
    setCurrentPage(1);
    setLatestItems([]);
    // setHasMoreItems(true); // Will be set by the data effect below

    setCurrentTopSellingPage(1);
    setTopSellingItems([]);
    // setHasMoreTopSellingItems(true); // Will be set by the data effect below

    // useQuery will refetch automatically as pageSize is in its queryKey.
    // The effect below will then process the new 'data' for page 1.
  }, [pageSize]);

  const { data, isLoading, isError } = useQuery<ProductAPIResponse, Error>({
    queryKey: ["products", 1, pageSize],
    queryFn: () => fetchProducts(1, pageSize),
    enabled: !!pageSize, // Ensure pageSize is determined before fetching
  });

  // Effect to process fetched data from useQuery (primarily for page 1)
  useEffect(() => {
    if (data) {
      // Handle Latest Items from page 1 data
      if (currentPage === 1) {
        if (data.latest_items?.results) {
          setLatestItems(data.latest_items.results);
          setHasMoreItems(!!data.latest_items.next);
        } else {
          setLatestItems([]);
          setHasMoreItems(false);
        }
      }

      // Handle Top Selling Items from page 1 data
      if (currentTopSellingPage === 1) {
        if (data.top_selling_items?.results) {
          setTopSellingItems(data.top_selling_items.results);
          setHasMoreTopSellingItems(!!data.top_selling_items.next);
        } else {
          setTopSellingItems([]);
          setHasMoreTopSellingItems(false);
        }
      }
    }
  }, [data, currentPage, currentTopSellingPage]); // Dependencies updated

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistRes = await WishData();
        setWishlistItems(wishlistRes.results);
      } catch (err) {
      } finally {
        setWishlistLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // Add new effect for slider data
  useEffect(() => {
    const loadSliderData = async () => {
      try {
        const data = await fetchSliderItems();
        if (data?.results) {
          setSliderItems(data.results);
        }
      } catch (error) {
        console.error('Error fetching slider items:', error);
      } finally {
        setSliderLoading(false);
      }
    };

    loadSliderData();
  }, []);

  // Function to load more items
  const loadMoreItems = async () => {
    if (!hasMoreItems || isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const newData = await fetchProducts(nextPage, pageSize);
      if (newData?.latest_items?.results) {
        setLatestItems((prevItems) => [
          ...prevItems,
          ...newData.latest_items.results,
        ]);
        setHasMoreItems(!!newData.latest_items?.next);
        setCurrentPage(nextPage);
        queryClient.setQueryData(["products", nextPage, pageSize], newData);
      } else {
        setHasMoreItems(false);
      }
    } catch (error) {
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreTopSellingItems = async () => {
    if (!hasMoreTopSellingItems || isLoadingMoreTopSelling) return;

    setIsLoadingMoreTopSelling(true);
    const nextPage = currentTopSellingPage + 1;

    try {
      const newData = await fetchProducts(nextPage, pageSize);
      if (newData?.top_selling_items?.results) {
        setTopSellingItems((prevItems) => [
          ...prevItems,
          ...newData.top_selling_items.results,
        ]);
        setHasMoreTopSellingItems(!!newData.top_selling_items?.next);
        setCurrentTopSellingPage(nextPage);
        queryClient.setQueryData(["products", nextPage, pageSize], newData);
      } else {
        setHasMoreTopSellingItems(false);
      }
    } catch (error) {
    } finally {
      setIsLoadingMoreTopSelling(false);
    }
  };

  useEffect(() => {}, [isLoading, wishlistLoading]);

  useEffect(() => {
    if (!isLoading && !wishlistLoading) {
    }
  }, [isLoading, wishlistLoading, latestItems, topSellingItems]);

  if (isLoading || wishlistLoading || sliderLoading) {
    return (
      <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading data. Please try again.
      </div>
    );
  }

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
      <div className="flex flex-col md:grid md:grid-cols-2 gap-8 lg:gap-12 container mx-auto mb-4 mt-8 md:mt-8 md:place-items-center">
        <div className="w-full md:col-start-2 md:row-start-1 flex items-center justify-center">
          <div className="relative w-full flex justify-center overflow-hidden">
            <img
              src={banner}
              alt="Banner image"
              className="w-full max-w-[320px] sm:max-w-xs lg:max-w-md object-contain mx-auto"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Link to="/new-arrivals">
                <button className="bg-customBlue text-white text-sm md:text-base font-medium rounded-md px-8 py-3 hover:brightness-90 transition-all duration-300 shadow-lg hover:shadow-xl opacity-70 animate-pulse">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center space-y-4 md:space-y-6 max-w-xl w-full px-2 md:px-0 md:col-start-1">
          <div className="w-full space-y-3 md:space-y-4 lg:space-y-6 text-center md:text-left">
            <h1 className="text-[22px] font-bold leading-[1.3] tracking-[-0.02em] sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 px-3 md:px-0">
              <span className="block mb-1">
                Furnish with Fun, Discover What Your Little Ones Love!
              </span>
            </h1>
            <p className="hidden md:block text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-[90%] mx-auto md:mx-0">
              Exclusive Deals. Stress-Free Shopping for Your Kids' Perfect
              Space.
            </p>
          </div>
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
        <ImageSlider data={sliderItems} />
        {topSellingItems.length > 0 && (
          <TopSelling
            product={topSellingItems}
            getWishlistInfo={getWishlistInfo}
            hasMoreItems={hasMoreTopSellingItems}
            isLoadingMore={isLoadingMoreTopSelling}
            onLoadMore={loadMoreTopSellingItems}
          />
        )}
      </div>
    </div>
  );
};

export default Homepage;
