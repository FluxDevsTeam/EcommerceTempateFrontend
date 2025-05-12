export interface Category {
    id: number;
    name: string;
  }
  
  export interface SubCategory {
    id: number;
    name: string;
    category: Category;
  }
  
  export interface ProductItem {
    id: number;
    name: string;
    description: string;
    total_quantity: number;
    sub_category: SubCategory;
    colour: string;
    image1: string;
    image2: string | null;
    image3: string | null;
    undiscounted_price: string;
    price: string;
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
  
  export interface ProductItemsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductItem[];
  }
  
  export interface ProductAPIResponse {
    latest_items: ProductItemsResponse;
    top_selling_items: ProductItemsResponse;
  }
  