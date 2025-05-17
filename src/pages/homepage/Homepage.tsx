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
import banner from "/images/banner.png";

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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", 1],
    queryFn: () => fetchProducts(1),
    onSuccess: (data: unknown) => {
      const response = data as ProductAPIResponse; // Assert type
      if (response?.latest_items?.results) {
        setLatestItems(response.latest_items.results);
        setHasMoreItems(response.latest_items.results.length === 16);
      }
      if (response?.top_selling_items?.results) {
        setTopSellingItems(response.top_selling_items.results);
        setHasMoreTopSellingItems(
          response.top_selling_items.results.length === 16
        );
      }
    },
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

  // Make sure latestItems is populated from data if it's empty
  useEffect(() => {
    const latestResults = (data as any)?.latest_items?.results;
    const topSellingResults = (data as any)?.top_selling_items?.results;

    if (latestResults && latestItems.length === 0) {
      setLatestItems(latestResults);
      setHasMoreItems(latestResults.length === 16);
    }
    if (topSellingResults && topSellingItems.length === 0) {
      setTopSellingItems(topSellingResults);
      setHasMoreItems(topSellingResults.length === 16);
    }
  }, [data, latestItems.length, topSellingItems.length]);

  // Function to load more items
  const loadMoreItems = async () => {
    if (!hasMoreItems || isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      const newData = await fetchProducts(nextPage);
      if (newData?.latest_items?.results) {
        setLatestItems((prevItems) => [
          ...prevItems,
          ...newData.latest_items.results,
        ]);
        setHasMoreItems(newData.latest_items.results.length === 16);
        setCurrentPage(nextPage);
        queryClient.setQueryData(["products", nextPage], newData);
      } else {
        setHasMoreItems(false);
      }
    } catch (error) {
      console.error("Error loading more items:", error);
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
        setTopSellingItems((prevItems) => [
          ...prevItems,
          ...newData.top_selling_items.results,
        ]);
        setHasMoreTopSellingItems(
          newData.top_selling_items.results.length === 16
        );
        setCurrentTopSellingPage(nextPage);
        queryClient.setQueryData(["products", nextPage], newData);
      } else {
        setHasMoreTopSellingItems(false);
      }
    } catch (error) {
      console.error("Error loading more top selling items:", error);
    } finally {
      setIsLoadingMoreTopSelling(false);
    }
  };

  if (isLoading || wishlistLoading)
    return (
      <div className="flex justify-center items-center py-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading data. Please try again.
      </div>
    );

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
                <button className="bg-customBlue text-white rounded-md px-6 py-3 hover:brightness-90 transition-all duration-300 opacity-75">
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start space-y-4 max-w-lg w-full px-4 md:col-start-1">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold max-md:text-center">
            Kids Design Company,
          </h1>
          <p className="text-[#000000] font-medium text-sm md:text-base max-md:text-center">
            At Kids Design Company, we don’t just create beautiful spaces — we
            craft inspiring environments that nurture creativity, spark
            imagination, and shape the dreams and destinies of children.
          </p>
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

        <ImageSlider data={latestItems} />

        {/* ################### */}
        {/* <div className="container mx-auto px-4 space-y-16 py-12">
        <ImageGrid
          product={data?.latest_items?.results ?? []}
          getWishlistInfo={getWishlistInfo}
        />
        <TopSelling
          product={data?.top_selling_items?.results ?? []}
          getWishlistInfo={getWishlistInfo}
        />
        <ImageSlider data={data?.latest_items?.results ?? []} /> */}
        {/* ################## */}
      </div>
    </div>
  );
};

export default Homepage;
