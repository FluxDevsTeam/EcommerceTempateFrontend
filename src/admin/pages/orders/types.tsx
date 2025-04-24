import { ReactNode } from "react";

// src/types.ts
export type Product = {
    image1: string;
  };

export type OrderItem = {
    name: string;
    price: string;
    quantity: number;
    product?: Product;  
  };
  
  export type Order = {
    phone_number: ReactNode;
    state: ReactNode;
    email: ReactNode;
    last_name: ReactNode;
    first_name: ReactNode;
    id: string;
    order_date: string;
    delivery_address: string;
    delivery_fee: string;
    order_items: OrderItem[];
    estimated_delivery: string;
    status: string;
  };
  
  export type Aggregate = {
    total_orders: number;
    returned_orders: number;
    delivered_orders: number;
  };