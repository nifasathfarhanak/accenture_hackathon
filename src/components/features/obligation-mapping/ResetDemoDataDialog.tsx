import React from 'react';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction 
} from '../../ui/AlertDialog';
import { Button } from '../../ui/Button';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetDemoDataDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetDemoDataDialog: React.FC<ResetDemoDataDialogProps> = ({
  isOpen,
  onClose,
  onConfirmReset
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mb-1">
            <RotateCcw className="w-5 h-5" />
          </div>
          <AlertDialogTitle>
            Reset Demonstration Dataset?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove all local modifications, approvals, rejections, draft changes, and custom notes created during this session.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 space-y-1.5">
          <div className="font-semibold flex items-center gap-1.5 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            What will be restored:
          </div>
          <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-900/90">
            <li>Original 8 synthetic regulatory obligations</li>
            <li>Original 10+ candidate internal banking controls</li>
            <li>Initial 12 deterministic mapping states (Approved, Suggested, Draft, Needs Info, Rejected)</li>
            <li>Historical seed audit events & telemetry</li>
          </ul>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="bg-[#B91C1C] hover:bg-[#991B1B] text-white"
          >
            Confirm & Restore Seed Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
