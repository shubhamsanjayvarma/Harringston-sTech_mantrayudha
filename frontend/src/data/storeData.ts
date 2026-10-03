import { Product, Order, Customer, Review, SupportTicket, StorePolicy, DeliveryLocation } from '../types';
import productsData from './products.json';
import customersData from './customers.json';
import ordersData from './orders.json';
import reviewsData from './reviews.json';
import ticketsData from './supportTickets.json';
import policiesData from './policies.json';

// All 300 products loaded from products.csv
export const ALL_PRODUCTS: Product[] = productsData as Product[];

// Featured & Popular items across key tech categories for homepage
export const POPULAR_PRODUCTS: Product[] = ALL_PRODUCTS.filter((p) => p.isPopular).slice(0, 12);

// Unique categories list
export const CATEGORIES: string[] = [
  'Laptops',
  'Smartphones',
  'Headphones',
  'Earbuds',
  'Smartwatches',
  'Speakers',
  'Monitors',
  'Gaming',
  'Keyboards',
  'Mice',
  'Cameras',
  'Tablets',
  'Accessories',
  'Networking',
];

// Active Customer (Ravi Ali, CUST-00001 from customers.csv)
export const CURRENT_CUSTOMER: Customer = (customersData as Customer[])[0] || {
  customerId: 'CUST-00001',
  firstName: 'Ravi',
  lastName: 'Ali',
  name: 'Ravi Ali',
  email: 'ravi.ali@webmail.example',
  phone: '+91 80008 44305',
  gender: 'male',
  dateOfBirth: '1981-04-26',
  city: 'Noida',
  state: 'Uttar Pradesh',
  pincode: '201451',
  address: 'Flat 273, Celestial Apartments, 12th Main, Industrial Estate',
  customerSince: '2019-01-21',
  customerSegment: 'regular',
  accountStatus: 'active',
  preferredLanguage: 'Hinglish',
  totalOrders: 4,
  totalSpend: 24778,
  loyaltyTier: 'bronze',
};

export const ALL_CUSTOMERS: Customer[] = customersData as Customer[];

// All loaded orders and current customer's orders
export const ALL_ORDERS: Order[] = ordersData as Order[];
export const CURRENT_CUSTOMER_ORDERS: Order[] = ALL_ORDERS.filter(
  (o) => o.customerId === CURRENT_CUSTOMER.customerId
);

// Reviews dictionary
export const REVIEWS_BY_PRODUCT: Record<string, Review[]> = reviewsData as Record<string, Review[]>;

// Support tickets
export const ALL_SUPPORT_TICKETS: SupportTicket[] = ticketsData as SupportTicket[];
export const CURRENT_CUSTOMER_TICKETS: SupportTicket[] = ALL_SUPPORT_TICKETS.filter(
  (t) => t.customerId === CURRENT_CUSTOMER.customerId
);

// Policies
export const STORE_POLICIES: StorePolicy[] = policiesData as StorePolicy[];

// Delivery locations for Bengaluru quick delivery
export const LOCATIONS: DeliveryLocation[] = [
  {
    id: 'indiranagar',
    area: 'Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    eta: '10 mins',
  },
  {
    id: 'koramangala',
    area: 'Koramangala',
    city: 'Bengaluru',
    pincode: '560034',
    eta: '12 mins',
  },
  {
    id: 'hsr-layout',
    area: 'HSR Layout',
    city: 'Bengaluru',
    pincode: '560102',
    eta: '15 mins',
  },
  {
    id: 'whitefield',
    area: 'Whitefield',
    city: 'Bengaluru',
    pincode: '560066',
    eta: '18 mins',
  },
  {
    id: 'jayanagar',
    area: 'Jayanagar',
    city: 'Bengaluru',
    pincode: '560011',
    eta: '15 mins',
  },
  {
    id: 'sadashivanagar',
    area: 'Sadashivanagar',
    city: 'Bengaluru',
    pincode: '560080',
    eta: '14 mins',
  },
];

// Helper Functions
export function getProductById(id: string): Product | undefined {
  return ALL_PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  if (!category || category === 'All' || category === 'All Tech') {
    return ALL_PRODUCTS;
  }
  return ALL_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ALL_PRODUCTS.filter((p) => {
    return (
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  });
}

export function getReviewsForProduct(productId: string): Review[] {
  return REVIEWS_BY_PRODUCT[productId] || [];
}

export function getPolicy(id: string): StorePolicy | undefined {
  return STORE_POLICIES.find(
    (p) => p.id.toLowerCase() === id.toLowerCase() || p.filename.toLowerCase().includes(id.toLowerCase())
  );
}
