import React, { useMemo } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  ChevronRight, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  RegulatoryObligation, 
  ControlMapping, 
  FilterState 
} from '../../../types';
import { 
  ApplicabilityBadge, 
  MappingStatusBadge, 
  OverallCoverageBadge 
} from '../../ui/Badge';
import { computeOverallCoverage } from '../../../services/storageService';

interface ObligationExplorerProps {
  obligations: RegulatoryObligation[];
  mappings: ControlMapping[];
  selectedObligationId: string | null;
  onSelectObligation: (obligation: RegulatoryObligation) => void;
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

export const ObligationExplorer: React.FC<ObligationExplorerProps> = ({
  obligations,
  mappings,
  selectedObligationId,
  onSelectObligation,
  filters,
  onUpdateFilters,
  onClearFilters
}) => {
  // Extract unique filter options from obligations
  const regulationOptions = useMemo(() => {
    return Array.from(new Set(obligations.map(o => o.regulationName))).sort();
  }, [obligations]);

  const businessFunctionOptions = useMemo(() => {
    return Array.from(new Set(obligations.map(o => o.businessFunction))).sort();
  }, [obligations]);

  // Filter logic
  const filteredObligations = useMemo(() => {
    return obligations.filter(ob => {
      // 1. Text search (ID, title, normalized req, regulation, section)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesQuery = 
          ob.id.toLowerCase().includes(query) ||
          ob.title.toLowerCase().includes(query) ||
          ob.normalizedRequirement.toLowerCase().includes(query) ||
          ob.regulationName.toLowerCase().includes(query) ||
          ob.sourceSection.toLowerCase().includes(query) ||
          ob.businessFunction.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // 2. Regulation filter
      if (filters.regulation && ob.regulationName !== filters.regulation) {
        return false;
      }

      // 3. Applicability filter
      if (filters.applicability && ob.applicabilityStatus !== filters.applicability) {
        return false;
      }

      // 4. Business function filter
      if (filters.businessFunction && ob.businessFunction !== filters.businessFunction) {
        return false;
      }

      // 5. Mapping status & review status filters
      const obMappings = mappings.filter(m => m.obligationId === ob.id);
      const coverageStatus = computeOverallCoverage(ob, obMappings);

      if (filters.mappingStatus) {
        if (filters.mappingStatus === 'Unmapped') {
          const hasApproved = obMappings.some(m => m.status === 'Approved' && m.active !== false);
          if (hasApproved) return false;
        } else if (filters.mappingStatus === 'Approved') {
          const hasApproved = obMappings.some(m => m.status === 'Approved' && m.active !== false);
          if (!hasApproved) return false;
        } else if (filters.mappingStatus === 'Partial') {
          if (coverageStatus !== 'Partial coverage') return false;
        } else if (filters.mappingStatus === 'Needs Information') {
          const hasNeedsInfo = obMappings.some(m => m.status === 'Needs Information');
          if (!hasNeedsInfo) return false;
        }
      }

      if (filters.reviewStatus) {
        if (filters.reviewStatus === 'Pending Review') {
          const isPending = obMappings.some(m => (m.status === 'Pending Review' || m.status === 'Suggested') && m.active !== false);
          if (!isPending) return false;
        } else if (filters.reviewStatus === 'Reviewed') {
          const isReviewed = obMappings.some(m => m.status === 'Approved' || m.status === 'Rejected');
          if (!isReviewed) return false;
        }
      }

      return true;
    });
  }, [obligations, mappings, filters]);

  const hasActiveFilters = Boolean(
    filters.searchQuery || 
    filters.regulation || 
    filters.applicability || 
    filters.mappingStatus || 
    filters.reviewStatus || 
    filters.businessFunction
  );

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col h-[calc(100vh-210px)] min-h-[580px] overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#E2E8F0] bg-slate-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#17263C]">
              Regulatory Obligations
            </h2>
            <p className="text-xs text-[#64748B]">
              Select a requirement to review its control coverage.
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
            {filteredObligations.length} of {obligations.length}
          </span>
        </div>

        {/* Search Input */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B]" />
          <input
            type="text"
            id="obligation-search"
            placeholder="Search ID, obligation, regulation, or clause..."
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-[#CBD5E1] rounded-lg text-[#17263C] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#0F766E] focus:border-transparent transition-all"
            aria-label="Search obligations by keyword, ID, regulation, or clause"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ searchQuery: '' })}
              className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
          {/* Regulation Filter */}
          <select
            value={filters.regulation}
            onChange={(e) => onUpdateFilters({ regulation: e.target.value })}
            className="px-2 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#17263C] focus:outline-none focus:ring-1 focus:ring-[#0F766E] truncate"
            aria-label="Filter by regulation"
          >
            <option value="">All Regulations</option>
            {regulationOptions.map(reg => (
              <option key={reg} value={reg} title={reg}>{reg}</option>
            ))}
          </select>

          {/* Applicability Filter */}
          <select
            value={filters.applicability}
            onChange={(e) => onUpdateFilters({ applicability: e.target.value })}
            className="px-2 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#17263C] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            aria-label="Filter by applicability"
          >
            <option value="">All Applicability</option>
            <option value="Applicable">Applicable</option>
            <option value="Under Review">Under Review</option>
            <option value="Not Applicable">Not Applicable</option>
          </select>

          {/* Mapping Status Filter */}
          <select
            value={filters.mappingStatus}
            onChange={(e) => onUpdateFilters({ mappingStatus: e.target.value })}
            className="px-2 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#17263C] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            aria-label="Filter by mapping coverage status"
          >
            <option value="">All Mapping Statuses</option>
            <option value="Approved">Approved Mappings</option>
            <option value="Partial">Partial Coverage</option>
            <option value="Needs Information">Needs Information</option>
            <option value="Unmapped">Unmapped / Gaps</option>
          </select>

          {/* Review Status Filter */}
          <select
            value={filters.reviewStatus}
            onChange={(e) => onUpdateFilters({ reviewStatus: e.target.value })}
            className="px-2 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#17263C] focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            aria-label="Filter by review status"
          >
            <option value="">All Review Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Reviewed">Reviewed Decisions</option>
          </select>
        </div>

        {/* Clear Filters Button if any active */}
        {hasActiveFilters && (
          <div className="mt-2 flex items-center justify-between text-xs pt-1 border-t border-slate-200">
            <span className="text-[11px] text-[#64748B]">Active filters applied</span>
            <button
              onClick={onClearFilters}
              className="text-[#0F766E] font-medium hover:underline inline-flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Obligations List / Table */}
      <div className="flex-1 overflow-y-auto">
        {filteredObligations.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="font-semibold text-sm text-[#17263C]">No obligations match your criteria</div>
            <p className="text-xs text-[#64748B] mt-1 max-w-xs mx-auto">
              Try adjusting your search keywords or clearing active filters to view all cataloged requirements.
            </p>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="mt-3 px-3 py-1.5 text-xs bg-[#0F766E] text-white font-medium rounded-lg hover:bg-[#115E59] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div 
            role="table" 
            aria-label="Regulatory Obligations Register"
            className="divide-y divide-[#E2E8F0]"
          >
            {filteredObligations.map((ob) => {
              const isSelected = selectedObligationId === ob.id;
              const obMappings = mappings.filter(m => m.obligationId === ob.id && m.active !== false);
              const coverage = computeOverallCoverage(ob, obMappings);
              const approvedCount = obMappings.filter(m => m.status === 'Approved').length;
              const hasPending = obMappings.some(m => m.status === 'Pending Review' || m.status === 'Suggested');

              return (
                <div
                  key={ob.id}
                  role="row"
                  tabIndex={0}
                  data-testid={`obligation-row-${ob.id}`}
                  onClick={() => onSelectObligation(ob)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectObligation(ob);
                    }
                  }}
                  className={`p-3.5 cursor-pointer transition-colors relative text-left focus:outline-none focus:bg-teal-50/50 ${
                    isSelected 
                      ? 'bg-teal-50/70 border-l-4 border-l-[#0F766E]' 
                      : 'hover:bg-slate-50 border-l-4 border-l-transparent'
                  }`}
                  aria-selected={isSelected}
                >
                  {/* Top line: ID and Applicability */}
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-bold text-xs text-[#0F766E] tracking-tight">
                      {ob.id}
                    </span>
                    <ApplicabilityBadge status={ob.applicabilityStatus} />
                  </div>

                  {/* Title / Requirement Summary */}
                  <div className="text-xs font-semibold text-[#17263C] line-clamp-1 mb-1">
                    {ob.title}
                  </div>
                  
                  <div className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed mb-2">
                    {ob.normalizedRequirement}
                  </div>

                  {/* Regulation & Section Metadata */}
                  <div className="text-[10px] text-slate-500 flex items-center justify-between mb-2">
                    <span className="truncate max-w-[200px]" title={ob.regulationName}>
                      {ob.regulationName}
                    </span>
                    <span className="font-medium bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                      {ob.sourceSection}
                    </span>
                  </div>

                  {/* Bottom Status Tags */}
                  <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <OverallCoverageBadge status={coverage} />
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                      {hasPending ? (
                        <span className="text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          Pending review
                        </span>
                      ) : approvedCount > 0 ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Approved ({approvedCount})
                        </span>
                      ) : (
                        <span className="text-slate-500">
                          {obMappings.length} candidates
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
