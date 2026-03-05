import React, { useState } from 'react';
import { useData } from '@/data/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function Inventory() {
  const { yarns } = useData();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'stockLevel', direction: 'desc' });

  const sortedYarns = [...yarns].sort((a, b) => {
    if (!sortConfig) return 0;
    const aValue = a[sortConfig.key as keyof typeof a];
    const bValue = b[sortConfig.key as keyof typeof b];
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const statusCounts = {
    Normal: yarns.filter(y => y.stockStatus === 'Normal').length,
    High: yarns.filter(y => y.stockStatus === 'High').length,
    Low: yarns.filter(y => y.stockStatus === 'Low').length,
    Stagnant: yarns.filter(y => y.stockStatus === 'Stagnant').length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Inventory</h1>
        <p className="text-zinc-500 mt-2 text-lg">Real-time stock monitoring and alerts</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard 
          label="Normal Stock" 
          count={statusCounts.Normal} 
          color="from-emerald-400 to-teal-500" 
          icon={CheckCircle} 
        />
        <StatusCard 
          label="High Stock" 
          count={statusCounts.High} 
          color="from-blue-400 to-indigo-500" 
          icon={ArrowUp} 
        />
        <StatusCard 
          label="Low Stock" 
          count={statusCounts.Low} 
          color="from-amber-400 to-orange-500" 
          icon={ArrowDown} 
        />
        <StatusCard 
          label="Stagnant" 
          count={statusCounts.Stagnant} 
          color="from-red-400 to-pink-500" 
          icon={AlertTriangle} 
          isAlert 
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl shadow-zinc-200/50 overflow-hidden">
        <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
          <h2 className="text-xl font-bold text-zinc-900">Stock Details</h2>
          <div className="text-sm font-medium text-zinc-400 bg-white px-3 py-1 rounded-full shadow-sm">
            Click headers to sort
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500 cursor-pointer hover:text-zinc-800 transition-colors" onClick={() => handleSort('code')}>
                  Item
                </th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500 cursor-pointer hover:text-zinc-800 transition-colors" onClick={() => handleSort('stockLevel')}>
                  Stock (kg) {sortConfig?.key === 'stockLevel' && (sortConfig.direction === 'desc' ? '↓' : '↑')}
                </th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500">Status</th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500 cursor-pointer hover:text-zinc-800 transition-colors" onClick={() => handleSort('pricePerKg')}>
                  Value (Est.)
                </th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {sortedYarns.map((yarn) => (
                <tr key={yarn.id} className="hover:bg-indigo-50/30 transition-colors">
                  <td className="px-4 lg:px-8 py-4 lg:py-6">
                    <div className="font-bold text-zinc-900 text-base">{yarn.code}</div>
                    <div className="text-zinc-500 text-xs mt-1">{yarn.name}</div>
                  </td>
                  <td className="px-8 py-6 font-mono font-medium text-zinc-700 text-base">
                    {yarn.stockLevel.toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      yarn.stockStatus === 'Normal' ? "bg-emerald-100 text-emerald-700" :
                      yarn.stockStatus === 'High' ? "bg-blue-100 text-blue-700" :
                      yarn.stockStatus === 'Low' ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {yarn.stockStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-mono text-zinc-600">
                    ¥{(yarn.stockLevel * yarn.pricePerKg).toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    {yarn.stockStatus === 'Stagnant' ? (
                      <button className="text-red-600 hover:text-red-700 font-medium text-xs flex items-center gap-1">
                        Promote <ArrowRight size={12} />
                      </button>
                    ) : yarn.stockStatus === 'Low' ? (
                      <button className="text-amber-600 hover:text-amber-700 font-medium text-xs flex items-center gap-1">
                        Restock <ArrowRight size={12} />
                      </button>
                    ) : (
                      <span className="text-zinc-400 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ label, count, color, icon: Icon, isAlert }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn(
        "p-6 rounded-[2rem] shadow-lg border flex items-center justify-between overflow-hidden relative group",
        isAlert ? "bg-white border-red-100" : "bg-white border-zinc-100"
      )}
    >
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity bg-gradient-to-br", color)} />
      
      <div>
        <div className="text-sm font-semibold text-zinc-500">{label}</div>
        <div className="text-3xl font-bold mt-2 text-zinc-900">{count}</div>
      </div>
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", color)}>
        <Icon size={24} />
      </div>
    </motion.div>
  );
}
