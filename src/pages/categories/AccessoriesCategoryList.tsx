import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';

// Define TypeScript interfaces for the API response
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

const fetchAccessories = async (): Promise<ApiResponse> => {
  const response = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/?category=4');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const AccessoriesCategoryList = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery<ApiResponse>({
    queryKey: ['accessories'],
    queryFn: fetchAccessories
  });

  if (isLoading) return (
    <div className="flex justify-center items-center py-10 text-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mr-3"></div>
      Loading results...
    </div>
  );

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No accessories found</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8 sm:mb-16">
      {data.results.map((item) => {
        const price = parseFloat(item.price);
        const discountedPrice = parseFloat(item.discounted_price);
        const amountSaved = price - discountedPrice;

        return (
               <div
                            key={item.id}
                            className="group hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden cursor-pointer"
                            onClick={() =>
                              navigate(`/product/item/${item.id}`)
                            }
                          >
                            <div className="bg-[#F0EEED] rounded-lg p-14 relative">
                              <div>
                                <img
                                  src={item.image1}
                                  alt={item.name}
                                  className="w-full h-[150px]  shadow-lg   object-cover"
                                />
                                <button
                                  className="absolute top-2 right-2 text-gray-600 hover:text-red-500 p-2 transition-colors duration-200"
                                  aria-label="Add to favorites"
                                >
                                  <FaRegHeart size={15} />
                                </button>
                              </div>
                            </div>
              
                            <div className="p-3 sm:p-4">
                        <h3 className="text-xl uppercase leading-[100%] sm:text-lg font-normal text-gray-800 truncate">
                          {item.name}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
                          <span className="text-2xl sm:text-xl font-normal leading-[100%] text-primary">
                            NGN{discountedPrice.toFixed(0)}
                          </span>
                          <span className="text-gray-500 line-through text-2xl sm:text-xl ">
                            NGN{price.toFixed(0)}
                          </span>
                          <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs sm:text-sm">
                             NGN{amountSaved.toFixed(0)}
                          </span>
                        </div>
                      </div>
                          </div>
        );
      })}
    </div>
  );
};

export default AccessoriesCategoryList;
