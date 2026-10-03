import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  Package, 
  MapPin, 
  CreditCard, 
  Heart, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Box, 
  Star,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Briefcase
} from 'lucide-react';
import { getRecentOrders, saveOrder } from '../data/orderHelper';
import { getAuthState, logoutUser } from '../data/authHelper';
import { PlacedOrder } from '../types';

interface SavedAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  addressLine: string;
  area: string;
  city: string;
  pincode: string;
  name: string;
  phone: string;
  isDefault?: boolean;
}

export default function MyAccount() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab state
  const tabParam = searchParams.get('tab');
  const actionParam = searchParams.get('action');

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'payments'>(
    tabParam === 'addresses' ? 'addresses' : tabParam === 'orders' ? 'orders' : 'overview'
  );

  // Address modal state
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(actionParam === 'add');

  // Address form fields
  const [addressType, setAddressType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [flatStreet, setFlatStreet] = useState('');
  const [area, setArea] = useState('Indiranagar');
  const [pincode, setPincode] = useState('560038');
  const [receiverName, setReceiverName] = useState('Tarak S.');
  const [receiverPhone, setReceiverPhone] = useState('+91 98765 43210');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Saved addresses list with localStorage persistence
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    try {
      const stored = localStorage.getItem('novamart_saved_addresses');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      {
        id: 'addr-1',
        type: 'Home',
        addressLine: 'Flat 402, Green Heights, 12th Main',
        area: 'Indiranagar',
        city: 'Bengaluru',
        pincode: '560038',
        name: 'Tarak S.',
        phone: '+91 98765 43210',
        isDefault: true,
      },
      {
        id: 'addr-2',
        type: 'Work',
        addressLine: 'Building 4B, 3rd Floor, Outer Ring Road',
        area: 'HSR Layout',
        city: 'Bengaluru',
        pincode: '560102',
        name: 'Tarak S.',
        phone: '+91 98765 43210',
        isDefault: false,
      },
    ];
  });

  // Watch tabParam changes
  useEffect(() => {
    if (tabParam === 'addresses') {
      setActiveTab('addresses');
      if (actionParam === 'add') {
        setIsAddAddressOpen(true);
      }
    } else if (tabParam === 'orders') {
      setActiveTab('orders');
    }
  }, [tabParam, actionParam]);

  // Real placed orders state
  const [recentOrders, setRecentOrders] = useState<PlacedOrder[]>(() => getRecentOrders());

  // User auth state
  const [auth, setAuth] = useState(() => getAuthState());

  useEffect(() => {
    const handleAuth = () => {
      setAuth(getAuthState());
    };
    window.addEventListener('novamart_auth_updated', handleAuth);
    return () => window.removeEventListener('novamart_auth_updated', handleAuth);
  }, []);

  useEffect(() => {
    const handleOrderUpdate = () => {
      setRecentOrders(getRecentOrders());
    };
    window.addEventListener('novamart_order_updated', handleOrderUpdate);
    return () => window.removeEventListener('novamart_order_updated', handleOrderUpdate);
  }, []);

  const handleTrackDelivery = (order: PlacedOrder) => {
    saveOrder(order);
    navigate('/order-confirmed');
  };

  // Persist addresses
  const persistAddresses = (newAddrs: SavedAddress[]) => {
    setAddresses(newAddrs);
    try {
      localStorage.setItem('novamart_saved_addresses', JSON.stringify(newAddrs));
    } catch {
      // ignore
    }
  };

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flatStreet.trim()) return;

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      type: addressType,
      addressLine: flatStreet.trim(),
      area,
      city: 'Bengaluru',
      pincode,
      name: receiverName,
      phone: receiverPhone,
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, newAddr];
    persistAddresses(updated);
    setIsAddAddressOpen(false);
    setFlatStreet('');
    setSaveSuccessMsg(`New ${addressType} address added successfully!`);
    setTimeout(() => setSaveSuccessMsg(null), 3500);

    // Update active delivery location across navbar
    try {
      localStorage.setItem('novamart_location', JSON.stringify({
        id: newAddr.area.toLowerCase().replace(/\s+/g, '-'),
        area: newAddr.area,
        city: newAddr.city,
        pincode: newAddr.pincode,
        eta: '10 mins'
      }));
      window.dispatchEvent(new Event('novamart_location_updated'));
    } catch {
      // ignore
    }

    // clean up URL action param
    searchParams.delete('action');
    setSearchParams(searchParams);
  };

  const handleSelectActiveAddress = (addr: SavedAddress) => {
    try {
      localStorage.setItem('novamart_location', JSON.stringify({
        id: addr.area.toLowerCase().replace(/\s+/g, '-'),
        area: addr.area,
        city: addr.city,
        pincode: addr.pincode,
        eta: '10 mins'
      }));
      window.dispatchEvent(new Event('novamart_location_updated'));
    } catch {
      // ignore
    }
    setSaveSuccessMsg(`Now delivering to ${addr.type} (${addr.area})!`);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    persistAddresses(updated);
  };

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
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-[#198038] font-medium">My account</span>
            </div>
          </li>
          {activeTab === 'addresses' && (
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-800 font-semibold">Saved addresses</span>
              </div>
            </li>
          )}
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My account</h1>
        <p className="text-lg text-gray-600 mt-1">
          {auth.isLoggedIn ? `Welcome back, ${auth.name}` : 'Welcome! Sign in to manage your account'}
        </p>
      </div>

      {!auth.isLoggedIn && (
        <div className="mb-6 p-4 rounded-2xl bg-[#eef8f1] border border-[#c4ebd3] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#198038] text-white flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">You are browsing as Guest</p>
              <p className="text-xs text-gray-600 mt-0.5">Sign in to save addresses, track live deliveries, and claim exclusive vouchers.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#198038] hover:bg-[#125A27] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
          >
            Sign In Now
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Sidebar Navigation */}
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6 sticky top-28">
            <div className="p-6 flex items-center gap-4 bg-[#fbfdfb] border-b border-gray-100">
              <div className="w-14 h-14 bg-[#eef8f1] text-[#198038] rounded-full flex items-center justify-center text-xl font-extrabold border border-[#c4ebd3]">
                {auth.avatar || (auth.name ? auth.name.slice(0, 2).toUpperCase() : 'TS')}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{auth.name || 'Guest User'}</h3>
                <p className="text-xs text-gray-500">{auth.email || auth.phone || 'guest@novamart.in'}</p>
                <span className="inline-block mt-1 text-[10px] bg-[#eef8f1] text-[#125A27] font-bold px-2 py-0.5 rounded-full">
                  {auth.isLoggedIn ? 'Nova Gold Member' : 'Guest'}
                </span>
              </div>
            </div>

            <nav className="flex flex-col py-2">
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setSearchParams({});
                }}
                className={`flex items-center gap-4 px-6 py-3.5 text-sm font-semibold transition-colors text-left cursor-pointer border-l-4 ${
                  activeTab === 'overview'
                    ? 'bg-[#eef8f1] text-[#198038] border-[#198038]'
                    : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200'
                }`}
              >
                <HomeIcon size={18} className={activeTab === 'overview' ? 'text-[#198038]' : 'text-gray-400'} />
                Overview
              </button>

              <button
                onClick={() => {
                  setActiveTab('orders');
                  setSearchParams({ tab: 'orders' });
                }}
                className={`flex items-center gap-4 px-6 py-3.5 text-sm font-semibold transition-colors text-left cursor-pointer border-l-4 ${
                  activeTab === 'orders'
                    ? 'bg-[#eef8f1] text-[#198038] border-[#198038]'
                    : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200'
                }`}
              >
                <Package size={18} className={activeTab === 'orders' ? 'text-[#198038]' : 'text-gray-400'} />
                My orders
              </button>

              <button
                id="saved-addresses-tab"
                onClick={() => {
                  setActiveTab('addresses');
                  setSearchParams({ tab: 'addresses' });
                }}
                className={`flex items-center justify-between px-6 py-3.5 text-sm font-semibold transition-colors text-left cursor-pointer border-l-4 ${
                  activeTab === 'addresses'
                    ? 'bg-[#eef8f1] text-[#198038] border-[#198038]'
                    : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <MapPin size={18} className={activeTab === 'addresses' ? 'text-[#198038]' : 'text-gray-400'} />
                  <span>Saved addresses</span>
                </div>
                <span className="text-[11px] bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full">
                  {addresses.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('payments');
                  setSearchParams({ tab: 'payments' });
                }}
                className={`flex items-center gap-4 px-6 py-3.5 text-sm font-semibold transition-colors text-left cursor-pointer border-l-4 ${
                  activeTab === 'payments'
                    ? 'bg-[#eef8f1] text-[#198038] border-[#198038]'
                    : 'text-gray-700 hover:bg-gray-50 border-transparent hover:border-gray-200'
                }`}
              >
                <CreditCard size={18} className={activeTab === 'payments' ? 'text-[#198038]' : 'text-gray-400'} />
                Payment methods
              </button>

              <Link
                to="/wishlist"
                className="flex items-center gap-4 px-6 py-3.5 text-sm text-gray-700 hover:bg-gray-50 font-semibold border-l-4 border-transparent hover:border-gray-200"
              >
                <Heart size={18} className="text-gray-400" />
                Wishlist
              </Link>

              <div className="my-2 border-t border-gray-100"></div>

              <Link
                to="/help"
                className="flex items-center gap-4 px-6 py-3.5 text-sm text-gray-700 hover:bg-gray-50 font-semibold border-l-4 border-transparent hover:border-gray-200"
              >
                <HelpCircle size={18} className="text-gray-400" />
                Help & support
              </Link>

              <button
                onClick={() => {
                  logoutUser();
                  navigate('/login');
                }}
                className="flex items-center gap-4 px-6 py-3.5 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50/50 font-semibold border-l-4 border-transparent text-left cursor-pointer transition-colors"
              >
                <LogOut size={18} />
                {auth.isLoggedIn ? 'Sign out' : 'Sign In'}
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full lg:w-3/4 flex flex-col gap-8">
          {/* Notification Alert */}
          {saveSuccessMsg && (
            <div className="bg-[#eef8f1] border border-[#c4ebd3] text-[#125A27] p-4 rounded-2xl flex items-center justify-between text-sm font-semibold animate-in fade-in">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-[#198038]" />
                <span>{saveSuccessMsg}</span>
              </div>
              <button onClick={() => setSaveSuccessMsg(null)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
          )}

          {/* TAB 1: SAVED ADDRESSES (User Focus) */}
          {(activeTab === 'addresses' || activeTab === 'overview') && (
            <div id="addresses-section" className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
                    <MapPin className="text-[#198038] w-6 h-6 stroke-[2.5]" />
                    Saved Delivery Addresses
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your delivery locations for 10-15 minute doorstep fulfillment.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="bg-[#198038] hover:bg-[#125A27] text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  Add new address
                </button>
              </div>

              {/* Add Address Form Accordion / Modal */}
              {isAddAddressOpen && (
                <div className="mb-8 p-6 bg-[#fbfdfb] border-2 border-[#198038]/30 rounded-2xl shadow-sm animate-in fade-in">
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 text-base">Add New Delivery Address</h3>
                    <button
                      onClick={() => setIsAddAddressOpen(false)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleAddNewAddress} className="space-y-4">
                    {/* Address Type Buttons */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                        Address Label
                      </label>
                      <div className="flex gap-3">
                        {(['Home', 'Work', 'Other'] as const).map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setAddressType(type)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              addressType === type
                                ? 'bg-[#198038] text-white shadow-xs'
                                : 'bg-white border border-gray-200 text-gray-700 hover:border-[#198038]'
                            }`}
                          >
                            {type === 'Home' ? <HomeIcon size={14} /> : type === 'Work' ? <Briefcase size={14} /> : <MapPin size={14} />}
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                        House / Flat No., Floor, Building Name & Street *
                      </label>
                      <input
                        type="text"
                        required
                        value={flatStreet}
                        onChange={(e) => setFlatStreet(e.target.value)}
                        placeholder="e.g. Flat 301, Silver Oak Apartments, 8th Cross"
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#198038] focus:ring-1 focus:ring-[#198038]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Area */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Locality / Area
                        </label>
                        <select
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#198038]"
                        >
                          <option value="Indiranagar">Indiranagar (560038)</option>
                          <option value="Koramangala">Koramangala (560034)</option>
                          <option value="HSR Layout">HSR Layout (560102)</option>
                          <option value="Whitefield">Whitefield (560066)</option>
                          <option value="Jayanagar">Jayanagar (560011)</option>
                          <option value="Sadashivanagar">Sadashivanagar (560080)</option>
                        </select>
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          City & Pincode
                        </label>
                        <input
                          type="text"
                          value={`Bengaluru - ${pincode}`}
                          onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#198038]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Receiver's Name
                        </label>
                        <input
                          type="text"
                          value={receiverName}
                          onChange={(e) => setReceiverName(e.target.value)}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#198038]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={receiverPhone}
                          onChange={(e) => setReceiverPhone(e.target.value)}
                          className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#198038]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsAddAddressOpen(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#198038] hover:bg-[#125A27] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Saved Addresses Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="border border-gray-200 hover:border-[#198038] rounded-2xl p-5 bg-white transition-all shadow-2xs hover:shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#eef8f1] text-[#198038] flex items-center justify-center font-bold">
                            {addr.type === 'Home' ? <HomeIcon size={16} /> : addr.type === 'Work' ? <Briefcase size={16} /> : <MapPin size={16} />}
                          </div>
                          <span className="font-bold text-gray-900 text-sm">{addr.type}</span>
                          {addr.isDefault && (
                            <span className="bg-[#eef8f1] text-[#125A27] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#c4ebd3]">
                              Default
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Delete address"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-gray-950 mb-1">{addr.addressLine}</p>
                      <p className="text-xs text-gray-500 mb-2">
                        {addr.area}, {addr.city} - {addr.pincode}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">
                        {addr.name} • {addr.phone}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-[#198038] font-semibold flex items-center gap-1">
                        ⚡ 10-15m ETA Hub
                      </span>
                      <button
                        onClick={() => handleSelectActiveAddress(addr)}
                        className="text-xs font-bold text-[#198038] hover:underline cursor-pointer bg-[#eef8f1] px-2.5 py-1 rounded-md border border-[#c4ebd3]"
                      >
                        Deliver here
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW STATS & RECENT ORDERS */}
          {(activeTab === 'overview' || activeTab === 'orders') && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#eef8f1] text-[#198038] flex items-center justify-center flex-shrink-0 border border-[#c4ebd3]">
                    <Box size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Total orders</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f8f6f2] text-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200">
                    <Heart size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Wishlist</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f8f6f2] text-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200">
                    <Star size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Reward Coins</p>
                    <p className="text-2xl font-bold text-gray-900">240</p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f8f6f2] text-gray-700 flex items-center justify-center flex-shrink-0 border border-gray-200">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Saved addresses</p>
                    <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
                  </div>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Recent Orders</h2>
                    <p className="text-sm text-gray-500 mt-1">Track live packages or re-order essentials.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-[#198038] transition-all bg-white shadow-2xs">
                        <div className="p-5 flex flex-wrap justify-between items-start gap-4 bg-gray-50/50 border-b border-gray-100">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">Order #{order.orderNumber}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{order.createdAt} • {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Amount</p>
                            <p className="font-bold text-[#198038] text-sm">₹ {order.total.toLocaleString('en-IN')}</p>
                          </div>
                          <div>
                            <span className="inline-flex items-center gap-1.5 bg-[#eef8f1] text-[#198038] px-2.5 py-1 rounded-full text-xs font-bold border border-[#c4ebd3]">
                              <Box size={13} /> {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="flex flex-wrap gap-4">
                            {order.items.map(({ product, quantity }) => (
                              <div key={product.id} className="flex items-center gap-3">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/assets/strawberries.jpg';
                                  }}
                                />
                                <div className="text-xs max-w-[180px]">
                                  <p className="font-bold text-gray-900 truncate">{product.name}</p>
                                  <p className="text-gray-500">Qty: {quantity} • ₹{product.price.toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => handleTrackDelivery(order)}
                            className="bg-[#198038] hover:bg-[#125A27] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors shrink-0 cursor-pointer flex items-center gap-1"
                          >
                            Track Delivery <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* Default fallback order */
                    <div className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all">
                      <div className="p-5 flex flex-wrap justify-between items-start gap-4 bg-gray-50/50">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Order #NM-261003-8419</p>
                          <p className="text-xs text-gray-500 mt-0.5">Today • 1 item</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="font-bold text-gray-900 text-sm">₹ 2,014</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center gap-1.5 bg-[#eef8f1] text-[#198038] px-2.5 py-1 rounded-full text-xs font-bold border border-[#c4ebd3]">
                            <Box size={13} /> Packing in dark store
                          </span>
                        </div>
                      </div>

                      <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <img src="/assets/smartwatch.jpg" alt="Smartwatch" className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1 border border-gray-100" />
                            <div className="text-xs">
                              <p className="font-bold text-gray-900">ColorFit Pulse Smartwatch</p>
                              <p className="text-gray-500">Qty: 1 • ₹1,999</p>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate('/order-confirmed')}
                          className="bg-[#198038] hover:bg-[#125A27] text-white font-bold py-2 px-5 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Track Delivery
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB 3: PAYMENT METHODS */}
          {activeTab === 'payments' && (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Saved Payment Methods</h2>
              <p className="text-sm text-gray-500 mb-6">Manage UPI accounts, saved cards, and wallets.</p>

              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
                      UPI
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Google Pay / PhonePe UPI</p>
                      <p className="text-xs text-gray-500">tarak.s@okhdfcbank • Verified</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#198038]">Active</span>
                </div>

                <div className="p-4 border border-gray-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs">
                      CARD
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">HDFC Bank Millennia Credit Card</p>
                      <p className="text-xs text-gray-500">•••• •••• •••• 4281 (Exp 08/29)</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-gray-500 hover:text-black">Edit</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
