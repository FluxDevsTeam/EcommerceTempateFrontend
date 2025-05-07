// ShoeCategoryList.tsx
import { useQuery } from '@tanstack/react-query';
import Card from '@/card/Card';
// Types
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

// Props
interface ShoeCategoryListProps {
  selectedOption: string;
}

const fetchProducts = async (): Promise<ApiResponse> => {
  const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?category=2');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const ShoeCategoryList = ({ selectedOption }: ShoeCategoryListProps) => {
 
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return (
    <div className="flex justify-center items-center py-10 text-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
      Loading results...
    </div>
  );
  if (error) return <div>Error: {error.message}</div>;

  // Sort products based on selected option
  let sortedProducts = data?.results || [];
  
  if (selectedOption === 'Highest price') {
    sortedProducts = [...sortedProducts].sort((a, b) => parseFloat(b.discounted_price) - parseFloat(a.discounted_price));
  } else if (selectedOption === 'Lowest price') {
    sortedProducts = [...sortedProducts].sort((a, b) => parseFloat(a.discounted_price) - parseFloat(b.discounted_price));
  } else if (selectedOption === 'Latest items') {
    sortedProducts = [...sortedProducts].sort((a, b) => b.id - a.id); // Assuming newer items have higher ID
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 md:gap-8 md:my-8 sm:mb-16">
       {sortedProducts.map((item) => (
                 <Card key={item.id} product={item} />
               ))}
    </div>
  );
};

export default ShoeCategoryList;
