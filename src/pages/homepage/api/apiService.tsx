import { ProductAPIResponse } from "../types/data-types";
import { ProductItemsResponse } from "../types/data-types";



export const fetchProducts = async (page = 1): Promise<ProductAPIResponse> => {
  try {
    const res = await fetch(
      `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/homepage/?page=${page}&page_size=16&latest_item=true&top_selling_items=true`
    );
    
    if (!res.ok) {
      console.error('API Error:', res.status, res.statusText);
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('API response data (page ' + page + '):', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};



  export const fetchSuggestedProducts = async () :Promise<ProductItemsResponse>   => {
    const res = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/suggestions/');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  export const fetchSuggestedProductsDetails = async (subCategoryId: any)=> {
    try {
      const response = await fetch(
        `https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/suggestions/?sub_category_id=${subCategoryId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch suggested products');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching suggested products:', error);
      throw error;
    }
  };