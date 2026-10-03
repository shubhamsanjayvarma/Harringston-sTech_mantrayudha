import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Minus, 
  X, 
  ShieldCheck, 
  Check, 
  Package, 
  Info, 
  RotateCcw, 
  Wrench, 
  User, 
  ChevronRight, 
  ChevronDown, 
  Paperclip, 
  Send, 
  Clock, 
  FileText, 
  CreditCard, 
  ShieldAlert, 
  ArrowLeft, 
  ExternalLink, 
  Truck,
  ShoppingCart,
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { 
  processUserMessage, 
  ChatMessage, 
  getCurrentTimeFormatted,
  ChatWidgetData
} from '../services/chatbotService';
import { Product, Order } from '../types';

export function FloatingSupportButton() {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [isOpen, setIsOpen] = useState(true);
  const [viewMode, setViewMode] = useState<'welcome' | 'chat'>('welcome');
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [isConnectingHuman, setIsConnectingHuman] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

  // Initial welcome messages when entering chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, viewMode, isOpen]);

  // Send message helper
  const sendMessage = async (textToSend: string, attachmentUrl?: string) => {
    const text = textToSend.trim();
    if (!text && !attachmentUrl) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text || 'Uploaded image for review',
      time: getCurrentTimeFormatted(),
      attachmentUrl
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // If on welcome, transition into chat
    if (viewMode !== 'chat') {
      setViewMode('chat');
    }

    // Simulate smart thinking delay
    setTimeout(async () => {
      let botResponse: ChatMessage;

      if (attachmentUrl) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: isHumanMode ? 'agent' : 'bot',
          senderName: isHumanMode ? 'Ananya · NovaMart Support' : 'Nova Assist',
          text: "I've received your uploaded image proof. Our support team is inspecting the physical condition against order ORD-003621 (Voltix Air Spark Pro). We've attached this evidence to support ticket TICK-00042.",
          time: getCurrentTimeFormatted(),
          suggestions: [
            'Check refund review timeline',
            'Troubleshoot device',
            'Talk to a person'
          ]
        };
      } else {
        botResponse = await processUserMessage(text, messages, isHumanMode);
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 850);
  };

  // Allow other pages to open Nova Assist with a preset query
  useEffect(() => {
    const handleOpenAssist = (event: Event) => {
      const customEvent = event as CustomEvent<{ query?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.query) {
        setViewMode('chat');
        sendMessage(customEvent.detail.query);
      }
    };
    window.addEventListener('open_nova_assist', handleOpenAssist);
    return () => window.removeEventListener('open_nova_assist', handleOpenAssist);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage(chatInput);
  };

  // Quick Action cards on the welcome screen
  const handleActionClick = (actionName: string) => {
    setViewMode('chat');
    sendMessage(actionName);
  };

  // Handle switching to human connection
  const handleTalkToPerson = () => {
    setIsConnectingHuman(true);
    setIsHumanMode(true);
    setViewMode('chat');

    setTimeout(() => {
      setIsConnectingHuman(false);
      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        senderName: 'Ananya · NovaMart Support',
        text: "Hi! I'm Ananya from NovaMart Support. I have received your case summary and order history (Ravi Ali, ORD-003621). How can I assist you with your order, return, or account today?",
        time: getCurrentTimeFormatted(),
        suggestions: [
          'What is the status of my refund?',
          'Verify delivery mismatch',
          'Send invoice copy'
        ]
      };
      setMessages((prev) => [...prev, agentMsg]);
    }, 1800);
  };

  const handleReturnToNova = () => {
    setIsHumanMode(false);
    const returnMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      senderName: 'Nova Assist',
      text: "You are now back with Nova Assist AI. Feel free to ask about tracking, products, or store policies!",
      time: getCurrentTimeFormatted(),
      suggestions: ['Track an order', 'Explore products', 'Return policy']
    };
    setMessages((prev) => [...prev, returnMsg]);
  };

  const handleResetChat = () => {
    setMessages([]);
    setViewMode('welcome');
    setIsHumanMode(false);
    setChatInput('');
  };

  // File upload trigger
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          sendMessage('Uploaded photo proof of delivery/item condition', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Hidden File Input for Paperclip */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 group">
          {/* Tooltip */}
          <div className="absolute right-0 bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
              Customer Support
              <div className="absolute right-5 top-full -mt-1 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open NovaMart Customer Support"
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white text-gray-800 border border-gray-200/90 shadow-[0_6px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(25,128,56,0.22)] transition-all duration-300 ease-out transform hover:-translate-y-1 active:scale-95 flex items-center justify-center focus:outline-none"
          >
            <span className="w-10 h-10 rounded-full bg-[#dcf5e3] flex items-center justify-center">
              <Leaf className="w-5 h-5 text-[#198038] fill-[#198038]" />
            </span>
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-novagreen-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#198038] ring-2 ring-white" />
            </span>
          </button>
        </div>
      )}

      {/* Main Support Modal / Widget */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="nova-assist-title"
          className="fixed right-3 sm:right-6 bottom-3 sm:bottom-6 w-[calc(100vw-24px)] sm:w-[410px] md:w-[430px] h-[730px] max-h-[92vh] bg-white rounded-[28px] shadow-[0_12px_44px_rgba(0,0,0,0.15)] border border-gray-200/80 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-3 duration-200"
        >
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              {viewMode === 'chat' && (
                <button
                  onClick={() => setViewMode('welcome')}
                  className="p-1 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg transition-colors mr-0.5"
                  title="Back to Welcome Home"
                  aria-label="Back to Welcome Home"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                </button>
              )}

              {/* Bot / Agent Avatar */}
              {isHumanMode ? (
                <img 
                  src="/assets/ananya-avatar.jpg" 
                  alt="Ananya" 
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-emerald-300"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                  <svg width="22" height="22" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M8 28C8 28 8.8 17.5 19.5 10.5C26 6.2 28.5 7 28.5 7C28.5 7 29.5 9.5 25.5 16C19.5 26.5 8 28 8 28Z"
                      fill="url(#nova-leaf-header-grad)"
                    />
                    <path
                      d="M8.5 27.5C13.5 24 18.5 18 24 11.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="nova-leaf-header-grad" x1="8" y1="28" x2="28.5" y2="7" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#0f7634" />
                        <stop offset="0.5" stopColor="#16a34a" />
                        <stop offset="1" stopColor="#22c55e" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              )}

              <div>
                <h3 id="nova-assist-title" className="font-bold text-[16px] text-[#141b36] leading-tight flex items-center gap-1.5">
                  {isHumanMode ? 'Ananya · Support' : 'Nova Assist'}
                  {!isHumanMode && (
                    <span className="text-[10px] font-semibold bg-[#eef8f1] text-[#198038] px-1.5 py-0.2 rounded">AI</span>
                  )}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#16a34a] inline-block animate-pulse" />
                  <span className="text-[12px] font-medium text-[#4f5d82]">
                    {isHumanMode ? 'Customer Support Specialist' : 'AI support · Online'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {viewMode === 'chat' && (
                <button
                  onClick={handleResetChat}
                  className="p-1.5 text-[#475569] hover:text-[#141b36] rounded-lg hover:bg-gray-100 transition-colors"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="w-4 h-4 stroke-[2]" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#475569] hover:text-[#141b36] rounded-lg hover:bg-gray-100 transition-colors"
                title="Minimize"
                aria-label="Minimize"
              >
                <Minus className="w-5 h-5 stroke-[2]" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#475569] hover:text-[#141b36] rounded-lg hover:bg-gray-100 transition-colors"
                title="Close"
                aria-label="Close"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIEW 1: WELCOME SCREEN (Matches User Screenshot)                         */}
          {/* ========================================================================= */}
          {viewMode === 'welcome' ? (
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col justify-between bg-white text-left">
              <div>
                {/* Hero Illustration */}
                <div className="flex justify-center pt-2 pb-1">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Glowing Sunray Lines */}
                    <div className="absolute -top-1 left-3 w-1.5 h-4 bg-[#16a34a] rounded-full rotate-[-30deg]" />
                    <div className="absolute -top-1 right-3 w-1.5 h-4 bg-[#16a34a] rounded-full rotate-[30deg]" />
                    <div className="absolute top-1/2 -left-4 -translate-y-1/2 w-4 h-1.5 bg-[#16a34a] rounded-full" />
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-1.5 bg-[#16a34a] rounded-full" />

                    {/* Green Soft Circle Base */}
                    <div className="w-24 h-24 rounded-full bg-[#dcfce7] flex items-center justify-center shadow-xs">
                      {/* Stylized Leaf */}
                      <svg width="46" height="46" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M8 28C8 28 8.8 17.5 19.5 10.5C26 6.2 28.5 7 28.5 7C28.5 7 29.5 9.5 25.5 16C19.5 26.5 8 28 8 28Z"
                          fill="url(#nova-leaf-hero-grad)"
                        />
                        <path
                          d="M8.5 27.5C13.5 24 18.5 18 24 11.5"
                          stroke="white"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="nova-leaf-hero-grad" x1="8" y1="28" x2="28.5" y2="7" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#0f7634" />
                            <stop offset="0.5" stopColor="#16a34a" />
                            <stop offset="1" stopColor="#22c55e" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hero Title */}
                <h2 className="text-[26px] font-extrabold text-[#141b36] text-center mt-3 tracking-tight flex items-center justify-center gap-2">
                  <span>Hi, I'm Nova</span>
                  <span className="inline-block text-[24px]">👋</span>
                </h2>

                {/* Hero Description */}
                <p className="text-[13.5px] text-[#4f5d82] text-center leading-[1.55] max-w-[315px] mx-auto mt-2 font-normal">
                  Welcome to NovaMart! I can help you find products, track an order, manage a return, or answer a question.
                </p>

                {/* 2x2 Feature Action Grid */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  {/* 1. Track an order */}
                  <button
                    onClick={() => handleActionClick('Track an order')}
                    className="bg-[#effbf3] hover:bg-[#e4f7ea] rounded-2xl p-4 flex flex-col justify-between h-[94px] text-left transition-all hover:scale-[1.01] active:scale-[0.98] group cursor-pointer"
                  >
                    <Truck className="w-6 h-6 text-[#141b36] stroke-[1.8]" />
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[13.5px] font-bold text-[#141b36]">Track an order</span>
                      <ChevronRight className="w-4 h-4 text-[#141b36] stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  {/* 2. Returns & refunds */}
                  <button
                    onClick={() => handleActionClick('Returns & refunds')}
                    className="bg-[#f0f7ff] hover:bg-[#e4f0fe] rounded-2xl p-4 flex flex-col justify-between h-[94px] text-left transition-all hover:scale-[1.01] active:scale-[0.98] group cursor-pointer"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#141b36]">
                      <path d="M9 14L4 9l5-5"/>
                      <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/>
                    </svg>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[13.5px] font-bold text-[#141b36]">Returns & refunds</span>
                      <ChevronRight className="w-4 h-4 text-[#141b36] stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  {/* 3. Product help */}
                  <button
                    onClick={() => handleActionClick('Product help')}
                    className="bg-[#f6f4fe] hover:bg-[#ece8fd] rounded-2xl p-4 flex flex-col justify-between h-[94px] text-left transition-all hover:scale-[1.01] active:scale-[0.98] group cursor-pointer"
                  >
                    <Package className="w-6 h-6 text-[#141b36] stroke-[1.8]" />
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[13.5px] font-bold text-[#141b36]">Product help</span>
                      <ChevronRight className="w-4 h-4 text-[#141b36] stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>

                  {/* 4. Payments & billing */}
                  <button
                    onClick={() => handleActionClick('Payments & billing')}
                    className="bg-[#fef9ec] hover:bg-[#fcf2d9] rounded-2xl p-4 flex flex-col justify-between h-[94px] text-left transition-all hover:scale-[1.01] active:scale-[0.98] group cursor-pointer"
                  >
                    <CreditCard className="w-6 h-6 text-[#141b36] stroke-[1.8]" />
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[13.5px] font-bold text-[#141b36]">Payments & billing</span>
                      <ChevronRight className="w-4 h-4 text-[#141b36] stroke-[2.2] group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>

                {/* Subtle Divider Line */}
                <div className="w-full h-px bg-gray-100 my-4" />

                {/* Policy Notice Row */}
                <div className="flex items-center gap-3 px-1">
                  <div className="w-9 h-9 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#16a34a] stroke-[2.2]" />
                  </div>
                  <p className="text-[12.5px] text-[#4f5d82] leading-snug font-normal">
                    I'll check your order and store policy<br />before suggesting next steps.
                  </p>
                </div>

                {/* Subtle Divider Line */}
                <div className="w-full h-px bg-gray-100 my-4" />
              </div>

              {/* Bottom Input Area on Welcome Screen */}
              <div className="px-0.5">
                <p className="text-[14.5px] font-semibold text-[#141b36] mb-2.5">
                  What can I help you with today?
                </p>

                <form onSubmit={handleFormSubmit} className="relative">
                  <div className="border border-gray-200 rounded-2xl px-4 py-3 bg-white flex items-center gap-2 focus-within:border-gray-300 transition-all">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 text-[13.5px] text-[#141b36] placeholder:text-[#94a3b8] focus:outline-none bg-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim()}
                      className="text-[#141b36] disabled:text-gray-300 p-1 hover:text-[#198038] transition-colors cursor-pointer"
                      aria-label="Send message"
                    >
                      <Send className="w-5 h-5 stroke-[1.8]" />
                    </button>
                  </div>
                </form>

                <p className="text-[11px] text-center text-[#8894a8] mt-2.5 font-normal">
                  AI can make mistakes. Actions are confirmed before processing.
                </p>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* VIEW 2: FULL WORKING CHAT SECTION STREAM                                 */
            /* ========================================================================= */
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white text-sm">
                {/* Store Policy Verification Notice Header */}
                <div className="border border-gray-100 bg-[#fbfcfc] rounded-2xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-gray-600 leading-relaxed font-normal">
                    I'll check your order and store policy before suggesting next steps.
                  </p>
                </div>

                {/* Connecting to Human Notice */}
                {isConnectingHuman && (
                  <div className="border border-amber-200 bg-amber-50 rounded-2xl p-3 flex items-center gap-3 animate-pulse">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">Connecting you to a support specialist...</p>
                      <p className="text-[11px] text-amber-700">Connecting you with Ananya · NovaMart Support.</p>
                    </div>
                  </div>
                )}

                {/* Active Human Support Banner */}
                {isHumanMode && !isConnectingHuman && (
                  <div className="border border-emerald-100 bg-[#f2faf4] rounded-2xl p-3 flex items-center gap-3">
                    <img 
                      src="/assets/ananya-avatar.jpg" 
                      alt="Ananya" 
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-emerald-300"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-900">You're chatting with a person</p>
                      <p className="text-[11px] text-gray-600">Ananya from NovaMart Support is here to help.</p>
                    </div>
                    <button
                      onClick={handleReturnToNova}
                      className="text-xs font-semibold text-[#198038] hover:underline"
                    >
                      Return to AI
                    </button>
                  </div>
                )}

                {/* Messages Stream */}
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <span className="text-[11px] text-gray-400 mb-1 px-1">{msg.time}</span>
                    
                    {/* User Message Bubble */}
                    {msg.sender === 'user' && (
                      <div className="max-w-[85%] bg-[#eaf8ed] text-gray-900 rounded-2xl rounded-tr-xs px-4 py-2.5 text-[13.5px] leading-relaxed shadow-2xs space-y-2">
                        {msg.attachmentUrl && (
                          <div className="rounded-xl overflow-hidden border border-emerald-200">
                            <img 
                              src={msg.attachmentUrl} 
                              alt="Attachment preview" 
                              className="max-h-48 w-full object-cover" 
                            />
                          </div>
                        )}
                        <p>{msg.text}</p>
                      </div>
                    )}

                    {/* Bot / Agent Message Bubble */}
                    {msg.sender !== 'user' && (
                      <div className="flex items-start gap-2.5 max-w-[95%]">
                        {/* Avatar */}
                        {msg.sender === 'agent' ? (
                          <img 
                            src="/assets/ananya-avatar.jpg" 
                            alt="Ananya" 
                            className="w-7 h-7 rounded-full object-cover shrink-0 mt-1 border border-emerald-300"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#dcf5e3] flex items-center justify-center shrink-0 mt-1">
                            <Leaf className="w-3.5 h-3.5 text-[#198038] fill-[#198038]" />
                          </div>
                        )}

                        <div className="flex-1 space-y-2.5">
                          <div className="bg-[#f4f5f9] text-gray-800 rounded-2xl rounded-tl-xs px-4 py-3 text-[13.5px] leading-relaxed shadow-2xs">
                            {msg.text}
                          </div>

                          {/* ========================================================= */}
                          {/* EMBEDDED WIDGETS                                          */}
                          {/* ========================================================= */}

                          {/* 1. ORDER LIST WIDGET */}
                          {msg.widget?.type === 'order_list' && msg.widget.orders && (
                            <div className="space-y-2 pt-1">
                              {msg.widget.orders.map((ord) => (
                                <div 
                                  key={ord.orderId}
                                  className="border border-gray-200/90 rounded-2xl p-3 bg-white shadow-2xs hover:border-[#198038] transition-all space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs text-gray-900">{ord.orderId}</span>
                                    <span className="bg-[#eef8f1] text-[#198038] text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
                                      {ord.deliveryStatus}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2.5">
                                    {ord.items[0]?.image && (
                                      <img 
                                        src={ord.items[0].image} 
                                        alt={ord.items[0].productName} 
                                        className="w-12 h-12 object-contain rounded-lg bg-gray-50 border border-gray-100 p-1 shrink-0"
                                      />
                                    )}
                                    <div className="flex-1 min-w-0 text-xs">
                                      <p className="font-semibold text-gray-900 truncate">
                                        {ord.items[0]?.productName || 'NovaMart Item'}
                                      </p>
                                      <p className="text-[11px] text-gray-500">
                                        Placed: {ord.orderDate.split(' ')[0]} · ₹{ord.totalAmount.toLocaleString('en-IN')}
                                      </p>
                                      <p className="text-[10px] text-gray-400">
                                        Courier: {ord.courier} ({ord.trackingNumber})
                                      </p>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => sendMessage(`Track ${ord.orderId}`)}
                                    className="w-full py-1.5 bg-[#f0f9f2] hover:bg-[#e3f4e6] text-[#198038] text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Truck className="w-3.5 h-3.5" />
                                    Track Live Delivery
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 2. ORDER DETAIL WIDGET */}
                          {msg.widget?.type === 'order_detail' && msg.widget.selectedOrder && (
                            <div className="border border-gray-200/90 rounded-2xl p-3.5 bg-white shadow-2xs space-y-3 pt-1">
                              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <span className="font-bold text-xs text-gray-900">{msg.widget.selectedOrder.orderId}</span>
                                <span className="bg-[#eef8f1] text-[#198038] text-[10px] font-semibold px-2 py-0.5 rounded capitalize">
                                  {msg.widget.selectedOrder.deliveryStatus}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                {msg.widget.selectedOrder.items[0]?.image && (
                                  <img 
                                    src={msg.widget.selectedOrder.items[0].image} 
                                    alt={msg.widget.selectedOrder.items[0].productName} 
                                    className="w-14 h-14 object-contain rounded-xl bg-gray-50 border border-gray-100 p-1"
                                  />
                                )}
                                <div className="flex-1 text-xs">
                                  <p className="font-bold text-gray-900">{msg.widget.selectedOrder.items[0]?.productName}</p>
                                  <p className="text-[11px] text-gray-500">Amount: ₹{msg.widget.selectedOrder.totalAmount.toLocaleString('en-IN')}</p>
                                  <p className="text-[11px] text-gray-500">Tracking: {msg.widget.selectedOrder.trackingNumber}</p>
                                  <p className="text-[11px] text-gray-500">Courier: {msg.widget.selectedOrder.courier}</p>
                                </div>
                              </div>

                              <div className="bg-gray-50 rounded-xl p-2.5 text-xs text-gray-600 space-y-1">
                                <p><span className="text-gray-400">Shipping Address:</span> {msg.widget.selectedOrder.shippingAddress}</p>
                                <p><span className="text-gray-400">Estimated Delivery:</span> {msg.widget.selectedOrder.estimatedDeliveryDate}</p>
                              </div>

                              <button
                                onClick={() => navigate('/account')}
                                className="w-full py-2 bg-[#198038] hover:bg-[#156d30] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                View in My Orders
                              </button>
                            </div>
                          )}

                          {/* 3. PRODUCT RECOMMENDATIONS WIDGET */}
                          {msg.widget?.type === 'products' && msg.widget.products && (
                            <div className="space-y-2.5 pt-1">
                              {msg.widget.products.map((prod) => (
                                <div 
                                  key={prod.id}
                                  className="border border-gray-200/90 rounded-2xl p-3 bg-white shadow-2xs hover:border-[#198038] transition-all flex items-center gap-3"
                                >
                                  <img 
                                    src={prod.image} 
                                    alt={prod.name} 
                                    className="w-14 h-14 object-contain rounded-xl bg-gray-50 border border-gray-100 p-1 shrink-0"
                                  />
                                  <div className="flex-1 min-w-0 text-xs">
                                    <h4 className="font-bold text-gray-900 truncate">{prod.name}</h4>
                                    <p className="text-[11px] text-gray-500">{prod.brand} · {prod.category}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="font-bold text-gray-900 text-sm">
                                        ₹ {prod.price.toLocaleString('en-IN')}
                                      </span>
                                      {(prod.discountPercent ?? 0) > 0 && (
                                        <span className="text-[10px] bg-rose-50 text-rose-600 font-semibold px-1.5 py-0.2 rounded">
                                          {prod.discountPercent}% off
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      addToCart(prod);
                                      sendMessage(`I added ${prod.name} to my cart.`);
                                    }}
                                    className="p-2 bg-[#198038] hover:bg-[#156d30] text-white rounded-xl shadow-2xs transition-all shrink-0 cursor-pointer"
                                    title="Add to cart"
                                    aria-label={`Add ${prod.name} to cart`}
                                  >
                                    <ShoppingCart className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 4. REFUND REVIEW STEPPER WIDGET */}
                          {msg.widget?.type === 'refund_stepper' && (
                            <div className="border border-gray-200/80 rounded-2xl p-3.5 bg-white shadow-2xs space-y-3 pt-1">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <Clock className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-bold text-gray-900 leading-tight">Refund: Pending review</h4>
                                    <p className="text-[11px] text-gray-500">Order: ORD-003621 · Ticket: TICK-00042</p>
                                  </div>
                                </div>
                                <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  Under review
                                </span>
                              </div>

                              {/* Stepper Steps */}
                              <div className="space-y-2.5 text-xs pt-1">
                                <div className="flex items-start gap-2.5">
                                  <div className="w-4 h-4 rounded-full bg-[#198038] text-white flex items-center justify-center mt-0.5">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </div>
                                  <div className="flex-1 flex justify-between">
                                    <p className="font-semibold text-gray-900">Return request created</p>
                                    <span className="text-[10px] text-gray-400">10:08 AM</span>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                  <div className="w-4 h-4 rounded-full bg-[#198038] text-white flex items-center justify-center mt-0.5">
                                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                                  </div>
                                  <div className="flex-1 flex justify-between">
                                    <p className="font-semibold text-gray-900">Proof received</p>
                                    <span className="text-[10px] text-gray-400">10:18 AM</span>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                  <div className="w-4 h-4 rounded-full border-2 border-[#198038] bg-white flex items-center justify-center mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#198038]" />
                                  </div>
                                  <div className="flex-1 flex justify-between items-center">
                                    <p className="font-semibold text-gray-900">Delivery verification</p>
                                    <span className="text-[10px] bg-[#eef8f1] text-[#198038] font-bold px-1.5 py-0.2 rounded">In progress</span>
                                  </div>
                                </div>

                                <div className="flex items-start gap-2.5 opacity-50">
                                  <div className="w-4 h-4 rounded-full border border-gray-300 bg-white flex items-center justify-center mt-0.5" />
                                  <div className="flex-1 flex justify-between items-center">
                                    <p className="font-medium text-gray-600">Inspection & refund approval</p>
                                    <span className="text-[10px] text-gray-400">Next</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-2 pt-1 border-t border-gray-100">
                                <button
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Paperclip className="w-3.5 h-3.5" />
                                  Upload Proof
                                </button>
                                <button
                                  onClick={handleTalkToPerson}
                                  className="flex-1 py-1.5 bg-[#198038] hover:bg-[#156d30] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <User className="w-3.5 h-3.5" />
                                  Speak to Agent
                                </button>
                              </div>
                            </div>
                          )}

                          {/* 5. TROUBLESHOOTING WIDGET */}
                          {msg.widget?.type === 'troubleshooting' && (
                            <div className="border border-gray-200/80 rounded-2xl p-3 bg-white shadow-2xs space-y-2 pt-1 text-xs">
                              <div className="flex items-center gap-2 mb-1">
                                <Wrench className="w-4 h-4 text-[#198038]" />
                                <h4 className="font-bold text-gray-900">Device Diagnostic Steps</h4>
                              </div>

                              {/* Accordion 1 */}
                              <div className="border border-gray-100 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => setActiveAccordion(activeAccordion === 1 ? null : 1)}
                                  className="w-full p-2.5 flex items-center justify-between hover:bg-gray-50 text-left font-medium text-gray-900 cursor-pointer"
                                >
                                  <span className="font-semibold">1. Power & Charging check</span>
                                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${activeAccordion === 1 ? 'rotate-180' : ''}`} />
                                </button>
                                {activeAccordion === 1 && (
                                  <div className="p-2.5 bg-gray-50/70 text-gray-600 text-[11px] border-t border-gray-100 leading-relaxed">
                                    Connect the supplied Type-C cable to a 5V/1.5A charger. Ensure the indicator LED turns red. Charge for at least 10 minutes before testing.
                                  </div>
                                )}
                              </div>

                              {/* Accordion 2 */}
                              <div className="border border-gray-100 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => setActiveAccordion(activeAccordion === 2 ? null : 2)}
                                  className="w-full p-2.5 flex items-center justify-between hover:bg-gray-50 text-left font-medium text-gray-900 cursor-pointer"
                                >
                                  <span className="font-semibold">2. Bluetooth Reconnection</span>
                                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${activeAccordion === 2 ? 'rotate-180' : ''}`} />
                                </button>
                                {activeAccordion === 2 && (
                                  <div className="p-2.5 bg-gray-50/70 text-gray-600 text-[11px] border-t border-gray-100 leading-relaxed">
                                    Forget device from your phone's Bluetooth settings, restart your phone, open the earbud case for 7 seconds to re-enter pairing mode.
                                  </div>
                                )}
                              </div>

                              {/* Accordion 3 */}
                              <div className="border border-gray-100 rounded-xl overflow-hidden">
                                <button
                                  onClick={() => setActiveAccordion(activeAccordion === 3 ? null : 3)}
                                  className="w-full p-2.5 flex items-center justify-between hover:bg-gray-50 text-left font-medium text-gray-900 cursor-pointer"
                                >
                                  <span className="font-semibold">3. Factory Hardware Reset</span>
                                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${activeAccordion === 3 ? 'rotate-180' : ''}`} />
                                </button>
                                {activeAccordion === 3 && (
                                  <div className="p-2.5 bg-gray-50/70 text-gray-600 text-[11px] border-t border-gray-100 leading-relaxed">
                                    Press and hold both touch buttons simultaneously for 10 seconds until the white LED flashes 3 times to restore factory settings.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 6. PAYMENT INFO WIDGET */}
                          {msg.widget?.type === 'payment_info' && (
                            <div className="border border-gray-200/80 rounded-2xl p-3 bg-white shadow-2xs space-y-2.5 pt-1 text-xs">
                              <div className="flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-[#198038]" />
                                <h4 className="font-bold text-gray-900">Payment & Refund Gateway</h4>
                              </div>

                              <div className="space-y-1.5 text-gray-600">
                                <div className="flex justify-between">
                                  <span>Order Reference:</span>
                                  <span className="font-bold text-gray-900">ORD-003621</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Payment Method:</span>
                                  <span className="font-bold text-gray-900">NovaMart Wallet •••• 3621</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Amount:</span>
                                  <span className="font-bold text-gray-900">₹ 5,899</span>
                                </div>
                              </div>

                              <div className="bg-rose-50 border border-rose-100 text-rose-800 rounded-xl p-2 text-[11px] flex items-center gap-1.5 font-medium">
                                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                <span>Never share your UPI PIN or OTP in chat.</span>
                              </div>
                            </div>
                          )}

                          {/* 7. POLICY INFO WIDGET */}
                          {msg.widget?.type === 'policy_info' && (
                            <div className="border border-gray-200/80 rounded-2xl p-3 bg-white shadow-2xs space-y-2 pt-1 text-xs">
                              <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-[#198038]" />
                                {msg.widget.policyTitle}
                              </h4>
                              <p className="text-[12px] text-gray-600 leading-relaxed font-normal bg-gray-50/70 p-2.5 rounded-xl border border-gray-100">
                                {msg.widget.policySummary}
                              </p>
                              <button
                                onClick={() => navigate('/help')}
                                className="w-full py-1.5 text-center text-[#198038] hover:bg-[#f0f9f2] rounded-lg font-semibold transition-colors cursor-pointer"
                              >
                                View full policy document →
                              </button>
                            </div>
                          )}

                          {/* Quick Suggestion Chips */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {msg.suggestions.map((sug, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => sendMessage(sug)}
                                  className="text-[11px] bg-white hover:bg-[#effbf3] border border-gray-200 hover:border-[#198038] text-gray-700 hover:text-[#198038] font-medium px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs"
                                >
                                  {sug}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Animated Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-7 h-7 rounded-full bg-[#dcf5e3] flex items-center justify-center shrink-0">
                      <Leaf className="w-3.5 h-3.5 text-[#198038] fill-[#198038]" />
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#f4f5f9] text-gray-500 rounded-2xl rounded-tl-xs px-3.5 py-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#198038] animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#198038] animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#198038] animate-bounce" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Chat Input Bar in conversation mode */}
              <div className="px-4 py-3 bg-white border-t border-gray-100 shrink-0 space-y-2">
                <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach proof or photo"
                    className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors shrink-0 cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4 stroke-[2]" />
                  </button>

                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={isHumanMode ? "Type message to Ananya..." : "Type your message..."}
                    className="flex-1 text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#198038] focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                  />

                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="w-9 h-9 bg-[#198038] hover:bg-[#156d30] disabled:bg-gray-200 text-white rounded-full flex items-center justify-center transition-all shadow-2xs hover:shadow-xs active:scale-95 shrink-0 cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 ml-0.5 fill-white text-white stroke-[1.5]" />
                  </button>
                </form>

                <div className="flex items-center justify-between text-[11px] px-1 text-gray-400">
                  <span>Actions confirmed before processing.</span>
                  {!isHumanMode ? (
                    <button
                      onClick={handleTalkToPerson}
                      className="font-semibold text-[#198038] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <User className="w-3 h-3" />
                      Talk to a person
                    </button>
                  ) : (
                    <button
                      onClick={handleReturnToNova}
                      className="font-semibold text-[#198038] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      Switch to AI
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
