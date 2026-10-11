import React from 'react';
import { 
  RegulatoryObligation, 
  ControlMapping, 
  InternalControl 
} from '../../../types';
import { CoverageStatusBadge } from '../../ui/Badge';
import { Layers, FileEdit } from 'lucide-react';
import { Button } from '../../ui/Button';

interface CoverageTableProps {
  obligation: RegulatoryObligation;
  mappings: ControlMapping[];
  controls: InternalControl[];
  onOpenReview: (mapping: ControlMapping) => void;
}

export const CoverageTable: React.FC<CoverageTableProps> = ({
  obligation,
  mappings,
  controls,
  onOpenReview
}) => {
  // Use the primary / first active mapping for display, or approved mapping if one exists
  const activeMappings = mappings.filter(m => m.obligationId === obligation.id && m.active !== false);
  const primaryMapping = activeMappings.find(m => m.status === 'Approved') || activeMappings[0];

  const primaryControl = primaryMapping 
    ? controls.find(c => c.id === primaryMapping.controlId)
    : undefined;

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E2E8F0]">
        <div>
          <h2 className="text-base font-bold text-[#17263C] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0F766E]" />
            Atomic Requirement Coverage Breakdown
          </h2>
          <p className="text-xs text-[#64748B]">
            Section 10 analytical matrix: verifiable mapping status per individual requirement component.
          </p>
        </div>

        {primaryMapping && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              Evaluating vs: <span className="font-semibold text-slate-800">{primaryMapping.controlId}</span>
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenReview(primaryMapping)}
              className="text-xs"
            >
              <FileEdit className="w-3.5 h-3.5 mr-1 text-[#0F766E]" />
              Edit Assessments
            </Button>
          </div>
        )}
      </div>

      {!primaryMapping ? (
        <div className="p-6 text-center text-xs text-[#64748B] bg-slate-50 rounded-lg border border-dashed border-slate-200">
          No active candidate control mapped to evaluate atomic component coverage.
        </div>
      ) : (
        <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-[#17263C] font-semibold border-b border-[#E2E8F0]">
                  <th className="p-3 w-1/4">Requirement Component</th>
                  <th className="p-3 w-1/3">Evidence Reference & Source Excerpt</th>
                  <th className="p-3 w-1/6">Coverage Status</th>
                  <th className="p-3 w-1/4">Analyst Compliance Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {obligation.requirementComponents.map((rc) => {
                  const assessment = primaryMapping.coverageAssessments.find(
                    a => a.requirementComponentId === rc.id
                  );

                  const status = assessment?.status || 'Unknown';
                  const excerpt = assessment?.supportingExcerpt || rc.sourceExcerpt;
                  const rationale = assessment?.reviewerNote || assessment?.rationale || "Pending review";

                  return (
                    <tr key={rc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 align-top">
                        <span className="font-bold text-[10px] text-[#0F766E] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 inline-block mb-1">
                          {rc.id}
                        </span>
                        <div className="font-medium text-[#17263C] leading-snug">
                          {rc.statement}
                        </div>
                      </td>

                      <td className="p-3 align-top text-[#64748B]">
                        <div className="bg-slate-50 p-2 rounded border border-slate-200 italic leading-relaxed text-[11px]">
                          "{excerpt}"
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Source Section: {rc.sourceSection}
                        </div>
                      </td>

                      <td className="p-3 align-top">
                        <CoverageStatusBadge status={status} />
                      </td>

                      <td className="p-3 align-top text-[#17263C]">
                        <div className="text-[11px] leading-relaxed">
                          {rationale}
                        </div>
                        {assessment?.analystReviewed && (
                          <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                            &check; Analyst Reviewed
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
