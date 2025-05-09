import { useQuery } from '@tanstack/react-query';
import Card from '@/card/Card';



interface ClothesCategoryListProps {
  selectedOption: string;
}

// Define your types
export interface Category {
  id: number;
  name: string;
}

export interface SubCategory {
  id: number;
  name: string;
  category: Category;
}

interface Product {
  id: number;
          name: string;
          image1: string;
          undiscounted_price: string;
          price: string;
          description: string;
          total_quantity: number;
          sub_category: SubCategory;
          colour: string;
          image2: string | null;
          image3: string | null;
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
    sortedResults.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  } else if (selectedOption === 'Lowest price') {
    sortedResults.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  } else if (selectedOption === 'Latest items') {
    sortedResults.sort((a, b) => b.id - a.id); // assuming latest = highest id
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 md:gap-8 md:my-8 sm:mb-16">
      {sortedResults.map((item) => (
            <Card key={item.id} product={item} />
          ))}
    </div>
  );
};

export default ClothesCategoryList;
