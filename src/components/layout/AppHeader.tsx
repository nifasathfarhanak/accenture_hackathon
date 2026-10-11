import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  ChevronDown, 
  CheckCircle, 
  User, 
  Check, 
  Info 
} from 'lucide-react';
import { DEMO_ORGANIZATION } from '../../data/seedData';
import { Tooltip } from '../ui/Tooltip';

interface AppHeaderProps {
  currentAnalyst: string;
  onSelectAnalyst: (name: string) => void;
  globalSearch: string;
  onGlobalSearchChange: (query: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentAnalyst,
  onSelectAnalyst,
  globalSearch,
  onGlobalSearchChange
}) => {
  const [showOrgMenu, setShowOrgMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New candidate mapping proposed', desc: 'CTRL-014 suggested for OBL-001 (Match: 86%)', read: false, time: '10m ago' },
    { id: '2', title: 'Clarification requested', desc: 'Information requested on OBL-003 cloud failover SLA', read: false, time: '1h ago' },
    { id: '3', title: 'Mapping Approved', desc: 'CTRL-002 approved for OBL-002 by Jane Doe', read: true, time: '2h ago' }
  ]);

  const analystRoles = [
    { name: 'Jane Doe', title: 'Senior Compliance Officer' },
    { name: 'Robert Chen', title: 'Principal Enterprise Risk Auditor' },
    { name: 'Maya Patel', title: 'Model Governance Analyst' }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#64748B] font-medium">Compliance Workspace</span>
        <span className="text-slate-300">/</span>
        <span className="text-[#17263C] font-semibold">Obligation Mapping</span>
      </div>

      {/* Middle: Organization Selector & Global Search */}
      <div className="flex items-center gap-4">
        {/* Organization Badge / Selector */}
        <div className="relative">
          <button
            onClick={() => setShowOrgMenu(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 transition-colors text-xs text-left"
            aria-expanded={showOrgMenu}
          >
            <Building2 className="w-4 h-4 text-[#0F766E]" />
            <div>
              <div className="font-semibold text-[#17263C] leading-tight flex items-center gap-1.5">
                {DEMO_ORGANIZATION.name}
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </div>
              <div className="text-[10px] text-[#64748B] leading-none">
                Fictional demo institution
              </div>
            </div>
          </button>

          {showOrgMenu && (
            <div className="absolute left-0 mt-1 w-64 bg-white border border-[#E2E8F0] rounded-lg shadow-lg p-3 z-50 text-xs">
              <div className="font-semibold text-[#17263C] mb-1">Active Entity</div>
              <p className="text-[#64748B] mb-2 leading-relaxed">
                {DEMO_ORGANIZATION.disclaimer}
              </p>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
                Jurisdiction: US / Multi-Regional Banking
              </div>
              <button
                onClick={() => setShowOrgMenu(false)}
                className="mt-2 w-full text-center text-xs text-[#0F766E] font-medium hover:underline"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* Global Quick Search */}
        <div className="relative w-64 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search obligations, controls..."
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F6F8FB] border border-[#E2E8F0] rounded-lg text-[#17263C] placeholder:text-[#64748B] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0F766E]"
            aria-label="Global search input"
          />
        </div>
      </div>

      {/* Right: Notifications & Analyst Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="p-2 text-[#64748B] hover:text-[#17263C] hover:bg-slate-100 rounded-lg relative transition-colors"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-[#E2E8F0] flex items-center justify-between">
                <span className="font-semibold text-xs text-[#17263C]">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-[#0F766E] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`p-3 text-xs ${n.read ? 'bg-white' : 'bg-slate-50/80'}`}>
                    <div className="font-semibold text-[#17263C] flex items-center justify-between">
                      {n.title}
                      <span className="text-[10px] text-[#64748B] font-normal">{n.time}</span>
                    </div>
                    <div className="text-[11px] text-[#64748B] mt-0.5">{n.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Analyst Profile Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(prev => !prev)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-[#E2E8F0] transition-colors"
            aria-expanded={showRoleMenu}
          >
            <div className="w-7 h-7 rounded-full bg-[#122238] text-white flex items-center justify-center text-xs font-semibold">
              {currentAnalyst.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-left text-xs hidden sm:block">
              <div className="font-medium text-[#17263C] leading-tight flex items-center gap-1">
                {currentAnalyst}
                <ChevronDown className="w-3 h-3 text-[#64748B]" />
              </div>
              <div className="text-[10px] text-[#64748B] leading-none">
                Demo Analyst
              </div>
            </div>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-2 z-50">
              <div className="px-3 py-2 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider border-b border-slate-100">
                Switch Demo Analyst Role
              </div>
              <div className="mt-1 space-y-1">
                {analystRoles.map(role => {
                  const isSelected = currentAnalyst === role.name;
                  return (
                    <button
                      key={role.name}
                      onClick={() => {
                        onSelectAnalyst(role.name);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isSelected ? 'bg-teal-50 text-[#0F766E] font-medium' : 'text-[#17263C] hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{role.name}</div>
                        <div className="text-[10px] text-[#64748B]">{role.title}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#0F766E]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
