import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Percent, 
  ChevronRight, 
  Zap, 
  Truck, 
  Leaf, 
  PercentCircle, 
  Plus,
  Minus,
  Check,
  Copy,
  Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data/mockData';

export default function Offers() {
  const navigate = useNavigate();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WELCOME500');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const offerTags = ['All', 'Breakfast Deals', 'Combos', 'Tech Savings', 'Kitchen Offers'];

  // Filter products that have discounts or are marked as Offers
  const dealProducts = ALL_PRODUCTS.filter((product) => {
    const isOffer = product.category === 'Offers' || (product.originalPrice && product.originalPrice > product.price);
    if (!isOffer) return false;

    if (selectedTag === 'All') return true;
    return product.subCategory?.toLowerCase() === selectedTag.toLowerCase();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-[#198038] font-semibold">Special Offers</span>
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
              Super Saver Deals & Combos
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-2xl leading-relaxed">
              Exclusive curated value packs, bundle discounts, and limited-time price drops.
            </p>
          </div>
          
          <div className="text-right flex flex-col items-end shrink-0">
            <span className="text-3xl sm:text-4xl font-black text-[#198038] leading-none">
              {dealProducts.length}
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
          {offerTags.map((tag) => {
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
                {tag === 'All' ? 'All Offers' : tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Promo Banner with Coupon Code */}
      <div className="bg-gradient-to-r from-[#eef8f1] via-[#e5f5ea] to-white rounded-3xl p-6 sm:p-8 mb-10 flex flex-col md:flex-row justify-between items-center relative overflow-hidden border border-[#c4ebd3] shadow-xs">
        {/* Banner content */}
        <div className="flex items-center gap-6 z-10 w-full md:w-auto">
          <div className="w-16 h-16 bg-[#198038] text-white rounded-2xl flex items-center justify-center transform -rotate-6 shadow-md shrink-0">
            <Percent size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex flex-wrap items-center gap-2">
              Extra <span className="text-[#198038]">₹500 off</span> your first order
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="text-gray-600 font-medium text-sm">Use coupon code:</span>
              <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-[#c4ebd3] shadow-2xs">
                <span className="font-mono font-bold text-sm text-[#125A27] tracking-wider">WELCOME500</span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 hover:bg-[#eef8f1] rounded-full text-gray-600 hover:text-[#198038] transition-colors cursor-pointer"
                  title="Copy coupon code"
                >
                  {copiedCode ? <Check size={14} className="text-[#198038]" /> : <Copy size={14} />}
                </button>
              </div>
              {copiedCode && (
                <span className="text-xs font-bold text-[#198038] animate-in fade-in">Copied to clipboard!</span>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            const section = document.getElementById('deals-grid');
            section?.scrollIntoView({ behavior: 'smooth' });
          }} 
          className="mt-6 md:mt-0 bg-[#198038] hover:bg-[#125A27] text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center gap-2 z-10 w-full md:w-auto justify-center shadow-xs cursor-pointer"
        >
          Explore All Deals <ChevronRight size={18} />
        </button>
      </div>

      {/* Deals Grid */}
      <div id="deals-grid" className="mb-14 scroll-mt-28">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {selectedTag === 'All' ? "Today's Best Deals" : `${selectedTag}`}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Showing {dealProducts.length} verified discounts
            </p>
          </div>
        </div>

        {dealProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dealProducts.map((deal) => {
              const quantity = getItemQuantity(deal.id);
              const discountPercent = deal.originalPrice && deal.originalPrice > deal.price
                ? Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)
                : 20;

              return (
                <div 
                  key={deal.id} 
                  className="group flex flex-col border border-gray-200 hover:border-[#198038] rounded-2xl p-4 bg-white shadow-xs hover:shadow-md transition-all"
                >
                  <div className="relative bg-gray-50 rounded-xl aspect-[4/3] mb-4 flex items-center justify-center p-4 overflow-hidden">
                    <img 
                      src={deal.image} 
                      alt={deal.name} 
                      className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/strawberries.jpg';
                      }}
                    />
                    
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 bg-[#eef8f1] text-[#125A27] font-bold text-xs px-2.5 py-1 rounded-md border border-[#c4ebd3] shadow-2xs">
                      {discountPercent}% OFF
                    </div>

                    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-[10px] font-bold text-gray-700 px-2 py-0.5 rounded shadow-2xs">
                      {deal.subCategory || deal.category}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 leading-snug line-clamp-1">{deal.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{deal.subtitle}</p>
                  
                  {deal.rating && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-800">{deal.rating}</span>
                      <span className="text-gray-400">• Verified</span>
                    </div>
                  )}

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-extrabold text-xl text-gray-950">
                      ₹{deal.price.toLocaleString('en-IN')}
                    </span>
                    {deal.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{deal.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
                    <div className="flex items-center gap-1 text-[#198038] text-xs font-semibold">
                      <Zap size={14} className="fill-[#198038]" /> {deal.deliveryTime || '10–15 mins'}
                    </div>
                    
                    {quantity > 0 ? (
                      <div className="inline-flex items-center bg-[#198038] text-white rounded-xl shadow-xs">
                        <button
                          onClick={() => updateQuantity(deal.id, -1)}
                          className="p-1.5 hover:bg-[#125A27] rounded-l-xl transition-colors cursor-pointer"
                          title="Decrease"
                        >
                          <Minus size={14} strokeWidth={2.5} />
                        </button>
                        <span className="px-2 text-xs font-bold">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(deal.id, 1)}
                          className="p-1.5 hover:bg-[#125A27] rounded-r-xl transition-colors cursor-pointer"
                          title="Increase"
                        >
                          <Plus size={14} strokeWidth={2.5} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => addToCart(deal)}
                        className="bg-[#198038] hover:bg-[#125A27] text-white font-bold py-1.5 px-5 rounded-xl text-xs transition-colors shadow-2xs hover:shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={13} strokeWidth={2.5} /> Add
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center">
            <p className="text-lg font-bold text-gray-900 mb-2">No offers available in this category currently</p>
            <p className="text-sm text-gray-500 mb-6">Explore our full catalog of products in other categories.</p>
            <button
              onClick={() => setSelectedTag('All')}
              className="bg-[#198038] text-white font-bold text-xs py-2 px-5 rounded-xl hover:bg-[#125A27] transition-colors"
            >
              View All Offers
            </button>
          </div>
        )}
      </div>

      {/* Value Badges Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">More ways to save</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/category?name=Groceries')}
            className="flex items-center justify-between border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] transition-all group cursor-pointer shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#eef8f1] rounded-2xl flex items-center justify-center text-[#198038] group-hover:scale-110 transition-transform">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Free delivery above ₹499</h4>
                <p className="text-xs text-gray-500 mt-0.5">Applied automatically on checkout</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[#198038] transition-colors" />
          </div>
          
          <div 
            onClick={() => navigate('/category?name=Fresh')}
            className="flex items-center justify-between border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] transition-all group cursor-pointer shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#eef8f1] rounded-2xl flex items-center justify-center text-[#198038] group-hover:scale-110 transition-transform">
                <Leaf size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Fresh farm picks from ₹49</h4>
                <p className="text-xs text-gray-500 mt-0.5">Hand-picked organic produce</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[#198038] transition-colors" />
          </div>
          
          <div 
            onClick={() => navigate('/category?name=Electronics')}
            className="flex items-center justify-between border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] transition-all group cursor-pointer shadow-xs hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#eef8f1] rounded-2xl flex items-center justify-center text-[#198038] group-hover:scale-110 transition-transform">
                <PercentCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Up to 40% on Electronics</h4>
                <p className="text-xs text-gray-500 mt-0.5">Brand warranties & easy returns</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[#198038] transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
