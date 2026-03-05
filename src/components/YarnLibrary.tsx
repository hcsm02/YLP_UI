import React, { useState } from 'react';
import { useData } from '@/data/DataContext';
import { Search, Filter, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function YarnLibrary() {
  const { yarns } = useData();
  const [filter, setFilter] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredYarns = yarns.filter(y => {
    const matchesSearch = 
      y.name.toLowerCase().includes(filter.toLowerCase()) || 
      y.code.toLowerCase().includes(filter.toLowerCase());
    const matchesTag = activeTag ? y.tags.includes(activeTag as any) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Library</h1>
          <p className="text-zinc-500 mt-2 text-lg">Manage and explore yarn specifications</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search yarn code or name..." 
              className="pl-12 pr-6 py-4 rounded-full border-none bg-white shadow-lg shadow-zinc-200/50 focus:ring-2 focus:ring-indigo-500/20 w-full md:w-80 transition-all outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <button className="p-4 bg-white rounded-full shadow-lg shadow-zinc-200/50 hover:bg-zinc-50 text-zinc-600 transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar">
        <button 
          onClick={() => setActiveTag(null)}
          className={cn(
            "px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm",
            activeTag === null 
              ? "bg-zinc-900 text-white shadow-zinc-900/20 scale-105" 
              : "bg-white text-zinc-600 hover:bg-zinc-50"
          )}
        >
          All Yarns
        </button>
        {['Core', 'Critical', 'Pressure'].map(tag => (
          <button 
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={cn(
              "px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 shadow-sm",
              activeTag === tag 
                ? "bg-indigo-500 text-white shadow-indigo-500/30 scale-105" 
                : "bg-white text-zinc-600 hover:bg-zinc-50"
            )}
          >
            <Tag size={16} />
            {tag}
          </button>
        ))}
      </div>

      {/* Data Grid */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-white/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50/50 border-b border-zinc-100">
              <tr>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500 uppercase tracking-wider text-xs">Code / Name</th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500 uppercase tracking-wider text-xs">Composition</th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500 uppercase tracking-wider text-xs">Spec</th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500 uppercase tracking-wider text-xs">Stock</th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500 uppercase tracking-wider text-xs">Tags</th>
                <th className="px-4 lg:px-8 py-4 lg:py-6 font-semibold text-zinc-500 uppercase tracking-wider text-xs text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {filteredYarns.map((yarn) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={yarn.id} 
                  className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                >
                  <td className="px-4 lg:px-8 py-4 lg:py-6">
                    <div className="font-bold text-zinc-900 text-base">{yarn.code}</div>
                    <div className="text-zinc-500 text-xs mt-1">{yarn.name}</div>
                  </td>
                  <td className="px-4 lg:px-8 py-4 lg:py-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-zinc-100 text-zinc-700 font-medium text-xs">
                      {yarn.composition}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-zinc-700">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{yarn.count}</span>
                      <span className="text-xs text-zinc-400">{yarn.craft}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        yarn.stockStatus === 'Stagnant' ? "bg-red-500" :
                        yarn.stockStatus === 'Low' ? "bg-amber-500" : "bg-emerald-500"
                      )} />
                      <span className={cn(
                        "font-mono font-bold text-base",
                        yarn.stockStatus === 'Stagnant' ? "text-red-600" : "text-zinc-900"
                      )}>
                        {yarn.stockLevel.toLocaleString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2 flex-wrap">
                      {yarn.tags.map(tag => (
                        <span key={tag} className={cn(
                          "px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider border",
                          tag === 'Core' ? "bg-blue-50 text-blue-600 border-blue-100" :
                          tag === 'Critical' ? "bg-purple-50 text-purple-600 border-purple-100" :
                          "bg-orange-50 text-orange-600 border-orange-100"
                        )}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-mono font-bold text-zinc-900">
                    ¥{yarn.pricePerKg.toFixed(2)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredYarns.length === 0 && (
          <div className="p-20 text-center text-zinc-400 flex flex-col items-center gap-4">
            <Search size={48} className="opacity-20" />
            <p>No yarns found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
