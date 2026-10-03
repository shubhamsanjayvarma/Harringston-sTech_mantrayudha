import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  Leaf,
  Clock,
  RotateCcw
} from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-[#f8f5f0] overflow-hidden">
        {/* Background Image Setup */}
        <div className="absolute inset-0 z-0">
           <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
              alt="Groceries" 
              className="w-full h-full object-cover opacity-60 mix-blend-multiply"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-[#f8f5f0] via-[#f8f5f0]/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-xl">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight mb-4">
              Everything you need,<br />in one place.
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Everyday essentials, delivered with care.
            </p>
            <button onClick={() => navigate('/category')} className="bg-[#1c2433] text-white px-8 py-4 rounded-full font-medium flex items-center hover:bg-gray-800 transition-colors">
              Shop now <ChevronRight size={20} className="ml-2" />
            </button>

            <div className="mt-12 flex items-center gap-8 text-sm font-medium text-gray-800">
              <div className="flex items-center gap-2">
                <div className="bg-[#eef8f1] p-2 rounded-full text-[#198038]">
                  <Leaf size={18} />
                </div>
                Fresh daily
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#eef8f1] p-2 rounded-full text-[#198038]">
                  <Clock size={18} />
                </div>
                Quick delivery
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#eef8f1] p-2 rounded-full text-[#198038]">
                  <RotateCcw size={18} />
                </div>
                Easy returns
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Right Now */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Popular right now</h2>
          <Link to="/category" className="text-[#198038] font-medium flex items-center hover:underline">
            View all <ChevronRight size={16} className="ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product Card 1 */}
          <Link to="/product" className="group">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer">
              <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden p-4 relative">
                <img 
                  src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Strawberries" 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 leading-tight">Strawberries</h3>
                <p className="text-sm text-gray-500 mt-1">250 g</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl font-bold">₹ 99</span>
                </div>
                <div className="mt-2 mb-4">
                  <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                    <span className="text-[#198038]">⚡</span> 10 mins
                  </span>
                </div>
                <div className="mt-auto">
                  <button onClick={(e) => { e.preventDefault(); navigate('/cart'); }} className="w-full bg-[#357c3c] hover:bg-[#2b6531] text-white font-medium py-2.5 rounded-lg transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Link>

          {/* Product Card 2 */}
          <Link to="/product" className="group">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer">
              <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden p-4 relative">
                <img 
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Olive oil" 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 leading-tight">Extra virgin<br/>olive oil</h3>
                <p className="text-sm text-gray-500 mt-1">500 ml</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl font-bold">₹ 499</span>
                </div>
                <div className="mt-2 mb-4">
                  <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                    <span className="text-[#198038]">⚡</span> 10 mins
                  </span>
                </div>
                <div className="mt-auto">
                  <button onClick={(e) => { e.preventDefault(); navigate('/cart'); }} className="w-full bg-[#357c3c] hover:bg-[#2b6531] text-white font-medium py-2.5 rounded-lg transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Link>

          {/* Product Card 3 */}
          <Link to="/product" className="group">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer">
              <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden p-4 relative">
                <img 
                  src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Headphones" 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 leading-tight">Wireless<br/>headphones</h3>
                <p className="text-sm text-gray-500 mt-1">Noise cancellation</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl font-bold">₹ 4,999</span>
                </div>
                <div className="mt-2 mb-4">
                  <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                    <span className="text-[#198038]">⚡</span> 15 mins
                  </span>
                </div>
                <div className="mt-auto">
                  <button onClick={(e) => { e.preventDefault(); navigate('/cart'); }} className="w-full bg-[#357c3c] hover:bg-[#2b6531] text-white font-medium py-2.5 rounded-lg transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Link>

          {/* Product Card 4 */}
          <Link to="/product" className="group">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer">
              <div className="aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden p-4 relative">
                <img 
                  src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Air fryer" 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-semibold text-gray-900 leading-tight">Air fryer</h3>
                <p className="text-sm text-gray-500 mt-1">4.2 L</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl font-bold">₹ 3,999</span>
                </div>
                <div className="mt-2 mb-4">
                  <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                    <span className="text-[#198038]">⚡</span> 15 mins
                  </span>
                </div>
                <div className="mt-auto">
                  <button onClick={(e) => { e.preventDefault(); navigate('/cart'); }} className="w-full bg-[#357c3c] hover:bg-[#2b6531] text-white font-medium py-2.5 rounded-lg transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
