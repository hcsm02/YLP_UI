import React from 'react';
import { useData } from '@/data/DataContext';
import { ArrowUpRight, ArrowDownRight, AlertTriangle, Package, Layers, TrendingUp, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export function Dashboard() {
  const { yarns } = useData();

  const stats = {
    totalYarns: yarns.length,
    totalStock: yarns.reduce((acc, y) => acc + y.stockLevel, 0),
    stagnantCount: yarns.filter(y => y.stockStatus === 'Stagnant').length,
    coreCount: yarns.filter(y => y.tags.includes('Core')).length,
  };

  const inventoryData = yarns.map(y => ({
    name: y.code,
    stock: y.stockLevel,
    status: y.stockStatus
  })).sort((a, b) => b.stock - a.stock).slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 tracking-tight">Overview</h1>
          <p className="text-zinc-500 mt-2 text-lg">Welcome back to YPL Platform</p>
        </div>
        <div className="text-sm font-medium text-zinc-400 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm border border-white/50">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Yarns" 
          value={stats.totalYarns} 
          icon={Package} 
          trend="+2 this month" 
          trendUp={true}
          variant="primary"
        />
        <StatCard 
          title="Total Stock" 
          value={`${(stats.totalStock / 1000).toFixed(1)}k`}
          unit="kg"
          icon={Layers} 
          trend="-5% vs last month" 
          trendUp={false}
          variant="white"
        />
        <StatCard 
          title="Stagnant" 
          value={stats.stagnantCount} 
          icon={AlertTriangle} 
          alert={stats.stagnantCount > 0}
          subtext="Requires attention"
          variant="danger"
        />
        <StatCard 
          title="Core Yarns" 
          value={stats.coreCount} 
          icon={TrendingUp} 
          subtext="High frequency"
          variant="white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Chart */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-white/60">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-zinc-900">Top Inventory</h2>
            <button className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F4F4F5" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tick={{fontSize: 13, fill: '#71717A', fontWeight: 500}} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: '#F4F4F5', radius: 8}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="stock" radius={[0, 8, 8, 0]} barSize={40}>
                  {inventoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.status === 'Stagnant' ? '#FF6B6B' : 'url(#colorGradient)'} 
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts / Quick Actions */}
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 border border-white/60 flex flex-col">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Alerts</h2>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {yarns.filter(y => y.stockStatus === 'Stagnant' || y.stockStatus === 'Low').slice(0, 5).map(yarn => (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                key={yarn.id} 
                className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white border border-zinc-100 shadow-sm"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  yarn.stockStatus === 'Stagnant' ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
                )}>
                  <AlertTriangle size={20} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-zinc-900 truncate">{yarn.code}</div>
                  <div className={cn(
                    "text-xs font-bold mt-0.5 uppercase tracking-wide",
                    yarn.stockStatus === 'Stagnant' ? "text-red-500" : "text-amber-500"
                  )}>
                    {yarn.stockStatus === 'Stagnant' ? 'Stagnant Stock' : 'Low Stock'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 rounded-[1.25rem] bg-zinc-900 text-white font-semibold hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20">
            Check Inventory
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, unit, icon: Icon, trend, trendUp, alert, subtext, variant = 'white' }: any) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn(
        "p-8 rounded-[2.5rem] shadow-xl border relative overflow-hidden group",
        isPrimary ? "bg-gradient-to-br from-orange-300 to-amber-200 border-orange-200/50 shadow-orange-200/50 text-zinc-900" :
        isDanger ? "bg-gradient-to-br from-red-500 to-pink-600 border-red-400/50 shadow-red-200/50 text-white" :
        "bg-white/80 backdrop-blur-xl border-white/60 shadow-zinc-200/50 text-zinc-900"
      )}
    >
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl opacity-40 transition-transform group-hover:scale-110",
        isPrimary ? "bg-white" : isDanger ? "bg-black" : "bg-indigo-200"
      )} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className={cn(
            "p-3 rounded-2xl",
            isPrimary ? "bg-white/30 text-zinc-900" : 
            isDanger ? "bg-white/20 text-white" : 
            "bg-zinc-100 text-zinc-600"
          )}>
            <Icon size={24} strokeWidth={2.5} />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-bold px-2 py-1 rounded-full",
              isPrimary ? "bg-white/30 text-zinc-900" :
              isDanger ? "bg-white/20 text-white" :
              trendUp ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            )}>
              {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trend}
            </div>
          )}
        </div>
        <div className="flex items-baseline gap-1">
          <div className="text-4xl font-bold tracking-tight">{value}</div>
          {unit && <div className={cn("text-lg font-medium opacity-60")}>{unit}</div>}
        </div>
        <div className={cn("text-sm font-medium mt-1 opacity-60")}>{title}</div>
        {subtext && <div className={cn("text-xs font-medium mt-2 opacity-40")}>{subtext}</div>}
      </div>
    </motion.div>
  );
}
