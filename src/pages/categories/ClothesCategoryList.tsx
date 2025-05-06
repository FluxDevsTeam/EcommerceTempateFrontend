import { useQuery } from '@tanstack/react-query';
import Card from '@/card/Card';



interface ClothesCategoryListProps {
  selectedOption: string;
}

// Define your types
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

// Fetch function
const fetchCategory = async (): Promise<ApiResponse> => {
  const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?category=1');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const ClothesCategoryList = ({ selectedOption }: ClothesCategoryListProps) => {

  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['category'],
    queryFn: fetchCategory
  });

  if (isLoading) return <div className="flex justify-center items-center py-10 text-lg">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
    Loading results...
  </div>;

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No category data found</div>;

  // Apply sorting here
  const sortedResults = [...data.results]; // clone the results

  if (selectedOption === 'Highest price') {
    sortedResults.sort((a, b) => parseFloat(b.discounted_price) - parseFloat(a.discounted_price));
  } else if (selectedOption === 'Lowest price') {
    sortedResults.sort((a, b) => parseFloat(a.discounted_price) - parseFloat(b.discounted_price));
  } else if (selectedOption === 'Latest items') {
    sortedResults.sort((a, b) => b.id - a.id); // assuming latest = highest id
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 my-8 sm:mb-16">
      {sortedResults.map((item) => (
            <Card key={item.id} product={item} />
          ))}
    </div>
  );
};

export default ClothesCategoryList;
