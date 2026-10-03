import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Package, MapPin, CreditCard, Heart, HelpCircle, LogOut, ChevronRight, Box, Star } from 'lucide-react';

export default function MyAccount() {
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
              <span className="text-gray-900 font-medium">My account</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">My account</h1>
        <p className="text-xl text-gray-600 mt-2">Hello, Tarak</p>
      </div>

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
              <Link to="/account" className="flex items-center gap-4 px-6 py-4 bg-[#eef8f1] text-[#198038] font-semibold border-l-4 border-[#198038]">
                <Home size={20} />
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
              <Link to="/wishlist" className="flex items-center gap-4 px-6 py-4 text-gray-700 hover:bg-gray-50 font-medium border-l-4 border-transparent hover:border-gray-200">
                <Heart size={20} className="text-gray-400" />
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
        <div className="w-full lg:w-3/4 flex flex-col gap-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#eef8f1] text-[#198038] flex items-center justify-center flex-shrink-0 border border-[#c4ebd3]">
                <Box size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-0.5">Total orders</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f8f6f2] text-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200">
                <Heart size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-0.5">Saved items</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f8f6f2] text-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200">
                <Star size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-0.5">Reward points</p>
                <p className="text-2xl font-bold text-gray-900">240</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f8f6f2] text-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200">
                <MapPin size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-0.5">Active addresses</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="mb-2">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent orders</h2>
              <Link to="/account" className="text-[#198038] font-semibold hover:underline flex items-center gap-1 text-sm">
                View all orders <ChevronRight size={16} />
              </Link>
            </div>

            <div className="space-y-4">
              {/* Order 1 */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 flex flex-wrap justify-between items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="w-full md:w-auto">
                    <p className="font-bold text-gray-900">Order #NM-240918-5821</p>
                    <p className="text-sm text-gray-500 mt-1">18 Sep 2026</p>
                  </div>
                  
                  <div className="w-1/2 md:w-auto">
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="font-bold text-gray-900">₹ 8,597</p>
                  </div>
                  
                  <div className="w-1/2 md:w-auto">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <div className="inline-flex items-center gap-1.5 bg-[#eef8f1] text-[#198038] px-2.5 py-1 rounded-full text-xs font-bold border border-[#c4ebd3]">
                      <Box size={14} /> Packing
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center h-full pt-3">
                    <ChevronRight size={24} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="border-t border-gray-100 p-5 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-wrap gap-6 flex-1">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 p-1">
                        <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Headphones" className="w-full h-full object-contain" />
                      </div>
                      <div className="py-1">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">Wireless headphones</p>
                        <p className="text-xs text-gray-500">Sony WH-CH720N</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: 1</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 p-1">
                        <img src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Air fryer" className="w-full h-full object-contain" />
                      </div>
                      <div className="py-1">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">Air fryer</p>
                        <p className="text-xs text-gray-500">Havells Pro Cook 4.2 L</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: 1</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 p-1">
                        <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Strawberries" className="w-full h-full object-contain" />
                      </div>
                      <div className="py-1">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">Strawberries</p>
                        <p className="text-xs text-gray-500">Fresh, 250 g</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: 1</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent('open-support-chat', {
                            detail: { query: 'Where is my order ORD-001042?', tab: 'chat' }
                          })
                        );
                      }} 
                      className="bg-[#198038] hover:bg-[#125A27] text-white font-semibold py-2 px-6 rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                      Track order
                    </button>
                    <button 
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent('open-support-chat', {
                            detail: { query: 'I need help with order ORD-001042', tab: 'chat' }
                          })
                        );
                      }} 
                      className="bg-white border border-[#198038] hover:bg-[#eef8f1] text-[#198038] font-semibold py-2 px-6 rounded-lg text-sm transition-colors whitespace-nowrap"
                    >
                      Get Agent Help
                    </button>
                  </div>
                </div>
              </div>

              {/* Order 2 */}
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 flex flex-wrap justify-between items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="w-full md:w-auto">
                    <p className="font-bold text-gray-900">Order #NM-240901-4472</p>
                    <p className="text-sm text-gray-500 mt-1">01 Sep 2026</p>
                  </div>
                  
                  <div className="w-1/2 md:w-auto">
                    <p className="text-sm text-gray-500 mb-1">Total</p>
                    <p className="font-bold text-gray-900">₹ 2,348</p>
                  </div>
                  
                  <div className="w-1/2 md:w-auto">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <div className="inline-flex items-center gap-1.5 bg-[#eef8f1] text-[#198038] px-2.5 py-1 rounded-full text-xs font-bold border border-[#c4ebd3]">
                      <div className="w-2 h-2 rounded-full bg-[#198038]"></div> Delivered
                    </div>
                  </div>
                  
                  <div className="hidden md:flex items-center h-full pt-3">
                    <ChevronRight size={24} className="text-gray-400" />
                  </div>
                </div>
                
                <div className="border-t border-gray-100 p-5 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-wrap gap-6 flex-1">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 p-1">
                        <img src="https://images.unsplash.com/photo-1473691955023-da1c49c95c78?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Olive oil" className="w-full h-full object-contain" />
                      </div>
                      <div className="py-1">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">Extra virgin olive oil</p>
                        <p className="text-xs text-gray-500">Figaro, 1 L</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: 1</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-16 h-16 bg-white rounded-xl border border-gray-200 p-1">
                        <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Strawberries" className="w-full h-full object-contain" />
                      </div>
                      <div className="py-1">
                        <p className="font-semibold text-sm text-gray-900 line-clamp-1">Strawberries</p>
                        <p className="text-xs text-gray-500">Fresh, 250 g</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: 2</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 w-full md:w-auto">
                    <button onClick={() => navigate('/account')} className="bg-white border border-[#198038] hover:bg-[#eef8f1] text-[#198038] font-semibold py-2 px-6 rounded-lg text-sm transition-colors whitespace-nowrap">
                      View order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved Addresses */}
          <div>
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Saved addresses</h2>
              <Link to="/account" className="text-[#198038] font-semibold hover:underline flex items-center gap-1 text-sm">
                View all addresses <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-[#eef8f1] text-[#198038] flex items-center justify-center flex-shrink-0">
                  <Home size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Home</h4>
                  <p className="text-gray-500 text-sm mt-1">Indiranagar, Bengaluru 560038</p>
                  <p className="text-gray-500 text-sm mt-1">Tarak S. <span className="mx-2">|</span> +91 98•• •••42</p>
                </div>
              </div>
              <button className="text-[#198038] font-bold text-sm hover:underline">Edit</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
