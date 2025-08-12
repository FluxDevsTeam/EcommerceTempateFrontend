// types.tsx
export interface Product {
  id: number;
  name: string;
  image1: string;
  price: number;
  undiscounted_price: number;
}

interface WishProduct {
  id: number;
  name: string;
  image1: string;
  undiscounted_price: number;
  price: number;
  sub_category?: SubCategory | null;
  unlimited?: boolean; // Added
}

export interface WishItem {
  id: number;
  product: WishProduct;
  date: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface SubCategory {
  id: number;
  name: string;
  category: Category;
}

export interface CardProps {
  product: {
    id: number;
    name: string;
    description: string;
    total_quantity: number;
    sub_category: SubCategory;
    colour: string;
    image1: string;
    image2: string | null;
    image3: string | null;
    undiscounted_price: number;
    price: number;
    is_available: boolean;
    latest_item: boolean;
    latest_item_position: number;
    dimensional_size: string;
    weight: string;
    top_selling_items: boolean;
    top_selling_position: number;
    date_created: string;
    date_updated: string;
  };
  isInitiallyLiked?: boolean;
  wishItemId?: number;
  removeOnUnlike?: boolean;
  isSuggested?: boolean;
  onItemClick: any;
}