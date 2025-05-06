import { useEffect, useState } from 'react';
import Card from '@/card/Card'; // adjust this import if needed

interface Product {
  id: number;
  name: string;
  image1: string;
  price: number;
  undiscounted_price: number;
}

const Producter = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/');
        const data = await response.json();
        setProducts(data.results); // If paginated
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="p-10 text-center">Loading products...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-14">
      <h2 className="text-[32px] sm:text-[40px] font-normal mb-4 sm:mb-8">All Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
        {products.map(product => (
          <Card
            key={product.id}
            product={product}
            isInitiallyLiked={false}
          />
        ))}
      </div>
    </div>
  );
};

export default Producter;
