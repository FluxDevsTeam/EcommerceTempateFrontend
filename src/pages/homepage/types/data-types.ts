export interface Category {
    id: number;
    name: string;
  }
  
  export interface SubCategory {
    id: number;
    name: string;
    category: Category;
  }
 
  export interface ProductItemsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductItem[];
  }
  

  
  export interface ProductAPIResponse {
  latest_items: {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductItem[];
  };
  top_selling_items: {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductItem[];
  };
}

export interface ProductItem {
  id: number;
  name: string;
  slug: string;
  desc: string;
  price: string;
  image: string;
  category: string;
  created: string;
  updated: string;
  in_stock: boolean;
  is_active: boolean;
  // Add any other properties that might be in your ProductItem
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}