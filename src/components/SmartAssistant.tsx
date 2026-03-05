import React, { useState } from 'react';
import { useData } from '@/data/DataContext';
import { Send, Bot, User, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: React.ReactNode;
  timestamp: Date;
}

export function SmartAssistant() {
  const { yarns, searchYarns } = useData();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am your YPL Assistant. Ask me about yarn stock, product associations, or recommendations.',
      timestamp: new Date()
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response logic
    setTimeout(() => {
      let responseContent: React.ReactNode = "I'm sorry, I didn't catch that.";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('stock') || lowerInput.includes('stagnant')) {
        const stagnant = yarns.filter(y => y.stockStatus === 'Stagnant');
        responseContent = (
          <div className="space-y-3">
            <p>Found {stagnant.length} stagnant yarns (high inventory pressure):</p>
            <ul className="space-y-2 mt-2">
              {stagnant.map(y => (
                <li key={y.id} className="bg-white/50 p-3 rounded-xl border border-red-100 shadow-sm flex justify-between items-center">
                  <div>
                    <div className="font-bold text-zinc-900">{y.code}</div>
                    <div className="text-xs text-zinc-500">{y.name}</div>
                  </div>
                  <span className="text-red-600 font-mono font-bold text-sm">{y.stockLevel}kg</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-zinc-500 mt-2">Recommendation: Prioritize these for new product development.</p>
          </div>
        );
      } else if (lowerInput.includes('recommend') || lowerInput.includes('cotton')) {
        const cottons = yarns.filter(y => y.composition.includes('Cotton') && y.stockStatus !== 'Low');
        responseContent = (
          <div className="space-y-3">
            <p>Here are some recommended cotton yarns with sufficient stock:</p>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {cottons.slice(0, 3).map(y => (
                <div key={y.id} className="bg-white/50 p-3 rounded-xl border border-zinc-200 hover:border-indigo-300 transition-colors cursor-pointer group">
                  <div className="flex justify-between">
                    <span className="font-bold text-indigo-600 group-hover:underline">{y.code}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold uppercase">In Stock</span>
                  </div>
                  <div className="text-sm text-zinc-700 mt-1">{y.name}</div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-zinc-500 font-medium">
                    <span>¥{y.pricePerKg}/kg</span>
                    <span>•</span>
                    <span>{y.craft}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      } else {
        responseContent = "I received your query. As a demo assistant, I currently support basic stock queries and recommendations. Try asking: 'Which yarns are stagnant?'";
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="h-[calc(100dvh-8rem)] lg:h-[calc(100vh-4rem)] flex flex-col bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl shadow-zinc-200/50 overflow-hidden relative">
      <div className="p-6 border-b border-zinc-100 bg-white/40 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Sparkles size={20} />
        </div>
        <div>
          <h2 className="font-bold text-zinc-900 text-lg">AI Assistant</h2>
          <p className="text-xs text-zinc-500 font-medium">Always here to help</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50/30 custom-scrollbar">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md",
              msg.role === 'user' ? "bg-zinc-900 text-white" : "bg-white text-indigo-600 border border-indigo-100"
            )}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={cn(
              "p-5 rounded-[1.5rem] text-sm leading-relaxed shadow-sm",
              msg.role === 'user' 
                ? "bg-zinc-900 text-white rounded-tr-sm" 
                : "bg-white border border-zinc-100 text-zinc-800 rounded-tl-sm"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 bg-white/60 border-t border-zinc-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..."
            className="w-full pl-6 pr-14 py-4 rounded-full border-none bg-white shadow-lg shadow-zinc-200/50 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-zinc-800 placeholder:text-zinc-400"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {['Stagnant stock?', 'Recommend cotton yarns', 'Usage of C-32S-CM?'].map(q => (
            <button 
              key={q}
              onClick={() => {
                setInput(q);
              }}
              className="px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-100 text-zinc-600 text-xs font-bold rounded-full whitespace-nowrap transition-all shadow-sm hover:shadow"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
