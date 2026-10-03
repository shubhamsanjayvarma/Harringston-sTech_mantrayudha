import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Star, Zap, Plus, Minus, ArrowRight } from 'lucide-react';
import { ALL_PRODUCTS } from '../data/mockData';
import { matchProductsByGeneralLanguage } from '../data/searchHelper';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { addToCart, updateQuantity, getItemQuantity } = useCart();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

  // Intelligent domain categorization engine
  const searchEngineResult = useMemo(() => {
    return matchProductsByGeneralLanguage(query);
  }, [query]);

  const detectedDomain = searchEngineResult.detectedDomain;

  // Perform general language & keyword search
  const matchedProducts = useMemo(() => {
    let results = searchEngineResult.products;

    // Apply secondary category chip filter if selected
    if (activeCategoryFilter !== 'All') {
      results = results.filter(
        (p) => p.category.toLowerCase() === activeCategoryFilter.toLowerCase()
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      return [...results].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...results].sort((a, b) => b.price - a.price);
    }

    return results;
  }, [searchEngineResult, activeCategoryFilter, sortBy]);

  const categoriesAvailable = useMemo(() => {
    const cats = new Set(ALL_PRODUCTS.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, []);

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
              <span className="text-gray-900 font-medium">Search</span>
            </div>
          </li>
          {query && (
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-[#198038] font-bold">"{query}"</span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      {/* Search Header Banner */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/70 p-6 rounded-3xl border border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            <Search className="text-[#198038] w-7 h-7 stroke-[2.5]" />
            {query ? (
              <span>
                Results for <span className="text-[#198038]">"{query}"</span>
              </span>
            ) : (
              <span>All Catalog Products</span>
            )}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Found <span className="font-bold text-gray-900">{matchedProducts.length}</span> items matching your search
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-600">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="p-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none focus:border-[#198038]"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Domain Bifurcation Banner */}
      {detectedDomain && (
        <div className="mb-8 bg-gradient-to-r from-[#eef8f1] to-white border border-[#c4ebd3] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#198038] text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              ⚡
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#125A27] uppercase tracking-wider mb-0.5">
                Domain Filter Active
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                Displaying only <span className="text-[#198038]">{detectedDomain}</span> items for "{query}"
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                All catalog products strictly filtered to the {detectedDomain} domain.
              </p>
            </div>
          </div>
          <Link
            to={detectedDomain === 'Offers' ? '/offers' : `/category?name=${encodeURIComponent(detectedDomain)}`}
            className="inline-flex items-center gap-1.5 bg-[#198038] hover:bg-[#125A27] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            Visit {detectedDomain} Section <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
        {categoriesAvailable.map((cat) => {
          const isSelected = activeCategoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#198038] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#198038] hover:bg-[#eef8f1]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Results Product Grid */}
      {matchedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {matchedProducts.map((product) => {
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
                    <span className="absolute top-2.5 right-2.5 bg-white/90 text-[#125A27] text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
                      {product.category}
                    </span>
                    <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-[#125A27] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs">
                      <span className="text-[#198038]">⚡</span> {product.deliveryTime}
                    </span>
                  </div>

                  {/* Details */}
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
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-xs text-gray-400 line-through ml-1.5">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {quantity > 0 ? (
                    <div className="inline-flex items-center bg-[#198038] text-white rounded-xl shadow-xs">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="p-2 hover:bg-[#125A27] rounded-l-xl transition-colors cursor-pointer"
                        title="Decrease"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="px-2 text-xs font-bold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="p-2 hover:bg-[#125A27] rounded-r-xl transition-colors cursor-pointer"
                        title="Increase"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(product)}
                      className="bg-[#198038] hover:bg-[#125A27] text-white font-bold py-2 px-4 rounded-xl text-xs transition-colors shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
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
        <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-[#eef8f1] text-[#198038] mx-auto flex items-center justify-center mb-4">
            <Search size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No matching products found</h2>
          <p className="text-sm text-gray-600 mb-6">
            We couldn't find items matching "{query}". Try checking for spelling or search by category name like "electronics", "groceries", or "fresh".
          </p>

          <div className="flex flex-wrap gap-2 justify-center">
            {['Groceries', 'Fresh', 'Electronics', 'Home', 'Personal Care', 'Offers'].map((cat) => (
              <Link
                key={cat}
                to={`/category?name=${encodeURIComponent(cat)}`}
                className="bg-gray-50 border border-gray-200 text-gray-800 hover:border-[#198038] hover:bg-[#eef8f1] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
              >
                Explore {cat} <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
