import React, { useState, useMemo } from 'react';
import { 
  RegulatoryObligation, 
  InternalControl, 
  ControlMapping 
} from '../../../types';
import { 
  MappingStatusBadge, 
  Badge 
} from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  FileEdit,
  AlertTriangle
} from 'lucide-react';

interface CandidateControlListProps {
  obligation: RegulatoryObligation;
  controls: InternalControl[];
  mappings: ControlMapping[];
  onOpenReviewDialog: (mapping: ControlMapping, control: InternalControl) => void;
  onRequestReject: (mapping: ControlMapping) => void;
  onRequestMoreInfo: (mapping: ControlMapping) => void;
}

export const CandidateControlList: React.FC<CandidateControlListProps> = ({
  obligation,
  controls,
  mappings,
  onOpenReviewDialog,
  onRequestReject,
  onRequestMoreInfo
}) => {
  const [controlSearch, setControlSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedRationaleId, setExpandedRationaleId] = useState<string | null>(null);

  // Mappings for the current obligation
  const obligationMappings = useMemo(() => {
    return mappings.filter(m => m.obligationId === obligation.id);
  }, [mappings, obligation.id]);

  // Extract unique control owners for filter
  const ownerOptions = useMemo(() => {
    const owners = new Set<string>();
    obligationMappings.forEach(m => {
      const ctrl = controls.find(c => c.id === m.controlId);
      if (ctrl?.ownerRole) owners.add(ctrl.ownerRole);
    });
    return Array.from(owners).sort();
  }, [obligationMappings, controls]);

  // Filtered mapping items
  const filteredMappingItems = useMemo(() => {
    return obligationMappings.filter(m => {
      const ctrl = controls.find(c => c.id === m.controlId);
      if (!ctrl) return false;

      // Text search
      if (controlSearch.trim()) {
        const q = controlSearch.toLowerCase().trim();
        const matches = 
          ctrl.id.toLowerCase().includes(q) ||
          ctrl.name.toLowerCase().includes(q) ||
          ctrl.description.toLowerCase().includes(q) ||
          ctrl.ownerRole.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Owner filter
      if (ownerFilter && ctrl.ownerRole !== ownerFilter) {
        return false;
      }

      // Status filter
      if (statusFilter && m.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [obligationMappings, controls, controlSearch, ownerFilter, statusFilter]);

  const toggleRationale = (id: string) => {
    setExpandedRationaleId(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-base font-bold text-[#17263C]">
            Candidate Internal Controls
          </h2>
          <p className="text-xs text-[#64748B]">
            Potential controls identified for analyst review and coverage verification.
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
          {filteredMappingItems.length} candidate {filteredMappingItems.length === 1 ? 'control' : 'controls'}
        </span>
      </div>

      {/* Control Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search candidate controls..."
            value={controlSearch}
            onChange={(e) => setControlSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#17263C] placeholder:text-[#64748B] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            aria-label="Search candidate controls"
          />
        </div>

        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#17263C] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
          aria-label="Filter by control owner"
        >
          <option value="">All Control Owners</option>
          {ownerOptions.map(owner => (
            <option key={owner} value={owner}>{owner}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#17263C] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
          aria-label="Filter by control status"
        >
          <option value="">All Mapping Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Suggested">Suggested</option>
          <option value="Draft">Draft</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Needs Information">Needs Information</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Candidate List or Unmapped State */}
      {filteredMappingItems.length === 0 ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <AlertCircle className="w-9 h-9 text-amber-500 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-[#17263C]">
            No Controls Identified for this Obligation
          </h3>
          <p className="text-xs text-[#64748B] max-w-md mx-auto mt-1 leading-relaxed">
            {obligationMappings.length === 0 
              ? "This applicable regulatory requirement currently has no candidate internal controls mapped in the repository. It represents a potential compliance gap requiring remediation or control design."
              : "No candidate controls match the search criteria. Try clearing the active filters."
            }
          </p>
          {obligationMappings.length === 0 && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200 text-left text-xs max-w-md mx-auto">
              <span className="font-semibold text-slate-700 block mb-1">
                Remediation Workflow Recommendation:
              </span>
              <span className="text-[#64748B]">
                Initiate a control drafting request to Business Unit ({obligation.businessFunction}) to author an operational policy addressing the {obligation.requirementComponents.length} defined atomic requirement components.
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredMappingItems.map(mapping => {
            const ctrl = controls.find(c => c.id === mapping.controlId);
            if (!ctrl) return null;

            const isExpanded = expandedRationaleId === mapping.id;
            const supportedCount = mapping.coverageAssessments.filter(a => a.status === 'Supported').length;
            const totalCount = mapping.coverageAssessments.length;

            return (
              <div
                key={mapping.id}
                className={`p-4 rounded-xl border transition-all shadow-sm ${
                  mapping.status === 'Approved'
                    ? 'bg-emerald-50/20 border-emerald-200'
                    : mapping.status === 'Rejected'
                    ? 'bg-red-50/10 border-red-200 opacity-80'
                    : mapping.status === 'Needs Information'
                    ? 'bg-amber-50/20 border-amber-200'
                    : 'bg-white border-[#E2E8F0] hover:border-slate-300'
                }`}
              >
                {/* Control Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#0F766E] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      {ctrl.id}
                    </span>
                    <h3 className="font-bold text-sm text-[#17263C]">
                      {ctrl.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <MappingStatusBadge status={mapping.status} />
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-50 text-[#0F766E] border border-teal-200">
                      Score: {mapping.matchScore}/100
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#64748B] leading-relaxed mb-3">
                  {ctrl.description}
                </p>

                {/* Metadata Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mb-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-medium">Owner</span>
                    <span className="font-semibold text-slate-800 truncate block mt-0.5" title={ctrl.ownerRole}>
                      {ctrl.ownerRole}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Cadence</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">
                      {ctrl.frequency}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Design Status</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">
                      {ctrl.designStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Evidence</span>
                    <span className="font-semibold text-slate-800 block mt-0.5">
                      {ctrl.evidenceStatus}
                    </span>
                  </div>
                </div>

                {/* Coverage Summary Pill */}
                <div className="flex items-center justify-between text-xs mb-3 px-1">
                  <div className="flex items-center gap-1.5 text-[#17263C] font-medium">
                    <span className="text-slate-500 text-[11px]">Component Coverage:</span>
                    <span className="font-semibold text-[#0F766E]">
                      {supportedCount} of {totalCount} supported
                    </span>
                  </div>

                  {mapping.reviewedBy && (
                    <span className="text-[11px] text-slate-500">
                      Reviewed by {mapping.reviewedBy}
                    </span>
                  )}
                </div>

                {/* Rejection / Needs Info Callouts if applicable */}
                {mapping.status === 'Rejected' && mapping.rejectionReason && (
                  <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                    <span className="font-semibold block mb-0.5">Rejection Rationale:</span>
                    "{mapping.rejectionReason}"
                  </div>
                )}

                {mapping.status === 'Needs Information' && mapping.requestedInformation && (
                  <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                    <div className="font-semibold flex items-center justify-between">
                      <span>Inquiry Sent to: {mapping.requestedInformation.requestedRole}</span>
                      {mapping.requestedInformation.dueDate && (
                        <span className="text-[11px] text-amber-700">Due: {mapping.requestedInformation.dueDate}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-800">
                      "{mapping.requestedInformation.informationRequired}"
                    </div>
                  </div>
                )}

                {/* Expandable Algorithmic Rationale */}
                <div className="mb-3 border border-slate-200 rounded-lg overflow-hidden text-xs">
                  <button
                    onClick={() => toggleRationale(mapping.id)}
                    className="w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-medium text-[#17263C] transition-colors"
                  >
                    <span className="flex items-center gap-1.5 text-[#0F766E]">
                      <Sparkles className="w-3.5 h-3.5" />
                      Algorithmic Match & Gap Analysis
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-3 bg-white space-y-2 border-t border-slate-200 text-[11px]">
                      <div>
                        <span className="font-semibold text-emerald-800">Positive Coverage: </span>
                        <span className="text-slate-700">{mapping.matchRationale.positiveCoverage}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-amber-800">Identified Gaps: </span>
                        <span className="text-slate-700">{mapping.matchRationale.potentialGaps}</span>
                      </div>
                      <div className="pt-1 text-[10px] text-slate-500 flex justify-between border-t border-slate-100">
                        <span>Provider: {mapping.matchProvider}</span>
                        <span>Action: {mapping.matchRationale.suggestedReviewerAction}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onOpenReviewDialog(mapping, ctrl)}
                    className="text-xs"
                  >
                    <FileEdit className="w-3.5 h-3.5 mr-1 text-[#0F766E]" />
                    Review & Edit Mapping
                  </Button>

                  <div className="flex items-center gap-1.5">
                    {mapping.status !== 'Rejected' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRequestReject(mapping)}
                        className="text-xs text-red-700 hover:text-red-800 hover:bg-red-50"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    )}

                    {mapping.status !== 'Needs Information' && mapping.status !== 'Approved' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRequestMoreInfo(mapping)}
                        className="text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                      >
                        <HelpCircle className="w-3.5 h-3.5 mr-1" />
                        Request Info
                      </Button>
                    )}

                    {mapping.status !== 'Approved' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onOpenReviewDialog(mapping, ctrl)}
                        className="text-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Approve Mapping
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
