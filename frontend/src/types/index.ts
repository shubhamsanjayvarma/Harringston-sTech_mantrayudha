export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  deliveryTime: string;
  image: string;
  category: 'Fresh' | 'Groceries' | 'Electronics' | 'Home' | 'Personal Care' | 'Offers';
  subCategory?: string;
  brand?: string;
  rating?: number;
  isPopular?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DeliveryLocation {
  id: string;
  area: string;
  city: string;
  pincode: string;
  eta: string;
}
