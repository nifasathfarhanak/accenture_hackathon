import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  BookOpen, 
  GitMerge, 
  ShieldAlert, 
  History, 
  Settings, 
  UserCircle 
} from 'lucide-react';
import { DEMO_ORGANIZATION } from '../../data/seedData';

interface AppSidebarProps {
  onOpenSettings?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ onOpenSettings }) => {
  const navItems = [
    { name: 'Overview', icon: Layers, status: 'unavailable', tag: 'Prototype' },
    { name: 'Regulatory Library', icon: BookOpen, status: 'unavailable', tag: 'Prototype' },
    { name: 'Obligation Mapping', icon: GitMerge, status: 'active', tag: 'Live Feature' },
    { name: 'Control Framework', icon: ShieldAlert, status: 'unavailable', tag: 'Prototype' },
    { name: 'Audit History', icon: History, status: 'unavailable', tag: 'Prototype' },
  ];

  return (
    <aside className="w-[248px] bg-[#122238] text-slate-300 flex flex-col justify-between h-screen fixed left-0 top-0 z-30 border-r border-slate-800 select-none">
      {/* Top Header */}
      <div>
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0F766E] flex items-center justify-center text-white shadow-md shadow-teal-950/40">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-base leading-tight">
              RegulaTrace AI
            </div>
            <div className="text-[11px] text-slate-400 font-medium tracking-wide">
              Regulatory Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Group */}
        <div className="px-3 py-4">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Compliance Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = item.status === 'active';

              if (isActive) {
                return (
                  <div
                    key={item.name}
                    aria-current="page"
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#0F766E] text-white font-medium text-sm shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-white" />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-[10px] bg-teal-800/80 text-teal-100 font-semibold px-1.5 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={item.name}
                  title={`${item.name} is a prototype module not in current single-feature scope.`}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 text-sm cursor-not-allowed opacity-60 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    Inactive
                  </span>
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Sandbox Info */}
      <div className="p-4 border-t border-slate-800 bg-[#0E1A2B]">
        <div className="mb-3 px-2 py-1.5 rounded bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">Environment</span>
            <span className="text-amber-400 font-semibold tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              SANDBOX / DEMO
            </span>
          </div>
          <div className="text-[10px] text-slate-400 truncate mt-0.5">
            {DEMO_ORGANIZATION.name}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-teal-400 font-semibold text-xs border border-slate-600">
              JD
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {DEMO_ORGANIZATION.analyst.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {DEMO_ORGANIZATION.analyst.role}
              </div>
            </div>
          </div>

          {onOpenSettings && (
            <button
              onClick={onOpenSettings}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              aria-label="Open settings"
              title="Settings & Simulation Controls"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
