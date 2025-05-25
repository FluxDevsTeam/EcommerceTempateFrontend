import { ProductAPIResponse } from "@/pages/homepage/types/data-types";


export const fetchProducts = async () :Promise<ProductAPIResponse>   => {
    const res = await fetch('http://kidsdesignecommerce.pythonanywhere.com/api/v1/product/category/');
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };