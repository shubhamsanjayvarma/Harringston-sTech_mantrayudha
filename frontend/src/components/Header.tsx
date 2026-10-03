import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Search, User, ShoppingCart, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ALL_PRODUCTS } from '../data/mockData';
import { DeliveryLocation, Product } from '../types';

interface HeaderProps {
  currentLocation: DeliveryLocation;
  onOpenLocationModal: () => void;
  onOpenAccountModal: () => void;
  onSelectProduct?: (product: Product) => void;
}

export function Header({
  currentLocation,
  onOpenLocationModal,
  onOpenAccountModal,
}: HeaderProps) {
  const { cartCount, setIsCartOpen, addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? ALL_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Left: Brand Logo & Location Selector */}
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          <a
            href="/"
            className="flex items-center gap-1.5 font-bold text-2xl tracking-tight text-gray-950 focus:outline-none"
            aria-label="NovaMart Homepage"
          >
            <span className="font-extrabold tracking-tight">NOVA</span>
            <span className="text-novagreen-700 font-extrabold">MART</span>
          </a>

          {/* Location Selector */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-2.5 text-left py-1 px-2 -ml-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-novagreen-500/20"
            title="Change delivery location"
            aria-label={`Delivering to ${currentLocation.area}, click to change`}
          >
            <MapPin className="w-5 h-5 text-gray-800 shrink-0 stroke-[1.8]" />
            <div className="flex flex-col">
              <span className="text-[11px] font-normal text-gray-500 leading-tight">
                Delivering to
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[13px] font-semibold text-gray-900 leading-tight">
                  {currentLocation.area}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-700" />
              </div>
            </div>
          </button>
        </div>

        {/* Center: Search Field */}
        <div
          ref={searchContainerRef}
          className="relative flex-1 max-w-xl mx-2 sm:mx-4 hidden sm:block"
        >
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none stroke-[2]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search groceries, electronics and more"
              className="w-full bg-[#f4f5f7] hover:bg-[#eceef2] focus:bg-white text-gray-900 text-sm rounded-full pl-11 pr-10 py-2.5 border border-transparent focus:border-gray-300 focus:outline-none transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="p-3 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Matching items for "{searchQuery}"</span>
                <span>{searchResults.length} found</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 p-1">
                {searchResults.length > 0 ? (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      className="p-2.5 flex items-center justify-between gap-3 hover:bg-gray-50 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-novagreen-800 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.subtitle} • {product.deliveryTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-900">
                          ₹{product.price}
                        </span>
                        <button
                          onClick={() => {
                            addToCart(product);
                            setIsSearchFocused(false);
                            setSearchQuery('');
                          }}
                          className="bg-novagreen-700 hover:bg-novagreen-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500">
                    <p className="font-medium text-gray-700">No items found</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try searching for "strawberries", "olive oil", "headphones", or "air fryer"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Header Actions (Account & Cart) */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {/* User Account */}
          <button
            onClick={onOpenAccountModal}
            className="p-2 text-gray-800 hover:text-gray-950 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-novagreen-500/20"
            aria-label="User Account"
            title="Account Profile"
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
          </button>

          {/* Shopping Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-gray-800 hover:text-gray-950 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-novagreen-500/20"
            aria-label={`Shopping cart with ${cartCount} items`}
            title="Open Cart"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.8]" />
            <span
              className={`absolute top-1 -right-0.5 min-w-[18px] h-[18px] px-1 bg-novagreen-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none transition-transform duration-200 ${
                cartCount > 0 ? 'scale-100' : 'scale-95'
              }`}
            >
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (under header) */}
      <div className="sm:hidden px-4 pb-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries, electronics and more"
            className="w-full bg-[#f4f5f7] text-gray-900 text-sm rounded-full pl-10 pr-4 py-2 border border-transparent focus:border-gray-300 focus:outline-none"
          />
        </div>
      </div>
    </header>
  );
}
