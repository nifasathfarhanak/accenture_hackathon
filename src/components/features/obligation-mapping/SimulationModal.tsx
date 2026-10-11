import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/Dialog';
import { Button } from '../../ui/Button';
import { 
  FlaskConical, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';
import { useToast } from '../../ui/Toast';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenario: string;
  onApplyScenario: (scenarioId: string) => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  activeScenario,
  onApplyScenario
}) => {
  const { addToast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState(activeScenario || 'baseline');

  const scenarios = [
    {
      id: 'baseline',
      title: 'Baseline Operational State',
      category: 'Production Baseline',
      desc: 'Standard Northstar Demo Bank compliance posture across all 8 regulatory mandates.',
      impact: 'Nominal baseline scoring across all controls.',
      badge: 'Current State',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    {
      id: 'amendment',
      title: 'What-If: Supervisory Regulatory Amendment',
      category: 'Regulatory Change Intelligence (Feature 2 & 12)',
      desc: 'Simulates the regulator publishing an emergency amendment to Cybersecurity Notification Rule CN-2024, cutting the incident escalation window from 4 hours to 90 minutes.',
      impact: 'CTRL-010 design status is automatically downgraded to "Deficient". OBL-004 triggers a critical regulatory gap alert.',
      badge: 'Regulatory Shock',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
    },
    {
      id: 'control_failure',
      title: 'What-If: Third-Party Operational Control Failure',
      category: 'Stress Simulation (Feature 12)',
      desc: 'Simulates primary AWS cloud availability zone outage invalidating Disaster Recovery control CTRL-007 evidence.',
      impact: 'Evidence status downgraded to "Missing Evidence". DORA resilience obligation OBL-003 drops to unapproved status.',
      badge: 'Control Outage',
      badgeColor: 'bg-red-50 text-red-800 border-red-200'
    }
  ];

  const handleApply = () => {
    onApplyScenario(selectedScenario);
    onClose();
    addToast({
      type: selectedScenario === 'baseline' ? 'info' : 'warning',
      title: `Simulation Applied: ${scenarios.find(s => s.id === selectedScenario)?.title}`,
      description: 'The workbench has dynamically adjusted candidate scores, control design statuses, and gap matrices.'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base text-[#17263C]">
            <FlaskConical className="w-5 h-5 text-[#0F766E]" />
            What-If & Regulatory Change Simulation Sandbox
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3.5 my-2 text-xs">
          <p className="text-[#64748B] leading-relaxed">
            Test the autonomous agent's resilience by simulating sudden regulatory amendments or operational control failures in real time (satisfying Feature #2 &amp; Feature #12).
          </p>

          <div className="space-y-2.5">
            {scenarios.map(sc => {
              const isSelected = selectedScenario === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#0F766E] bg-teal-50/40 ring-1 ring-[#0F766E]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      {sc.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${sc.badgeColor}`}>
                      {sc.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-2">
                    {sc.desc}
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span><strong>Simulated Impact:</strong> {sc.impact}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedScenario('baseline');
              onApplyScenario('baseline');
              onClose();
            }}
            className="text-xs text-slate-600"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reset to Baseline
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleApply}
              className="text-xs"
            >
              <Zap className="w-3.5 h-3.5 mr-1" />
              Run Simulation
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
