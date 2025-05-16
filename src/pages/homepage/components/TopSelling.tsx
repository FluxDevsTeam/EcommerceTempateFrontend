import { ProductItem } from "../types/data-types";
import Card from "@/card/Card";
import { useEffect } from "react";

interface LatestItemsProps {
  product: ProductItem[];
  getWishlistInfo: (productId: number) => {
    isInitiallyLiked: boolean;
    wishItemId?: number;
  };
  hasMoreItems: boolean;
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

const TopSelling: React.FC<LatestItemsProps> = ({ 
  product, 
  getWishlistInfo, 
  hasMoreItems,
  isLoadingMore,
  onLoadMore
}) => {
  // Auto-load more items when scrolling to bottom
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >= 
        document.documentElement.offsetHeight && 
        hasMoreItems && 
        !isLoadingMore
      ) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMoreItems, isLoadingMore, onLoadMore]);

  return (
    <div className="px-3 py-8 md:py-12 space-y-5">
      <p className="text-3xl md:text-5xl font-medium leading-tight text-center mb-6 sm:mb-8 md:mb-10">
        Top Selling Items
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 md:space-x-8 space-x-0 mb-8 sm:mb-16">
        {product.map((item) => {
          const wishlistInfo = getWishlistInfo(item.id);
          return (
            <Card
              key={`${item.id}-${wishlistInfo.wishItemId || 'no-wish'}`}
              product={item}
              isInitiallyLiked={wishlistInfo.isInitiallyLiked}
              wishItemId={wishlistInfo.wishItemId}
            />
          );
        })}
      </div>

      <div className="flex justify-center items-center mt-6 sm:mt-8">
        {hasMoreItems ? (
          <button 
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <span className="flex items-center">
                <span className="animate-spin h-4 w-4 border-b-2 border-primary rounded-full mr-2"></span>
                Loading...
              </span>
            ) : (
              "Load More"
            )}
          </button>
        ) : (
          <p className="text-gray-500">You've reached the end of products</p>
        )}
      </div>
    </div>
  );
};

export default TopSelling;