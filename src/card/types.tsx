// types.ts
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
  undiscounted_price: number,
  price: number;
}

export interface WishItem {
  id: number;
  product: WishProduct;
  date: string;
}

export interface CardProps {
  product: {
    id: number;
    name: string;
    image1: string;
    price: number;
    undiscounted_price: number;
  };
  isInitiallyLiked: boolean;
  wishItemId?: number;
  removeOnUnlike?: boolean;
}