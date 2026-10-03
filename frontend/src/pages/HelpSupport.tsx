import React, { useState } from 'react';
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
  Clock, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { STORE_POLICIES, CURRENT_CUSTOMER_TICKETS, CURRENT_CUSTOMER } from '../data/storeData';

export default function HelpSupport() {
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('return_policy_v2');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedPolicy = STORE_POLICIES.find((p) => p.id === selectedPolicyId) || STORE_POLICIES[0];

  const filteredPolicies = STORE_POLICIES.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
  });

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

      <div className="mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          NovaMart Help & Policies
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Official store guidelines, returns, warranty, and customer support.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 relative max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-12 pr-4 py-3.5 border border-gray-200 bg-gray-50/50 rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300"
          placeholder="Search return window, refund SLA, warranty or shipping rules..."
        />
      </div>

      {/* Main Grid: Policies Viewer + Support Channel */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left Column: Policy List */}
        <div className="w-full lg:w-1/3 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <FileText size={18} className="text-[#198038]" /> Store Policies ({filteredPolicies.length})
          </h2>

          <div className="space-y-2">
            {filteredPolicies.map((pol) => {
              const isSelected = pol.id === selectedPolicyId;
              return (
                <button
                  key={pol.id}
                  onClick={() => setSelectedPolicyId(pol.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#198038] bg-[#eef8f1] font-bold text-[#198038] shadow-2xs'
                      : 'border-gray-200/80 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate pr-2">{pol.title}</span>
                  <ChevronRight size={16} className={isSelected ? 'text-[#198038]' : 'text-gray-400'} />
                </button>
              );
            })}
          </div>

          {/* Quick Support Card */}
          <div className="mt-6 bg-[#f0f7ff] border border-[#dbeafe] rounded-2xl p-5 text-xs text-gray-700">
            <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
              <Headset size={16} className="text-[#0284c7]" /> Need human assistance?
            </h4>
            <p className="leading-relaxed mb-3">
              Our support team is available from 8:00 AM to 10:00 PM IST daily. You can also chat directly with Nova Assist on the bottom right.
            </p>
            <div className="space-y-1.5 font-medium text-gray-800">
              <p>Email: support@novamart.in</p>
              <p>Toll-Free: 1800-209-NOVA</p>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Policy Content */}
        <div className="w-full lg:w-2/3">
          {selectedPolicy ? (
            <div className="bg-white border border-gray-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                    Official Document
                  </span>
                  <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                    {selectedPolicy.title}
                  </h2>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-mono">
                  {selectedPolicy.filename}
                </span>
              </div>

              {/* Render formatted policy text */}
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4 font-normal">
                {selectedPolicy.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return null; // Skip main title as rendered above
                  }
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h3 key={index} className="text-lg font-bold text-gray-900 pt-3 border-t border-gray-100">
                        {paragraph.replace('## ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('|')) {
                    // Render simple table markdown as card
                    return (
                      <div key={index} className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/80 font-mono text-xs overflow-x-auto whitespace-pre">
                        {paragraph}
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="whitespace-pre-line text-sm">
                      {paragraph.replace(/\*\*/g, '')}
                    </p>
                  );
                })}
              </div>
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
        <h2 className="text-2xl font-extrabold text-gray-900 mb-4">
          Recent Support Inquiries for {CURRENT_CUSTOMER.name} ({CURRENT_CUSTOMER_TICKETS.length})
        </h2>

        {CURRENT_CUSTOMER_TICKETS.length === 0 ? (
          <div className="bg-gray-50 rounded-2xl p-6 text-center text-sm text-gray-500">
            No active support tickets found for your account. Everything is in order!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURRENT_CUSTOMER_TICKETS.map((t) => (
              <div key={t.ticketId} className="bg-white border border-gray-200/90 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-extrabold text-xs text-gray-900 font-mono">{t.ticketId}</span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full capitalize ${
                    t.status === 'resolved' || t.status === 'closed'
                      ? 'bg-[#dcfce7] text-[#166534]'
                      : 'bg-[#fef9ec] text-[#b45309]'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <p className="text-sm font-bold text-gray-900 mb-1">{t.issueSummary}</p>
                {t.resolution && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mt-2">
                    <span className="font-semibold text-gray-800">Resolution:</span> {t.resolution}
                  </p>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-100">
                  <span>Category: {t.category}</span>
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
