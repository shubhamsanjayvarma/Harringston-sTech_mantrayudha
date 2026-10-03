import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Smartphone, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Sparkles 
} from 'lucide-react';
import { setAuthState, DEFAULT_USER } from '../data/authHelper';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target if any
  const from = (location.state as { from?: string })?.from || '/account';

  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('98765 43210');
  const [email, setEmail] = useState('tarak.desai@novamart.in');
  const [otpOrPass, setOtpOrPass] = useState('5821');
  const [userName, setUserName] = useState('Tarak S.');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setAuthState({
        isLoggedIn: true,
        name: userName || 'Tarak S.',
        phone: loginMethod === 'phone' ? `+91 ${phone}` : DEFAULT_USER.phone,
        email: loginMethod === 'email' ? email : DEFAULT_USER.email,
        avatar: (userName || 'Tarak S.').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      });

      setIsLoading(false);
      setSuccess(true);

      setTimeout(() => {
        navigate(from, { replace: true });
      }, 400);
    }, 600);
  };

  const handleInstantDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setAuthState({
        isLoggedIn: true,
        name: 'Tarak S.',
        phone: '+91 98765 43210',
        email: 'tarak.desai@novamart.in',
        avatar: 'TS',
      });
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/account', { replace: true });
      }, 300);
    }, 400);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2">
          <li className="inline-flex items-center">
            <Link to="/" className="hover:text-gray-900">Home</Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Sign In</span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="max-w-md mx-auto">
        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#198038] via-[#24a148] to-[#125A27]" />

          {/* Header */}
          <div className="text-center mb-6 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eef8f1] border border-[#c4ebd3] text-[#125A27] text-xs font-bold mb-3">
              <Zap size={14} className="fill-[#198038] text-[#198038]" /> 10-15 Min Hyperlocal Delivery
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight">
              Welcome to NovaMart
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              Sign in to manage your orders, saved addresses, and personalized offers.
            </p>
          </div>

          {/* Quick 1-Click Demo Login Banner */}
          <div className="mb-6 p-3.5 rounded-2xl bg-[#eef8f1]/80 border border-[#c4ebd3] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#198038] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-950 truncate">Speedrun Demo User</p>
                <p className="text-[11px] text-[#125A27] font-medium">Tarak S. • Active Account</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleInstantDemoLogin}
              disabled={isLoading || success}
              className="bg-[#198038] hover:bg-[#125A27] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1 hover:scale-102"
            >
              <span>Instant Login</span>
              <ArrowRight size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* Method Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === 'phone'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Smartphone size={14} /> Phone Number
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                loginMethod === 'email'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Mail size={14} /> Email Address
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#198038] focus:border-transparent transition-all font-medium"
                />
                <User size={16} className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>

            {loginMethod === 'phone' ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3.5 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700">
                    +91
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      required
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#198038] focus:border-transparent transition-all font-medium"
                    />
                    <Smartphone size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tarak.desai@novamart.in"
                    required
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#198038] focus:border-transparent transition-all font-medium"
                  />
                  <Mail size={16} className="absolute left-3.5 top-3 text-gray-400" />
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Verification Code / Password
                </label>
                <span className="text-[11px] font-semibold text-[#198038] hover:underline cursor-pointer">
                  Auto-filled for demo
                </span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={otpOrPass}
                  onChange={(e) => setOtpOrPass(e.target.value)}
                  placeholder="Enter code"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50/60 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#198038] focus:border-transparent transition-all font-mono font-bold tracking-widest"
                />
                <Lock size={16} className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full mt-2 bg-[#198038] hover:bg-[#125A27] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-lg disabled:opacity-75"
            >
              {success ? (
                <>
                  <CheckCircle2 size={18} className="text-white" />
                  <span>Logged in! Moving to My Account...</span>
                </>
              ) : isLoading ? (
                <span>Verifying credentials...</span>
              ) : (
                <>
                  <span>Sign In & Move to My Account</span>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </>
              )}
            </button>
          </form>

          {/* Terms & Privacy */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-[11px] text-gray-400 leading-relaxed">
              By continuing, you agree to NovaMart's{' '}
              <span className="text-gray-600 underline cursor-pointer">Terms of Service</span> and{' '}
              <span className="text-gray-600 underline cursor-pointer">Privacy Policy</span>.
            </p>
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[#198038]" />
            <span>256-bit SSL Secure</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-gray-300" />
          <div className="flex items-center gap-1.5">
            <Zap size={15} className="text-[#198038]" />
            <span>10-15 Min Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}
