import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  ShieldCheck, 
  FileText, 
  ChevronRight, 
  Headset, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  HelpCircle,
  Info,
  Clock,
  Check
} from 'lucide-react';
import { STORE_POLICIES, CURRENT_CUSTOMER_TICKETS, CURRENT_CUSTOMER } from '../data/storeData';
import { StorePolicy } from '../types';

interface PolicyMeta {
  displayTitle: string;
  versionLabel: string;
  isCurrent: boolean;
  category: 'Returns & Refunds' | 'Shipping & Delivery' | 'Cancellation & Payments' | 'Warranty & Conduct';
  summary: string;
}

const POLICY_META_MAP: Record<string, PolicyMeta> = {
  return_policy_v2: {
    displayTitle: 'Return Policy (v2 - Current)',
    versionLabel: 'v2 · Orders placed ≥ Jun 1, 2026',
    isCurrent: true,
    category: 'Returns & Refunds',
    summary: '7-day change of mind, 10-day defect window, and restocking guidelines.'
  },
  return_policy_v1: {
    displayTitle: 'Return Policy (v1 - Prior Orders)',
    versionLabel: 'v1 · Orders placed before Jun 1, 2026',
    isCurrent: false,
    category: 'Returns & Refunds',
    summary: '10-day change of mind, 15-day defect window for legacy orders.'
  },
  refund_policy_v2: {
    displayTitle: 'Refund Policy (v2 - Current)',
    versionLabel: 'v2 · Orders placed ≥ Jun 1, 2026',
    isCurrent: true,
    category: 'Returns & Refunds',
    summary: 'Refund timelines, ₹75,000 human approval threshold, and restocking fees.'
  },
  refund_policy_v1: {
    displayTitle: 'Refund Policy (v1 - Prior Orders)',
    versionLabel: 'v1 · Orders placed before Jun 1, 2026',
    isCurrent: false,
    category: 'Returns & Refunds',
    summary: 'Refund timelines, ₹1,00,000 approval threshold, zero restocking fee.'
  },
  replacement_policy: {
    displayTitle: 'Replacement Policy',
    versionLabel: 'v1.0 · Defective / DOA',
    isCurrent: true,
    category: 'Returns & Refunds',
    summary: 'Free doorstep replacement for DOA, damaged, and incorrect shipments.'
  },
  cancellation_policy: {
    displayTitle: 'Cancellation Policy',
    versionLabel: 'v1.0 · Unshipped Orders',
    isCurrent: true,
    category: 'Cancellation & Payments',
    summary: 'Order cancellation rules before shipment, instant wallet refunds.'
  },
  payment_policy: {
    displayTitle: 'Payment & Refund Destination',
    versionLabel: 'v1.0 · Standard',
    isCurrent: true,
    category: 'Cancellation & Payments',
    summary: 'Prepaid & COD methods, strict refund to original payment instrument.'
  },
  shipping_policy: {
    displayTitle: 'Shipping & Delivery Policy',
    versionLabel: 'v1.0 · Express & Standard',
    isCurrent: true,
    category: 'Shipping & Delivery',
    summary: 'Delivery SLAs, OTP verification for ₹5,000+ orders, courier tracking.'
  },
  warranty_policy: {
    displayTitle: 'Warranty Policy',
    versionLabel: 'v1.0 · 6-36 Months',
    isCurrent: true,
    category: 'Warranty & Conduct',
    summary: 'Manufacturer warranty coverage, authorised repairs, and safety alerts.'
  },
  customer_escalation_policy: {
    displayTitle: 'Customer Escalation & Conduct',
    versionLabel: 'v1.0 · Operational SLAs',
    isCurrent: true,
    category: 'Warranty & Conduct',
    summary: 'Mandatory escalation triggers, fraud detection signals, and support SLAs.'
  }
};

function getPolicyCategory(policyId: string): string {
  return POLICY_META_MAP[policyId]?.category || 'General';
}

function getPolicyDisplayTitle(policy: StorePolicy): string {
  return POLICY_META_MAP[policy.id]?.displayTitle || policy.title;
}

function getPolicyIcon(category: string) {
  switch (category) {
    case 'Returns & Refunds':
      return <RotateCcw size={17} className="text-[#198038]" />;
    case 'Shipping & Delivery':
      return <Truck size={17} className="text-[#0284c7]" />;
    case 'Cancellation & Payments':
      return <CreditCard size={17} className="text-[#7c3aed]" />;
    case 'Warranty & Conduct':
      return <ShieldCheck size={17} className="text-[#d97706]" />;
    default:
      return <FileText size={17} className="text-gray-500" />;
  }
}

