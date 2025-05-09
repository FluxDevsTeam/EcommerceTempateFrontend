import { ProductAPIResponse } from "../types/data-types";
import { ProductItemsResponse } from "../types/data-types";


export const fetchProducts = async () :Promise<ProductAPIResponse>   => {
    const res = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/homepage/');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  export const fetchSuggestedProducts = async () :Promise<ProductItemsResponse>   => {
    const res = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/suggestions/');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  export const fetchSuggestedProductsDetails = async (subCategoryId) => {
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