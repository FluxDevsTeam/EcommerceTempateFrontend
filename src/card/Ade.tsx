import { useEffect, useState } from 'react';
import Card from './Card';
import { WishData } from './wishListApi'; // Import your wishlist fetch function

interface Product {
  id: number;
  name: string;
  image1: string;
  price: number;
  undiscounted_price: number;
}

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

const Producter = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, wishlistRes] = await Promise.all([
          fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/'),
          WishData()
        ]);

        const productData = await productRes.json();
        setProducts(productData.results);

        setWishlistItems(wishlistRes);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading products...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-14">
      <h2 className="text-[32px] sm:text-[40px] font-normal mb-4 sm:mb-8">All Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
        {products.map(product => {
          const matchedWish = wishlistItems.find(item => item.product.id === product.id);

          return (
            <Card
              key={product.id}
              product={product}
              isInitiallyLiked={!!matchedWish}
              wishItemId={matchedWish?.id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Producter;
