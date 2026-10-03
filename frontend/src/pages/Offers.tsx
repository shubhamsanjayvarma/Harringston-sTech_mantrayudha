import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Percent, ChevronRight, Zap, Truck, Tag, LayoutGrid, Laptop, Smartphone, Headphones, Gamepad2, Plug } from 'lucide-react';
import { ALL_PRODUCTS } from '../data/storeData';
import { useCart } from '../context/CartContext';

export default function Offers() {
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Top deals sorted by discount percentage
  const deals = useMemo(() => {
    return ALL_PRODUCTS
      .filter((p) => p.discountPercent && p.discountPercent > 5)
      .sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  }, []);

  const filteredDeals = useMemo(() => {
    if (selectedCategory === 'All') return deals;
    return deals.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
  }, [deals, selectedCategory]);

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
              <span className="text-gray-900 font-medium">Offers</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Tech Deals & Clearance Offers
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Genuine products from Voltix, NovaTech, AudioMax & more — refreshed daily.
        </p>
      </div>

      {/* Main Promo Banner */}
      <div className="bg-[#eef8f1] rounded-3xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden border border-[#c4ebd3]">
        <div className="flex items-center gap-5 z-10 w-full md:w-auto">
          <div className="w-14 h-14 bg-[#198038] text-white rounded-2xl flex items-center justify-center transform -rotate-6 shadow-md shrink-0">
            <Percent size={28} strokeWidth={2.8} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Extra <span className="text-[#198038]">₹ 500 off</span> your first order
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-gray-600 text-sm font-medium">Use code</span>
              <span className="bg-[#c4ebd3] text-[#125A27] font-bold px-3.5 py-1 rounded-full text-xs tracking-wider">
                NOVA500
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/category')}
          className="mt-5 md:mt-0 bg-[#198038] hover:bg-[#125A27] text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 z-10 text-sm shadow-2xs"
        >
          Explore all tech <ChevronRight size={18} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-8 pb-2 border-b border-gray-100 overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
            selectedCategory === 'All'
              ? 'bg-[#198038] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <LayoutGrid size={16} /> All deals ({deals.length})
        </button>
        <button
          onClick={() => setSelectedCategory('Laptops')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
            selectedCategory === 'Laptops'
              ? 'bg-[#198038] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Laptop size={16} /> Laptops
        </button>
        <button
          onClick={() => setSelectedCategory('Smartphones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
            selectedCategory === 'Smartphones'
              ? 'bg-[#198038] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Smartphone size={16} /> Smartphones
        </button>
        <button
          onClick={() => setSelectedCategory('Headphones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
            selectedCategory === 'Headphones'
              ? 'bg-[#198038] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Headphones size={16} /> Headphones
        </button>
        <button
          onClick={() => setSelectedCategory('Gaming')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
            selectedCategory === 'Gaming'
              ? 'bg-[#198038] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Gamepad2 size={16} /> Gaming
        </button>
        <button
          onClick={() => setSelectedCategory('Accessories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-colors ${
            selectedCategory === 'Accessories'
              ? 'bg-[#198038] text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Plug size={16} /> Accessories
        </button>
      </div>

      {/* Grid of Deals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredDeals.map((deal) => {
          const qty = getItemQuantity(deal.id);
          return (
            <div
              key={deal.id}
              className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all flex flex-col h-full group"
            >
              <Link to={`/product?id=${deal.id}`} className="block flex-1">
                <div className="aspect-square bg-[#f9fafb] rounded-xl mb-3 overflow-hidden p-3 relative flex items-center justify-center border border-gray-100">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 right-2 bg-[#dc2626] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                    {deal.discountPercent}% OFF
                  </span>
                </div>

                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">{deal.brand} · {deal.subcategory}</p>
                <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1 mt-0.5 group-hover:text-[#198038] transition-colors">
                  {deal.name}
                </h3>

                <div className="flex items-baseline gap-2 mt-2 mb-2">
                  <span className="text-base font-extrabold text-gray-900">₹ {deal.price.toLocaleString('en-IN')}</span>
                  {deal.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">₹ {deal.originalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>

                <div className="mb-3">
                  <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    <Zap size={11} className="fill-[#198038]" /> {deal.deliveryTime}
                  </span>
                </div>
              </Link>

              <div className="mt-auto pt-2 border-t border-gray-100">
                <button
                  onClick={() => addToCart(deal)}
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
    </div>
  );
}
