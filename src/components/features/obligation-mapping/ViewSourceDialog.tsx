import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '../../ui/Dialog';
import { RegulatoryObligation } from '../../../types';
import { Button } from '../../ui/Button';
import { BookOpen, ShieldAlert, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Badge } from '../../ui/Badge';

interface ViewSourceDialogProps {
  obligation: RegulatoryObligation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewSourceDialog: React.FC<ViewSourceDialogProps> = ({
  obligation,
  isOpen,
  onClose
}) => {
  if (!obligation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#0F766E] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              {obligation.id}
            </span>
            <Badge variant="warning">
              {obligation.sourceVerificationStatus}
            </Badge>
          </div>
          <DialogTitle className="text-base font-bold text-[#17263C]">
            Regulatory Source Citation & Original Excerpt
          </DialogTitle>
          <DialogDescription className="text-xs text-[#64748B]">
            Original text extraction and provenance references for requirement verification.
          </DialogDescription>
        </DialogHeader>

        {/* Synthetic Citation Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-amber-800">Synthetic Demo Source Notice</div>
            <div className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
              Synthetic demo source — not a real regulatory citation. This text is created solely for illustrative evaluation of compliance mapping workflows and should not be construed as authentic law or regulatory guidance.
            </div>
          </div>
        </div>

        {/* Source Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-[#E2E8F0]">
          <div>
            <div className="text-[#64748B] font-medium text-[11px]">Regulation Document</div>
            <div className="font-semibold text-[#17263C] mt-0.5">{obligation.regulationName}</div>
          </div>
          <div>
            <div className="text-[#64748B] font-medium text-[11px]">Document Version</div>
            <div className="font-semibold text-[#17263C] mt-0.5">{obligation.sourceDocumentVersion}</div>
          </div>
          <div>
            <div className="text-[#64748B] font-medium text-[11px]">Section / Clause</div>
            <div className="font-semibold text-[#17263C] mt-0.5">{obligation.sourceSection}</div>
          </div>
          <div>
            <div className="text-[#64748B] font-medium text-[11px]">Page Number</div>
            <div className="font-semibold text-[#17263C] mt-0.5">Page {obligation.sourcePage}</div>
          </div>
          <div>
            <div className="text-[#64748B] font-medium text-[11px]">Jurisdiction</div>
            <div className="font-semibold text-[#17263C] mt-0.5">{obligation.jurisdiction}</div>
          </div>
          <div>
            <div className="text-[#64748B] font-medium text-[11px]">Effective Date</div>
            <div className="font-semibold text-[#17263C] mt-0.5">{obligation.effectiveDate}</div>
          </div>
        </div>

        {/* Original Excerpt Box */}
        <div>
          <div className="text-xs font-semibold text-[#17263C] mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
            Original Source Excerpt
          </div>
          <blockquote className="p-3.5 bg-white border-l-4 border-l-[#0F766E] border border-slate-200 rounded-r-lg text-xs text-[#17263C] italic leading-relaxed shadow-inner">
            "{obligation.sourceExcerpt}"
          </blockquote>
        </div>

        {/* Normalized Requirement Box */}
        <div>
          <div className="text-xs font-semibold text-[#17263C] mb-1.5 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#0F766E]" />
            Normalized Compliance Requirement
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#17263C] leading-relaxed">
            {obligation.normalizedRequirement}
          </div>
        </div>

        {/* Requirement Components Breakdown */}
        <div>
          <div className="text-xs font-semibold text-[#17263C] mb-1.5">
            Extracted Atomic Requirement Components ({obligation.requirementComponents.length})
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {obligation.requirementComponents.map((rc, idx) => (
              <div 
                key={rc.id}
                className="p-2.5 rounded bg-white border border-slate-200 text-xs flex items-start gap-2"
              >
                <span className="font-bold text-[10px] text-[#0F766E] bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200 flex-shrink-0">
                  {rc.id}
                </span>
                <div className="flex-1">
                  <div className="text-[#17263C] font-medium">{rc.statement}</div>
                  <div className="text-[11px] text-[#64748B] mt-0.5 italic">
                    Source ref ({rc.sourceSection}): "{rc.sourceExcerpt}"
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Source Viewer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
