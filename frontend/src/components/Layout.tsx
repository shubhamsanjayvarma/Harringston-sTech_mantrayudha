import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
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
  Percent,
  X,
  ArrowRight
} from 'lucide-react';
import { FloatingSupportButton } from './FloatingSupportButton';
import { useCart } from '../context/CartContext';
import { LocationModal } from './LocationModal';
import { CartDrawer } from './CartDrawer';
import { Toast } from './Toast';
import { LOCATIONS, ALL_PRODUCTS } from '../data/mockData';
import { matchProductsByGeneralLanguage } from '../data/searchHelper';
import { getAuthState } from '../data/authHelper';
import { DeliveryLocation } from '../types';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { cartCount, setIsCartOpen, addToCart } = useCart();

  // Location state
  const [currentLocation, setCurrentLocation] = useState<DeliveryLocation>(() => {
    try {
      const saved = localStorage.getItem('novamart_location');
      return saved ? JSON.parse(saved) : LOCATIONS[0];
    } catch {
      return LOCATIONS[0];
    }
  });

  // Auth state for profile / account link
  const [auth, setAuth] = useState(() => getAuthState());

  useEffect(() => {
    const handleAuthChange = () => {
      setAuth(getAuthState());
    };
    window.addEventListener('novamart_auth_updated', handleAuthChange);
    return () => window.removeEventListener('novamart_auth_updated', handleAuthChange);
  }, []);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Sync location
  const handleSelectLocation = (loc: DeliveryLocation) => {
    setCurrentLocation(loc);
    try {
      localStorage.setItem('novamart_location', JSON.stringify(loc));
    } catch {
      // ignore
    }
  };

  // Listen for cross-page location updates (e.g. from address section)
  useEffect(() => {
    const handleLocationUpdate = () => {
      try {
        const saved = localStorage.getItem('novamart_location');
        if (saved) setCurrentLocation(JSON.parse(saved));
      } catch {
        // ignore
      }
    };
    window.addEventListener('novamart_location_updated', handleLocationUpdate);
    return () => window.removeEventListener('novamart_location_updated', handleLocationUpdate);
  }, []);

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

  // Determine active category for navbar
  const categoryParam = searchParams.get('name');
  let activeCategory = '';
  if (location.pathname === '/category') {
    activeCategory = categoryParam || 'Electronics';
  } else if (location.pathname === '/offers') {
    activeCategory = 'Offers';
  }

  // Handle live search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Live quick search matching using domain bifurcation
  const liveSearchResult = searchQuery.trim()
    ? matchProductsByGeneralLanguage(searchQuery)
    : { products: [], detectedDomain: null, query: '' };
  const liveMatches = liveSearchResult.products.slice(0, 5);

  const categories = [
    {
      name: 'Groceries',
      path: '/category?name=Groceries',
      icon: <ShoppingBag size={18} />
    },
    {
      name: 'Fresh',
      path: '/category?name=Fresh',
      icon: <Leaf size={18} />
    },
    {
      name: 'Electronics',
      path: '/category?name=Electronics',
      icon: <Smartphone size={18} />
    },
    {
      name: 'Home',
      path: '/category?name=Home',
      icon: <Home size={18} />
    },
    {
      name: 'Personal Care',
      path: '/category?name=Personal%20Care',
      icon: <Droplet size={18} />
    },
    {
      name: 'Offers',
      path: '/offers',
      icon: <Percent size={18} />
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#eef8f1] py-2 text-center text-sm font-medium text-[#125A27] flex items-center justify-center gap-2">
        <Leaf size={16} />
        Fresh picks. Fast delivery.
      </div>

      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                NOVA <span className="text-[#198038]">MART</span>
              </span>
            </Link>

            {/* Delivery Location Selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2 text-left hover:bg-gray-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer group"
              title="Change Delivery Location"
            >
              <div className="bg-[#eef8f1] p-2 rounded-lg text-[#198038] group-hover:scale-105 transition-transform">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Delivering to
                </span>
                <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  {currentLocation.area}
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-700" />
                </span>
              </div>
            </button>

            {/* Smart Search Bar with Domain Recognition */}
            <div className="flex-1 max-w-2xl relative" ref={searchContainerRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search groceries, electronics, fresh & more in natural language..."
                  className="block w-full pl-10 pr-10 py-2.5 bg-gray-50/80 border border-gray-200 rounded-full text-sm placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#198038] focus:ring-1 focus:ring-[#198038] transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>

              {/* Instant Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in duration-150">
                  <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-600">
                    <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-semibold text-gray-800">Enter</kbd> to view all results</span>
                    <button
                      onClick={handleSearchSubmit}
                      className="text-[#198038] font-bold hover:underline flex items-center gap-1"
                    >
                      Search for "{searchQuery}" <ArrowRight size={12} />
                    </button>
                  </div>

                  {liveSearchResult.detectedDomain && (
                    <div className="px-3 py-2 bg-[#eef8f1] border-b border-[#c4ebd3] flex items-center justify-between text-xs text-[#125A27]">
                      <span className="font-bold flex items-center gap-1.5">
                        ⚡ Showing only <span className="underline">{liveSearchResult.detectedDomain}</span> items
                      </span>
                      <span className="text-[10px] font-semibold bg-white text-[#198038] px-2 py-0.5 rounded-full border border-[#c4ebd3]">
                        Domain Filter
                      </span>
                    </div>
                  )}

                  {liveMatches.length > 0 ? (
                    <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                      {liveMatches.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setIsSearchFocused(false);
                            navigate(`/search?q=${encodeURIComponent(item.name)}`);
                          }}
                          className="p-3 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 object-contain rounded-lg bg-gray-50 p-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/assets/strawberries.jpg';
                              }}
                            />
                            <div>
                              <p className="text-sm font-semibold text-gray-900 leading-snug">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.subtitle} • <span className="text-[#198038] font-medium">{item.category}</span></p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-900">₹{item.price.toLocaleString('en-IN')}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(item);
                              }}
                              className="bg-[#eef8f1] hover:bg-[#198038] text-[#198038] hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-sm text-gray-500">
                      No quick matches found for "{searchQuery}". Press Enter to search everywhere!
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Header Right Action Icons */}
            <div className="flex items-center gap-4 sm:gap-6">
              <Link 
                to={auth.isLoggedIn ? "/account" : "/login"} 
                className="text-gray-700 hover:text-[#198038] p-1.5 rounded-full hover:bg-gray-50 transition-colors relative flex items-center gap-1.5"
                title={auth.isLoggedIn ? `My Account (${auth.name})` : "Sign In / Login"}
              >
                <User size={24} />
                {auth.isLoggedIn ? (
                  <span 
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#198038] border-2 border-white rounded-full" 
                    title="Logged In"
                  />
                ) : (
                  <span className="hidden sm:inline text-xs font-bold text-gray-700 hover:text-[#198038]">
                    Sign In
                  </span>
                )}
              </Link>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-gray-700 hover:text-[#198038] p-1.5 rounded-full hover:bg-gray-50 transition-colors relative cursor-pointer"
                title="Open Cart"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#198038] text-white text-[10px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Categories Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between py-4 text-sm font-medium text-gray-600 overflow-x-auto no-scrollbar">
            {categories.map((cat, idx) => {
              const isSelected = activeCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <React.Fragment key={cat.name}>
                  <Link
                    to={cat.path}
                    className={`flex items-center gap-2 whitespace-nowrap min-w-max px-4 transition-all ${
                      isSelected
                        ? 'text-[#198038] font-bold border-b-2 border-[#198038] pb-1 -mb-[18px]'
                        : 'text-gray-600 hover:text-[#198038]'
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </Link>
                  {idx < categories.length - 1 && (
                    <div className="w-px h-6 bg-gray-200"></div>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating Customer Support Button */}
      <FloatingSupportButton />

      {/* Location Modal with Add Address Route */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={handleSelectLocation}
        onNavigateToAddAddress={() => {
          setIsLocationModalOpen(false);
          navigate('/account?tab=addresses&action=add');
        }}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer currentLocation={currentLocation} />

      {/* Global Toast */}
      <Toast />
    </div>
  );
}
