import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  User, 
  ShoppingCart, 
  ChevronDown, 
  Leaf,
  ShoppingBag,
  Smartphone,
  Home,
  Droplet,
  Percent
} from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#eef8f1] py-2 text-center text-sm font-medium text-[#125A27] flex items-center justify-center gap-2">
        <Leaf size={16} />
        Fresh picks. Fast delivery.
      </div>

      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                NOVA <span className="text-[#198038]">MART</span>
              </span>
            </Link>

            {/* Location */}
            <div className="hidden md:flex items-center text-sm">
              <MapPin className="text-gray-400 mr-2" size={20} />
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Delivering to</span>
                <span className="font-semibold flex items-center cursor-pointer">
                  Indiranagar <ChevronDown size={14} className="ml-1" />
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-2xl">
              <form action="/search" className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="q"
                  className="block w-full pl-10 pr-3 py-3 border-none bg-gray-50 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-200"
                  placeholder="Search groceries, electronics and more"
                />
              </form>
            </div>

            {/* Icons */}
            <div className="flex items-center gap-6">
              <Link to="/account" className="text-gray-700 hover:text-black">
                <User size={24} />
              </Link>
              <Link to="/cart" className="text-gray-700 hover:text-black relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-1 -right-2 bg-[#198038] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-4 text-sm font-medium text-gray-600 overflow-x-auto">
            <Link to="/" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-4">
              <ShoppingBag size={18} /> Groceries
            </Link>
            <div className="w-px h-6 bg-gray-200"></div>
            <Link to="/" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-4">
              <Leaf size={18} /> Fresh
            </Link>
            <div className="w-px h-6 bg-gray-200"></div>
            <Link to="/category" className="flex items-center gap-2 text-[#198038] whitespace-nowrap min-w-max px-4 border-b-2 border-[#198038] pb-1 -mb-[18px]">
              <Smartphone size={18} /> Electronics
            </Link>
            <div className="w-px h-6 bg-gray-200"></div>
            <Link to="/" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-4">
              <Home size={18} /> Home
            </Link>
            <div className="w-px h-6 bg-gray-200"></div>
            <Link to="/" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-4">
              <Droplet size={18} /> Personal Care
            </Link>
            <div className="w-px h-6 bg-gray-200"></div>
            <Link to="/offers" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-4">
              <Percent size={18} /> Offers
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
