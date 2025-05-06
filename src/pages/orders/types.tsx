// types.ts
export interface Product {
    id: number;
    name: string;
    image1: string;
    price: number;
    undiscounted_price: number;
  }
  
  export interface OrderItem {
    id: number;
    name: string;
    size: string;
    description: string;
    colour: string;
    image1: string;
    price: string;
    quantity: number;
    product: Product;
  }
  
  export interface OrderData {
    id: string;
    user: number;
    order_date: string;
    status: string;
    delivery_fee: string;
    first_name: string;
    last_name: string;
    email: string;
    state: string;
    city: string;
    delivery_address: string;
    phone_number: string;
    delivery_date: string | null;
    estimated_delivery: string;
    order_items: OrderItem[];
  } 

  interface WishProduct {
    id: number;
    name: string;
    image1: string;
    undiscounted_price: number;
    price: number;
  }
  
  export interface WishItem {
    id: number;
    product: WishProduct;
    date: string;
  }
  