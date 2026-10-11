import React, { useState } from 'react';
import { AppSidebar } from './components/layout/AppSidebar';
import { AppHeader } from './components/layout/AppHeader';
import { MappingWorkbench } from './components/features/obligation-mapping/MappingWorkbench';
import { ToastProvider } from './components/ui/Toast';
import { TooltipProvider } from './components/ui/Tooltip';
import { SettingsDialog } from './components/features/obligation-mapping/SettingsDialog';
import { DEMO_ORGANIZATION } from './data/seedData';

export function App() {
  const [currentAnalyst, setCurrentAnalyst] = useState(DEMO_ORGANIZATION.analyst.name);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <ToastProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-[#F6F8FB] text-[#17263C] flex font-sans">
          {/* Fixed Left Sidebar */}
          <div className="hidden lg:block">
            <AppSidebar onOpenSettings={() => setIsSettingsOpen(true)} />
          </div>

          {/* Main Layout Area */}
          <div className="flex-1 lg:ml-[248px] flex flex-col min-w-0">
            {/* Top Navigation Header */}
            <AppHeader
              currentAnalyst={currentAnalyst}
              onSelectAnalyst={(name) => setCurrentAnalyst(name)}
              globalSearch={globalSearch}
              onGlobalSearchChange={(query) => setGlobalSearch(query)}
            />

            {/* Primary Content Container */}
            <main className="flex-1 pb-16">
              <MappingWorkbench
                currentAnalyst={currentAnalyst}
                globalSearch={globalSearch}
              />
            </main>
          </div>

          {/* Global Settings / Simulation Dialog */}
          <SettingsDialog
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onTriggerReset={() => {
              // Triggered via workbench
            }}
          />
        </div>
      </TooltipProvider>
    </ToastProvider>
  );
}

export default App;
