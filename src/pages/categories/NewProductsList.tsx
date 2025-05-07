// NewProductsList.tsx
import { useQuery } from '@tanstack/react-query';
import Card from '@/card/Card';

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category: Category;
  name: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  discounted_price: string;
  total_quantity: number;
  sub_category: SubCategory;
  image1: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

interface NewProductsListProps {
  sortOption: string;
}

const fetchProducts = async (): Promise<ApiResponse> => {
  const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const NewProductsList = ({ sortOption }: NewProductsListProps) => {
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  if (isLoading) return <div className="flex justify-center items-center py-10 text-lg">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
    Loading results...
  </div>;

  if (error) return <div>Error: {error.message}</div>;

  // Copy and sort the products
  const sortedProducts = [...(data?.results || [])].sort((a, b) => {
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);

    if (sortOption === 'Highest price') {
      return priceB - priceA;
    } else if (sortOption === 'Lowest price') {
      return priceA - priceB;
    } else {
      // Latest items (assuming latest means higher ID)
      return b.id - a.id;
    }
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 md:gap-8 md:my-8 sm:mb-16">
     {sortedProducts.map((item) => (
            <Card key={item.id} product={item} />
          ))}
    </div>
  );
};

export default NewProductsList;
