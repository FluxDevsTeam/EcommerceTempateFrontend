import { ProductItem } from "../types/data-types";
import { Link } from "react-router-dom";
import Card from "@/card/Card";

interface LatestItemsProps {
  product: ProductItem[];
  getWishlistInfo: (productId: number) => {
    isInitiallyLiked: boolean;
    wishItemId?: number;
  };
}

const ImageGrid: React.FC<LatestItemsProps> = ({ product, getWishlistInfo }) => {
  return (
    <div className="px-3 py-8 md:py-12 space-y-5">
      <p className="text-3xl md:text-5xl font-medium leading-tight text-center mb-6 sm:mb-8 md:mb-10">
        Latest Items
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 md:space-x-8 space-x-0 mb-8 sm:mb-16">
        {product.map((item) => {
          const wishlistInfo = getWishlistInfo(item.id);
          return (
            <Card
              key={item.id}
              product={item}
              isInitiallyLiked={wishlistInfo.isInitiallyLiked}
              wishItemId={wishlistInfo.wishItemId}
            />
          );
        })}
      </div>

      <div className="flex justify-center items-center mt-6 sm:mt-8">
        <Link to='/categories'>
          <button className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors duration-200 border-b-2 border-transparent hover:border-primary">
            View All
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ImageGrid;