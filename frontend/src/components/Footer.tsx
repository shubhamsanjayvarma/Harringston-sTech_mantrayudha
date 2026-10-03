import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  Check, 
  Headset
} from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function TwitterIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
    </svg>
  );
}

function YoutubeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  const openSupportChat = () => {
    // Triggers click on floating support button if present
    const supportBtn = document.querySelector('button[aria-label="Customer Support"]') as HTMLButtonElement | null;
    const novaAssistBtn = document.querySelector('button[aria-label="Open Nova Assist Support"]') as HTMLButtonElement | null;
    if (supportBtn) {
      supportBtn.click();
    } else if (novaAssistBtn) {
      novaAssistBtn.click();
    }
  };

  return (
    <footer className="w-full bg-[#0d141e] text-gray-300 mt-16 font-sans">
      {/* 1. Value Proposition & Trust Highlights Strip */}
      <div className="bg-[#f0f9f2] border-y border-[#d8edd9] text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Perk 1 */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#bce4c4] text-[#198038] flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-tight">10-15 Min Delivery</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Dispatched instantaneously from your nearest hyperlocal dark store hub.
              </p>
            </div>
          </div>

          {/* Perk 2 */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#bce4c4] text-[#198038] flex items-center justify-center shrink-0 shadow-xs">
              <Leaf className="w-5 h-5 stroke-[2.2] fill-[#198038]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-tight">Farm-Fresh Quality</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Daily handpicked organic fruits, veggies and verified pantry staples.
              </p>
            </div>
          </div>

          {/* Perk 3 */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#bce4c4] text-[#198038] flex items-center justify-center shrink-0 shadow-xs">
              <RotateCcw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-tight">Doorstep Returns</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Instant refund or exchange at your doorstep with zero questions asked.
              </p>
            </div>
          </div>

          {/* Perk 4 */}
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-[#bce4c4] text-[#198038] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900 leading-tight">100% Safe Payments</h4>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                End-to-end encrypted transactions supporting UPI, Cards, and NetBanking.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: Brand & Contact */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-full bg-[#198038] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Leaf className="w-4 h-4 fill-white" />
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">
                NOVA <span className="text-[#34c759]">MART</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed pr-4 max-w-sm">
              India's premier everyday tech commerce platform. Delivering 100% genuine laptops, smartphones, audio, gaming gear, and tech essentials in 10-15 minutes across Bengaluru.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-gray-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#34c759] shrink-0" />
                <span>Indiranagar Dark Store Hub, Bengaluru, KA 560038</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#34c759] shrink-0" />
                <a href="tel:18004196682" className="hover:text-white transition-colors">
                  1800-419-NOVA (6:00 AM – 12:00 Midnight)
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#34c759] shrink-0" />
                <a href="mailto:support@novamart.in" className="hover:text-white transition-colors">
                  support@novamart.in
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-gray-800/80 hover:bg-[#198038] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-xl bg-gray-800/80 hover:bg-[#198038] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-gray-800/80 hover:bg-[#198038] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-xl bg-gray-800/80 hover:bg-[#198038] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-gray-800/80 hover:bg-[#198038] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Tech Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <Link to="/category?cat=Laptops" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Laptops & Ultrabooks
                </Link>
              </li>
              <li>
                <Link to="/category?cat=Smartphones" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Smartphones & 5G Phones
                </Link>
              </li>
              <li>
                <Link to="/category?cat=Headphones" className="hover:text-white hover:translate-x-0.5 transition-all inline-block text-gray-300 font-medium">
                  Wireless Headphones & Audio
                </Link>
              </li>
              <li>
                <Link to="/category?cat=Smartwatches" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Smartwatches & Fitness Bands
                </Link>
              </li>
              <li>
                <Link to="/category?cat=Gaming" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Gaming Gear & Consoles
                </Link>
              </li>
              <li>
                <Link to="/category?cat=Accessories" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Fast Chargers & Accessories
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-[#34c759] hover:underline font-semibold flex items-center gap-1.5 mt-1">
                  <span>Hot Deals & Clearance</span>
                  <span className="bg-[#198038]/30 text-[#34c759] text-[10px] px-1.5 py-0.5 rounded-full font-bold">SALE</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400">
              <li>
                <button 
                  onClick={openSupportChat}
                  className="text-left text-[#34c759] hover:text-white hover:translate-x-0.5 transition-all inline-flex items-center gap-1.5 font-semibold"
                >
                  <Headset className="w-3.5 h-3.5" />
                  <span>Nova Assist 24/7 Support</span>
                </button>
              </li>
              <li>
                <Link to="/help" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Help & Support Center
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Track Current Delivery
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Returns & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Manage Addresses & Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white hover:translate-x-0.5 transition-all inline-block">
                  Saved Wishlist Items
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Apps */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Stay Updated
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-3">
              Subscribe for exclusive weekly dark-store flash drops, discounts, and fresh arrivals.
            </p>

            {/* Newsletter Subscription */}
            {subscribed ? (
              <div className="bg-[#198038]/20 border border-[#198038] text-[#34c759] p-3 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>You're subscribed to NovaMart updates!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full text-xs px-3.5 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#34c759] transition-colors"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#198038] hover:bg-[#156d30] text-white text-xs font-semibold rounded-lg flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Hyperlocal Delivery Status Badge */}
            <div className="mt-4 pt-4 border-t border-gray-800/80">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span className="w-2 h-2 rounded-full bg-[#34c759] animate-pulse" />
                <span className="font-semibold text-white">Live Delivery Hub</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Delivering to Indiranagar, Koramangala, HSR Layout, Whitefield & more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal & Payment Badges Strip */}
      <div className="border-t border-gray-800/90 bg-[#090e15] py-6 px-4 sm:px-6 lg:px-8 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
            <p>© {new Date().getFullYear()} NovaMart Technologies Pvt. Ltd. All rights reserved.</p>
            <Link to="/help" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="/help" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link to="/help" className="hover:text-gray-300 transition-colors">Security</Link>
          </div>

          {/* Payment Badges */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400 mr-1 hidden sm:inline">100% Safe Checkout:</span>
            <span className="px-2 py-1 bg-gray-800 text-gray-300 text-[10px] font-bold rounded tracking-wide border border-gray-700">UPI</span>
            <span className="px-2 py-1 bg-gray-800 text-gray-300 text-[10px] font-bold rounded tracking-wide border border-gray-700">RUPAY</span>
            <span className="px-2 py-1 bg-gray-800 text-gray-300 text-[10px] font-bold rounded tracking-wide border border-gray-700">VISA</span>
            <span className="px-2 py-1 bg-gray-800 text-gray-300 text-[10px] font-bold rounded tracking-wide border border-gray-700">MASTERCARD</span>
            <span className="px-2 py-1 bg-gray-800 text-gray-300 text-[10px] font-bold rounded tracking-wide border border-gray-700">NETBANKING</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
