import { useEffect, useState } from 'react';
import Card from './Card';
import { WishData } from '../pages/orders/api'; // Corrected import for WishData
import type { WishItem as ApiWishItem } from '../pages/orders/types'; // Corrected import for WishItem type, aliased
// import type { ProductItem } from './types'; // Removed as ProductItem is not exported from ./types.tsx

// Define a product type that matches the structure expected by CardProps.product
interface ProductForCard {
  id: number;
  name: string;
  description: string;
  total_quantity: number;
  sub_category: any; // Replace 'any' with a more specific SubCategory type if available and needed
  colour: string;
  image1: string;
  image2: string | null;
  image3: string | null;
  undiscounted_price: number;
  price: number;
  is_available: boolean;
  latest_item: boolean;
  latest_item_position: number;
  dimensional_size: string;
  weight: string;
  top_selling_items: boolean;
  top_selling_position: number;
  date_created: string;
  date_updated: string;
}

const Producter = () => {
  const [products, setProducts] = useState<ProductForCard[]>([]); // Use ProductForCard
  const [wishlistItems, setWishlistItems] = useState<ApiWishItem[]>([]); // Use imported ApiWishItem
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, wishlistRes] = await Promise.all([
          fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/').then(res => res.json()), // Ensure res.json() is called here
          WishData()
        ]);

        // Assuming productData.results matches ProductForCard structure
        setProducts(productRes.results as ProductForCard[]); 

        setWishlistItems(wishlistRes);
      } catch (err) {
        
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
              onItemClick={() => {}} // Added dummy onItemClick to satisfy CardProps
            />
          );
        })}
      </div>
    </div>
  );
};

export default Producter;
