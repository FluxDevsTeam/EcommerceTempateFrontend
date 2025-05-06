import { useEffect, useState } from 'react';
import Card from '@/card/Card';
import { WishData } from './api';

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
        console.error('Failed to load wishlist:', err);
        setError('Failed to load wishlist.');
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
    <div className="-mt-10 p-4 sm:p-14">
      <h2 className="font-normal text-[32px] sm:text-[40px] tracking mb-4 sm:mb-8">Wishlist</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-16">
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
    </div>
  );
};

export default Wishlist;