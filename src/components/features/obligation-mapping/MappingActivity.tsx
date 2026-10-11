import React, { useState } from 'react';
import { 
  AuditEvent, 
  AuditAction 
} from '../../../types';
import { 
  History, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  RotateCcw, 
  FileEdit, 
  Sparkles, 
  Clock 
} from 'lucide-react';
import { Badge } from '../../ui/Badge';

interface MappingActivityProps {
  obligationId: string;
  events: AuditEvent[];
}

export const MappingActivity: React.FC<MappingActivityProps> = ({
  obligationId,
  events
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Filter events relevant to this obligation or system-wide events
  const relevantEvents = events.filter(e => 
    e.entityId === obligationId ||
    (e.relatedRecordIds && e.relatedRecordIds.includes(obligationId)) ||
    e.action === 'DEMO_DATA_RESET'
  );

  const getActionBadge = (action: AuditAction) => {
    switch (action) {
      case 'MAPPING_APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'MAPPING_REJECTED':
        return <Badge variant="error">Rejected</Badge>;
      case 'INFORMATION_REQUESTED':
        return <Badge variant="warning">Info Requested</Badge>;
      case 'MAPPING_SUPERSEDED':
        return <Badge variant="purple">Superseded</Badge>;
      case 'MAPPING_DRAFT_SAVED':
        return <Badge variant="neutral">Draft Saved</Badge>;
      case 'COVERAGE_UPDATED':
        return <Badge variant="info">Coverage Updated</Badge>;
      case 'MAPPING_SUBMITTED_FOR_REVIEW':
        return <Badge variant="info">Submitted</Badge>;
      case 'DEMO_DATA_RESET':
        return <Badge variant="warning">Data Reset</Badge>;
      default:
        return <Badge variant="neutral">{action}</Badge>;
    }
  };

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case 'MAPPING_APPROVED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'MAPPING_REJECTED':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'INFORMATION_REQUESTED':
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case 'MAPPING_SUPERSEDED':
        return <History className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return ts;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#0F766E]" />
          <h2 className="text-base font-bold text-[#17263C]">
            Mapping Activity & Compliance Audit History
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 ml-1">
            {relevantEvents.length} events
          </span>
        </div>

        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-slate-100">
          <div className="text-[11px] text-[#64748B] mb-3 p-2 bg-slate-50 rounded border border-slate-200">
            <span className="font-semibold text-slate-700">Audit Trail Notice:</span> Application-level chronological audit records for decision traceability and regulatory inspection. Entries are append-only.
          </div>

          {relevantEvents.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No audit events recorded for this obligation yet.
            </div>
          ) : (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200 before:z-0">
              {relevantEvents.map((event) => (
                <div key={event.id} className="relative z-10 flex items-start gap-3 text-xs pl-1">
                  <div className="w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getActionIcon(event.action)}
                  </div>

                  <div className="flex-1 bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-2">
                        {getActionBadge(event.action)}
                        <span className="font-semibold text-[#17263C]">
                          {event.actorDisplayName}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B] font-mono">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>

                    {/* Transition details */}
                    {(event.previousState || event.newState) && (
                      <div className="text-[11px] text-slate-500 mb-1">
                        State transition: <span className="font-medium text-slate-700">{event.previousState || 'None'}</span> &rarr; <span className="font-semibold text-[#0F766E]">{event.newState}</span>
                      </div>
                    )}

                    {/* Reason / Rationale */}
                    {event.reason && (
                      <p className="text-xs text-[#17263C] bg-white p-2 rounded border border-slate-200/80 mt-1.5 leading-relaxed">
                        "{event.reason}"
                      </p>
                    )}

                    {/* Record IDs */}
                    {event.relatedRecordIds && event.relatedRecordIds.length > 0 && (
                      <div className="mt-1.5 text-[10px] text-slate-400 flex items-center gap-1.5 font-mono">
                        <span>Related records:</span>
                        {event.relatedRecordIds.map(id => (
                          <span key={id} className="bg-slate-200/60 text-slate-700 px-1 py-0.2 rounded">
                            {id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