// Inline Markdown formatting helper for **bold** and `code`
function renderInlineFormatting(rawText: string): React.ReactNode {
  if (!rawText) return null;
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      parts.push(rawText.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      const boldText = token.slice(2, -2).trim();
      const lower = boldText.toLowerCase();

      if (lower === 'yes' || lower === 'allowed') {
        parts.push(
          <span key={match.index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[#dcfce7] text-[#166534]">
            <Check size={11} /> {boldText}
          </span>
        );
      } else if (lower === 'no' || lower === 'not allowed') {
        parts.push(
          <span key={match.index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-[#fee2e2] text-[#991b1b]">
            <AlertCircle size={11} /> {boldText}
          </span>
        );
      } else {
        parts.push(
          <strong key={match.index} className="font-bold text-gray-950">
            {boldText}
          </strong>
        );
      }
    } else if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code key={match.index} className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[#125A27] font-mono text-xs font-semibold">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < rawText.length) {
    parts.push(rawText.substring(lastIndex));
  }

  return parts.length > 0 ? parts : rawText;
}

// Markdown Table Renderer
function RenderMarkdownTable({ lines }: { lines: string[] }) {
  const tableRows = lines
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|') && l.endsWith('|'));

  if (tableRows.length < 2) return null;

  const parseRow = (line: string) =>
    line
      .slice(1, -1)
      .split('|')
      .map((c) => c.trim());

  const headers = parseRow(tableRows[0]);
  const isSeparator = (line: string) => /^\|[-: |]+\|$/.test(line);

  const dataRows: string[][] = [];
  for (let i = 1; i < tableRows.length; i++) {
    if (isSeparator(tableRows[i])) continue;
    dataRows.push(parseRow(tableRows[i]));
  }

  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-gray-200/90 shadow-2xs">
      <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm">
        <thead className="bg-[#f0f9f1] text-[#125A27] font-bold text-[11px] uppercase tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="py-3 px-4 font-bold">
                {renderInlineFormatting(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {dataRows.map((row, rIdx) => (
            <tr
              key={rIdx}
              className={rIdx % 2 === 1 ? 'bg-gray-50/60 hover:bg-emerald-50/20' : 'hover:bg-emerald-50/20'}
            >
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="py-2.5 px-4 text-gray-700 leading-relaxed align-top">
                  {renderInlineFormatting(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Structured Policy Content Renderer
function PolicyContentRenderer({ content }: { content: string }) {
  // 1. Separate document header metadata table if present
  const lines = content.split('\n');
  const metadataLines: string[] = [];
  let metaTableEnded = false;
  let remainingContentLines: string[] = [];

  let inInitialTable = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      continue; // Skip main # title
    }
    if (!metaTableEnded) {
      if (line.startsWith('|')) {
        inInitialTable = true;
        metadataLines.push(line);
        continue;
      }
      if (inInitialTable && !line.startsWith('|')) {
        metaTableEnded = true;
      }
    }
    if (metaTableEnded || (!inInitialTable && line.length > 0)) {
      metaTableEnded = true;
      remainingContentLines.push(lines[i]);
    }
  }

  // Parse Metadata Key-Value pairs
  const metaPairs: { key: string; value: string }[] = [];
  if (metadataLines.length >= 3) {
    const isSeparator = (l: string) => /^\|[-: |]+\|$/.test(l.trim());
    metadataLines.forEach((mLine) => {
      if (isSeparator(mLine)) return;
      const parts = mLine
        .slice(1, -1)
        .split('|')
        .map((p) => p.trim());
      if (parts.length >= 2 && parts[0] !== 'Field' && parts[1] !== 'Value') {
        metaPairs.push({
          key: parts[0].replace(/\*\*/g, ''),
          value: parts[1].replace(/\*\*/g, '')
        });
      }
    });
  }

  // 2. Parse Remaining Sections by `## `
  const remainingText = remainingContentLines.join('\n');
  const rawSections = remainingText.split('\n## ');

  const sections: { title: string; body: string }[] = [];
  rawSections.forEach((sec, idx) => {
    const trimmed = sec.trim();
    if (!trimmed) return;
    if (idx === 0 && !trimmed.startsWith('1.') && !trimmed.includes('\n')) {
      return;
    }
    const firstNewline = trimmed.indexOf('\n');
    if (firstNewline !== -1) {
      sections.push({
        title: trimmed.substring(0, firstNewline).replace(/^##\s*/, ''),
        body: trimmed.substring(firstNewline + 1).trim()
      });
    } else {
      sections.push({
        title: trimmed.replace(/^##\s*/, ''),
        body: ''
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Policy Metadata Card */}
      {metaPairs.length > 0 && (
        <div className="bg-[#f0f9f1] border border-emerald-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#125A27] mb-3">
            <Info size={15} /> Document Facts & Scope
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {metaPairs.map((pair, pIdx) => (
              <div key={pIdx} className="bg-white/90 p-3 rounded-xl border border-emerald-100/80">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tight block">
                  {pair.key}
                </span>
                <span className="text-xs font-semibold text-gray-900 mt-0.5 block leading-snug">
                  {pair.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-6">
        {sections.map((section, sIdx) => {
          const bodyLines = section.body.split('\n');

          // Group lines into blocks: tables, bullet lists, step lists, and paragraphs
          const blocks: { type: 'table' | 'steps' | 'bullets' | 'callout' | 'p'; lines: string[] }[] = [];
          let currentTableLines: string[] = [];
          let currentStepLines: string[] = [];
          let currentBulletLines: string[] = [];
          let currentParagraphLines: string[] = [];

          const flushCurrent = () => {
            if (currentTableLines.length > 0) {
              blocks.push({ type: 'table', lines: [...currentTableLines] });
              currentTableLines = [];
            }
            if (currentStepLines.length > 0) {
              blocks.push({ type: 'steps', lines: [...currentStepLines] });
              currentStepLines = [];
            }
            if (currentBulletLines.length > 0) {
              blocks.push({ type: 'bullets', lines: [...currentBulletLines] });
              currentBulletLines = [];
            }
            if (currentParagraphLines.length > 0) {
              const fullP = currentParagraphLines.join(' ').trim();
              if (
                fullP.startsWith('Note:') ||
                fullP.startsWith('Warning:') ||
                fullP.startsWith('Safety:') ||
                fullP.startsWith('Abuse limits:')
              ) {
                blocks.push({ type: 'callout', lines: [fullP] });
              } else {
                blocks.push({ type: 'p', lines: [fullP] });
              }
              currentParagraphLines = [];
            }
          };

          bodyLines.forEach((line) => {
            const trimmed = line.trim();
            if (!trimmed) {
              flushCurrent();
              return;
            }

            if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
              if (currentStepLines.length || currentBulletLines.length || currentParagraphLines.length) {
                flushCurrent();
              }
              currentTableLines.push(trimmed);
            } else if (/^\d+\.\s+/.test(trimmed)) {
              if (currentTableLines.length || currentBulletLines.length || currentParagraphLines.length) {
                flushCurrent();
              }
              currentStepLines.push(trimmed);
            } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              if (currentTableLines.length || currentStepLines.length || currentParagraphLines.length) {
                flushCurrent();
              }
              currentBulletLines.push(trimmed.replace(/^[-*]\s+/, ''));
            } else {
              if (currentTableLines.length || currentStepLines.length || currentBulletLines.length) {
                flushCurrent();
              }
              currentParagraphLines.push(trimmed);
            }
          });

          flushCurrent();

          return (
            <div
              key={sIdx}
              className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-2xs hover:border-gray-200 transition-colors"
            >
              {/* Section Header */}
              <h3 className="text-base sm:text-lg font-extrabold text-gray-950 flex items-center gap-2.5 pb-3 border-b border-gray-100">
                <span className="w-6 h-6 rounded-lg bg-[#eef8f1] text-[#198038] flex items-center justify-center text-xs font-bold shrink-0">
                  {sIdx + 1}
                </span>
                <span>{section.title}</span>
              </h3>

              {/* Section Body */}
              <div className="mt-4 space-y-4">
                {blocks.map((block, bIdx) => {
                  if (block.type === 'table') {
                    return <RenderMarkdownTable key={bIdx} lines={block.lines} />;
                  }

                  if (block.type === 'steps') {
                    return (
                      <div key={bIdx} className="space-y-2.5 my-3">
                        {block.lines.map((stLine, stIdx) => {
                          const match = stLine.match(/^(\d+)\.\s+(.*)$/);
                          const stepNum = match ? match[1] : `${stIdx + 1}`;
                          const stepText = match ? match[2] : stLine;
                          return (
                            <div
                              key={stIdx}
                              className="flex items-start gap-3 p-3 bg-gray-50/70 border border-gray-100 rounded-xl"
                            >
                              <div className="w-5 h-5 rounded-full bg-[#198038] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 shadow-2xs">
                                {stepNum}
                              </div>
                              <div className="text-sm text-gray-800 leading-relaxed">
                                {renderInlineFormatting(stepText)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  if (block.type === 'bullets') {
                    return (
                      <ul key={bIdx} className="space-y-2 my-2 pl-1">
                        {block.lines.map((bText, blIdx) => (
                          <li key={blIdx} className="flex items-start gap-2.5 text-sm text-gray-700 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#198038] shrink-0 mt-2"></span>
                            <span>{renderInlineFormatting(bText)}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  if (block.type === 'callout') {
                    const text = block.lines[0];
                    const isSafety = text.toLowerCase().includes('safety');
                    const isWarning = text.toLowerCase().includes('abuse') || text.toLowerCase().includes('escalate');

                    return (
                      <div
                        key={bIdx}
                        className={`p-4 rounded-xl border flex items-start gap-3 my-3 text-xs sm:text-sm ${
                          isSafety
                            ? 'bg-red-50 border-red-200 text-red-900'
                            : isWarning
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        }`}
                      >
                        {isSafety ? (
                          <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
                        ) : isWarning ? (
                          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                        ) : (
                          <Info size={18} className="text-emerald-700 shrink-0 mt-0.5" />
                        )}
                        <div className="leading-relaxed">
                          {renderInlineFormatting(text)}
                        </div>
                      </div>
                    );
                  }

                  // Default paragraph
                  return (
                    <p key={bIdx} className="text-sm text-gray-700 leading-relaxed">
                      {renderInlineFormatting(block.lines[0])}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function HelpSupport() {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('return_policy_v2');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Returns & Refunds',
    'Shipping & Delivery',
    'Cancellation & Payments',
    'Warranty & Conduct'
  ];

  // Filtered policies based on category and search query
  const filteredPolicies = useMemo(() => {
    return STORE_POLICIES.filter((pol) => {
      const meta = POLICY_META_MAP[pol.id];
      const categoryMatch = selectedCategory === 'All' || meta?.category === selectedCategory;

      if (!categoryMatch) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const titleMatch = pol.title.toLowerCase().includes(q) || (meta?.displayTitle.toLowerCase().includes(q));
      const contentMatch = pol.content.toLowerCase().includes(q);
      const summaryMatch = meta?.summary.toLowerCase().includes(q);

      return titleMatch || contentMatch || summaryMatch;
    });
  }, [selectedCategory, searchQuery]);

  const selectedPolicy =
    filteredPolicies.find((p) => p.id === selectedPolicyId) ||
    STORE_POLICIES.find((p) => p.id === selectedPolicyId) ||
    filteredPolicies[0] ||
    STORE_POLICIES[0];

  const selectedMeta = selectedPolicy ? POLICY_META_MAP[selectedPolicy.id] : null;

  const handleAskNovaAssist = (query: string) => {
    window.dispatchEvent(
      new CustomEvent('open_nova_assist', {
        detail: { query }
      })
    );
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
              <span className="text-gray-900 font-medium">Help & Policies</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#eef8f1] text-[#198038] mb-2">
            <ShieldCheck size={14} /> Official Customer Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            NovaMart Help & Policies
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-1">
            Store guidelines, return windows, refund SLAs, warranty coverage, and customer support.
          </p>
        </div>

        {/* AI Quick Query Button */}
        <button
          onClick={() => handleAskNovaAssist('What are the key return and refund policies for NovaMart?')}
          className="inline-flex items-center gap-2 bg-[#198038] hover:bg-[#146c2e] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <Sparkles size={16} />
          Ask Nova Assist AI
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? STORE_POLICIES.length
                : STORE_POLICIES.filter((p) => POLICY_META_MAP[p.id]?.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#198038] text-white shadow-2xs font-bold'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 bg-white rounded-xl text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#198038]/20 focus:border-[#198038]"
            placeholder="Search windows, OTP, INR 75,000..."
          />
        </div>
      </div>

      {/* Main Grid: Policy List (Left) + Document Viewer (Right) */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12 items-start">
        {/* Left Column: Disambiguated Policies */}
        <div className="w-full lg:w-1/3 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-2xs">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1 flex items-center justify-between">
              <span>Policies ({filteredPolicies.length})</span>
              {selectedCategory !== 'All' && (
                <span className="text-[11px] text-[#198038] font-bold lowercase">
                  filtered by {selectedCategory}
                </span>
              )}
            </h2>

            <div className="space-y-2">
              {filteredPolicies.map((pol) => {
                const meta = POLICY_META_MAP[pol.id];
                const isSelected = pol.id === selectedPolicy?.id;
                const displayTitle = meta?.displayTitle || pol.title;

                return (
                  <button
                    key={pol.id}
                    onClick={() => setSelectedPolicyId(pol.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'border-[#198038] bg-[#f0f9f1] text-[#198038] shadow-2xs ring-1 ring-[#198038]/20'
                        : 'border-gray-200/80 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 shrink-0">
                        {getPolicyIcon(meta?.category || '')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-bold ${isSelected ? 'text-[#198038]' : 'text-gray-900'}`}>
                            {displayTitle}
                          </span>
                          {meta && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                meta.isCurrent
                                  ? 'bg-[#dcfce7] text-[#166534]'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {meta.isCurrent ? 'Current' : 'Archive'}
                            </span>
                          )}
                        </div>
                        {meta && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-1 leading-snug">
                            {meta.summary}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`shrink-0 mt-1 ${isSelected ? 'text-[#198038]' : 'text-gray-400'}`}
                    />
                  </button>
                );
              })}

              {filteredPolicies.length === 0 && (
                <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl">
                  No policy matches "{searchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* Assistance Card */}
          <div className="bg-[#f0f7ff] border border-[#dbeafe] rounded-2xl p-5 text-xs text-gray-700">
            <h4 className="font-bold text-gray-900 text-sm mb-1.5 flex items-center gap-2">
              <Headset size={16} className="text-[#0284c7]" /> Need human assistance?
            </h4>
            <p className="leading-relaxed mb-3">
              Our support team is available from 8:00 AM to 10:00 PM IST daily. You can also chat directly with Nova Assist anytime.
            </p>
            <div className="space-y-1.5 font-medium text-gray-800">
              <p>Email: <span className="text-[#0284c7] font-semibold">support@novamart.in</span></p>
              <p>Toll-Free: <span className="font-semibold">1800-209-NOVA</span></p>
            </div>
            <button
              onClick={() => handleAskNovaAssist('Connect me to a support agent')}
              className="mt-3.5 w-full flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <MessageCircle size={14} /> Talk to Support Agent
            </button>
          </div>
        </div>

        {/* Right Column: Selected Policy Content */}
        <div className="w-full lg:w-2/3">
          {selectedPolicy ? (
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 mb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                      Official Store Document
                    </span>
                    {selectedMeta && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          selectedMeta.isCurrent
                            ? 'bg-[#dcfce7] text-[#166534]'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {selectedMeta.isCurrent ? 'Latest Policy' : 'Archived Policy'}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {getPolicyDisplayTitle(selectedPolicy)}
                  </h2>
                  {selectedMeta && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      {selectedMeta.versionLabel}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAskNovaAssist(`Can you explain the key details of ${getPolicyDisplayTitle(selectedPolicy)}?`)}
                    className="inline-flex items-center gap-1.5 bg-[#eef8f1] hover:bg-[#dcfce7] text-[#166534] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    title="Ask AI to summarize this policy"
                  >
                    <Sparkles size={14} /> Explain with AI
                  </button>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-mono">
                    {selectedPolicy.filename}
                  </span>
                </div>
              </div>

              {/* Render Structured Policy Content */}
              <PolicyContentRenderer content={selectedPolicy.content} />
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">Please select a policy from the list.</p>
            </div>
          )}
        </div>
      </div>

      {/* Support Tickets Section from support_tickets.csv */}
      <div className="border-t border-gray-100 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Recent Support Inquiries for {CURRENT_CUSTOMER.name} ({CURRENT_CUSTOMER_TICKETS.length})
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Live status from support ticket records for customer {CURRENT_CUSTOMER.customerId}
            </p>
          </div>

          <button
            onClick={() => handleAskNovaAssist('I want to create a new support ticket regarding my order')}
            className="inline-flex items-center gap-2 bg-[#198038] hover:bg-[#146c2e] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <MessageCircle size={14} /> Raise New Inquiry
          </button>
        </div>

        {CURRENT_CUSTOMER_TICKETS.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-8 text-center text-sm text-gray-500 border border-gray-100">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
            No active support tickets found for your account. Everything is in order!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURRENT_CUSTOMER_TICKETS.map((t) => (
              <div key={t.ticketId} className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {t.ticketId}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                      t.status === 'resolved' || t.status === 'closed'
                        ? 'bg-[#dcfce7] text-[#166534]'
                        : 'bg-[#fef9ec] text-[#b45309]'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <p className="text-sm font-bold text-gray-900 mb-1">{t.issueSummary}</p>
                {t.resolution && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl border border-gray-100 mt-2 leading-relaxed">
                    <span className="font-semibold text-gray-800">Resolution:</span> {t.resolution}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 pt-2.5 border-t border-gray-100">
                  <span className="font-medium text-gray-500">Category: {t.category}</span>
                  <span>{t.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
