import { Product, DeliveryLocation } from '../types';

export const POPULAR_PRODUCTS: Product[] = [
  {
    id: 'strawberries',
    name: 'Fresh Strawberries',
    subtitle: '250 g sweet farm-picked berries',
    price: 99,
    originalPrice: 129,
    deliveryTime: '10 mins',
    image: '/assets/strawberries.jpg',
    category: 'Fresh',
    subCategory: 'Berries & Apples',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'olive-oil',
    name: 'Extra virgin olive oil',
    subtitle: '500 ml cold pressed glass bottle',
    price: 499,
    originalPrice: 599,
    deliveryTime: '10 mins',
    image: '/assets/olive-oil.jpg',
    category: 'Groceries',
    subCategory: 'Oils & Ghee',
    rating: 4.9,
    isPopular: true
  },
  {
    id: 'headphones',
    name: 'Wireless headphones',
    subtitle: 'Active noise cancellation & 50h battery',
    price: 4999,
    originalPrice: 6999,
    deliveryTime: '15 mins',
    image: '/assets/headphones.jpg',
    category: 'Electronics',
    subCategory: 'Audio',
    rating: 4.7,
    isPopular: true
  },
  {
    id: 'air-fryer',
    name: 'Digital Rapid Air fryer',
    subtitle: '4.2 L smart touch oil-free cooking',
    price: 3999,
    originalPrice: 5499,
    deliveryTime: '15 mins',
    image: '/assets/air-fryer.jpg',
    category: 'Home',
    subCategory: 'Air Fryers',
    rating: 4.8,
    isPopular: true
  }
];

