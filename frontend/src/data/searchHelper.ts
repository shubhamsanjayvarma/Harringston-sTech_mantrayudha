import { Product } from '../types';
import { ALL_PRODUCTS } from './mockData';

export interface SearchResultData {
  products: Product[];
  detectedDomain: string | null;
  query: string;
}

// Map general language and natural terminology to canonical NovaMart domains
const DOMAIN_DEFINITIONS: Record<
  string,
  {
    category: string;
    strictTriggers: RegExp[];
    keywordTokens: string[];
  }
> = {
  Electronics: {
    category: 'Electronics',
    strictTriggers: [
      /\belectronic(s)?\b/i,
      /\bgadget(s)?\b/i,
      /\btech\b/i,
      /\bdevice(s)?\b/i,
    ],
    keywordTokens: [
      'electronics',
      'electronic',
      'gadget',
      'gadgets',
      'tech',
      'device',
      'devices',
      'headphone',
      'headphones',
      'audio',
      'charger',
      'cable',
      'cables',
      'earbuds',
      'smartwatch',
      'watch',
      'wearable',
      'speaker',
    ],
  },
  Groceries: {
    category: 'Groceries',
    strictTriggers: [
      /\bgrocer(y|ies)\b/i,
      /\bpantry\b/i,
      /\bstaple(s)?\b/i,
    ],
    keywordTokens: [
      'grocery',
      'groceries',
      'grocer',
      'pantry',
      'staples',
      'staple',
      'atta',
      'rice',
      'flour',
      'dal',
      'dals',
      'pulses',
      'oil',
      'oils',
      'ghee',
      'tea',
      'coffee',
      'spices',
      'masala',
      'salt',
      'sugar',
      'food',
      'grain',
      'grains',
    ],
  },
  Fresh: {
    category: 'Fresh',
    strictTriggers: [
      /\bfresh\b/i,
      /\bfruit(s)?\b/i,
      /\bvegetable(s)?\b/i,
      /\bveggie(s)?\b/i,
      /\bproduce\b/i,
      /\borganic\b/i,
    ],
    keywordTokens: [
      'fresh',
      'fruit',
      'fruits',
      'vegetable',
      'vegetables',
      'veggie',
      'veggies',
      'produce',
      'greens',
      'organic',
      'berries',
      'strawberry',
      'strawberries',
      'blueberry',
      'apple',
      'banana',
      'tomato',
      'avocado',
      'spinach',
      'coriander',
    ],
  },
  Home: {
    category: 'Home',
    strictTriggers: [
      /\bhome\b/i,
      /\bhousehold\b/i,
      /\bappliance(s)?\b/i,
      /\bkitchenware\b/i,
    ],
    keywordTokens: [
      'home',
      'kitchen',
      'appliance',
      'appliances',
      'air fryer',
      'fryer',
      'blender',
      'kettle',
      'espresso',
      'coffee machine',
      'storage',
      'container',
      'containers',
      'glass jar',
      'cookware',
      'pan',
      'lamp',
    ],
  },
  'Personal Care': {
    category: 'Personal Care',
    strictTriggers: [
      /\bpersonal care\b/i,
      /\bskincare\b/i,
      /\bwellness\b/i,
      /\bhaircare\b/i,
    ],
    keywordTokens: [
      'personal care',
      'personal',
      'care',
      'beauty',
      'skincare',
      'skin',
      'hair',
      'haircare',
      'shampoo',
      'lotion',
      'cleanser',
      'sunscreen',
      'serum',
      'body wash',
      'bath',
      'oral',
      'toothpaste',
      'cream',
    ],
  },
  Offers: {
    category: 'Offers',
    strictTriggers: [
      /\boffer(s)?\b/i,
      /\bdeal(s)?\b/i,
      /\bdiscount(s)?\b/i,
      /\bsale(s)?\b/i,
      /\bcombo(s)?\b/i,
      /\bbundle(s)?\b/i,
    ],
    keywordTokens: [
      'offer',
      'offers',
      'deal',
      'deals',
      'discount',
      'discounts',
      'sale',
      'savings',
      'combo',
      'combos',
      'bundle',
      'special offer',
    ],
  },
};

/**
 * Intelligent general language search that bifurcates by domain
 * when the user enters general terminology like "electronics", "grocery", "fresh", etc.
 */
export function matchProductsByGeneralLanguage(rawQuery: string): SearchResultData {
  const q = rawQuery.trim().toLowerCase();
  if (!q) {
    return {
      products: ALL_PRODUCTS,
      detectedDomain: null,
      query: rawQuery,
    };
  }

  // 1. Check for explicit domain category intent
  // Example: "electronics", "electronic items", "grocery", "fresh vegetables", "personal care", "offers"
  let matchedDomain: string | null = null;

  for (const [domainName, config] of Object.entries(DOMAIN_DEFINITIONS)) {
    // Check if query matches strict triggers
    const hasTriggerMatch = config.strictTriggers.some((rgx) => rgx.test(q));
    // Or if query is equal to or starts/ends with domain name
    const domainLower = domainName.toLowerCase();
    const isDomainDirect =
      q === domainLower ||
      q === `${domainLower}s` ||
      q.startsWith(`${domainLower} `) ||
      q.endsWith(` ${domainLower}`) ||
      q.includes(`${domainLower} items`) ||
      q.includes(`${domainLower} section`) ||
      q.includes(`show me ${domainLower}`) ||
      q.includes(`i want ${domainLower}`);

    if (hasTriggerMatch || isDomainDirect) {
      matchedDomain = config.category;
      break;
    }
  }

  // 2. If a domain is explicitly identified by general language:
  // Strictly filter products belonging to that domain ONLY (as requested by user)
  if (matchedDomain) {
    const domainProducts = ALL_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === matchedDomain!.toLowerCase()
    );

    // If query has additional sub-filters (e.g. "electronics sony", "grocery rice")
    const words = q.split(/\s+/).filter(
      (w) =>
        w.length > 2 &&
        !DOMAIN_DEFINITIONS[matchedDomain!]?.keywordTokens.includes(w) &&
        !['show', 'me', 'items', 'item', 'the', 'and', 'for', 'want', 'need', 'section', 'only'].includes(w)
    );

    if (words.length > 0) {
      const filteredSub = domainProducts.filter((p) => {
        const text = `${p.name} ${p.subtitle}`.toLowerCase();
        return words.some((word) => text.includes(word));
      });
      return {
        products: filteredSub.length > 0 ? filteredSub : domainProducts,
        detectedDomain: matchedDomain,
        query: rawQuery,
      };
    }

    return {
      products: domainProducts,
      detectedDomain: matchedDomain,
      query: rawQuery,
    };
  }

  // 3. Otherwise, perform tokenized full-text search across all items
  const tokens = q.split(/\s+/).filter((t) => t.length > 0);
  const matched = ALL_PRODUCTS.filter((product) => {
    const searchString = `${product.name} ${product.subtitle} ${product.category}`.toLowerCase();
    return tokens.every((token) => searchString.includes(token));
  });

  return {
    products: matched,
    detectedDomain: null,
    query: rawQuery,
  };
}
