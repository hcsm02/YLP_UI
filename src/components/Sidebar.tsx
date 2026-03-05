import React from 'react';
import { LayoutDashboard, Package, BarChart3, Search, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library', label: 'Library', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: BarChart3 },
    { id: 'analysis', label: 'Analysis', icon: Sparkles },
    { id: 'assistant', label: 'AI Assistant', icon: Search },
  ];

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          "fixed top-4 left-4 bottom-4 w-72 bg-white/80 backdrop-blur-xl z-50 flex flex-col rounded-[2rem] shadow-2xl border border-white/50",
          "lg:translate-x-0 transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1)",
          isMobileOpen ? "translate-x-0" : "-translate-x-[120%] lg:translate-x-0"
        )}
      >
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center shadow-lg shadow-zinc-900/20">
              <span className="font-bold text-white text-lg">Y</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-zinc-800">YPL</span>
          </div>
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] text-sm font-semibold transition-all duration-300",
                activeTab === item.id
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-100"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 hover:scale-[1.02]"
              )}
            >
              <item.icon size={20} strokeWidth={2.5} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-zinc-50/80 backdrop-blur-md rounded-[1.5rem] p-5 border border-white/50 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-bold shadow-md">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-zinc-900 font-bold text-sm">Admin User</span>
                <span className="text-zinc-500 text-xs font-medium">Product Dept.</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
