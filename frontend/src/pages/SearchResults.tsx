import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, Star, Zap, Truck, Heart } from 'lucide-react';

export default function SearchResults() {
  const navigate = useNavigate();
  const searchResults = [
    {
      id: 1,
      name: 'Espresso coffee maker',
      brand: "De'Longhi Dedica EC685",
      price: '32,999',
      rating: 4.6,
      reviews: '1.2K',
      delivery: 'Same day',
      isFastDelivery: false,
      image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      name: 'Ground coffee',
      brand: 'Nescafé Classic, 250 g',
      price: '399',
      rating: 4.5,
      reviews: '3.4K',
      delivery: '10–20 mins',
      isFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      name: 'Instant coffee',
      brand: 'Bru Gold, 100 g',
      price: '249',
      rating: 4.4,
      reviews: '2.1K',
      delivery: '10–20 mins',
      isFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 4,
      name: 'Coffee grinder',
      brand: 'Philips Daily Collection',
      price: '1,999',
      rating: 4.3,
      reviews: '892',
      delivery: 'Same day',
      isFastDelivery: false,
      image: 'https://images.unsplash.com/photo-1585237894520-2210fb835071?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 5,
      name: 'Coffee beans',
      brand: 'Starbucks House Blend, 250 g',
      price: '549',
      rating: 4.6,
      reviews: '1.8K',
      delivery: '10–20 mins',
      isFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 6,
      name: 'French press',
      brand: 'Borosil, 600 ml',
      price: '999',
      rating: 4.4,
      reviews: '650',
      delivery: 'Same day',
      isFastDelivery: false,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 7,
      name: 'Espresso coffee maker',
      brand: 'Nespresso Essenza Mini',
      price: '11,999',
      rating: 4.5,
      reviews: '1.1K',
      delivery: 'Same day',
      isFastDelivery: false,
      image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 8,
      name: 'Coffee pods',
      brand: 'Nescafé Dolce Gusto, 16 pods',
      price: '699',
      rating: 4.4,
      reviews: '420',
      delivery: '10–20 mins',
      isFastDelivery: true,
      image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
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
              <span className="text-gray-900 font-medium">Search results</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Search results for 'coffee'</h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-gray-200 pb-4">
        <div className="flex items-center gap-6">
          <span className="text-lg text-gray-600">24 products found</span>
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 text-gray-800 font-medium px-4 py-1.5 rounded-full flex items-center gap-2 text-sm border border-gray-200 hover:bg-gray-200 cursor-pointer transition-colors">
              coffee <X size={14} className="text-gray-500" />
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">24 products</span>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 text-sm">
              Recommended <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar (Filters) */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          
          {/* Category Filter */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <button className="flex justify-between items-center w-full text-left font-bold text-gray-900 mb-4">
              Category
              <ChevronUp size={20} className="text-gray-500" />
            </button>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">Groceries <span className="text-gray-400">(14)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-900 font-medium">Coffee & tea <span className="text-gray-500">(12)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-900 font-medium">Kitchen appliances <span className="text-gray-500">(10)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">Electronics <span className="text-gray-400">(0)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">Home <span className="text-gray-400">(0)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">Personal care <span className="text-gray-400">(0)</span></span>
              </label>
            </div>
          </div>

          {/* Brand Filter */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <button className="flex justify-between items-center w-full text-left font-bold text-gray-900 mb-4">
              Brand
              <ChevronUp size={20} className="text-gray-500" />
            </button>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">Nescafé <span className="text-gray-400">(5)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">Bru <span className="text-gray-400">(3)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">De'Longhi <span className="text-gray-400">(2)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">Philips <span className="text-gray-400">(2)</span></span>
              </label>
              <button className="text-[#198038] font-bold text-sm hover:underline mt-2">
                Show more <ChevronDown size={14} className="inline" />
              </button>
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-6 border-b border-gray-200 pb-6">
            <button className="flex justify-between items-center w-full text-left font-bold text-gray-900 mb-4">
              Price
              <ChevronUp size={20} className="text-gray-500" />
            </button>
            <p className="text-sm text-gray-600 mb-4">₹100 – ₹50,000</p>
            <div className="px-2">
              <div className="h-1.5 w-full bg-gray-200 rounded-full relative mb-6">
                <div className="absolute left-[0%] right-[0%] h-full bg-[#198038] rounded-full"></div>
                <div className="absolute left-[0%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#198038] rounded-full shadow cursor-pointer"></div>
                <div className="absolute right-[0%] top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#198038] rounded-full shadow cursor-pointer"></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹100</span>
                <span>₹50,000</span>
              </div>
            </div>
          </div>

          {/* Delivery Filter */}
          <div className="mb-6">
            <button className="flex justify-between items-center w-full text-left font-bold text-gray-900 mb-4">
              Delivery
              <ChevronUp size={20} className="text-gray-500" />
            </button>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">10–20 mins <span className="text-gray-400">(14)</span></span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#198038] focus:ring-[#198038]" />
                <span className="text-gray-700 group-hover:text-gray-900">Same day <span className="text-gray-400">(10)</span></span>
              </label>
            </div>
          </div>

        </div>

        {/* Main Content (Product Grid) */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div className="relative bg-[#f8f6f2] rounded-2xl aspect-square mb-3 flex items-center justify-center p-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  
                  {/* Heart button */}
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-[#198038] transition-colors">
                    <Heart size={24} strokeWidth={2} />
                  </button>
                </div>
                
                <h3 className="font-bold text-gray-900 text-sm leading-snug h-10">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5 h-4 line-clamp-1">{product.brand}</p>
                
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="fill-[#198038] text-[#198038]" />
                  <span className="font-bold text-sm">{product.rating}</span>
                  <span className="text-gray-500 text-xs">({product.reviews} reviews)</span>
                </div>
                
                <div className="mt-2">
                  <span className="font-bold text-xl">₹ {product.price}</span>
                </div>
                
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
                  {product.isFastDelivery ? (
                    <>
                      <Zap size={14} className="fill-[#198038] text-[#198038]" />
                      <span className="text-[#198038]">{product.delivery}</span>
                    </>
                  ) : (
                    <>
                      <Truck size={14} className="text-gray-500" />
                      <span className="text-[#198038]">{product.delivery}</span>
                    </>
                  )}
                </div>
                
                <button onClick={() => navigate('/cart')} className="mt-4 w-full border-2 border-[#198038] text-[#198038] hover:bg-[#eef8f1] font-bold py-2 rounded-lg transition-colors">
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
