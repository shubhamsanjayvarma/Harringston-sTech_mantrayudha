import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Box,
  Sparkles,
  ShieldCheck,
  Cpu,
  Play
} from 'lucide-react';

export default function HelpSupport() {
  const [searchQuery, setSearchQuery] = useState('');

  const popularQuestions = [
    "How can I track my order?",
    "Can I change my delivery address?",
    "How do I return an item?",
    "When will I receive my refund?"
  ];

  const judgeScenarios = [
    { id: 'scenario_01_order_tracking', label: '01. Order Tracking', icon: '🚚', persona: 'Priya S.' },
    { id: 'scenario_02_capped_refund', label: '02. Capped Refund', icon: '💰', persona: 'Arjun M.' },
    { id: 'scenario_03_disambiguation', label: '03. Disambiguation', icon: '🎧', persona: 'Ravi K.' },
    { id: 'scenario_04_memory_continuity', label: '04. Photo Memory', icon: '📸', persona: 'Meera D.' },
    { id: 'scenario_05_prompt_injection', label: '05. Injection Defense', icon: '🛡️', persona: 'Security' },
    { id: 'scenario_06_otp_contradiction', label: '06. OTP Dispute', icon: '🚫', persona: 'Suresh T.' },
  ];

  const triggerChat = (query?: string, tab: 'presets' | 'chat' = 'chat') => {
    window.dispatchEvent(
      new CustomEvent('open-support-chat', {
        detail: { query, tab },
      })
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      triggerChat(searchQuery.trim(), 'chat');
      setSearchQuery('');
    }
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
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium">Help & support</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Header and Live Hybrid Agent Notice */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">How can we help?</h1>
          <p className="text-xl sm:text-2xl text-gray-600 mt-2">Find instant answers powered by our Hybrid AI Support Agent.</p>
        </div>
        <button
          onClick={() => triggerChat(undefined, 'presets')}
          className="inline-flex items-center gap-2 self-start lg:self-center px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#198038] to-[#125a27] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Launch Judge Benchmark Panel</span>
        </button>
      </div>

      {/* Official Judge Scenarios Interactive Quick-Bar */}
      <div className="mb-10 p-5 rounded-3xl bg-gradient-to-br from-[#f0f9f2] via-[#f7fcf8] to-white border border-[#cbe8d0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#198038] text-white flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">Official Judge Demonstration Scenarios</h2>
              <p className="text-xs text-gray-600">Dual-Engine Verified: AI reasons, backend verifies, database stores truth.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#198038]">
            <ShieldCheck className="w-4 h-4" />
            <span>Sub-millisecond Deterministic Guardrails</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {judgeScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => triggerChat(undefined, 'presets')}
              className="p-2.5 rounded-2xl bg-white border border-gray-200/90 hover:border-[#198038] hover:shadow-xs text-left transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{sc.icon}</span>
                <Play className="w-3 h-3 text-gray-300 group-hover:text-[#198038] transition-colors" />
              </div>
              <div className="mt-2">
                <div className="text-[11px] font-bold text-gray-900 leading-snug group-hover:text-[#198038]">
                  {sc.label}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5">
                  {sc.persona}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-10 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-6 w-6 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-12 pr-28 py-4 border border-gray-200 bg-gray-50 rounded-2xl text-base sm:text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#198038] focus:bg-white transition-all"
          placeholder="Search help articles or ask the AI assistant directly..."
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#198038] hover:bg-[#125a27] text-white text-xs font-bold rounded-xl transition-colors"
        >
          Ask Agent
        </button>
      </form>

      {/* Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div
          onClick={() => triggerChat('Where is my order ORD-001042?')}
          className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] hover:shadow-xs transition-all group flex items-start gap-4 cursor-pointer"
        >
          <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038] flex-shrink-0 group-hover:scale-110 transition-transform">
            <Truck size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">Orders & delivery</h3>
            <p className="text-sm text-gray-500">Track, change or get help with your order.</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 mt-1" />
        </div>
        
        <div
          onClick={() => triggerChat('I want to return an item from my recent delivery.')}
          className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] hover:shadow-xs transition-all group flex items-start gap-4 cursor-pointer"
        >
          <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038] flex-shrink-0 group-hover:scale-110 transition-transform">
            <PackageOpen size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">Returns & refunds</h3>
            <p className="text-sm text-gray-500">Return items and check refund status.</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 mt-1" />
        </div>

        <div
          onClick={() => triggerChat('My payment was deducted but order shows pending. What should I do?')}
          className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] hover:shadow-xs transition-all group flex items-start gap-4 cursor-pointer"
        >
          <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038] flex-shrink-0 group-hover:scale-110 transition-transform">
            <CreditCard size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">Payments</h3>
            <p className="text-sm text-gray-500">UPI, cards, wallets and billing help.</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 mt-1" />
        </div>

        <div
          onClick={() => triggerChat('Can I update my delivery address for an existing order?')}
          className="border border-gray-200 rounded-2xl p-5 bg-white hover:border-[#198038] hover:shadow-xs transition-all group flex items-start gap-4 cursor-pointer"
        >
          <div className="bg-[#eef8f1] p-3 rounded-full text-[#198038] flex-shrink-0 group-hover:scale-110 transition-transform">
            <User size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">Account & wishlist</h3>
            <p className="text-sm text-gray-500">Manage your account, addresses and wishlist.</p>
          </div>
          <ChevronRight size={20} className="text-gray-400 mt-1" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Popular Questions */}
        <div className="w-full lg:w-3/5">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Popular questions</h2>
          <p className="text-gray-500 mt-2 mb-6">Quick answers to the most common questions.</p>
          
          <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-xs">
            {popularQuestions.map((question, index) => (
              <div 
                key={index} 
                onClick={() => triggerChat(question)}
                className={`p-6 flex justify-between items-center cursor-pointer hover:bg-[#f0f9f2]/40 transition-colors ${index !== popularQuestions.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{question}</h3>
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
          <div className="bg-[#eef8f1] rounded-3xl p-8 border border-[#c4ebd3]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Need more help?</h2>
                <p className="text-gray-600 mt-2">Dual-Engine AI Agent available 24/7.</p>
              </div>
              <div className="w-14 h-14 bg-[#c4ebd3] rounded-2xl flex items-center justify-center text-[#198038] shadow-xs">
                <Headset size={30} strokeWidth={2.2} />
              </div>
            </div>

            <div className="flex items-center gap-3 text-gray-700 font-medium mb-6">
              <Clock size={20} />
              <span>Available 24/7 • Instant Response</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <button 
                onClick={() => triggerChat(undefined, 'chat')}
                className="flex-1 bg-[#198038] hover:bg-[#125A27] text-white font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <MessageCircle size={20} /> Start a chat
              </button>
              <a 
                href="tel:18004196682"
                className="flex-1 bg-white border border-[#198038] hover:bg-gray-50 text-[#198038] font-bold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 text-center"
              >
                <PhoneCall size={20} /> Call us
              </a>
            </div>

            <div className="flex items-center gap-3 text-gray-700 font-medium pt-4 border-t border-[#c4ebd3]">
              <Mail size={20} />
              <a href="mailto:support@novamart.in" className="hover:underline">support@novamart.in</a>
            </div>
          </div>

          {/* Recent Order Box */}
          <div className="border border-gray-200 rounded-3xl p-6 bg-white shadow-xs">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your recent order</h2>
              <span className="text-[#198038] text-xs font-semibold">Live in Dark Store</span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-[#f8f6f2] rounded-2xl flex-shrink-0 p-1 flex items-center justify-center border border-gray-100">
                  <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" alt="Strawberries" className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Order #ORD-001042</p>
                  <p className="text-xs text-gray-500 mt-1">Priya S. • Indiranagar Hub</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-[#eef8f1] text-[#198038] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#c4ebd3]">
                    <Box size={12} /> Out for Delivery
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => triggerChat('Where is my order ORD-001042?')}
                className="w-full sm:w-auto bg-white border border-[#198038] hover:bg-[#eef8f1] text-[#198038] font-bold py-2.5 px-5 rounded-xl text-xs transition-colors mt-2 sm:mt-0"
              >
                Get order help
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
