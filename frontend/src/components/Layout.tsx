import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  User, 
  ShoppingCart, 
  ChevronDown, 
  Leaf,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Gamepad2,
  Tv,
  Keyboard,
  Plug,
  Percent,
  Headset
} from 'lucide-react';
import { FloatingSupportButton } from './FloatingSupportButton';
import { Footer } from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#eef8f1] py-2 text-center text-sm font-medium text-[#125A27] flex items-center justify-center gap-2">
        <Leaf size={16} />
        100% Genuine Tech. Express delivery across Bengaluru.
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
                  placeholder="Search laptops, smartphones, headphones, gaming, accessories..."
                />
              </form>
            </div>

            {/* Header Right Action Icons */}
            <div className="flex items-center gap-5 sm:gap-6">
              <Link 
                to="/help" 
                className="text-gray-700 hover:text-[#198038] flex items-center gap-1.5 transition-colors p-1.5 rounded-full hover:bg-gray-50"
                title="Help & Support"
              >
                <Headset size={22} className="stroke-[2]" />
                <span className="hidden sm:inline text-xs font-semibold">Support</span>
              </Link>
              <Link 
                to="/account" 
                className="text-gray-700 hover:text-[#198038] p-1.5 rounded-full hover:bg-gray-50 transition-colors"
                title="My Account"
              >
                <User size={24} />
              </Link>
              <Link to="/cart" className="text-gray-700 hover:text-black relative" title="View Cart">
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
          <nav className="flex items-center justify-between py-3.5 text-sm font-medium text-gray-600 overflow-x-auto no-scrollbar gap-2">
            <Link to="/category" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-3 py-1 rounded-md hover:bg-gray-50">
              <Laptop size={17} /> Laptops
            </Link>
            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
            <Link to="/category?cat=Smartphones" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-3 py-1 rounded-md hover:bg-gray-50">
              <Smartphone size={17} /> Smartphones
            </Link>
            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
            <Link to="/category?cat=Headphones" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-3 py-1 rounded-md hover:bg-gray-50">
              <Headphones size={17} /> Headphones
            </Link>
            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
            <Link to="/category?cat=Smartwatches" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-3 py-1 rounded-md hover:bg-gray-50">
              <Watch size={17} /> Smartwatches
            </Link>
            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
            <Link to="/category?cat=Gaming" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-3 py-1 rounded-md hover:bg-gray-50">
              <Gamepad2 size={17} /> Gaming
            </Link>
            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
            <Link to="/category?cat=Monitors" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-3 py-1 rounded-md hover:bg-gray-50">
              <Tv size={17} /> Monitors
            </Link>
            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
            <Link to="/category?cat=Keyboards" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-3 py-1 rounded-md hover:bg-gray-50">
              <Keyboard size={17} /> Keyboards
            </Link>
            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
            <Link to="/category?cat=Accessories" className="flex items-center gap-2 hover:text-[#198038] whitespace-nowrap min-w-max px-3 py-1 rounded-md hover:bg-gray-50">
              <Plug size={17} /> Accessories
            </Link>
            <div className="w-px h-5 bg-gray-200 hidden sm:block"></div>
            <Link to="/offers" className="flex items-center gap-2 text-[#198038] font-bold whitespace-nowrap min-w-max px-3 py-1 rounded-md bg-[#eef8f1]">
              <Percent size={17} /> Offers
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Global Website Footer */}
      <Footer />

      {/* Floating Customer Support Button */}
      <FloatingSupportButton />
    </div>
  );
}
