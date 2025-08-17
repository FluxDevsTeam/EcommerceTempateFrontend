import { ProductAPIResponse } from "@/pages/homepage/types/data-types";


export const fetchProducts = async () :Promise<ProductAPIResponse>   => {
    const res = await fetch('https://api.fluxdevs.com/api/v1/product/category/');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

//   // apiService.tsx
// import { ProductAPIResponse, ProductItemsResponse } from "../types/data-types";
// import { Product } from "@/card/types";

// export const fetchProducts = async (page = 1, pageSize = 12): Promise<ProductAPIResponse> => {
//   try {
//     const res = await fetch(
//       `https://api.fluxdevs.com/api/v1/product/item/homepage/?page=${page}&page_size=${pageSize}&latest_item=true&top_selling_items=true`
//     );
    
//     if (!res.ok) {
//       console.error('API Error:', res.status, res.statusText);
//       throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
//     }
    
//     const data = await res.json();

//     return data;
//   } catch (error) {
//     console.error('Fetch error:', error);
//     throw error;
//   }
// };

// export const fetchSuggestedProducts = async (): Promise<ProductItemsResponse> => {
//   const res = await fetch('https://api.fluxdevs.com/api/v1/product/item/suggestions/');
//   if (!res.ok) throw new Error('Failed to fetch');
//   return res.json();
// };

// // Added overload with query parameters
// export const fetchSuggestedProducts = async (
//   subCategoryId?: number,
//   secondSubCategoryId?: number,
//   excludeProductIds: number[] = []
// ): Promise<ProductItemsResponse> => {
//   try {
//     const params = new URLSearchParams();
//     if (subCategoryId) {
//       params.append('sub_category_id', subCategoryId.toString());
//     }
//     if (secondSubCategoryId) {
//       params.append('second_sub_category_id', secondSubCategoryId.toString());
//     }
//     const url = `https://api.fluxdevs.com/api/v1/product/item/suggestions/?${params.toString()}`;

//     const res = await fetch(url, {
//       headers: {
//         'Authorization': `JWT ${localStorage.getItem('accessToken') || ''}`,
//         'Content-Type': 'application/json',
//       },
//     });
//     if (!res.ok) throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
//     const data: ProductItemsResponse = await res.json();
//     const mappedResults: Product[] = data.results.map((item) => ({
//       id: item.id,
//       name: item.name,
//       image1: item.image,
//       price: parseFloat(item.price),
//       undiscounted_price: item.undiscounted_price ? parseFloat(item.undiscounted_price) : parseFloat(item.price),
//     }));
//     return {
//       ...data,
//       results: mappedResults.filter(product => !excludeProductIds.includes(product.id)),
//     };
//   } catch (error) {
//     console.error('Error fetching suggested products:', error);
//     throw error;
//   }
// };

// export const fetchSuggestedProductsDetails = async (subCategoryId: any) => {
//   try {
//     const response = await fetch(
//       `https://api.fluxdevs.com/api/v1/product/item/suggestions/?sub_category_id=${subCategoryId}`
//     );
//     if (!response.ok) {
//       throw new Error('Failed to fetch suggested products');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching suggested products:', error);
//     throw error;
//   }
// };