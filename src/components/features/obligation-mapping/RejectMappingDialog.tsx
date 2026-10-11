import React, { useState } from 'react';
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
import { AlertCircle, XCircle } from 'lucide-react';
import { ControlMapping } from '../../../types';

interface RejectMappingDialogProps {
  mapping: ControlMapping | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReject: (reason: string, notes?: string) => Promise<void>;
}

export const RejectMappingDialog: React.FC<RejectMappingDialogProps> = ({
  mapping,
  isOpen,
  onClose,
  onConfirmReject
}) => {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim() || reason.trim().length < 5) {
      setError('A substantive rejection reason is required (minimum 5 characters).');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onConfirmReject(reason.trim(), notes.trim() || undefined);
      setReason('');
      setNotes('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject mapping');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mapping) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-1">
              <XCircle className="w-6 h-6" />
            </div>
            <AlertDialogTitle>
              Reject Obligation-to-Control Mapping
            </AlertDialogTitle>
            <AlertDialogDescription>
              Reject candidate mapping <span className="font-semibold text-slate-800">{mapping.id}</span> between obligation <span className="font-semibold text-slate-800">{mapping.obligationId}</span> and control <span className="font-semibold text-slate-800">{mapping.controlId}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4 space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <div>
                Rejected mappings are excluded from active compliance coverage calculations, but remain fully preserved in audit history.
              </div>
            </div>

            <div>
              <label htmlFor="rejection-reason" className="block text-xs font-semibold text-[#17263C] mb-1">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejection-reason"
                required
                rows={3}
                placeholder="Explain why this control does not satisfy the obligation requirements..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg text-[#17263C] focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label htmlFor="rejection-notes" className="block text-xs font-semibold text-[#17263C] mb-1">
                Optional Analyst Notes
              </label>
              <input
                id="rejection-notes"
                type="text"
                placeholder="Internal guidance or recommendations for remediation..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 text-xs border border-slate-300 rounded-lg text-[#17263C] focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {error && (
              <div className="text-xs text-red-600 font-medium">
                {error}
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              isLoading={isSubmitting}
            >
              Confirm Rejection
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
