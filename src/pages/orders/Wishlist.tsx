import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "@/card/Card";
import { WishData } from "./api";

interface WishItem {
  id: number;
  product: {
    id: number;
    name: string;
    image1: string;
    price: number;
    undiscounted_price: number;
  };
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const data = await WishData();
        setWishlistItems(data);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        setError("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) {
    return <p className="p-10 text-center">Loading wishlist...</p>;
  }

  if (error) {
    return <p className="p-10 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mt-8 md:mt-0 p-4 sm:p-14">
      <h2 className="text-3xl font-semibold capitalize tracking mb-4 sm:mb-8">
        Wishlist
      </h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-medium text-gray-600 mb-4">
            No Items In Wishlist
          </h2>
          <Link
            to="/products"
            className="inline-block bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 transition-colors"
          >
            Continue Browsing Our Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8 md:space-x-8 space-x-0 sm:mb-16">
          {wishlistItems.map((item) => (
            <Card
              key={item.product.id}
              product={item.product}
              isInitiallyLiked={true}
              wishItemId={item.id}
              removeOnUnlike={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
