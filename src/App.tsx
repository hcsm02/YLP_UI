import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { YarnLibrary } from './components/YarnLibrary';
import { SmartAssistant } from './components/SmartAssistant';
import { Analysis } from './components/Analysis';
import { Inventory } from './components/Inventory';
import { DataProvider } from './data/DataContext';
import { Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'library': return <YarnLibrary />;
      case 'inventory': return <Inventory />;
      case 'analysis': return <Analysis />;
      case 'assistant': return <SmartAssistant />;
      default: return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="flex min-h-screen font-sans text-zinc-900">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        <main className="flex-1 flex flex-col min-h-screen relative">
          {/* Mobile Header */}
          <div className="lg:hidden p-4 bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-30 flex items-center justify-between">
            <div className="font-bold text-lg">YPL</div>
            <button onClick={() => setIsMobileOpen(true)} className="p-2 hover:bg-black/5 rounded-full">
              <Menu size={24} />
            </button>
          </div>

          <div className="flex-1 p-4 lg:p-8 lg:ml-80">
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </DataProvider>
  );
}
