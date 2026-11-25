export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  category_id: string | null;
  collection_id: string | null;
  images: string[];
  available_sizes: string[];
  available_colors: string[];
  stock_quantity: number;
  featured: boolean;
  bestseller: boolean;
  status: "active" | "draft" | "archived";
  created_at: string;
  // joined
  category?: Category | null;
  collection?: Collection | null;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
};

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  banner_url: string | null;
  status: "active" | "draft";
};

export type Customer = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  customer_id: string | null;
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  payment_status: "pending" | "paid" | "failed" | "refunded";
  order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  created_at: string;
  items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  unit_price: number;
};

export type Review = {
  id: string;
  customer_id: string | null;
  product_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  author?: string;
};

export type NewsletterSubscriber = {
  id: string;
  email: string;
  created_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
  size: string | null;
  color: string | null;
};
