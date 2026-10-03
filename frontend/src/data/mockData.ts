import { Product, DeliveryLocation } from '../types';

export const POPULAR_PRODUCTS: Product[] = [
  {
    id: 'strawberries',
    name: 'Strawberries',
    subtitle: '250 g',
    price: 99,
    originalPrice: 129,
    deliveryTime: '10 mins',
    image: '/assets/strawberries.jpg',
    category: 'Fresh',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'olive-oil',
    name: 'Extra virgin olive oil',
    subtitle: '500 ml',
    price: 499,
    originalPrice: 599,
    deliveryTime: '10 mins',
    image: '/assets/olive-oil.jpg',
    category: 'Groceries',
    rating: 4.9,
    isPopular: true
  },
  {
    id: 'headphones',
    name: 'Wireless headphones',
    subtitle: 'Noise cancellation',
    price: 4999,
    originalPrice: 6999,
    deliveryTime: '15 mins',
    image: '/assets/headphones.jpg',
    category: 'Electronics',
    rating: 4.7,
    isPopular: true
  },
  {
    id: 'air-fryer',
    name: 'Air fryer',
    subtitle: '4.2 L',
    price: 3999,
    originalPrice: 5499,
    deliveryTime: '15 mins',
    image: '/assets/air-fryer.jpg',
    category: 'Home',
    rating: 4.8,
    isPopular: true
  }
];

export const ALL_PRODUCTS: Product[] = [
  ...POPULAR_PRODUCTS,
  {
    id: 'avocados',
    name: 'Hass Avocados',
    subtitle: '2 pcs (approx. 300g)',
    price: 199,
    originalPrice: 249,
    deliveryTime: '10 mins',
    image: '/assets/strawberries.jpg',
    category: 'Fresh',
    rating: 4.6
  },
  {
    id: 'organic-honey',
    name: 'Wild Forest Raw Honey',
    subtitle: '350 g glass jar',
    price: 349,
    originalPrice: 420,
    deliveryTime: '10 mins',
    image: '/assets/olive-oil.jpg',
    category: 'Groceries',
    rating: 4.9
  },
  {
    id: 'smart-speaker',
    name: 'Smart Bluetooth Speaker',
    subtitle: 'Deep bass & voice assistant',
    price: 2499,
    originalPrice: 3499,
    deliveryTime: '15 mins',
    image: '/assets/headphones.jpg',
    category: 'Electronics',
    rating: 4.5
  },
  {
    id: 'coffee-maker',
    name: 'Espresso Maker Machine',
    subtitle: '15-bar Italian pump',
    price: 8999,
    originalPrice: 11999,
    deliveryTime: '20 mins',
    image: '/assets/air-fryer.jpg',
    category: 'Home',
    rating: 4.9
  },
  {
    id: 'body-lotion',
    name: 'Ceramide Hydrating Lotion',
    subtitle: '400 ml pump bottle',
    price: 599,
    originalPrice: 750,
    deliveryTime: '12 mins',
    image: '/assets/olive-oil.jpg',
    category: 'Personal Care',
    rating: 4.8
  },
  {
    id: 'face-wash',
    name: 'Gentle Foaming Cleanser',
    subtitle: '150 ml',
    price: 299,
    originalPrice: 399,
    deliveryTime: '10 mins',
    image: '/assets/strawberries.jpg',
    category: 'Personal Care',
    rating: 4.7
  },
  {
    id: 'weekend-deal-combo',
    name: 'Breakfast Combo Deal',
    subtitle: 'Oats + Honey + Almond Milk',
    price: 649,
    originalPrice: 899,
    deliveryTime: '12 mins',
    image: '/assets/olive-oil.jpg',
    category: 'Offers',
    rating: 4.9
  }
];

export const LOCATIONS: DeliveryLocation[] = [
  {
    id: 'indiranagar',
    area: 'Indiranagar',
    city: 'Bengaluru',
    pincode: '560038',
    eta: '10 mins'
  },
  {
    id: 'koramangala',
    area: 'Koramangala',
    city: 'Bengaluru',
    pincode: '560034',
    eta: '12 mins'
  },
  {
    id: 'hsr-layout',
    area: 'HSR Layout',
    city: 'Bengaluru',
    pincode: '560102',
    eta: '15 mins'
  },
  {
    id: 'whitefield',
    area: 'Whitefield',
    city: 'Bengaluru',
    pincode: '560066',
    eta: '18 mins'
  },
  {
    id: 'jayanagar',
    area: 'Jayanagar',
    city: 'Bengaluru',
    pincode: '560011',
    eta: '15 mins'
  },
  {
    id: 'sadashivanagar',
    area: 'Sadashivanagar',
    city: 'Bengaluru',
    pincode: '560080',
    eta: '14 mins'
  }
];
