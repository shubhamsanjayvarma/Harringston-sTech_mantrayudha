import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Percent, ChevronRight, Zap, Truck, Leaf, PercentCircle, LayoutGrid, Coffee, Smartphone, Home, Droplets } from 'lucide-react';

export default function Offers() {
  const navigate = useNavigate();
  const deals = [
    {
      id: 1,
      name: 'Strawberries',
      brand: 'Fresh, 250 g',
      price: '99',
      originalPrice: '110',
      discount: '10% off',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      name: 'Premium olive oil',
      brand: 'Figaro, 1 L',
      price: '499',
      originalPrice: '625',
      discount: '20% off',
      image: 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      name: 'Wireless headphones',
      brand: 'Sony WH-CH720N',
      price: '4,999',
      originalPrice: '7,990',
      discount: '37% off',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 4,
      name: 'Air fryer',
      brand: 'Havells Pro Cook 4.2 L',
      price: '3,999',
      originalPrice: '5,499',
      discount: '27% off',
      image: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    }
  ];

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
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">Offers made for your everyday</h1>
        <p className="text-2xl text-gray-600 mt-2">Good finds, better prices — refreshed daily.</p>
      </div>

      {/* Main Promo Banner */}
      <div className="bg-[#eef8f1] rounded-3xl p-8 mb-8 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
        {/* Banner content */}
        <div className="flex items-center gap-6 z-10 w-full md:w-auto">
          <div className="w-16 h-16 bg-[#198038] text-white rounded-2xl flex items-center justify-center transform -rotate-12 shadow-lg">
            <Percent size={32} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Extra <span className="text-[#198038]">₹500 off</span> your first order
            </h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-gray-600 font-medium">Use code</span>
              <span className="bg-[#c4ebd3] text-[#125A27] font-bold px-4 py-1.5 rounded-full tracking-wide">WELCOME500</span>
            </div>
          </div>
        </div>
        
        {/* Decorative Image area */}
        <div className="hidden md:block absolute right-[20%] top-1/2 -translate-y-1/2 h-full py-4 z-0">
           {/* Abstract basket placeholder instead of real image to match UI if needed, but we can use an image */}
           <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Groceries basket" className="h-full object-cover rounded-xl shadow-2xl transform rotate-3" style={{ maskImage: 'linear-gradient(to left, black, transparent)' }} />
        </div>

        <button onClick={() => navigate('/category')} className="mt-6 md:mt-0 bg-[#198038] hover:bg-[#125A27] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 z-10 w-full md:w-auto justify-center">
          Shop deals <ChevronRight size={20} />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-4 mb-10 border-b border-gray-200 pb-2">
        <button className="flex items-center gap-2 px-6 py-3 bg-[#eef8f1] border-2 border-[#198038] text-[#198038] font-bold rounded-full transition-colors">
          <LayoutGrid size={20} /> All offers
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors">
          <Coffee size={20} className="text-gray-500" /> Groceries
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors">
          <Smartphone size={20} className="text-gray-500" /> Electronics
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors">
          <Home size={20} className="text-gray-500" /> Home & kitchen
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors">
          <Droplets size={20} className="text-gray-500" /> Personal care
        </button>
      </div>

      {/* Today's best deals */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Today's best deals</h2>
          <Link to="#" className="text-[#198038] font-bold hover:underline flex items-center gap-1">
            View all <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="group flex flex-col border border-gray-100 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="relative bg-[#f8f6f2] rounded-xl aspect-[4/3] mb-4 flex items-center justify-center p-6 overflow-hidden">
                <img src={deal.image} alt={deal.name} className="w-full h-full object-contain mix-blend-multiply" />
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-[#eef8f1] text-[#198038] font-bold text-xs px-2.5 py-1 rounded-md border border-[#c4ebd3]">
                  {deal.discount}
                </div>
              </div>
              
              <h3 className="font-bold text-gray-900">{deal.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{deal.brand}</p>
              
              <div className="mt-2 flex items-center gap-2">
                <span className="font-bold text-xl text-gray-900">₹ {deal.price}</span>
                <span className="text-sm text-gray-400 line-through">₹ {deal.originalPrice}</span>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#198038] text-xs font-semibold">
                  <Zap size={14} className="fill-[#198038]" /> 10–20 mins
                </div>
                
                <button onClick={() => navigate('/cart')} className="border-2 border-[#198038] text-[#198038] hover:bg-[#eef8f1] font-bold py-1.5 px-6 rounded-lg transition-colors">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* More ways to save */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">More ways to save</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link to="#" className="flex items-center justify-between border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#eef8f1] rounded-full flex items-center justify-center text-[#198038] group-hover:scale-110 transition-transform">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Free delivery above ₹499</h4>
                <p className="text-sm text-gray-500">On all products</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-[#198038]" />
          </Link>
          
          {/* Card 2 */}
          <Link to="#" className="flex items-center justify-between border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#eef8f1] rounded-full flex items-center justify-center text-[#198038] group-hover:scale-110 transition-transform">
                <Leaf size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Fresh picks from ₹49</h4>
                <p className="text-sm text-gray-500">Everyday essentials</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-[#198038]" />
          </Link>
          
          {/* Card 3 */}
          <Link to="#" className="flex items-center justify-between border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#eef8f1] rounded-full flex items-center justify-center text-[#198038] group-hover:scale-110 transition-transform">
                <PercentCircle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Extra savings on appliances</h4>
                <p className="text-sm text-gray-500">Top brands, great deals</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400 group-hover:text-[#198038]" />
          </Link>
        </div>
      </div>

    </div>
  );
}
