import React from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle 
} from 'lucide-react';
import { SummaryMetrics as SummaryMetricsType } from '../../../types';
import { Tooltip } from '../../ui/Tooltip';

interface SummaryMetricsProps {
  metrics: SummaryMetricsType;
  activeFilterKey?: string;
  onSelectMetricFilter: (metricType: 'all' | 'pending' | 'approved' | 'unmapped') => void;
}

export const SummaryMetricsBar: React.FC<SummaryMetricsProps> = ({
  metrics,
  activeFilterKey,
  onSelectMetricFilter,
}) => {
  const items = [
    {
      id: 'all' as const,
      title: 'Total Obligations',
      value: metrics.totalObligations,
      definition: 'Total count of regulatory obligation records currently cataloged in the repository.',
      icon: FileText,
      iconColor: 'text-[#0F766E]',
      iconBg: 'bg-teal-50',
      activeBorder: 'border-[#0F766E] ring-1 ring-[#0F766E]',
      filterLabel: 'View All Obligations'
    },
    {
      id: 'pending' as const,
      title: 'Pending Review',
      value: metrics.pendingReview,
      definition: 'Obligations having at least one candidate mapping with status "Pending Review" or "Suggested" awaiting analyst decision.',
      icon: Clock,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      activeBorder: 'border-blue-600 ring-1 ring-blue-600',
      filterLabel: 'Filter: Pending Review'
    },
    {
      id: 'approved' as const,
      title: 'Approved Mappings',
      value: metrics.approvedMappings,
      definition: 'Active obligation-to-control relationships reviewed and formally approved with signed analyst rationale.',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      activeBorder: 'border-emerald-600 ring-1 ring-emerald-600',
      filterLabel: 'Filter: Approved Coverage'
    },
    {
      id: 'unmapped' as const,
      title: 'Unmapped Obligations',
      value: metrics.unmappedObligations,
      definition: 'Applicable regulatory obligations that currently lack an active approved control mapping.',
      icon: AlertCircle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      activeBorder: 'border-amber-600 ring-1 ring-amber-600',
      filterLabel: 'Filter: Unmapped / Gaps'
    }
  ];

  return (
    <div className="space-y-1.5 mb-6">
      <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
        <span className="font-medium">Executive Compliance Metrics</span>
        <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
          Illustrative demo dataset
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(item => {
          const Icon = item.icon;
          const isSelected = activeFilterKey === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectMetricFilter(item.id)}
              className={`p-4 bg-white rounded-xl border transition-all text-left group shadow-sm hover:shadow hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0F766E] ${
                isSelected ? item.activeBorder : 'border-[#E2E8F0]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
                    <span>{item.title}</span>
                    <Tooltip content={item.definition} side="top">
                      <span className="inline-block cursor-help text-slate-400 hover:text-slate-600">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </span>
                    </Tooltip>
                  </div>
                  <div className="text-2xl font-bold text-[#17263C] mt-1 tracking-tight">
                    {item.value}
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg ${item.iconBg} ${item.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-slate-100">
                <span className="group-hover:text-[#0F766E] font-medium transition-colors">
                  {item.filterLabel}
                </span>
                <span className="text-slate-400 group-hover:translate-x-0.5 transition-transform">
                  &rarr;
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
