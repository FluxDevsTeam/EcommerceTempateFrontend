import { useState } from 'react';

// Interfaces
export interface Category {
  id: number;
  name: string;
}

export interface SubCategory {
  id: number;
  category: Category;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  total_quantity: number;
  sub_category: SubCategory;
  colour: string;
  image1: string;
  image2: string | null;
  image3: string | null;
  discounted_price: string | null;
  price: string;
  is_available: boolean;
  latest_item: boolean;
  latest_item_position: number | null;
  dimensional_size: string | null;
  weight: string | null;
  top_selling_items: boolean;
  top_selling_position: number | null;
  date_created: string;
  date_updated: string;
  production_days: number;
  unlimited: boolean;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export const baseURL = 'https://api.fluxdevs.com';

// Utility Functions
export const buildQueryParams = (params: Record<string, string>) => {
  return new URLSearchParams(
    Object.entries(params).filter(([_, value]) => value !== '')
  ).toString();
};

export const getStatusColor = (product: Product) => {
  if (!product.is_available) return "text-gray-600 bg-gray-50";
  if (product.unlimited || product.total_quantity > 0) return "text-green-600 bg-green-50";
  return "text-orange-600 bg-orange-50";
};

export const getStatusText = (product: Product) => {
  if (!product.is_available) return "Unavailable";
  if (product.unlimited || product.total_quantity > 0) return "Available";
  return "Out of Stock";
};

export const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    
    return "Invalid Date";
  }
};

// API Functions
export const fetchProducts = async (
  searchQuery: string,
  page: number,
  itemsPerPage: number,
  filters: any
) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Authentication required");

  const params = buildQueryParams({
    page: String(page),
    page_size: String(itemsPerPage),
    ...filters
  });

  const url = searchQuery
    ? `${baseURL}/api/v1/product/item/search/?search=${encodeURIComponent(searchQuery)}&${params}`
    : `${baseURL}/api/v1/product/item/?${params}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `JWT ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch products");
  
  return response.json();
};

export const fetchCategories = async () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Authentication required");

  const response = await fetch(`${baseURL}/api/v1/product/sub-category/`, {
    headers: {
      Authorization: `JWT ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch categories");
  
  return response.json();
};

export const deleteProduct = async (productId: number) => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) throw new Error("Authentication required");

  const response = await fetch(`${baseURL}/api/v1/product/item/${productId}/`, {
    method: "DELETE",
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
  });

  if (!response.ok) throw new Error("Failed to delete product");
};
