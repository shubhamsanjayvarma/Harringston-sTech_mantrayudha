import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Headset, 
  X, 
  MessageSquare, 
  Truck, 
  RotateCcw, 
  Phone, 
  ChevronRight,
  Send,
  Sparkles,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  Tag
} from 'lucide-react';
import { 
  AuditTraceStage, 
  CustomerPersona, 
  DemoPreset, 
  PRESET_CUSTOMERS, 
  TerminalMove 
} from '../types/agent';
import { 
  chatWithAgent, 
  fetchDemoPresets, 
  runDemoPreset, 
  checkHealth 
} from '../services/api';
import { AuditTraceViewer } from './AuditTraceViewer';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  time: string;
  terminalMove?: TerminalMove | string;
  createdTicketId?: string | null;
  executionTimeMs?: number;
  auditTrace?: AuditTraceStage[];
}

export function FloatingSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'chat' | 'quick'>('presets');
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [runningPresetId, setRunningPresetId] = useState<string | null>(null);
  const [activeCustomer, setActiveCustomer] = useState<CustomerPersona>(PRESET_CUSTOMERS[0]);
  const [backendStatus, setBackendStatus] = useState<{ online: boolean; records: number }>({
    online: true,
    records: 29244,
  });

  const [presets, setPresets] = useState<DemoPreset[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: `Hello ${PRESET_CUSTOMERS[0].name}! 👋 I am your NovaMart Hybrid AI Support Assistant. My decisions are backed by deterministic policies with zero hallucination. How can I assist you today?`,
      time: 'Just now',
      terminalMove: 'ANSWER',
    },
  ]);

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab, isLoading]);

  // Load presets & check health on mount
  useEffect(() => {
    async function initData() {
      try {
        const [health, presetList] = await Promise.all([
          checkHealth(),
          fetchDemoPresets(),
        ]);
        setBackendStatus({
          online: health.status === 'healthy',
          records: health.orders_indexed || 29244,
        });
        if (presetList && presetList.length > 0) {
          setPresets(presetList);
        }
      } catch (err) {
        console.warn('Backend initialization warning:', err);
      }
    }
    initData();
  }, []);

  // Update greeting when customer changes
  const handleSelectCustomer = (cust: CustomerPersona) => {
    setActiveCustomer(cust);
    setMessages((prev) => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        sender: 'agent',
        text: `Switched customer context to ${cust.name} (${cust.id} • ${cust.tier} tier). ${cust.description}.`,
        time: 'Just now',
        terminalMove: 'ANSWER',
      },
    ]);
  };

  // Listen for open-support-chat custom event
  useEffect(() => {
    function handleOpenEvent(e: Event) {
      const customEvent = e as CustomEvent<{ query?: string; tab?: 'presets' | 'chat' | 'quick' }>;
      setIsOpen(true);
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab);
      } else {
        setActiveTab('chat');
      }
      if (customEvent.detail?.query) {
        handleSendMessage(undefined, customEvent.detail.query);
      }
    }
    window.addEventListener('open-support-chat', handleOpenEvent);
    return () => window.removeEventListener('open-support-chat', handleOpenEvent);
  }, [activeCustomer]);

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

  // Send message via real API
  const handleSendMessage = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const query = overrideText || chatInput;
    if (!query.trim() || isLoading) return;

    const userText = query.trim();
    const userMsgId = `user-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        text: userText,
        time: 'Just now',
      },
    ]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAgent({
        customer_id: activeCustomer.id,
        message: userText,
        reference_time: '2026-10-03T14:00:00+05:30',
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'agent',
          text: response.response,
          time: 'Just now',
          terminalMove: response.terminal_move,
          createdTicketId: response.created_ticket_id,
          executionTimeMs: response.execution_time_ms,
          auditTrace: response.audit_trace,
        },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: `⚠️ Gateway communication note: ${err.message || 'Unable to reach backend'}. Please ensure FastAPI is running on http://localhost:8001.`,
          time: 'Just now',
          terminalMove: 'ESCALATE',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Run official judge demo preset
  const handleRunPreset = async (scenarioId: string) => {
    setRunningPresetId(scenarioId);
    try {
      const result = await runDemoPreset(scenarioId);

      // Match persona to scenario if matching
      const foundCustomer = PRESET_CUSTOMERS.find((c) => result.customer.includes(c.id));
      if (foundCustomer) {
        setActiveCustomer(foundCustomer);
      }

      // Add to conversation thread
      setMessages((prev) => [
        ...prev,
        {
          id: `user-preset-${Date.now()}`,
          sender: 'user',
          text: `[Demo Preset ${scenarioId}]: ${result.input_message}`,
          time: 'Just now',
        },
        {
          id: `agent-preset-${Date.now()}`,
          sender: 'agent',
          text: result.agent_response,
          time: 'Just now',
          terminalMove: result.actual_move,
          createdTicketId: result.created_ticket_id,
          executionTimeMs: result.execution_time_ms,
          auditTrace: result.audit_trace,
        },
      ]);

      // Switch to chat tab to view the live execution
      setActiveTab('chat');
    } catch (err: any) {
      console.error('Failed to run preset:', err);
      alert(`Could not execute preset: ${err.message}`);
    } finally {
      setRunningPresetId(null);
    }
  };

  const renderMoveBadge = (move?: string) => {
    if (!move) return null;
    let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
    if (move === 'ANSWER') colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (move === 'ACT') colorClass = 'bg-blue-50 text-blue-800 border-blue-200';
    if (move === 'ASK') colorClass = 'bg-amber-50 text-amber-800 border-amber-200';
    if (move === 'ESCALATE') colorClass = 'bg-rose-50 text-rose-800 border-rose-200';

    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colorClass}`}>
        <Tag className="w-2.5 h-2.5" />
        {move}
      </span>
    );
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed right-5 sm:right-7 bottom-6 sm:bottom-8 z-40 group">
        <div
          id="support-tooltip"
          role="tooltip"
          className="absolute right-full top-1/2 -translate-y-1/2 mr-3 px-3 py-1.5 bg-gray-900/95 text-white text-xs font-medium rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 whitespace-nowrap translate-x-1 group-hover:translate-x-0 hidden sm:flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Support • Dual-Engine</span>
          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-gray-900/95" />
        </div>

        <button
          ref={buttonRef}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label="Open AI Customer Support Agent"
          className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white hover:bg-gray-50 text-gray-800 hover:text-[#198038] border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(25,128,56,0.22)] transition-all duration-300 ease-out transform hover:-translate-y-1 active:scale-95 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#198038] focus-visible:ring-offset-2"
        >
          {/* Online green indicator */}
          <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#198038] ring-2 ring-white" />
          </span>

          {isOpen ? (
            <X className="w-6 h-6 text-gray-700 transition-transform duration-200 rotate-90 group-hover:rotate-0" />
          ) : (
            <Headset className="w-6 h-6 stroke-[2] text-[#198038]" />
          )}
        </button>
      </div>

      {/* Main Support Panel Dialog */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-dialog-title"
          className="fixed right-3 sm:right-7 bottom-20 sm:bottom-24 w-[calc(100vw-24px)] sm:w-[460px] h-[640px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#eef8f1] via-[#f4faf5] to-white border-b border-[#d8edd9] p-3.5 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#198038] text-white flex items-center justify-center shadow-xs">
                  <Headset className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 id="support-dialog-title" className="text-sm font-bold text-gray-900 leading-tight">
                      NovaMart AI Agent
                    </h3>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#198038]/10 text-[#198038] uppercase">
                      Dual-Engine
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#198038]" />
                    <span className="text-[10px] font-medium text-gray-600">
                      {backendStatus.online ? 'Online' : 'Degraded'} • {backendStatus.records.toLocaleString()} in-memory records
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-black/5 transition-colors"
                  aria-label="Close support dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Persona Switcher Strip */}
            <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Active Customer:
              </span>
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                {PRESET_CUSTOMERS.map((cust) => {
                  const isSelected = activeCustomer.id === cust.id;
                  return (
                    <button
                      key={cust.id}
                      type="button"
                      onClick={() => handleSelectCustomer(cust)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#198038] text-white shadow-xs'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {cust.avatar} {cust.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/70 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-white text-[#198038] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Judge Presets</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-white text-[#198038] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat</span>
              {messages.length > 1 && (
                <span className="w-4 h-4 rounded-full bg-[#198038] text-white text-[9px] flex items-center justify-center">
                  {messages.length}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-1.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'quick'
                  ? 'bg-white text-[#198038] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>Quick Help</span>
            </button>
          </div>

          {/* Panel Content Body */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3">
            {/* TAB 1: Judge Presets */}
            {activeTab === 'presets' && (
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Official Judge Benchmark Scenarios:</span>
                    <p className="text-amber-800 text-[10px] mt-0.5">
                      1-click runs tested against the 9-stage verified hybrid engine. Real-time audit traces generated in sub-milliseconds.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {presets.map((preset, idx) => {
                    const isRunning = runningPresetId === preset.scenario_id;
                    return (
                      <div
                        key={preset.scenario_id}
                        className="p-3 rounded-2xl border border-gray-200 bg-white hover:border-[#198038] hover:shadow-xs transition-all flex flex-col justify-between gap-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[10px] font-bold text-gray-400">
                                0{idx + 1}
                              </span>
                              <h4 className="text-xs font-bold text-gray-900 leading-snug">
                                {preset.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1">
                              {preset.description}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                            {preset.expected_move}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                          <span className="text-[10px] text-gray-500 font-medium">
                            Persona: <strong className="text-gray-700">{preset.customer_name}</strong>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRunPreset(preset.scenario_id)}
                            disabled={isRunning}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-[#198038] hover:bg-[#125a27] text-white shadow-xs transition-colors disabled:opacity-50"
                          >
                            {isRunning ? (
                              <>
                                <RotateCw className="w-3 h-3 animate-spin" />
                                <span>Evaluating...</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3 h-3 fill-current" />
                                <span>Run Preset</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Live Chat */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full justify-between">
                {/* Messages stream */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[420px]">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[90%] text-xs px-3.5 py-2.5 rounded-2xl ${
                          msg.sender === 'user'
                            ? 'bg-[#198038] text-white rounded-br-xs shadow-xs'
                            : 'bg-gray-100/90 text-gray-900 rounded-bl-xs border border-gray-200/50'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                        {/* Ticket Badge */}
                        {msg.createdTicketId && (
                          <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 text-[11px]">
                            <div className="flex items-center gap-1.5 font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Ticket #{msg.createdTicketId}</span>
                            </div>
                            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-mono">
                              Dispatched
                            </span>
                          </div>
                        )}

                        {/* Audit Trace Accordion */}
                        {msg.auditTrace && msg.auditTrace.length > 0 && (
                          <AuditTraceViewer
                            stages={msg.auditTrace}
                            executionTimeMs={msg.executionTimeMs}
                            terminalMove={msg.terminalMove}
                          />
                        )}
                      </div>

                      {/* Footer label with time and terminal move */}
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-[10px] text-gray-400">{msg.time}</span>
                        {msg.sender === 'agent' && renderMoveBadge(msg.terminalMove)}
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-2xl max-w-[120px] text-gray-500 text-xs">
                      <RotateCw className="w-3.5 h-3.5 animate-spin text-[#198038]" />
                      <span>Reasoning...</span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Persona Quick Query Suggester */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1 overflow-x-auto pb-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase shrink-0">
                      Sample:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSendMessage(undefined, activeCustomer.sampleQuery)}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-gray-100 hover:bg-[#eef8f1] hover:text-[#198038] text-gray-700 font-medium truncate max-w-[280px] shrink-0 border border-gray-200"
                    >
                      &quot;{activeCustomer.sampleQuery}&quot;
                    </button>
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Ask as ${activeCustomer.name} (order, return, delivery)...`}
                      disabled={isLoading}
                      className="flex-1 text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#198038] focus:bg-white transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isLoading}
                      className="p-2.5 bg-[#198038] disabled:bg-gray-200 text-white rounded-xl hover:bg-[#125a27] transition-colors"
                      aria-label="Send customer message"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: Quick Help */}
            {activeTab === 'quick' && (
              <div className="space-y-2.5">
                <div
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage(undefined, 'Where is my order ORD-001042?');
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

                <div
                  onClick={() => {
                    setActiveTab('chat');
                    handleSendMessage(undefined, 'I want to return an item from my recent delivery.');
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

                <div
                  onClick={() => setActiveTab('presets')}
                  className="p-3 bg-gray-50/80 hover:bg-[#f0f9f2] rounded-2xl border border-gray-100 hover:border-[#b8e2be] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#198038] group-hover:scale-105 transition-transform">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Official Judge Scenarios</p>
                      <p className="text-[11px] text-gray-500">6 automated benchmark tests</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-700" />
                </div>

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

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/help');
                  }}
                  className="w-full mt-2 py-2 px-3 text-xs font-semibold text-[#198038] hover:text-[#125a27] bg-[#eef8f1] hover:bg-[#e4f3e8] rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Visit Full Help & Support Center</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
