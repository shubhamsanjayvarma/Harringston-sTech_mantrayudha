import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, ChevronUp, Star } from 'lucide-react';

export default function Category() {
  const navigate = useNavigate();

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
              <span className="text-gray-900 font-medium">Electronics</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Electronics</h1>
        <p className="text-lg text-gray-600">Everyday tech, chosen well.</p>
        
        {/* Horizontal Tags */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="px-4 py-2 bg-[#eef8f1] text-[#125A27] font-medium rounded-lg border border-[#c4ebd3]">
            All electronics
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-gray-300">
            Audio
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-gray-300">
            Kitchen appliances
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-gray-300">
            Mobiles & accessories
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-gray-300">
            Computing
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="border border-gray-100 rounded-2xl bg-gray-50/50 p-5 space-y-6">
            
            {/* Category Filter */}
            <div>
              <button className="flex items-center justify-between w-full font-bold text-gray-900 mb-3">
                Category <ChevronUp size={18} />
              </button>
              <div className="space-y-2.5">
                {[
                  { name: 'Audio', count: 32 },
                  { name: 'Kitchen appliances', count: 28 },
                  { name: 'Mobiles & accessories', count: 34 },
                  { name: 'Computing', count: 22 },
                  { name: 'Wearables', count: 12 },
                ].map((item, i) => (
                  <label key={i} className="flex items-center text-sm text-gray-700 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#198038] focus:ring-[#198038] mr-3" />
                    <span className="group-hover:text-black">{item.name} <span className="text-gray-400">({item.count})</span></span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Brand Filter */}
            <div>
              <button className="flex items-center justify-between w-full font-bold text-gray-900 mb-3">
                Brand <ChevronUp size={18} />
              </button>
              <div className="space-y-2.5">
                {[
                  { name: 'Apple', count: 18 },
                  { name: 'Sony', count: 14 },
                  { name: 'Samsung', count: 16 },
                  { name: 'Philips', count: 10 },
                  { name: 'boAt', count: 8 },
                ].map((item, i) => (
                  <label key={i} className="flex items-center text-sm text-gray-700 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#198038] focus:ring-[#198038] mr-3" />
                    <span className="group-hover:text-black">{item.name} <span className="text-gray-400">({item.count})</span></span>
                  </label>
                ))}
                <button className="text-[#198038] text-sm font-medium hover:underline mt-1">Show more</button>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Price Filter */}
            <div>
              <button className="flex items-center justify-between w-full font-bold text-gray-900 mb-3">
                Price <ChevronUp size={18} />
              </button>
              <div className="space-y-2.5">
                {[
                  { name: 'Under ₹5,000', count: 28 },
                  { name: '₹5,000 - ₹20,000', count: 44 },
                  { name: '₹20,000 - ₹50,000', count: 36 },
                  { name: 'Above ₹50,000', count: 20 },
                ].map((item, i) => (
                  <label key={i} className="flex items-center text-sm text-gray-700 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#198038] focus:ring-[#198038] mr-3" />
                    <span className="group-hover:text-black">{item.name} <span className="text-gray-400">({item.count})</span></span>
                  </label>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Delivery Filter */}
            <div>
              <button className="flex items-center justify-between w-full font-bold text-gray-900 mb-3">
                Delivery <ChevronUp size={18} />
              </button>
              <div className="space-y-2.5">
                <label className="flex items-center text-sm text-gray-700 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#198038] focus:ring-[#198038] mr-3" />
                  <span className="group-hover:text-black">10-20 mins <span className="text-gray-400">(128)</span></span>
                </label>
              </div>
            </div>

          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Popular in electronics</h2>
              <p className="text-sm text-gray-500 mt-1">128 products</p>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center">
              <div className="relative">
                <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest Arrivals</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <Link to="/product" className="group">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer">
                <div className="aspect-square bg-[#f8f6f2] rounded-xl mb-4 overflow-hidden p-6 relative flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Wireless headphones" 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 leading-tight">Wireless headphones</h3>
                  <p className="text-sm text-gray-500 mt-1">Sony WH-CH720N</p>
                  
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <Star className="fill-[#198038] text-[#198038]" size={14} />
                    <span className="font-bold text-gray-900">4.6</span>
                    <span className="text-gray-500">(2.4K)</span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold">₹ 4,999</span>
                    <span className="text-sm text-gray-400 line-through">₹ 7,990</span>
                    <span className="text-sm font-bold text-[#198038]">37% off</span>
                  </div>
                  
                  <div className="mt-2 mb-4">
                    <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                      <span className="text-[#198038]">⚡</span> 10-20 mins
                    </span>
                  </div>
                  <div className="mt-auto">
                    <button onClick={(e) => { e.preventDefault(); navigate('/cart'); }} className="w-full bg-white border border-[#198038] text-[#198038] hover:bg-[#eef8f1] font-semibold py-2.5 rounded-lg transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link to="/product" className="group">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer">
                <div className="aspect-square bg-[#f8f6f2] rounded-xl mb-4 overflow-hidden p-6 relative flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Espresso coffee maker" 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 leading-tight">Espresso coffee maker</h3>
                  <p className="text-sm text-gray-500 mt-1">Philips EP3221/40</p>
                  
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <Star className="fill-[#198038] text-[#198038]" size={14} />
                    <span className="font-bold text-gray-900">4.4</span>
                    <span className="text-gray-500">(1.8K)</span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold">₹ 32,999</span>
                    <span className="text-sm text-gray-400 line-through">₹ 44,990</span>
                    <span className="text-sm font-bold text-[#198038]">27% off</span>
                  </div>
                  
                  <div className="mt-2 mb-4">
                    <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                      <span className="text-[#198038]">⚡</span> 10-20 mins
                    </span>
                  </div>
                  <div className="mt-auto">
                    <button onClick={(e) => { e.preventDefault(); navigate('/cart'); }} className="w-full bg-white border border-[#198038] text-[#198038] hover:bg-[#eef8f1] font-semibold py-2.5 rounded-lg transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link to="/product" className="group">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer">
                <div className="aspect-square bg-[#f8f6f2] rounded-xl mb-4 overflow-hidden p-6 relative flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Air fryer" 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 leading-tight">Air fryer</h3>
                  <p className="text-sm text-gray-500 mt-1">Havells Pro Cook 4.2 L</p>
                  
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <Star className="fill-[#198038] text-[#198038]" size={14} />
                    <span className="font-bold text-gray-900">4.5</span>
                    <span className="text-gray-500">(3.1K)</span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold">₹ 3,999</span>
                    <span className="text-sm text-gray-400 line-through">₹ 5,999</span>
                    <span className="text-sm font-bold text-[#198038]">33% off</span>
                  </div>
                  
                  <div className="mt-2 mb-4">
                    <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                      <span className="text-[#198038]">⚡</span> 10-20 mins
                    </span>
                  </div>
                  <div className="mt-auto">
                    <button onClick={(e) => { e.preventDefault(); navigate('/cart'); }} className="w-full bg-white border border-[#198038] text-[#198038] hover:bg-[#eef8f1] font-semibold py-2.5 rounded-lg transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 4 */}
            <Link to="/product" className="group">
              <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full cursor-pointer">
                <div className="aspect-square bg-[#f8f6f2] rounded-xl mb-4 overflow-hidden p-6 relative flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Laptop" 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-semibold text-gray-900 leading-tight">Laptop</h3>
                  <p className="text-sm text-gray-500 mt-1">Apple MacBook Pro M3</p>
                  
                  <div className="mt-2 flex items-center gap-1.5 text-sm">
                    <Star className="fill-[#198038] text-[#198038]" size={14} />
                    <span className="font-bold text-gray-900">4.8</span>
                    <span className="text-gray-500">(892)</span>
                  </div>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-bold">₹ 1,49,900</span>
                    <span className="text-sm text-gray-400 line-through">₹ 1,69,900</span>
                    <span className="text-sm font-bold text-[#198038]">12% off</span>
                  </div>
                  
                  <div className="mt-2 mb-4">
                    <span className="inline-flex items-center gap-1 bg-[#eef8f1] text-[#125A27] text-xs font-semibold px-2 py-1 rounded-md">
                      <span className="text-[#198038]">⚡</span> 10-20 mins
                    </span>
                  </div>
                  <div className="mt-auto">
                    <button onClick={(e) => { e.preventDefault(); navigate('/cart'); }} className="w-full bg-white border border-[#198038] text-[#198038] hover:bg-[#eef8f1] font-semibold py-2.5 rounded-lg transition-colors">
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}
