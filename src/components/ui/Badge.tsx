import React from 'react';
import { 
  MappingStatus, 
  RequirementCoverageStatus, 
  OverallCoverageStatus, 
  ApplicabilityStatus 
} from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '' 
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
    success: 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]',
    warning: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    error: 'bg-[#FEF2F2] text-[#B91C1C] border-[#FCA5A5]',
    info: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    purple: 'bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]',
  }[variant];

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span 
      className={`inline-flex items-center font-medium rounded-full border ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export const MappingStatusBadge: React.FC<{ status: MappingStatus; className?: string }> = ({ status, className }) => {
  const config: Record<MappingStatus, { variant: BadgeProps['variant']; label: string }> = {
    Approved: { variant: 'success', label: 'Approved' },
    'Pending Review': { variant: 'info', label: 'Pending Review' },
    Suggested: { variant: 'purple', label: 'Suggested' },
    Draft: { variant: 'warning', label: 'Draft' },
    'Needs Information': { variant: 'warning', label: 'Needs Information' },
    Rejected: { variant: 'error', label: 'Rejected' },
    Superseded: { variant: 'neutral', label: 'Superseded' },
  };

  const item = config[status] || { variant: 'neutral', label: status };
  return (
    <Badge variant={item.variant} className={className}>
      {item.label}
    </Badge>
  );
};

export const CoverageStatusBadge: React.FC<{ status: RequirementCoverageStatus; className?: string }> = ({ status, className }) => {
  const config: Record<RequirementCoverageStatus, { variant: BadgeProps['variant']; label: string }> = {
    Supported: { variant: 'success', label: 'Supported' },
    'Partially supported': { variant: 'warning', label: 'Partially Supported' },
    'Not supported': { variant: 'error', label: 'Not Supported' },
    Unknown: { variant: 'neutral', label: 'Unknown' },
  };

  const item = config[status] || { variant: 'neutral', label: status };
  return (
    <Badge variant={item.variant} className={className}>
      {item.label}
    </Badge>
  );
};

export const OverallCoverageBadge: React.FC<{ status: OverallCoverageStatus; isProvisional?: boolean; className?: string }> = ({ 
  status, 
  isProvisional,
  className 
}) => {
  const config: Record<OverallCoverageStatus, { variant: BadgeProps['variant']; label: string }> = {
    'Approved mapping': { variant: 'success', label: 'Approved Mapping' },
    'Fully mapped, pending approval': { variant: 'info', label: 'Fully Mapped (Pending Approval)' },
    'Partial coverage': { variant: 'warning', label: 'Partial Coverage' },
    'Mapping suggested': { variant: 'purple', label: 'Mapping Suggested' },
    'No control identified': { variant: 'error', label: 'No Control Identified' },
    'Mapping rejected': { variant: 'error', label: 'Mapping Rejected' },
    'Applicability requires review': { variant: 'warning', label: 'Applicability Requires Review' },
  };

  const item = config[status] || { variant: 'neutral', label: status };

  return (
    <div className="inline-flex items-center gap-1.5">
      <Badge variant={item.variant} className={className}>
        {item.label}
      </Badge>
      {isProvisional && (
        <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
          Provisional
        </span>
      )}
    </div>
  );
};

export const ApplicabilityBadge: React.FC<{ status: ApplicabilityStatus; className?: string }> = ({ status, className }) => {
  const config: Record<ApplicabilityStatus, { variant: BadgeProps['variant'] }> = {
    Applicable: { variant: 'success' },
    'Not Applicable': { variant: 'neutral' },
    'Under Review': { variant: 'warning' },
  };

  return (
    <Badge variant={config[status]?.variant || 'neutral'} className={className}>
      {status}
    </Badge>
  );
};
