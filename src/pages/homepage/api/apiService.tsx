import { ProductAPIResponse } from "../types/data-types";


export const fetchProducts = async () :Promise<ProductAPIResponse>   => {
    const res = await fetch('https://ecommercetemplate.pythonanywhere.com/api/v1/product/item/homepage/');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };