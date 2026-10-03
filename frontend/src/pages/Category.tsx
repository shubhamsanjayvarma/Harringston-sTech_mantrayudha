import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Star, Filter, ArrowUpDown } from 'lucide-react';
import { ALL_PRODUCTS, CATEGORIES } from '../data/storeData';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

export default function Category() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, getItemQuantity } = useCart();

  const selectedCategory = searchParams.get('cat') || 'All';
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: ALL_PRODUCTS.length };
    ALL_PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter products by category first
  const categoryFiltered = useMemo(() => {
    if (selectedCategory === 'All' || selectedCategory === 'All Tech') {
      return ALL_PRODUCTS;
    }
    return ALL_PRODUCTS.filter(
      (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory]);

  // Brand list and counts for current category
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categoryFiltered.forEach((p) => {
      if (p.brand) {
        counts[p.brand] = (counts[p.brand] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [categoryFiltered]);

  // Apply all filters and sorting
  const filteredProducts = useMemo(() => {
    return categoryFiltered.filter((p) => {
      // Brand filter
      if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) {
        return false;
      }

      // Price filter
      if (selectedPriceRange === 'under-1000' && p.price >= 1000) return false;
      if (selectedPriceRange === '1000-5000' && (p.price < 1000 || p.price > 5000)) return false;
      if (selectedPriceRange === '5000-20000' && (p.price < 5000 || p.price > 20000)) return false;
      if (selectedPriceRange === 'above-20000' && p.price <= 20000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      return 0; // recommended default
    });
  }, [categoryFiltered, selectedBrands, selectedPriceRange, sortBy]);

  const handleCategoryChange = (cat: string) => {
    setSelectedBrands([]);
    setSelectedPriceRange(null);
    if (cat === 'All') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', cat);
    }
    setSearchParams(searchParams);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

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
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">{selectedCategory === 'All' ? 'All Electronics & Tech' : selectedCategory}</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
          {selectedCategory === 'All' ? 'All Electronics & Tech' : selectedCategory}
        </h1>
        <p className="text-base text-gray-600">
          Explore genuine electronics, top brands, and instant delivery across Bengaluru.
        </p>

        {/* Horizontal Quick Category Pills */}
        <div className="flex flex-wrap gap-2.5 mt-5 overflow-x-auto pb-1">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#198038] text-white shadow-xs'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
            }`}
          >
            All Tech ({ALL_PRODUCTS.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#198038] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat} ({categoryCounts[cat] || 0})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="border border-gray-200/80 rounded-2xl bg-gray-50/50 p-5 space-y-6 sticky top-24">
            {/* Category Filter */}
            <div>
              <div className="flex items-center justify-between font-bold text-gray-900 mb-3 text-sm">
                <span>Categories</span>
                <ChevronUp size={16} />
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {CATEGORIES.slice(0, 8).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`flex items-center justify-between w-full text-left text-xs sm:text-sm py-1 px-2 rounded-lg transition-colors ${
                      selectedCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-[#eef8f1] text-[#198038] font-bold'
                        : 'text-gray-700 hover:bg-gray-100/70'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-gray-400 text-xs">({categoryCounts[cat] || 0})</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Brand Filter */}
            {brandCounts.length > 0 && (
              <div>
                <div className="flex items-center justify-between font-bold text-gray-900 mb-3 text-sm">
                  <span>Brands</span>
                  <ChevronUp size={16} />
                </div>
                <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                  {brandCounts.slice(0, 8).map(([brand, count]) => {
                    const isChecked = selectedBrands.includes(brand);
                    return (
                      <label key={brand} className="flex items-center text-xs sm:text-sm text-gray-700 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 rounded border-gray-300 text-[#198038] focus:ring-[#198038] mr-2.5"
                        />
                        <span className="group-hover:text-black flex-1 truncate">
                          {brand} <span className="text-gray-400 text-xs">({count})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <hr className="border-gray-200" />

            {/* Price Filter */}
            <div>
              <div className="flex items-center justify-between font-bold text-gray-900 mb-3 text-sm">
                <span>Price Bracket</span>
                <ChevronUp size={16} />
              </div>
              <div className="space-y-2">
                {[
                  { id: null, label: 'All prices' },
                  { id: 'under-1000', label: 'Under ₹ 1,000' },
                  { id: '1000-5000', label: '₹ 1,000 - ₹ 5,000' },
                  { id: '5000-20000', label: '₹ 5,000 - ₹ 20,000' },
                  { id: 'above-20000', label: 'Above ₹ 20,000' },
                ].map((item) => (
                  <label key={item.label} className="flex items-center text-xs sm:text-sm text-gray-700 cursor-pointer group">
                    <input
                      type="radio"
                      name="price-bracket"
                      checked={selectedPriceRange === item.id}
                      onChange={() => setSelectedPriceRange(item.id)}
                      className="w-4 h-4 text-[#198038] focus:ring-[#198038] mr-2.5"
                    />
                    <span className="group-hover:text-black">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset Filters button */}
            {(selectedBrands.length > 0 || selectedPriceRange) && (
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedPriceRange(null);
                }}
                className="w-full text-xs font-semibold text-[#198038] hover:text-[#125a27] text-center pt-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Products in {selectedCategory === 'All' ? 'Electronics' : selectedCategory}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Showing {filteredProducts.length} verified products
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 text-gray-800 py-2 pl-3.5 pr-8 rounded-lg text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer shadow-2xs"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-lg font-bold text-gray-700">No products match your filter</p>
              <p className="text-sm text-gray-500 mt-1">Try resetting the brand or price filters above.</p>
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedPriceRange(null);
                }}
                className="mt-4 px-4 py-2 bg-[#198038] text-white rounded-lg text-sm font-semibold hover:bg-[#125a27] transition-colors"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((p) => {
                const qty = getItemQuantity(p.id);
                return (
                  <div
                    key={p.id}
                    className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col h-full group"
                  >
                    <Link to={`/product?id=${p.id}`} className="block flex-1">
                      <div className="aspect-square bg-[#f9fafb] rounded-xl mb-4 overflow-hidden p-4 relative flex items-center justify-center border border-gray-100">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        {p.discountPercent && p.discountPercent > 5 ? (
                          <span className="absolute top-2.5 right-2.5 bg-[#dcfce7] text-[#166534] text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {p.discountPercent}% OFF
                          </span>
                        ) : null}
                      </div>

                      <div className="mb-2">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{p.brand} · {p.subcategory}</p>
                        <h3 className="font-bold text-gray-900 leading-snug line-clamp-1 mt-0.5 group-hover:text-[#198038] transition-colors">
                          {p.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs mb-3">
                        <Star className="fill-[#198038] text-[#198038]" size={13} />
                        <span className="font-bold text-gray-900">{p.rating}</span>
                        <span className="text-gray-400">({p.reviewCount} reviews)</span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-lg font-extrabold text-gray-900">₹ {p.price.toLocaleString('en-IN')}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-gray-400 line-through">₹ {p.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                      </div>

                      <div className="mb-4">
                        <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-[11px] font-semibold px-2 py-0.5 rounded-md">
                          ⚡ {p.deliveryTime}
                        </span>
                      </div>
                    </Link>

                    <div className="mt-auto pt-2 border-t border-gray-100">
                      <button
                        onClick={() => addToCart(p)}
                        className={`w-full font-semibold py-2 px-4 rounded-lg text-sm transition-colors shadow-2xs ${
                          qty > 0
                            ? 'bg-[#198038] text-white hover:bg-[#156d30]'
                            : 'bg-white border border-[#198038] text-[#198038] hover:bg-[#eef8f1]'
                        }`}
                      >
                        {qty > 0 ? `In Cart (${qty})` : 'Add to cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
