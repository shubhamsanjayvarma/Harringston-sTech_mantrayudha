import { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  ShieldCheck, 
  Clock
} from 'lucide-react';
import { AuditTraceStage } from '../types/agent';

interface AuditTraceViewerProps {
  stages: AuditTraceStage[];
  executionTimeMs?: number;
  terminalMove?: string;
}

export function AuditTraceViewer({
  stages,
  executionTimeMs,
  terminalMove,
}: AuditTraceViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedStageIdx, setSelectedStageIdx] = useState<number | null>(null);

  if (!stages || stages.length === 0) {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PASS':
      case 'SUCCESS':
      case 'COMPLETE':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            {status}
          </span>
        );
      case 'BLOCK':
      case 'ESCALATE':
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            {status}
          </span>
        );
      case 'FLAG':
      case 'WARN':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" />
            {status}
          </span>
        );
    }
  };

  const formatStageName = (rawName: string) => {
    return rawName
      .replace(/^[0-9]+_/, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className="mt-2 rounded-xl border border-gray-200/90 bg-white/95 text-xs shadow-xs overflow-hidden">
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-50/90 hover:bg-gray-100/80 transition-colors text-left"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#198038]/10 text-[#198038] flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-gray-800">
            9-Stage Reasoning Audit Trace
          </span>
          {executionTimeMs !== undefined && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-mono font-medium text-gray-500 bg-white px-1.5 py-0.5 rounded border border-gray-200">
              <Clock className="w-2.5 h-2.5 text-gray-400" />
              {executionTimeMs.toFixed(2)} ms
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {terminalMove && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Move: <span className="text-[#198038]">{terminalMove}</span>
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>

      {/* Accordion content */}
      {isExpanded && (
        <div className="p-3 bg-white divide-y divide-gray-100 max-h-80 overflow-y-auto">
          <div className="pb-2 mb-2 flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1 font-medium">
              <Cpu className="w-3 h-3 text-[#198038]" />
              Dual-Engine Verified Execution
            </span>
            <span>{stages.length} stages checked</span>
          </div>

          <div className="space-y-2 pt-2">
            {stages.map((st, idx) => {
              const isSelected = selectedStageIdx === idx;
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 p-2 transition-all cursor-pointer"
                  onClick={() => setSelectedStageIdx(isSelected ? null : idx)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-[10px] text-gray-400 font-bold shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-semibold text-gray-800 truncate">
                        {formatStageName(st.stage)}
                      </span>
                    </div>
                    <div className="shrink-0">{getStatusBadge(st.status)}</div>
                  </div>

                  <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                    {st.summary}
                  </p>

                  {/* Optional JSON detail drill-down */}
                  {isSelected && st.details && (
                    <div className="mt-2 p-2 bg-gray-900 text-gray-100 rounded-md font-mono text-[10px] overflow-x-auto">
                      <pre>{JSON.stringify(st.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
