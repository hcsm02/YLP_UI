import React, { useState } from 'react';
import { useData } from '@/data/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { ArrowRight, Box, Layers, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function Analysis() {
  const { yarns, products } = useData();
  const [selectedYarnId, setSelectedYarnId] = useState<string | null>(null);

  const selectedYarn = yarns.find(y => y.id === selectedYarnId);
  const relatedProducts = selectedYarn 
    ? products.filter(p => p.yarnIds.includes(selectedYarn.id))
    : [];

  // Data for charts
  const consumptionData = yarns
    .map(y => ({ name: y.code, value: y.totalConsumption }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const usageData = yarns
    .map(y => ({ name: y.code, value: y.relatedProductCount }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F59E0B'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Analysis</h1>
        <p className="text-zinc-500 mt-2 text-lg">Deep dive into yarn usage and product relationships</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Yarn List */}
        <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl shadow-zinc-200/50 overflow-hidden flex flex-col h-[400px] lg:h-[700px]">
          <div className="p-6 lg:p-8 border-b border-zinc-100 bg-zinc-50/30">
            <h2 className="text-xl font-bold text-zinc-900">Yarn List</h2>
            <p className="text-sm text-zinc-500 mt-1">Select to view details</p>
          </div>
          <div className="overflow-y-auto flex-1 custom-scrollbar p-4 space-y-2">
            {yarns.map(yarn => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={yarn.id}
                onClick={() => setSelectedYarnId(yarn.id)}
                className={cn(
                  "p-5 rounded-[1.5rem] cursor-pointer transition-all border",
                  selectedYarnId === yarn.id 
                    ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-900/20" 
                    : "bg-white border-zinc-100 text-zinc-900 hover:border-zinc-300"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-base">{yarn.code}</div>
                    <div className={cn("text-xs mt-1", selectedYarnId === yarn.id ? "text-zinc-400" : "text-zinc-500")}>{yarn.name}</div>
                  </div>
                  {yarn.isFlagship && (
                    <Star size={16} className={cn("fill-current", selectedYarnId === yarn.id ? "text-amber-400" : "text-amber-400")} />
                  )}
                </div>
                <div className={cn("mt-4 flex items-center gap-4 text-xs font-medium", selectedYarnId === yarn.id ? "text-zinc-400" : "text-zinc-500")}>
                  <div className="flex items-center gap-1.5">
                    <Box size={14} />
                    <span>{yarn.relatedProductCount} Products</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers size={14} />
                    <span>{yarn.totalConsumption.toLocaleString()}kg</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detail View */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl shadow-zinc-200/50 p-8 min-h-[240px]">
            {selectedYarn ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
                      {selectedYarn.code}
                      {selectedYarn.isFlagship && (
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider">Flagship</span>
                      )}
                    </h2>
                    <p className="text-zinc-500 mt-2 text-lg">{selectedYarn.name} • {selectedYarn.composition}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-mono font-bold text-indigo-600 tracking-tight">{selectedYarn.totalConsumption.toLocaleString()} <span className="text-lg text-zinc-400 font-sans font-medium">kg</span></div>
                    <div className="text-sm font-medium text-zinc-400 mt-1">Total Consumption</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Box size={16} />
                    Related Products ({relatedProducts.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedProducts.map(product => (
                      <div key={product.id} className="p-4 rounded-[1.25rem] border border-zinc-100 bg-white shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                          <div className="font-bold text-zinc-900">{product.code}</div>
                          <div className="text-xs text-zinc-500 mt-0.5">{product.name}</div>
                        </div>
                        {product.isFlagship && (
                          <span className="w-2 h-2 rounded-full bg-amber-400" />
                        )}
                      </div>
                    ))}
                    {relatedProducts.length === 0 && (
                      <div className="text-zinc-400 text-sm italic col-span-2 py-4 text-center bg-zinc-50 rounded-2xl">No related products found</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
                  <Box size={32} className="opacity-40" />
                </div>
                <p className="font-medium">Select a yarn from the list to view details</p>
              </div>
            )}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl shadow-zinc-200/50 p-8">
              <h3 className="text-lg font-bold text-zinc-900 mb-6">Top Consumption (kg)</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={consumptionData} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F4F4F5" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={80} 
                      tick={{fontSize: 11, fill: '#71717A', fontWeight: 500}} 
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      cursor={{fill: '#F4F4F5', radius: 8}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" fill="#6366F1" radius={[0, 6, 6, 0]} barSize={24}>
                      {consumptionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl shadow-zinc-200/50 p-8">
              <h3 className="text-lg font-bold text-zinc-900 mb-6">Usage Frequency</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {usageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" wrapperStyle={{fontSize: '11px', fontWeight: 500}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
