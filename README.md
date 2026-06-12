# npx create-react-app trademind-ai
cd trademind-ai
npm install tailwindcss @heroicons/react framer-motion zustand react-chartjs-2 chart.js react-router-dom
npx tailwindcss init -p
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00F5FF",
          green: "#39FF14",
          pink: "#FF2D55",
          gold: "#FFD700",
        },
        dark: {
          bg: "#0A0A0F",
          card: "rgba(15, 15, 25, 0.7)",
        },
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0A0A0F;
  font-family: 'Space Grotesk', sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #1a1a2e;
}
::-webkit-scrollbar-thumb {
  background: #00F5FF;
  border-radius: 10px;
}

/* Glassmorphism helper */
.glass {
  background: rgba(15, 15, 25, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 245, 255, 0.2);
}

.glass-card {
  background: rgba(15, 15, 25, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 245, 255, 0.15);
  transition: all 0.3s ease;
}
.glass-card:hover {
  border-color: rgba(0, 245, 255, 0.5);
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.1);
}

/* Grid background */
.grid-bg {
  background-image: 
    linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Pages (we'll create these)
import Dashboard from './pages/Dashboard';
import AIBot from './pages/AIBot';
import LearningHub from './pages/LearningHub';
import TradeJournal from './pages/TradeJournal';
import Tools from './pages/Tools';

// Icons
import { 
  HomeIcon, 
  SparklesIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  ClipboardDocumentListIcon,
  CalculatorIcon,
  NewspaperIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'AI Bot', path: '/ai-bot', icon: SparklesIcon },
  { name: 'Charts', path: '/charts', icon: ChartBarIcon },
  { name: 'Learn', path: '/learn', icon: BookOpenIcon },
  { name: 'Journal', path: '/journal', icon: ClipboardDocumentListIcon },
  { name: 'Tools', path: '/tools', icon: CalculatorIcon },
  { name: 'News', path: '/news', icon: NewspaperIcon },
  { name: 'Profile', path: '/profile', icon: UserCircleIcon },
];

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-dark-bg grid-bg text-white flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 260 }}
        animate={{ width: sidebarOpen ? 260 : 80 }}
        className="glass border-r border-neon-cyan/20 h-screen fixed left-0 top-0 z-50 overflow-hidden"
      >
        <div className="p-4 border-b border-neon-cyan/20">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'} bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent`}>
              TradeMind AI
            </h1>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>
        
        <nav className="p-3 space-y-2">
          {navItems.map((item) => (
            <Link to={item.path} key={item.name}>
              <motion.div 
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                  location.pathname === item.path 
                    ? 'bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan' 
                    : 'hover:bg-white/5 text-gray-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </motion.div>
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-500">
          {sidebarOpen && <p>⚠️ Educational Only</p>}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[260px]' : 'ml-[80px]'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ai-bot" element={<AIBot />} />
            <Route path="/learn" element={<LearningHub />} />
            <Route path="/journal" element={<TradeJournal />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/charts" element={<div className="p-6"><h1>Charts Page (TradingView embed here)</h1></div>} />
            <Route path="/news" element={<div className="p-6"><h1>News Page</h1></div>} />
            <Route path="/profile" element={<div className="p-6"><h1>Profile Page</h1></div>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const mockMarketData = [
  { name: 'NIFTY 50', price: 22450, change: 0.85 },
  { name: 'SENSEX', price: 73800, change: 0.72 },
  { name: 'BANK NIFTY', price: 48200, change: -0.23 },
];

const mockSignals = [
  { stock: 'RELIANCE', entry: 2850, sl: 2780, target: 2980, confidence: 87, time: '09:45', type: 'BUY' },
  { stock: 'HDFC BANK', entry: 1680, sl: 1640, target: 1750, confidence: 76, time: '10:15', type: 'BUY' },
  { stock: 'TATA MOTORS', entry: 980, sl: 960, target: 1020, confidence: 82, time: '09:30', type: 'SELL' },
];

export default function Dashboard() {
  const [time, setTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState('OPEN');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 text-sm">Welcome back, Trader</p>
        </div>
        <div className="glass px-4 py-2 rounded-xl">
          <span className={`${marketStatus === 'OPEN' ? 'text-neon-green' : 'text-neon-pink'} font-bold`}>
            {marketStatus}
          </span>
          <span className="ml-3 text-gray-300 font-mono">
            {time.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Market Overview Bar */}
      <div className="glass-card rounded-xl p-4 mb-6 overflow-x-auto">
        <div className="flex gap-6">
          {mockMarketData.map((item) => (
            <div key={item.name} className="flex items-center gap-4">
              <span className="font-bold">{item.name}</span>
              <span className="font-mono">₹{item.price.toLocaleString()}</span>
              <span className={`${item.change >= 0 ? 'text-neon-green' : 'text-neon-pink'} font-bold`}>
                {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.change)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Today's Best Setup", value: "RELIANCE", sub: "Breakout", color: "neon-cyan" },
          { label: "AI Confidence", value: "84%", sub: "+12% vs yesterday", color: "neon-green" },
          { label: "Signals Generated", value: "18", sub: "Today", color: "neon-gold" },
          { label: "Active Trades", value: "3", sub: "2 profitable", color: "neon-pink" },
        ].map((card, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass-card rounded-xl p-4 border-l-4"
            style={{ borderLeftColor: `#${card.color === 'neon-cyan' ? '00F5FF' : card.color === 'neon-green' ? '39FF14' : card.color === 'neon-gold' ? 'FFD700' : 'FF2D55'}` }}
          >
            <p className="text-gray-400 text-sm">{card.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
            <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* AI Signals Feed */}
      <div className="glass-card rounded-xl p-4">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-neon-cyan rounded-full animate-pulse"></span>
          Recent AI Signals
        </h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {mockSignals.map((signal, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  signal.type === 'BUY' ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-pink/20 text-neon-pink'
                }`}>
                  {signal.type}
                </span>
                <span className="font-bold">{signal.stock}</span>
              </div>
              <div className="flex gap-6 text-sm">
                <span>Entry: ₹{signal.entry}</span>
                <span>SL: ₹{signal.sl}</span>
                <span>Target: ₹{signal.target}</span>
                <span className="text-neon-cyan">{signal.confidence}% conf</span>
                <span className="text-gray-500">{signal.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}wimport React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/solid';

export default function AIBot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI trading assistant. Ask me about any stock or trading concept!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Mock AI response (replace with actual Claude API call)
    setTimeout(() => {
      const mockResponse = {
        role: 'assistant',
        content: `📊 **Analysis for ${input.toUpperCase()}**\n\n• RSI: 65 (Neutral zone)\n• Support: ₹2450 | Resistance: ₹2750\n• 50-day EMA showing uptrend\n• Volume: Above average\n\n**Recommendation:** Wait for breakout above ₹2750 with volume confirmation. ⚠️ Educational only.`
      };
      setMessages(prev => [...prev, mockResponse]);
      setLoading(false);
    }, 1500);
  };

  // Mock AI Setups Generator
  const [setups, setSetups] = useState([]);
  const generateSetups = () => {
    const mockSetups = [
      { stock: 'RELIANCE', pattern: 'Bull Flag', entry: '2850-2870', sl: '2780', target1: '2950', target2: '3050', rr: '1:3', confidence: 87 },
      { stock: 'HDFC BANK', pattern: 'Support Bounce', entry: '1660-1675', sl: '1630', target1: '1720', target2: '1760', rr: '1:2', confidence: 79 },
      { stock: 'INFY', pattern: 'Breakout', entry: '1620-1630', sl: '1590', target1: '1680', target2: '1740', rr: '1:2.5', confidence: 84 },
      { stock: 'TATAMOTORS', pattern: 'VWAP Pullback', entry: '965-975', sl: '950', target1: '1000', target2: '1025', rr: '1:2', confidence: 76 },
    ];
    setSetups(mockSetups);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🤖 AI Trading Bot</h1>
      
      {/* Daily Setup Generator */}
      <div className="glass-card rounded-xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neon-cyan">Daily Setup Generator</h2>
          <button
            onClick={generateSetups}
            className="px-4 py-2 bg-neon-cyan/20 border border-neon-cyan rounded-lg hover:bg-neon-cyan/30 transition"
          >
            Generate Today's Setups
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {setups.map((setup, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-neon-cyan/20 rounded-lg p-4 hover:border-neon-cyan/60 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold">{setup.stock}</h3>
                <span className="text-xs px-2 py-1 bg-neon-cyan/20 rounded text-neon-cyan">{setup.confidence}%</span>
              </div>
              <p className="text-sm text-gray-300">{setup.pattern}</p>
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div>Entry: {setup.entry}</div>
                <div>SL: {setup.sl}</div>
                <div>R:R: {setup.rr}</div>
                <div>T1: {setup.target1}</div>
                <div>T2: {setup.target2}</div>
              </div>
            </motion.div>
          ))}
        </div>
        {setups.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Click "Generate Today's Setups" to get AI-powered trade ideas
          </div>
        )}
      </div>

      {/* Signal Scanner */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-xl font-bold mb-4 text-neon-green">Signal Scanner</h2>
        <div className="flex gap-4 mb-4 flex-wrap">
          <select className="bg-black/50 border border-gray-700 rounded-lg p-2 text-sm">
            <option>All Sectors</option>
            <option>Banking</option>
            <option>IT</option>
            <option>Auto</option>
          </select>
          <button className="px-3 py-2 bg-neon-green/20 border border-neon-green rounded-lg text-sm">
            🔄 Auto-refresh (5min)
          </button>
        </div>
        <div className="space-y-2">
          {['RELIANCE - Bullish Breakout', 'HDFC - RSI Oversold', 'ICICI - Volume Spike'].map((signal, i) => (
            <div key={i} className="p-3 bg-white/5 rounded-lg flex justify-between">
              <span>{signal}</span>
              <span className="text-neon-green text-sm">New</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat Assistant Floating Button */}
      <>
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-neon-cyan to-neon-green shadow-lg flex items-center justify-center z-50 hover:scale-110 transition"
          >
            <SparklesIcon className="w-6 h-6 text-black" />
          </button>
        )}

        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-6 right-6 w-96 h-[500px] glass rounded-xl shadow-2xl z-50 flex flex-col border border-neon-cyan/30"
            >
              <div className="p-3 border-b border-neon-cyan/20 flex justify-between items-center">
                <h3 className="font-bold text-neon-cyan">AI Trading Assistant</h3>
                <button onClick={() => setChatOpen(false)}>
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`inline-block p-3 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'bg-neon-cyan/20 text-white' : 'bg-white/10 text-gray-200'}`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-left">
                    <div className="inline-block p-3 rounded-xl bg-white/10">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-100"></span>
                        <span className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce delay-200"></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-neon-cyan/20 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about stocks, patterns, or strategies..."
                  className="flex-1 bg-black/50 border border-gray-700 rounded-lg p-2 text-sm focus:outline-none focus:border-neon-cyan"
                />
                <button onClick={handleSend} className="p-2 bg-neon-cyan/20 rounded-lg">
                  <PaperAirplaneIcon className="w-4 h-4 text-neon-cyan" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    </div>
  );
}

// Icon import fix
function SparklesIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 6.75l-.813 2.846a4.5 4.5 0 01-3.09 3.09L11.25 13.5l2.846.813a4.5 4.5 0 013.09 3.09L18.25 20.25l.813-2.846a4.5 4.5 0 013.09-3.09L24.75 12l-2.846-.813a4.5 4.5 0 01-3.09-3.09L18.25 6.75z" />
    </svg>
  );
}import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TradeJournal() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({
    stock: '', date: '', entry: '', exit: '', quantity: 1, notes: '', emotion: 'neutral'
  });

  useEffect(() => {
    const saved = localStorage.getItem('trades');
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  const saveTrades = (newTrades) => {
    setTrades(newTrades);
    localStorage.setItem('trades', JSON.stringify(newTrades));
  };

  const addTrade = () => {
    const pnl = (form.exit - form.entry) * form.quantity;
    const newTrade = { ...form, pnl, id: Date.now() };
    saveTrades([...trades, newTrade]);
    setForm({ stock: '', date: '', entry: '', exit: '', quantity: 1, notes: '', emotion: 'neutral' });
  };

  const totalPnl = trades.reduce((sum, t) => sum + t.pnl, 0);
  const winRate = trades.length ? (trades.filter(t => t.pnl > 0).length / trades.length * 100).toFixed(1) : 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📓 Trade Journal</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total P&L</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-neon-green' : 'text-neon-pink'}`}>
            ₹{totalPnl.toLocaleString()}
          </p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Win Rate</p>
          <p className="text-2xl font-bold text-neon-cyan">{winRate}%</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total Trades</p>
          <p className="text-2xl font-bold">{trades.length}</p>
        </div>
        <div className="glass-card p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Best Trade</p>
          <p className="text-2xl font-bold text-neon-green">
            ₹{Math.max(...trades.map(t => t.pnl), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Add Trade Form */}
      <div className="glass-card rounded-xl p-5 mb-6">
        <h2 className="text-lg font-bold mb-3">Add New Trade</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input type="text" placeholder="Stock" className="bg-black/50 border border-gray-700 rounded-lg p-2 text-sm" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
          <input type="date" className="bg-black/50 border border-gray-700 rounded-lg p-2 text-sm" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          <input type="number" placeholder="Entry Price" className="bg-black/50 border border-gray-700 rounded-lg p-2 text-sm" value={form.entry} onChange={e => setForm({...form, entry: parseFloat(e.target.value)})} />
          <input type="number" placeholder="Exit Price" className="bg-black/50 border border-gray-700 rounded-lg p-2 text-sm" value={form.exit} onChange={e => setForm({...form, exit: parseFloat(e.target.value)})} />
          <input type="number" placeholder="Quantity" className="bg-black/50 border border-gray-700 rounded-lg p-2 text-sm" value={form.quantity} onChange={e => setForm({...form, quantity: parseInt(e.target.value)})} />
          <select className="bg-black/50 border border-gray-700 rounded-lg p-2 text-sm" value={form.emotion} onChange={e => setForm({...form, emotion: e.target.value})}>
            <option>neutral</option>
            <option>confident</option>
            <option>fearful</option>
            <option>greedy</option>
          </select>
          <input type="text" placeholder="Notes" className="bg-black/50 border border-gray-700 rounded-lg p-2 text-sm col-span-2" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
        </div>
        <button onClick={addTrade} className="mt-3 px-4 py-2 bg-neon-cyan/20 border border-neon-cyan rounded-lg w-full">Save Trade</button>
      </div>

      {/* Trades Table */}
      <div className="glass-card rounded-xl p-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-700">
            <tr className="text-left text-gray-400">
              <th className="p-2">Stock</th><th>Date</th><th>Entry</th><th>Exit</th><th>Qty</th><th>P&L</th><th>Emotion</th>
            </tr>
          </thead>
          <tbody>
            {trades.slice().reverse().map(trade => (
              <tr key={trade.id} className="border-b border-gray-800">
                <td className="p-2 font-bold">{trade.stock}</td>
                <td>{trade.date}</td><td>₹{trade.entry}</td><td>₹{trade.exit}</td><td>{trade.quantity}</td>
                <td className={trade.pnl >= 0 ? 'text-neon-green' : 'text-neon-pink'}>₹{trade.pnl}</td>
                <td>{trade.emotion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}import React, { useState } from 'react';

const videos = [
  { title: "Complete Stock Market Course for Beginners", channel: "Trading Lab", duration: "45:23", category: "basics" },
  { title: "Technical Analysis Masterclass", channel: "Chartology", duration: "1:12:00", category: "technical" },
  { title: "Candlestick Patterns Every Trader Must Know", channel: "Market Mind", duration: "28:15", category: "basics" },
];

export default function LearningHub() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('basics');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">📚 Zero to Hero Learning Hub</h1>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-6">
        <div className="bg-neon-cyan h-2 rounded-full" style={{ width: '15%' }}></div>
        <p className="text-xs text-gray-400 mt-1">15% complete • 3/20 lessons done</p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['basics', 'technical', 'options', 'psychology'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg ${activeTab === tab ? 'bg-neon-cyan/30 border border-neon-cyan' : 'bg-white/5'}`}>
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videos.filter(v => v.category === activeTab).map((video, i) => (
          <div key={i} className="glass-card rounded-xl p-4 flex gap-3 cursor-pointer hover:border-neon-cyan transition" onClick={() => setSelectedVideo(video)}>
            <div className="w-32 h-24 bg-gradient-to-br from-neon-cyan to-neon-green rounded-lg flex items-center justify-center">📺</div>
            <div><h3 className="font-bold">{video.title}</h3><p className="text-sm text-gray-400">{video.channel} • {video.duration}</p></div>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedVideo(null)}>
          <div className="glass p-4 rounded-xl w-96" onClick={e => e.stopPropagation()}>
            <himport React, { useState } from 'react';

export default function Tools() {
  const [posSize, setPosSize] = useState({ capital: 100000, riskPercent: 2, entry: 100, sl: 95 });
  const positionSize = (posSize.capital * (posSize.riskPercent / 100)) / (posSize.entry - posSize.sl);

  const [rr, setRr] = useState({ entry: 100, sl: 95, target: 110 });
  const risk = rr.entry - rr.sl;
  const reward = rr.target - rr.entry;
  const rrRatio = (reward / risk).toFixed(2);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🧮 Trading Calculators</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Position Size Calculator */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-bold text-neon-cyan mb-3">Position Size Calculator</h2>
          <div className="space-y-3">
            <input type="number" placeholder="Capital (₹)" className="w-full bg-black/50 border border-gray-700 rounded-lg p-2" value={posSize.capital} onChange={e => setPosSize({...posSize, capital: +e.target.value})} />
            <input type="number" placeholder="Risk %" className="w-full bg-black/50 border border-gray-700 rounded-lg p-2" value={posSize.riskPercent} onChange={e => setPosSize({...posSize, riskPercent: +e.target.value})} />
            <input type="number" placeholder="Entry Price" className="w-full bg-black/50 border border-gray-700 rounded-lg p-2" value={posSize.entry} onChange={e => setPosSize({...posSize, entry: +e.target.value})} />
            <input type="number" placeholder="Stop Loss" className="w-full bg-black/50 border border-gray-700 rounded-lg p-2" value={posSize.sl} onChange={e => setPosSize({...posSize, sl: +e.target.value})} />
            <div className="p-3 bg-neon-cyan/10 rounded-lg">
              <p className="text-sm text-gray-300">Position Size: <span className="text-neon-cyan font-bold">{Math.floor(positionSize)} shares</span></p>
              <p className="text-sm text-gray-300">Max Loss: ₹{(posSize.capital * posSize.riskPercent / 100).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Risk/Reward Calculator */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="text-lg font-bold text-neon-green mb-3">Risk:Reward Calculator</h2>
          <div className="space-y-3">
            <input type="number" placeholder="Entry" className="w-full bg-black/50 border border-gray-700 rounded-lg p-2" value={rr.entry} onChange={e => setRr({...rr, entry: +e.target.value})} />
            <input type="number" placeholder="Stop Loss" className="w-full bg-black/50 border border-gray-700 rounded-lg p-2" value={rr.sl} onChange={e => setRr({...rr, sl: +e.target.value})} />
            <input type="number" placeholder="Target" className="w-full bg-black/50 border border-gray-700 rounded-lg p-2" value={rr.target} onChange={e => setRr({...rr, target: +e.target.value})} />
            <div className="p-3 bg-neon-green/10 rounded-lg">
              <p className="text-sm">Risk: ₹{risk.toFixed(2)} | Reward: ₹{reward.toFixed(2)}</p>
              <p className="text-xl font-bold text-neon-green">R:R = 1:{rrRatio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
