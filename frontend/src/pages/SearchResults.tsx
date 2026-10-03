import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronDown, Star, Zap, Search as SearchIcon } from 'lucide-react';
import { ALL_PRODUCTS, searchProducts } from '../data/storeData';
import { useCart } from '../context/CartContext';

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addToCart, getItemQuantity } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('recommended');

  const baseResults = useMemo(() => {
    if (!query.trim()) {
      return ALL_PRODUCTS.slice(0, 24);
    }
    return searchProducts(query);
  }, [query]);

  // Available categories in results
  const resultCategories = useMemo(() => {
    const cats: Record<string, number> = { All: baseResults.length };
    baseResults.forEach((p) => {
      cats[p.category] = (cats[p.category] || 0) + 1;
    });
    return Object.entries(cats);
  }, [baseResults]);

  const filteredResults = useMemo(() => {
    let res = baseResults;
    if (selectedCategory !== 'All') {
      res = res.filter((p) => p.category === selectedCategory);
    }
    return res.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [baseResults, selectedCategory, sortBy]);

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
              <span className="text-gray-900 font-medium">Search</span>
            </div>
          </li>
          {query && (
            <li>
              <div className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium truncate max-w-xs">"{query}"</span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {query ? `Results for "${query}"` : 'Browse Electronics & Tech'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Found {filteredResults.length} matching products
        </p>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto pb-1">
          {resultCategories.map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#198038] text-white shadow-2xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {cat} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <span className="text-xs text-gray-500 font-medium">
          Showing {filteredResults.length} items
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Sort:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-gray-800 py-1.5 pl-3 pr-8 rounded-lg text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={14} />
          </div>
        </div>
      </div>

      {filteredResults.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <SearchIcon size={40} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No products found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            We couldn't find any products matching your query. Try searching for headphones, charger, laptop, webcam, or mechanical keyboard.
          </p>
          <Link
            to="/category"
            className="inline-block mt-4 px-5 py-2.5 bg-[#198038] text-white rounded-lg text-sm font-semibold hover:bg-[#156d30] transition-colors"
          >
            Explore all tech
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredResults.map((p) => {
            const qty = getItemQuantity(p.id);
            return (
              <div
                key={p.id}
                className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col h-full group"
              >
                <Link to={`/product?id=${p.id}`} className="block flex-1">
                  <div className="aspect-square bg-[#f9fafb] rounded-xl mb-3 overflow-hidden p-3 relative flex items-center justify-center border border-gray-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {p.discountPercent && p.discountPercent > 5 && (
                      <span className="absolute top-2 right-2 bg-[#dcfce7] text-[#166534] text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {p.discountPercent}% OFF
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{p.brand} · {p.subcategory}</p>
                  <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1 mt-0.5 group-hover:text-[#198038] transition-colors">
                    {p.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs mt-1.5 mb-2">
                    <Star className="fill-[#198038] text-[#198038]" size={12} />
                    <span className="font-bold text-gray-900">{p.rating}</span>
                    <span className="text-gray-400">({p.reviewCount})</span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-base font-extrabold text-gray-900">₹ {p.price.toLocaleString('en-IN')}</span>
                    {p.originalPrice && p.originalPrice > p.price && (
                      <span className="text-xs text-gray-400 line-through">₹ {p.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                      <Zap size={11} className="fill-[#198038]" /> {p.deliveryTime}
                    </span>
                  </div>
                </Link>

                <div className="mt-auto pt-2 border-t border-gray-100">
                  <button
                    onClick={() => addToCart(p)}
                    className={`w-full font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors shadow-2xs ${
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
  );
}