export const ALL_PRODUCTS: Product[] = [
  // ==========================================
  // --- GROCERIES SECTION ---
  // Subcategories: Oils & Ghee, Flour & Rice, Dal & Pulses, Tea & Coffee
  // ==========================================
  {
    id: 'olive-oil',
    name: 'Extra virgin olive oil',
    subtitle: '500 ml cold pressed glass bottle',
    price: 499,
    originalPrice: 599,
    deliveryTime: '10 mins',
    image: '/assets/olive-oil.jpg',
    category: 'Groceries',
    subCategory: 'Oils & Ghee',
    brand: 'Figaro',
    rating: 4.9,
    isPopular: true
  },
  {
    id: 'a2-desi-ghee',
    name: 'A2 Desi Cow Bilona Ghee',
    subtitle: '500 ml cultured aromatic glass jar',
    price: 799,
    originalPrice: 999,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Oils & Ghee',
    brand: 'Organic Tattva',
    rating: 4.9
  },
  {
    id: 'organic-honey',
    name: 'Wild Forest Raw Honey',
    subtitle: '350 g pure unprocessed glass jar',
    price: 349,
    originalPrice: 420,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Oils & Ghee',
    brand: 'NovaMart Curated',
    rating: 4.9
  },
  {
    id: 'sharbati-atta',
    name: 'Royal Sharbati Whole Wheat Atta',
    subtitle: '5 kg stone-ground 100% whole grain',
    price: 289,
    originalPrice: 340,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Flour & Rice',
    brand: 'Aashirvaad',
    rating: 4.8
  },
  {
    id: 'basmati-rice',
    name: 'Aged Royal Basmati Rice',
    subtitle: '1 kg long grain aromatic aged rice',
    price: 189,
    originalPrice: 220,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Flour & Rice',
    brand: 'Daawat',
    rating: 4.7
  },
  {
    id: 'multigrain-flour',
    name: 'Organic Multigrain Spelt Flour',
    subtitle: '1 kg fiber-rich nutrition blend',
    price: 145,
    originalPrice: 180,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Flour & Rice',
    brand: 'Organic Tattva',
    rating: 4.8
  },
  {
    id: 'toor-dal',
    name: 'Organic Unpolished Toor Dal',
    subtitle: '1 kg high protein farm fresh pulse',
    price: 175,
    originalPrice: 210,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Dal & Pulses',
    brand: 'Organic Tattva',
    rating: 4.8
  },
  {
    id: 'moong-dal',
    name: 'Yellow Moong Dal Split',
    subtitle: '1 kg premium washed easy-digest dal',
    price: 160,
    originalPrice: 195,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Dal & Pulses',
    brand: 'Organic Tattva',
    rating: 4.7
  },
  {
    id: 'kashmiri-rajma',
    name: 'Kashmiri Red Chitra Rajma',
    subtitle: '500 g organic kidney beans',
    price: 130,
    originalPrice: 165,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Dal & Pulses',
    brand: 'Organic Tattva',
    rating: 4.9
  },
  {
    id: 'filter-coffee',
    name: 'South Indian Filter Coffee Blend',
    subtitle: '250 g 80:20 rich chicory aromatic roast',
    price: 210,
    originalPrice: 260,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Tea & Coffee',
    brand: 'NovaMart Curated',
    rating: 4.9
  },
  {
    id: 'assam-tea',
    name: 'Assam Gold Premium CTC Tea',
    subtitle: '500 g strong malty kadak chai blend',
    price: 260,
    originalPrice: 320,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Groceries',
    subCategory: 'Tea & Coffee',
    brand: 'Tata Tea',
    rating: 4.8
  },

  // ==========================================
  // --- FRESH SECTION ---
  // Subcategories: Berries & Apples, Vegetables, Avocados, Daily Greens
  // ==========================================
  {
    id: 'strawberries',
    name: 'Fresh Strawberries',
    subtitle: '250 g sweet farm-picked berries',
    price: 99,
    originalPrice: 129,
    deliveryTime: '10 mins',
    image: '/assets/strawberries.jpg',
    category: 'Fresh',
    subCategory: 'Berries & Apples',
    brand: 'Farm Direct',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'royal-apples',
    name: 'Crisp Royal Gala Apples',
    subtitle: '4 pcs (approx. 500g) juicy orchard apples',
    price: 180,
    originalPrice: 220,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Berries & Apples',
    brand: 'Organic Farms',
    rating: 4.8
  },
  {
    id: 'blueberries',
    name: 'Fresh Blueberries',
    subtitle: '125 g antioxidant-rich plump berries',
    price: 249,
    originalPrice: 299,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Berries & Apples',
    brand: 'Fresh Picks',
    rating: 4.9
  },
  {
    id: 'cherry-tomatoes',
    name: 'Sweet Red Cherry Tomatoes',
    subtitle: '250 g vine-ripened salad crunch',
    price: 55,
    originalPrice: 75,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Vegetables',
    brand: 'Farm Direct',
    rating: 4.7
  },
  {
    id: 'fresh-carrots',
    name: 'Crunchy Orange Carrots',
    subtitle: '500 g sweet tender winter carrots',
    price: 49,
    originalPrice: 65,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Vegetables',
    brand: 'Farm Direct',
    rating: 4.8
  },
  {
    id: 'baby-potatoes',
    name: 'Baby Dum Potatoes',
    subtitle: '500 g tender skin washed potatoes',
    price: 39,
    originalPrice: 50,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Vegetables',
    brand: 'Farm Direct',
    rating: 4.6
  },
  {
    id: 'avocados',
    name: 'Hass Avocados Twin Pack',
    subtitle: '2 pcs (approx. 300g) creamy ripe avocados',
    price: 199,
    originalPrice: 249,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Avocados',
    brand: 'Organic Farms',
    rating: 4.7
  },
  {
    id: 'single-avocado',
    name: 'Single Ripe Hass Avocado',
    subtitle: '1 pc (approx. 180g) buttery guacamole ready',
    price: 109,
    originalPrice: 135,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Avocados',
    brand: 'Organic Farms',
    rating: 4.8
  },
  {
    id: 'baby-spinach',
    name: 'Hydroponic Baby Spinach',
    subtitle: '200 g washed, tender organic greens',
    price: 45,
    originalPrice: 60,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Daily Greens',
    brand: 'Green Hydro',
    rating: 4.9
  },
  {
    id: 'coriander-mint',
    name: 'Fresh Mint & Coriander Combo',
    subtitle: '1 bunch each (approx. 200g) aromatic herbs',
    price: 35,
    originalPrice: 45,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Daily Greens',
    brand: 'Green Hydro',
    rating: 4.8
  },
  {
    id: 'tender-coconut',
    name: 'Fresh Tender Coconut',
    subtitle: '1 pc naturally sweet hydrating water',
    price: 65,
    originalPrice: 80,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Fresh',
    subCategory: 'Daily Greens',
    brand: 'Farm Direct',
    rating: 4.8
  },

  // ==========================================
  // --- ELECTRONICS SECTION ---
  // Subcategories: Audio, Smart Wearables, Power & Cables, Smart TV
  // ==========================================
  {
    id: 'headphones',
    name: 'Wireless headphones',
    subtitle: 'Active noise cancellation & 50h battery',
    price: 4999,
    originalPrice: 6999,
    deliveryTime: '15 mins',
    image: '/assets/headphones.jpg',
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'Sony',
    rating: 4.7,
    isPopular: true
  },
  {
    id: 'smart-speaker',
    name: 'Smart Bluetooth Speaker',
    subtitle: '360° deep bass & voice assistant ready',
    price: 2499,
    originalPrice: 3499,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'boAt',
    rating: 4.6
  },
  {
    id: 'earbuds',
    name: 'TWS True Wireless Earbuds',
    subtitle: 'Spatial audio, quad mic with ENC',
    price: 2199,
    originalPrice: 3299,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    subCategory: 'Audio',
    brand: 'boAt',
    rating: 4.5
  },
  {
    id: 'smart-watch',
    name: 'Smart Fitness AMOLED Watch',
    subtitle: 'SpO2, heart monitor, waterproof 5ATM',
    price: 3499,
    originalPrice: 4999,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    subCategory: 'Smart Wearables',
    brand: 'Apple',
    rating: 4.7
  },
  {
    id: 'noise-smartwatch',
    name: 'ColorFit Pulse Smartwatch',
    subtitle: '1.85" HD display, Bluetooth calling & 100+ modes',
    price: 1999,
    originalPrice: 3499,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    subCategory: 'Smart Wearables',
    brand: 'boAt',
    rating: 4.6
  },
  {
    id: 'power-bank',
    name: '20,000mAh 65W Fast Power Bank',
    subtitle: 'Type-C PD triple device charging',
    price: 1899,
    originalPrice: 2599,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    subCategory: 'Power & Cables',
    brand: 'Samsung',
    rating: 4.8
  },
  {
    id: 'wireless-charger',
    name: 'Magnetic 15W Qi Fast Charger',
    subtitle: 'Aluminium stand with foreign object detection',
    price: 1299,
    originalPrice: 1799,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1622445262464-84b14e0745b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    subCategory: 'Power & Cables',
    brand: 'Apple',
    rating: 4.6
  },
  {
    id: 'type-c-cable',
    name: '100W PD Braided Type-C Cable',
    subtitle: '2 meters nylon reinforced fast data transfer',
    price: 399,
    originalPrice: 599,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    subCategory: 'Power & Cables',
    brand: 'Philips',
    rating: 4.8
  },
  {
    id: 'smart-tv-43',
    name: '43" 4K Ultra HD Smart LED TV',
    subtitle: 'Dolby Vision Atmos, HDR10+, Google TV built-in',
    price: 24999,
    originalPrice: 32990,
    deliveryTime: '20 mins',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    subCategory: 'Smart TV',
    brand: 'Samsung',
    rating: 4.9
  },
  {
    id: 'streaming-stick',
    name: '4K Smart TV Streaming Media Player',
    subtitle: 'Voice remote with Alexa & Dolby Audio support',
    price: 3499,
    originalPrice: 4999,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    subCategory: 'Smart TV',
    brand: 'Philips',
    rating: 4.7
  },

  // ==========================================
  // --- HOME & KITCHEN SECTION ---
  // Subcategories: Air Fryers, Coffee & Tea, Blenders, Glass Storage
  // ==========================================
  {
    id: 'air-fryer',
    name: 'Air fryer 4.2 L',
    subtitle: 'Rapid Air technology for 90% less oil',
    price: 3999,
    originalPrice: 5499,
    deliveryTime: '15 mins',
    image: '/assets/air-fryer.jpg',
    category: 'Home',
    subCategory: 'Air Fryers',
    brand: 'Havells',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'dual-air-fryer',
    name: 'Digital Dual-Basket Smart Air Fryer',
    subtitle: '6.5 L dual chamber with touch synch cook',
    price: 6499,
    originalPrice: 8999,
    deliveryTime: '15 mins',
    image: '/assets/air-fryer.jpg',
    category: 'Home',
    subCategory: 'Air Fryers',
    brand: 'Philips',
    rating: 4.9
  },
  {
    id: 'espresso-machine',
    name: "De'Longhi Dedica Espresso Maker",
    subtitle: '15-bar professional pump & milk frother',
    price: 18499,
    originalPrice: 22999,
    deliveryTime: '20 mins',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Home',
    subCategory: 'Coffee & Tea',
    brand: "De'Longhi",
    rating: 4.9
  },
  {
    id: 'electric-kettle',
    name: 'Borosil Smart Electric Glass Kettle',
    subtitle: '1.7 L borosilicate auto shut-off kettle',
    price: 1599,
    originalPrice: 2199,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1594213114663-d94db9b17125?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Home',
    subCategory: 'Coffee & Tea',
    brand: 'Borosil',
    rating: 4.7
  },
  {
    id: 'mixer-grinder',
    name: '750W Heavy-Duty Mixer Grinder',
    subtitle: '3 stainless steel jars with flow breakers',
    price: 3299,
    originalPrice: 4499,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Home',
    subCategory: 'Blenders',
    brand: 'Prestige',
    rating: 4.7
  },
  {
    id: 'nutri-blender',
    name: 'Nutri-Blend High Speed Bullet Blender',
    subtitle: '400W super-fast motor for smoothies & dips',
    price: 2199,
    originalPrice: 2999,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Home',
    subCategory: 'Blenders',
    brand: 'Philips',
    rating: 4.8
  },
  {
    id: 'glass-containers',
    name: 'Borosil Airtight Glass Containers Set',
    subtitle: '3 pcs (320ml, 500ml, 800ml) microwave safe',
    price: 999,
    originalPrice: 1399,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Home',
    subCategory: 'Glass Storage',
    brand: 'Borosil',
    rating: 4.8
  },
  {
    id: 'spice-jars-set',
    name: 'Airtight Glass Spice Jar Carousel',
    subtitle: 'Set of 6 leakproof bamboo lid storage jars',
    price: 749,
    originalPrice: 999,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Home',
    subCategory: 'Glass Storage',
    brand: 'Borosil',
    rating: 4.6
  },

  // ==========================================
  // --- PERSONAL CARE SECTION ---
  // Subcategories: Skincare, Sun Protection, Haircare, Bath & Body
  // ==========================================
  {
    id: 'cerave-cleanser',
    name: 'CeraVe Hydrating Facial Cleanser',
    subtitle: '236 ml with 3 essential ceramides & hyaluronic acid',
    price: 699,
    originalPrice: 850,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
    subCategory: 'Skincare',
    brand: 'CeraVe',
    rating: 4.9
  },
  {
    id: 'vitamin-c-serum',
    name: 'Minimalist 10% Vitamin C Face Serum',
    subtitle: '30 ml glowing skin brightening complex',
    price: 599,
    originalPrice: 699,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
    subCategory: 'Skincare',
    brand: 'The Minimalist',
    rating: 4.8
  },
  {
    id: 'cetaphil-cream',
    name: 'Cetaphil Daily Hydrating Face Cream',
    subtitle: '88 ml non-comedogenic moisture boost',
    price: 499,
    originalPrice: 620,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
    subCategory: 'Skincare',
    brand: 'Cetaphil',
    rating: 4.8
  },
  {
    id: 'neutrogena-sunscreen',
    name: 'Neutrogena Ultra Sheer SPF 50+',
    subtitle: '88 ml matte finish water-resistant sunscreen',
    price: 550,
    originalPrice: 675,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
    subCategory: 'Sun Protection',
    brand: 'The Minimalist',
    rating: 4.7
  },
  {
    id: 'mineral-sunscreen',
    name: 'Minimalist SPF 50 PA++++ Invisible Fluid',
    subtitle: '50 ml light fluid sunscreen with no white cast',
    price: 499,
    originalPrice: 599,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
    subCategory: 'Sun Protection',
    brand: 'The Minimalist',
    rating: 4.8
  },
  {
    id: 'dove-shampoo',
    name: 'Dove Intense Repair Keratin Shampoo',
    subtitle: '650 ml deep nourishing damage therapy',
    price: 399,
    originalPrice: 525,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
    subCategory: 'Haircare',
    brand: 'Dove',
    rating: 4.7
  },
  {
    id: 'moroccanoil-serum',
    name: 'Moroccanoil Treatment Argan Hair Oil',
    subtitle: '50 ml luxury conditioning frizz control',
    price: 1950,
    originalPrice: 2300,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1608248597359-00e9323145d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
    subCategory: 'Haircare',
    brand: 'Dove',
    rating: 4.9
  },
  {
    id: 'nivea-body-wash',
    name: 'Nivea Frangipani & Oil Shower Gel',
    subtitle: '250 ml refreshing care pearls body wash',
    price: 199,
    originalPrice: 275,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
    subCategory: 'Bath & Body',
    brand: 'Dove',
    rating: 4.8
  },
  {
    id: 'cherry-blossom-lotion',
    name: 'Japanese Cherry Blossom Body Lotion',
    subtitle: '236 ml shea butter deep moisture cream',
    price: 799,
    originalPrice: 1199,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Personal Care',
    subCategory: 'Bath & Body',
    brand: 'Colgate',
    rating: 4.8
  },

  // ==========================================
  // --- OFFERS SECTION ---
  // Subcategories: Breakfast Deals, Combos, Tech Savings, Kitchen Offers
  // ==========================================
  {
    id: 'berry-fiesta',
    name: 'Berry Fiesta Twin Pack',
    subtitle: 'Strawberries 250g + Blueberries 125g (Save 21%)',
    price: 299,
    originalPrice: 378,
    deliveryTime: '10 mins',
    image: '/assets/strawberries.jpg',
    category: 'Offers',
    subCategory: 'Breakfast Deals',
    brand: 'Value Picks',
    rating: 4.8
  },
  {
    id: 'ghee-rice-bundle',
    name: 'Festive Ghee & Basmati Rice Bundle',
    subtitle: 'A2 Desi Ghee 500ml + Aged Basmati 1kg (Save 22%)',
    price: 899,
    originalPrice: 1150,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Offers',
    subCategory: 'Breakfast Deals',
    brand: 'NovaMart Specials',
    rating: 4.9
  },
  {
    id: 'olive-oil-duo',
    name: 'Extra Virgin Olive Oil Duo Pack',
    subtitle: '2 x 500 ml twin glass bottle combo (Save 29%)',
    price: 849,
    originalPrice: 1198,
    deliveryTime: '10 mins',
    image: '/assets/olive-oil.jpg',
    category: 'Offers',
    subCategory: 'Combos',
    brand: 'Bundle Deals',
    rating: 4.9
  },
  {
    id: 'breakfast-oats-honey',
    name: 'Organic Rolled Oats + Forest Honey Combo',
    subtitle: 'Rolled Oats 1kg + Raw Wild Honey 350g (Save 25%)',
    price: 499,
    originalPrice: 665,
    deliveryTime: '10 mins',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Offers',
    subCategory: 'Combos',
    brand: 'NovaMart Specials',
    rating: 4.8
  },
  {
    id: 'headphones-deal',
    name: 'Sony Noise-Cancelling Mega Deal',
    subtitle: 'Sony WH-CH720N over-ear headphones (Save 29%)',
    price: 4999,
    originalPrice: 6999,
    deliveryTime: '15 mins',
    image: '/assets/headphones.jpg',
    category: 'Offers',
    subCategory: 'Tech Savings',
    brand: 'Value Picks',
    rating: 4.8
  },
  {
    id: 'tech-duo-bundle',
    name: 'Fast Charge Power Duo Bundle',
    subtitle: '20,000mAh Power Bank + 100W Braided Cable (Save 28%)',
    price: 1999,
    originalPrice: 2798,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Offers',
    subCategory: 'Tech Savings',
    brand: 'Bundle Deals',
    rating: 4.7
  },
  {
    id: 'air-fryer-deal',
    name: 'Digital Rapid Air Fryer Deal',
    subtitle: '4.2 L smart air fryer kitchen special (Save 27%)',
    price: 3999,
    originalPrice: 5499,
    deliveryTime: '15 mins',
    image: '/assets/air-fryer.jpg',
    category: 'Offers',
    subCategory: 'Kitchen Offers',
    brand: 'Value Picks',
    rating: 4.8
  },
  {
    id: 'borosil-storage-combo',
    name: 'Borosil 4-Piece Storage Container Deal',
    subtitle: '4 airtight microwave safe borosilicate bowls (Save 32%)',
    price: 1199,
    originalPrice: 1799,
    deliveryTime: '15 mins',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    category: 'Offers',
    subCategory: 'Kitchen Offers',
    brand: 'NovaMart Specials',
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
