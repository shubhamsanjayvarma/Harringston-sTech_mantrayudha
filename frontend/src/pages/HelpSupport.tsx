import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Truck, 
  PackageOpen, 
  CreditCard, 
  User, 
  ChevronRight, 
  Plus, 
  Headset, 
  Clock, 
  MessageCircle, 
  PhoneCall, 
  Mail,
  Box
} from 'lucide-react';

export default function HelpSupport() {
  const navigate = useNavigate();
  const popularQuestions = [
    "How can I track my order?",
    "Can I change my delivery address?",
    "How do I return an item?",
    "When will I receive my refund?"
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
              <span className="text-gray-900 font-medium">Help & support</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-900 tracking-tight">How can we help?</h1>
        <p className="text-2xl text-gray-600 mt-2">Find answers or talk to our team.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-10 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-12 pr-4 py-4 border border-gray-200 bg-gray-50 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300"
          placeholder="Search help articles"
        />
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <Link to="#" className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] hover:shadow-sm transition-all group flex items-start gap-4">
          <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038] flex-shrink-0 group-hover:scale-110 transition-transform">
            <Truck size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">Orders & delivery</h3>
            <p className="text-sm text-gray-500">Track, change or get help with your order.</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 mt-1" />
        </Link>
        
        <Link to="#" className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] hover:shadow-sm transition-all group flex items-start gap-4">
          <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038] flex-shrink-0 group-hover:scale-110 transition-transform">
            <PackageOpen size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">Returns & refunds</h3>
            <p className="text-sm text-gray-500">Return items and check refund status.</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 mt-1" />
        </Link>

        <Link to="#" className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] hover:shadow-sm transition-all group flex items-start gap-4">
          <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038] flex-shrink-0 group-hover:scale-110 transition-transform">
            <CreditCard size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">Payments</h3>
            <p className="text-sm text-gray-500">UPI, cards, wallets and billing help.</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 mt-1" />
        </Link>

        <Link to="#" className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] hover:shadow-sm transition-all group flex items-start gap-4">
          <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038] flex-shrink-0 group-hover:scale-110 transition-transform">
            <User size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">Account & wishlist</h3>
            <p className="text-sm text-gray-500">Manage your account, addresses and wishlist.</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 mt-1" />
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Popular Questions */}
        <div className="w-full lg:w-3/5">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Popular questions</h2>
          <p className="text-gray-500 mt-2 mb-6">Quick answers to the most common questions.</p>
          
          <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-sm">
            {popularQuestions.map((question, index) => (
              <div 
                key={index} 
                className={`p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors ${index !== popularQuestions.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <h3 className="font-bold text-gray-900 text-lg">{question}</h3>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                  <Plus size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Need more help & Recent order */}
        <div className="w-full lg:w-2/5 flex flex-col gap-6">
          
          {/* Contact Box */}
          <div className="bg-[#eef8f1] rounded-2xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Need more help?</h2>
                <p className="text-gray-600 mt-2">Our team is here for you, every day.</p>
              </div>
              <div className="relative">
                <div className="w-16 h-16 bg-[#c4ebd3] rounded-full flex items-center justify-center text-[#198038]">
                  <Headset size={32} strokeWidth={2.5} />
                </div>
                {/* Decorative lines for the headset icon to match the image */}
                <div className="absolute -left-2 top-2 w-1.5 h-1.5 bg-[#198038] rounded-full transform -rotate-45"></div>
                <div className="absolute -left-3 top-6 w-2 h-1.5 bg-[#198038] rounded-full transform -rotate-12"></div>
                <div className="absolute -left-1 bottom-4 w-1.5 h-1.5 bg-[#198038] rounded-full transform rotate-45"></div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 font-medium mb-6">
              <Clock size={20} />
              <span>8:00 AM – 10:00 PM</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button className="flex-1 bg-[#198038] hover:bg-[#125A27] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                <MessageCircle size={20} /> Start a chat
              </button>
              <button className="flex-1 bg-white border border-[#198038] hover:bg-gray-50 text-[#198038] font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                <PhoneCall size={20} /> Call us
              </button>
            </div>

            <div className="flex items-center gap-3 text-gray-700 font-medium pt-4 border-t border-[#c4ebd3]">
              <Mail size={20} />
              <a href="mailto:support@novamart.in" className="hover:underline">support@novamart.in</a>
            </div>
          </div>

          {/* Recent Order Box */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your recent order</h2>
              <Link to="/account" className="text-[#198038] font-semibold hover:underline flex items-center gap-1 text-sm">
                View all orders <ChevronRight size={16} />
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-[#f8f6f2] rounded-xl flex-shrink-0 p-1 flex items-center justify-center border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Strawberries" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Order #NM-240918-5821</p>
                  <p className="text-xs text-gray-500 mt-1">18 Sep 2026</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-[#eef8f1] text-[#198038] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#c4ebd3]">
                    <Box size={12} /> Packing
                  </div>
                </div>
              </div>
              
              <button onClick={() => navigate('/account')} className="w-full sm:w-auto bg-white border border-[#198038] hover:bg-[#eef8f1] text-[#198038] font-bold py-2.5 px-6 rounded-lg text-sm transition-colors mt-2 sm:mt-0">
                Get order help
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
