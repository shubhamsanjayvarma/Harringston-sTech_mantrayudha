import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Package, MapPin, CreditCard, Heart, HelpCircle, LogOut, ChevronDown, Star, Zap } from 'lucide-react';

export default function Wishlist() {
  const navigate = useNavigate();
  const wishlistItems = [
    {
      id: 1,
      name: 'Wireless headphones',
      brand: 'Sony WH-CH720N',
      price: '4,999',
      originalPrice: '7,990',
      discount: '37% off',
      rating: 4.6,
      reviews: '2.4K',
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      name: 'Espresso coffee maker',
      brand: "De'Longhi Stilosa EC260.BK",
      price: '8,999',
      originalPrice: '12,995',
      discount: '31% off',
      rating: 4.5,
      reviews: '1.2K',
      image: 'https://images.unsplash.com/photo-1520970014086-2208d157c9e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 3,
      name: 'Air fryer',
      brand: 'Havells Pro Cook 4.2 L',
      price: '3,999',
      originalPrice: '5,495',
      discount: '27% off',
      rating: 4.4,
      reviews: '892',
      image: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 4,
      name: 'Laptop',
      brand: 'Apple MacBook Air M2 (13.6")',
      price: '89,900',
      originalPrice: '99,900',
      discount: '10% off',
      rating: 4.8,
      reviews: '3.1K',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 5,
      name: 'Strawberries',
      brand: 'Fresh, 250 g',
      price: '99',
      originalPrice: '',
      discount: '',
      rating: 4.5,
      reviews: '1.1K',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 6,
      name: 'Extra virgin olive oil',
      brand: 'Figaro, 1 L',
      price: '699',
      originalPrice: '850',
      discount: '18% off',
      rating: 4.4,
      reviews: '982',
      image: 'https://images.unsplash.com/photo-1473691955023-da1c49c95c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 7,
      name: 'Blender',
      brand: 'Philips 5000 Series, 1.5 L',
      price: '4,499',
      originalPrice: '5,995',
      discount: '25% off',
      rating: 4.3,
      reviews: '650',
      image: 'https://images.unsplash.com/photo-1585237894520-2210fb835071?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 8,
      name: 'Skincare set',
      brand: 'CeraVe Daily Essentials (3 pcs)',
      price: '1,299',
      originalPrice: '1,697',
      discount: '23% off',
      rating: 4.6,
      reviews: '1.5K',
      image: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
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
              <Link to="/account" className="hover:text-gray-900">My account</Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Wishlist</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="p-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-[#eef8f1] text-[#198038] rounded-full flex items-center justify-center text-xl font-bold">
                TS
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Tarak S.</h3>
                <p className="text-sm text-gray-500">tarak.s@email.com</p>
              </div>
            </div>
            
            <nav className="flex flex-col">
              <Link to="/account" className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <Home size={20} className="text-gray-400" />
                Overview
              </Link>
              <Link to="#" className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <Package size={20} className="text-gray-400" />
                My orders
              </Link>
              <Link to="#" className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <MapPin size={20} className="text-gray-400" />
                Saved addresses
              </Link>
              <Link to="#" className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <CreditCard size={20} className="text-gray-400" />
                Payment methods
              </Link>
              <Link to="/wishlist" className="flex items-center gap-4 px-6 py-4 bg-[#eef8f1] text-[#198038] font-semibold border-l-4 border-[#198038]">
                <Heart size={20} />
                Wishlist
              </Link>
              
              <div className="my-2 border-t border-gray-100"></div>
              
              <Link to="/help" className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <HelpCircle size={20} className="text-gray-400" />
                Help & support
              </Link>
              <Link to="#" className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <LogOut size={20} className="text-gray-400" />
                Sign out
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Saved items</h1>
              <p className="text-lg text-gray-600 mt-2">Your favourites, ready when you are.</p>
            </div>
            <span className="text-gray-500 font-medium mt-2">8 items</span>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by:</span>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50">
                Recently added <ChevronDown size={16} />
              </button>
            </div>
            
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-[#eef8f1] text-[#198038] border border-[#c4ebd3] rounded-full font-semibold text-sm">
                All items
              </button>
              <button className="px-4 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-full font-medium text-sm hover:bg-gray-50">
                In stock
              </button>
              <button className="px-4 py-1.5 bg-white text-gray-600 border border-gray-300 rounded-full font-medium text-sm hover:bg-gray-50">
                On offer
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="group flex flex-col">
                <div className="relative bg-[#f8f6f2] rounded-2xl aspect-square mb-3 flex items-center justify-center p-4">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  
                  {/* Remove button */}
                  <button className="absolute top-3 right-3 flex flex-col items-center">
                    <Heart size={24} className="fill-[#198038] text-[#198038]" />
                    <span className="text-[10px] font-medium text-gray-500 mt-0.5">Remove</span>
                  </button>
                </div>
                
                <h3 className="font-bold text-gray-900 text-sm">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{item.brand}</p>
                
                <div className="flex items-center gap-1 mt-1">
                  <Star size={14} className="fill-[#198038] text-[#198038]" />
                  <span className="font-bold text-sm">{item.rating}</span>
                  <span className="text-gray-500 text-xs">({item.reviews} reviews)</span>
                </div>
                
                <div className="mt-2 flex items-center gap-2">
                  <span className="font-bold text-lg">₹ {item.price}</span>
                  {item.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">₹ {item.originalPrice}</span>
                  )}
                  {item.discount && (
                    <span className="text-xs font-bold text-[#198038]">{item.discount}</span>
                  )}
                </div>
                
                <div className="mt-1 flex items-center gap-1 text-[#198038] text-xs font-semibold">
                  <Zap size={12} className="fill-[#198038]" /> 10–20 mins
                </div>
                
                <button onClick={() => navigate('/cart')} className="mt-3 w-full border-2 border-[#198038] text-[#198038] hover:bg-[#eef8f1] font-bold py-2 rounded-lg transition-colors">
                  Add to cart
                </button>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
