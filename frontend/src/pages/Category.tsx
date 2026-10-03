import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, Star, Zap, Plus, Minus, Check } from 'lucide-react';
import { ALL_PRODUCTS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

export default function Category() {
  const [searchParams] = useSearchParams();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();

  const categoryName = searchParams.get('name') || 'Electronics';

  // Sub-filter tag state
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [priceFilter, setPriceFilter] = useState<number | null>(null);

  // Reset filters on category change
  useEffect(() => {
    setSelectedTag('All');
    setPriceFilter(null);
  }, [categoryName]);

  // Category Configuration
  const categoryMeta: Record<
    string,
    {
      title: string;
      tagline: string;
      tags: string[];
      brands: string[];
    }
  > = {
    Groceries: {
      title: 'Groceries & Kitchen Staples',
      tagline: 'Pure cooking oils, aromatic grains, unpolished dals, and fresh pantry essentials.',
      tags: ['All', 'Oils & Ghee', 'Flour & Rice', 'Dal & Pulses', 'Tea & Coffee'],
      brands: ['Figaro', 'Aashirvaad', 'Organic Tattva', 'Daawat', 'Tata Tea'],
    },
    Fresh: {
      title: 'Fresh Farm Produce',
      tagline: 'Orchard-picked fruits, crisp farm vegetables, and hydroponic organic greens.',
      tags: ['All', 'Berries & Apples', 'Vegetables', 'Avocados', 'Daily Greens'],
      brands: ['Farm Direct', 'Organic Farms', 'Fresh Picks', 'Green Hydro'],
    },
    Electronics: {
      title: 'Electronics & Audio',
      tagline: 'Everyday tech, smart audio, wireless charging, and digital lifestyle accessories.',
      tags: ['All', 'Audio', 'Smart Wearables', 'Power & Cables', 'Smart TV'],
      brands: ['Sony', 'Apple', 'boAt', 'Samsung', 'Philips'],
    },
    Home: {
      title: 'Home & Kitchen Appliances',
      tagline: 'Smart air fryers, espresso machines, airtight containers, and modern home essentials.',
      tags: ['All', 'Air Fryers', 'Coffee & Tea', 'Blenders', 'Glass Storage'],
      brands: ['Havells', "De'Longhi", 'Borosil', 'Philips', 'Prestige'],
    },
    'Personal Care': {
      title: 'Personal Care & Wellness',
      tagline: 'Gentle dermatological skincare, restorative haircare, and daily wellness items.',
      tags: ['All', 'Skincare', 'Sun Protection', 'Haircare', 'Bath & Body'],
      brands: ['CeraVe', 'The Minimalist', 'Cetaphil', 'Dove', 'Colgate'],
    },
    Offers: {
      title: 'Super Saver Deals & Combos',
      tagline: 'Exclusive curated value packs, bundle discounts, and limited-time price drops.',
      tags: ['All', 'Breakfast Deals', 'Combos', 'Tech Savings', 'Kitchen Offers'],
      brands: ['NovaMart Specials', 'Value Picks', 'Bundle Deals'],
    },
  };

  const currentMeta = categoryMeta[categoryName] || {
    title: categoryName,
    tagline: 'Carefully curated essentials delivered in 10-15 minutes.',
    tags: ['All'],
    brands: ['Top Brands', 'NovaMart Curated'],
  };

  // Filter products by domain category
  const filteredProducts = useMemo(() => {
    let list = ALL_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );

    // If tag filter is active
    if (selectedTag !== 'All') {
      const tagLower = selectedTag.toLowerCase();
      list = list.filter((p) => {
        // Direct subCategory match
        if (p.subCategory && p.subCategory.toLowerCase() === tagLower) {
          return true;
        }
        // Fallback keyword match
        const words = tagLower.split(/[\s&,/]+/).filter((w) => w.length > 2);
        const searchString = `${p.name} ${p.subtitle} ${p.subCategory || ''}`.toLowerCase();
        return words.some((w) => searchString.includes(w));
      });
    }

    // Price filter
    if (priceFilter !== null) {
      list = list.filter((p) => p.price <= priceFilter);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [categoryName, selectedTag, priceFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-gray-900">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-[#198038] font-semibold">{categoryName}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header Banner - Exact styling matching user reference */}
      <div className="mb-8 bg-gradient-to-r from-[#eef8f1] via-[#f7fcf9] to-white p-6 sm:p-8 rounded-3xl border border-[#c4ebd3] shadow-xs">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 bg-white text-[#198038] text-xs font-bold px-3 py-1 rounded-full border border-[#c4ebd3] mb-3 shadow-2xs">
              <Zap size={14} className="fill-[#198038]" /> Hyperlocal 10-15 Min Delivery
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight">
              {currentMeta.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
              {currentMeta.tagline}
            </p>
          </div>
          
          <div className="text-right flex flex-col items-end shrink-0">
            <span className="text-3xl sm:text-4xl font-black text-[#198038] leading-none">
              {filteredProducts.length}
            </span>
            <span className="text-xs text-gray-500 font-semibold mt-1">
              Items in stock
            </span>
          </div>
        </div>

        {/* Divider Line */}
        <div className="border-t border-[#c4ebd3]/70 my-5"></div>

        {/* Subcategory Filter Pills */}
        <div className="flex flex-wrap gap-2.5">
          {currentMeta.tags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#198038] text-white shadow-xs'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-[#198038] hover:bg-[#eef8f1]'
                }`}
              >
                {tag === 'All' ? `All ${categoryName}` : tag}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="border border-gray-200 rounded-2xl bg-white p-5 space-y-6 shadow-2xs sticky top-28">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
              {(selectedTag !== 'All' || priceFilter !== null || sortBy !== 'featured') && (
                <button
                  onClick={() => {
                    setSelectedTag('All');
                    setPriceFilter(null);
                    setSortBy('featured');
                  }}
                  className="text-xs text-[#198038] font-bold hover:underline"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-[#198038]"
              >
                <option value="featured">Featured Picks</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Max Price
              </label>
              <div className="space-y-2">
                {[
                  { label: 'All prices', val: null },
                  { label: 'Under ₹200', val: 200 },
                  { label: 'Under ₹500', val: 500 },
                  { label: 'Under ₹1,000', val: 1000 },
                  { label: 'Under ₹5,000', val: 5000 },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center text-xs text-gray-700 cursor-pointer hover:text-black gap-2.5"
                  >
                    <input
                      type="radio"
                      name="priceFilter"
                      checked={priceFilter === item.val}
                      onChange={() => setPriceFilter(item.val)}
                      className="text-[#198038] focus:ring-[#198038]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands list */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Featured Brands
              </label>
              <div className="space-y-1.5">
                {currentMeta.brands.map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check size={13} className="text-[#198038]" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const quantity = getItemQuantity(product.id);
                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden p-4 relative flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/strawberries.jpg';
                          }}
                        />
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="absolute top-3 left-3 bg-[#eef8f1] text-[#125A27] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c4ebd3]">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-[#125A27] text-[11px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                          <span className="text-[#198038]">⚡</span> {product.deliveryTime}
                        </span>
                      </div>

                      {/* Product Details */}
                      <h3 className="font-bold text-gray-900 leading-snug line-clamp-1 text-base">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.subtitle}</p>

                      {product.rating && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span className="font-bold text-gray-800">{product.rating}</span>
                          <span className="text-gray-400">• Verified</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-lg font-extrabold text-gray-950">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through ml-2">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {quantity > 0 ? (
                        <div className="inline-flex items-center bg-[#198038] text-white rounded-xl shadow-xs">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                            className="p-2 hover:bg-[#125A27] rounded-l-xl transition-colors cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus size={14} strokeWidth={2.5} />
                          </button>
                          <span className="px-2.5 text-xs font-bold">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, 1)}
                            className="p-2 hover:bg-[#125A27] rounded-r-xl transition-colors cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-[#198038] hover:bg-[#125A27] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                          <Plus size={14} strokeWidth={2.5} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center">
              <p className="text-lg font-bold text-gray-900 mb-2">No products found in this filter</p>
              <p className="text-sm text-gray-500 mb-6">
                Try selecting a different filter or reset all filters to view all {categoryName} items.
              </p>
              <button
                onClick={() => {
                  setSelectedTag('All');
                  setPriceFilter(null);
                }}
                className="bg-[#198038] text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-[#125A27] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
