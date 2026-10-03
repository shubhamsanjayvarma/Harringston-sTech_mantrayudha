import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Headset, 
  X, 
  MessageSquare, 
  Truck, 
  RotateCcw, 
  Phone, 
  ExternalLink, 
  ChevronRight,
  Send
} from 'lucide-react';

export function FloatingSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'quick' | 'chat'>('quick');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([
    {
      sender: 'agent',
      text: 'Hi there! 👋 How can NovaMart support help you today?',
      time: 'Just now'
    }
  ]);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: 'Just now' }
    ]);
    setChatInput('');

    // Automated agent acknowledgment
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: 'Thanks for reaching out! A support representative from your nearest dark store is reviewing your request and will reply momentarily.',
          time: 'Just now'
        }
      ]);
    }, 900);
  };

  const handleNavigateToHelp = () => {
    setIsOpen(false);
    navigate('/help');
  };

  return (
    <>
      {/* Floating Action Button Container */}
      <div className="fixed right-5 sm:right-7 bottom-6 sm:bottom-8 z-40 group">
        {/* Hover Tooltip */}
        <div
          id="support-tooltip"
          role="tooltip"
          className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-gray-900/95 text-white text-xs font-medium rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 whitespace-nowrap translate-x-1 group-hover:translate-x-0 hidden sm:flex items-center gap-1.5"
        >
          <span>Customer Support</span>
          {/* Tooltip caret arrow pointing to button */}
          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-900/95" />
        </div>

        {/* Main Floating Button */}
        <button
          ref={buttonRef}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Customer Support"
          aria-describedby="support-tooltip"
          className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 hover:bg-white text-gray-800 hover:text-novagreen-800 border border-gray-200/90 hover:border-novagreen-600/40 shadow-[0_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(25,128,56,0.18)] transition-all duration-300 ease-out transform hover:-translate-y-1 active:scale-95 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-novagreen-600 focus-visible:ring-offset-2 backdrop-blur-xs"
        >
          {/* Subtle online status indicator */}
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-novagreen-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#198038] ring-2 ring-white" />
          </span>

          {isOpen ? (
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
          ) : (
            <Headset className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.9] text-gray-800 group-hover:text-[#198038] transition-colors" />
          )}
        </button>
      </div>

      {/* Floating Support Modal / Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-dialog-title"
          className="fixed right-4 sm:right-7 bottom-20 sm:bottom-24 w-[calc(100vw-32px)] sm:w-[380px] max-h-[560px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-3 fade-in duration-200"
        >
          {/* Panel Header */}
          <div className="bg-[#f0f9f2] border-b border-[#d8edd9] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#198038] text-white flex items-center justify-center shadow-xs">
                <Headset className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 id="support-dialog-title" className="text-sm font-bold text-gray-900 leading-tight">
                  NovaMart Support
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#198038]" />
                  <span className="text-[11px] font-medium text-gray-600">
                    Online • Typically replies in 2 mins
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Close support panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/60 p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'quick'
                  ? 'bg-white text-[#198038] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Quick Help
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-[#198038] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Live Chat
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'quick' ? (
              <div className="space-y-3">
                {/* Instant Action 1: Track order */}
                <div
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/cart');
                  }}
                  className="p-3 bg-gray-50/80 hover:bg-[#f0f9f2] rounded-2xl border border-gray-100 hover:border-[#b8e2be] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#198038] group-hover:scale-105 transition-transform">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Track Current Delivery</p>
                      <p className="text-[11px] text-gray-500">Live 10-15m dark store ETA</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                </div>

                {/* Instant Action 2: Returns & Refunds */}
                <div
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/help');
                  }}
                  className="p-3 bg-gray-50/80 hover:bg-[#f0f9f2] rounded-2xl border border-gray-100 hover:border-[#b8e2be] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#198038] group-hover:scale-105 transition-transform">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Returns & Refunds</p>
                      <p className="text-[11px] text-gray-500">Instant return at doorstep</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                </div>

                {/* Instant Action 3: Switch to Live Chat */}
                <div
                  onClick={() => setActiveTab('chat')}
                  className="p-3 bg-gray-50/80 hover:bg-[#f0f9f2] rounded-2xl border border-gray-100 hover:border-[#b8e2be] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#198038] group-hover:scale-105 transition-transform">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Chat with Support Agent</p>
                      <p className="text-[11px] text-gray-500">Instant in-app assistance</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                </div>

                {/* Direct Phone Support */}
                <div className="p-3 bg-[#f8f9fa] rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#198038]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Toll-free Hotline</p>
                      <p className="text-[11px] text-gray-500">1800-419-NOVA (6am - 12am)</p>
                    </div>
                  </div>
                  <a
                    href="tel:18004196682"
                    className="text-xs font-bold text-[#198038] hover:underline"
                  >
                    Call
                  </a>
                </div>

                {/* Full Help Center Link */}
                <button
                  onClick={handleNavigateToHelp}
                  className="w-full mt-2 py-2 px-3 text-xs font-semibold text-[#198038] hover:text-[#125a27] bg-[#eef8f1] hover:bg-[#e4f3e8] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Visit Full Help & Support Center</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* Live Chat Stream */
              <div className="flex flex-col h-[280px]">
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] text-xs px-3 py-2 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-[#198038] text-white rounded-br-xs'
                            : 'bg-gray-100 text-gray-900 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5 px-1">
                        {msg.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chat Input Box */}
                <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#198038] focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="p-2 bg-[#198038] disabled:bg-gray-200 text-white rounded-xl hover:bg-[#156d30] transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
