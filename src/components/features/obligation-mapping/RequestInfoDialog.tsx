import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '../../ui/Dialog';
import { Button } from '../../ui/Button';
import { HelpCircle, Send } from 'lucide-react';
import { ControlMapping } from '../../../types';

interface RequestInfoDialogProps {
  mapping: ControlMapping | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRequest: (payload: {
    informationRequired: string;
    reason: string;
    requestedRole: string;
    dueDate?: string;
  }) => Promise<void>;
}

export const RequestInfoDialog: React.FC<RequestInfoDialogProps> = ({
  mapping,
  isOpen,
  onClose,
  onConfirmRequest
}) => {
  const [informationRequired, setInformationRequired] = useState('');
  const [reason, setReason] = useState('');
  const [requestedRole, setRequestedRole] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!informationRequired.trim() || informationRequired.trim().length < 5) {
      setError('Description of required information must be at least 5 characters.');
      return;
    }
    if (!reason.trim() || reason.trim().length < 5) {
      setError('Reason for request must be at least 5 characters.');
      return;
    }
    if (!requestedRole.trim()) {
      setError('Responsible function or owner role is required.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await onConfirmRequest({
        informationRequired: informationRequired.trim(),
        reason: reason.trim(),
        requestedRole: requestedRole.trim(),
        dueDate: dueDate || undefined
      });
      setInformationRequired('');
      setReason('');
      setRequestedRole('');
      setDueDate('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mapping) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center gap-2 text-amber-700 mb-1">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Clarification Workflow
              </span>
            </div>
            <DialogTitle>
              Request Additional Control Information
            </DialogTitle>
            <DialogDescription>
              Submit an internal review inquiry for mapping <span className="font-semibold text-slate-800">{mapping.id}</span>. Status will change to "Needs Information".
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 space-y-3.5">
            <div>
              <label htmlFor="info-required" className="block text-xs font-semibold text-[#17263C] mb-1">
                Information or Documentation Required <span className="text-red-500">*</span>
              </label>
              <textarea
                id="info-required"
                required
                rows={2}
                placeholder="Specify missing evidence, SLA definition, testing cadence, or population scope..."
                value={informationRequired}
                onChange={(e) => {
                  setInformationRequired(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div>
              <label htmlFor="info-reason" className="block text-xs font-semibold text-[#17263C] mb-1">
                Regulatory Rationale / Justification <span className="text-red-500">*</span>
              </label>
              <textarea
                id="info-reason"
                required
                rows={2}
                placeholder="Explain why this information is necessary to establish compliance coverage..."
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full p-2.5 text-xs border border-slate-300 rounded-lg text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="info-role" className="block text-xs font-semibold text-[#17263C] mb-1">
                  Responsible Function / Role <span className="text-red-500">*</span>
                </label>
                <input
                  id="info-role"
                  type="text"
                  required
                  placeholder="e.g. Infrastructure Resilience Lead"
                  value={requestedRole}
                  onChange={(e) => {
                    setRequestedRole(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>

              <div>
                <label htmlFor="info-due" className="block text-xs font-semibold text-[#17263C] mb-1">
                  Target Due Date (Optional)
                </label>
                <input
                  id="info-due"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg text-[#17263C] focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-600 font-medium">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
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
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Submit Information Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
