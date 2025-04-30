interface Category {
  name: string;
  slug: string;
}

interface SubCategory {
  name: string;
  slug: string;
}

export interface Product {
  id: number;
discounted_price: string;
  name: string;
  description: string;
  discount: boolean;
  colour: string[];
  size: string[] | number[];
  price: string;
  slug: string;
  inventory: number;
  top_deal: boolean;
  image1: string;
  image2: string;
  image3: string;
  category: Category;
  subcategory: SubCategory;
}