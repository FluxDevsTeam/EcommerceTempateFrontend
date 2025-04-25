import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

// Define TypeScript interfaces for the API response
interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category: number; // This is just the ID, not the full category object
  name: string;
}

interface CategoryResponse {
  id: number;
  name: string;
  sub_categories: SubCategory[];
}

const fetchCategory = async (): Promise<CategoryResponse> => {
  const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/1/');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const ClothesCategoryList = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery<CategoryResponse>({
    queryKey: ['category'],
    queryFn: fetchCategory
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No category data found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">{data.name} Categories</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {data.sub_categories?.length ? (
          data.sub_categories.map((subCategory) => (
            <div
              key={subCategory.id}
              className="group hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer p-4 border border-gray-200"
              onClick={() => navigate(`/products?subcategory=${subCategory.id}`)}
            >
              <div className="bg-[#F0EEED] rounded-lg p-6 flex items-center justify-center mb-3">
                <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              </div>
              <h3 className="text-center font-medium text-gray-800">
                {subCategory.name}
              </h3>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            No subcategories available
          </div>
        )}
      </div>
    </div>
  );
};

export default ClothesCategoryList 