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
import { 
  Settings, 
  AlertTriangle, 
  Database, 
  RotateCcw, 
  CheckCircle2, 
  Bug, 
  ShieldAlert 
} from 'lucide-react';
import { 
  setSimulateStorageFailure, 
  isStorageFailureSimulated 
} from '../../../services/storageService';
import { useToast } from '../../ui/Toast';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerReset: () => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  onTriggerReset
}) => {
  const { addToast } = useToast();
  const [simulateError, setSimulateError] = useState(isStorageFailureSimulated());

  const handleToggleSimulateError = (checked: boolean) => {
    setSimulateError(checked);
    setSimulateStorageFailure(checked);
    addToast({
      type: checked ? 'warning' : 'info',
      title: checked ? 'Storage Error Simulation Enabled' : 'Normal Storage Mode Restored',
      description: checked 
        ? 'Future save/approve/reject mutations will throw a simulated storage write error.'
        : 'Storage writes will persist normally.'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[#0F766E] mb-1">
            <Settings className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Prototype & Simulation Controls
            </span>
          </div>
          <DialogTitle>
            Demo Environment Settings
          </DialogTitle>
          <DialogDescription>
            Configure prototype behaviors, test resilience error handlers, and manage local storage states.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2 text-xs">
          {/* Storage Failure Simulation Toggle (Requirement for Test 18) */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17263C] flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-amber-600" />
                Simulate Storage Failure (Test 18)
              </span>
              <input
                type="checkbox"
                id="sim-storage-err"
                checked={simulateError}
                onChange={(e) => handleToggleSimulateError(e.target.checked)}
                className="w-4 h-4 text-[#0F766E] rounded border-slate-300 focus:ring-[#0F766E]"
              />
            </div>
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              When enabled, any storage write action (approval, rejection, draft save) will fail with a simulated transaction rollback error. Unsaved changes will not falsely display success.
            </p>
          </div>

          {/* Reset Demo Data Action */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#17263C] flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#0F766E]" />
                Seed Data Management
              </span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onClose();
                  onTriggerReset();
                }}
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset Data
              </Button>
            </div>
            <p className="text-[#64748B] text-[11px] leading-relaxed">
              Restores the deterministic seed obligations, controls, and mapping catalog.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
