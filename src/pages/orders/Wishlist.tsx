import { useState, useEffect } from 'react';
import Wish from "./Wish"
import { WishData } from "./api";
import { WishItem } from './types';

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
    <div className='p-4 sm:p-14'>
      <h2 className="font-normal text-[32px] sm:text-[40px] tracking mb-8">Wishlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8 sm:mb-16">
        {wishlistItems.map((item) => (
          <div key={item.id} className='mb-10'>
            <div className="relative w-fit mb-4">
              <img
                src={item.product.image1}
                alt={item.product.name}
                className="rounded-2xl h-[300px]"
              />
              <Wish color="red" defaultLiked />
            </div>
            <p className="text-base sm:text-[20px] mb-2">{item.product.name}</p>
            <div className="flex gap-2 sm:gap-4">
              <span className="text-[20px] sm:text-[24px]">₦{item.product.price}</span>
              <span className="text-[20px] sm:text-[24px] text-[#00000066] line-through">
                ₦{item.product.discounted_price}
              </span>
              <span className="text-[#FF3333] bg-red-200 text-[10px] sm:text-[12px] flex justify-between items-center rounded-3xl py-0.5 px-3">
                -20%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;