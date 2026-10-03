import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Battery, Navigation, Truck, ShieldCheck, RotateCcw, Search, Minus, Plus } from 'lucide-react';

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-gray-900">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/category" className="hover:text-gray-900">Electronics</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <Link to="/category" className="hover:text-gray-900">Audio</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Wireless headphones</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 mb-12">
        {/* Left: Images */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-[#f8f6f2] rounded-2xl p-8 relative flex items-center justify-center aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Wireless headphones" 
              className="w-full h-full object-contain mix-blend-multiply"
            />
            <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
              <Search size={20} className="text-gray-600" />
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <button 
                key={i} 
                className={`w-24 h-24 rounded-xl bg-[#f8f6f2] p-2 flex-shrink-0 border-2 ${i === 1 ? 'border-[#198038]' : 'border-transparent hover:border-gray-300'} transition-colors`}
              >
                <img 
                  src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" 
                  alt={`Thumbnail ${i}`} 
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="mb-4">
            <span className="inline-block bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-3 py-1 rounded-md mb-3">
              Bestseller
            </span>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              Wireless headphones
            </h1>
            <p className="text-lg text-gray-500 mt-2">Sony WH-CH720N</p>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Star className="fill-[#198038] text-[#198038]" size={20} />
            <span className="font-bold text-gray-900 text-lg">4.6</span>
            <span className="text-gray-500 hover:underline cursor-pointer">(2.4K reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900">₹ 4,999</span>
            <span className="text-xl text-gray-400 line-through">₹ 7,990</span>
            <span className="text-xl font-bold text-[#198038]">37% off</span>
          </div>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Lightweight comfort with rich sound and all-day battery life.
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-3 w-[45%]">
              <Battery className="text-[#198038]" size={24} />
              <span className="text-sm font-medium text-gray-700">Up to 35 hours<br/>battery</span>
            </div>
            <div className="flex items-center gap-3 w-[45%]">
              <Navigation className="text-[#198038]" size={24} />
              <span className="text-sm font-medium text-gray-700">Active noise<br/>cancellation</span>
            </div>
            <div className="flex items-center gap-3 w-[45%]">
              <Truck className="text-[#198038]" size={24} />
              <span className="text-sm font-medium text-gray-700">Fast delivery<br/>in 10-20 mins</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-14">
              <button 
                className="px-4 text-gray-500 hover:text-black hover:bg-gray-50 h-full transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus size={20} />
              </button>
              <span className="w-10 text-center font-semibold text-lg">{quantity}</span>
              <button 
                className="px-4 text-gray-500 hover:text-black hover:bg-gray-50 h-full transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={20} />
              </button>
            </div>
            
            <button className="flex-1 bg-[#198038] hover:bg-[#125A27] text-white font-semibold rounded-lg h-14 transition-colors text-lg" onClick={() => navigate('/cart')}>
              Add to cart
            </button>
            <button className="flex-1 bg-white border-2 border-[#198038] hover:bg-[#eef8f1] text-[#198038] font-semibold rounded-lg h-14 transition-colors text-lg" onClick={() => navigate('/checkout')}>
              Buy now
            </button>
          </div>

          {/* Guarantees */}
          <div className="bg-[#f8f6f2] rounded-xl p-4 flex flex-wrap gap-y-4 justify-between">
            <div className="flex items-center gap-3 pr-4">
              <Truck className="text-[#198038]" size={24} />
              <div>
                <p className="text-sm font-bold text-gray-900">Free delivery</p>
                <p className="text-xs text-gray-500">On this product</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 border-l border-gray-300">
              <RotateCcw className="text-[#198038]" size={24} />
              <div>
                <p className="text-sm font-bold text-gray-900">Easy returns</p>
                <p className="text-xs text-gray-500">Within 7 days</p>
              </div>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
              <ShieldCheck className="text-[#198038]" size={24} />
              <div>
                <p className="text-sm font-bold text-gray-900">Secure payment</p>
                <p className="text-xs text-gray-500">100% safe & encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-[#198038] text-[#198038] whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg">
              Overview
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg">
              Specifications
            </button>
            <button className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg">
              Reviews
            </button>
          </nav>
        </div>
        <div className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Made for everyday listening</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl">
            Experience powerful sound, effective noise cancellation and long-lasting comfort wherever you go. 
            These wireless headphones feature dual noise sensor technology and the Integrated Processor V1 to 
            take noise cancellation to the next level.
          </p>
        </div>
      </div>
    </div>
  );
}
