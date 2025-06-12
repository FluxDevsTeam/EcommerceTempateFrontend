import { ProductItem } from "../types/data-types";
import Card from "@/card/Card";
import { useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

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

const ImageGrid: React.FC<LatestItemsProps> = ({ 
  product, 
  getWishlistInfo, 
  hasMoreItems,
  isLoadingMore,
  onLoadMore
}) => {
  // Auto-load more items when scrolling to bottom
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + document.documentElement.scrollTop + 100 >= 
  //       document.documentElement.offsetHeight && 
  //       hasMoreItems && 
  //       !isLoadingMore
  //     ) {
  //       onLoadMore();
  //     }
  //   };
  //
  //   window.addEventListener('scroll', handleScroll);
  //   return () => window.removeEventListener('scroll', handleScroll);
  // }, [hasMoreItems, isLoadingMore, onLoadMore]);

  const isTabletAndAbove = useMediaQuery({ query: '(min-width: 768px)' });

  return (
    <div className="px-3 py-6 md:py-12 space-y-5">
      <p className="text-xl pt-2 pb-0 md:text-3xl font-medium leading-tight text-center mb-6 sm:mb-0 md:mb-10">
        LATEST ITEMS
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8">
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

      <div className="flex justify-center items-center" style={{marginTop: isTabletAndAbove ? '46px' : "0px"}}>
        {hasMoreItems ? (
          <button 
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? (
              <span className="flex items-center">
                <span className="animate-spin w-4 border-b-2 border-primary rounded-full mr-2"></span>
                Loading...
              </span>
            ) : (
              <span>Load More...</span>
            )}
          </button>
        ) : (
          <p className="text-gray-500"></p>
        )}
      </div>
    </div>
  );
};

export default ImageGrid;