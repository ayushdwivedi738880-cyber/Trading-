import { useState, useEffect, useRef } from "react";

// ─── Fake Data ───────────────────────────────────────────────────────────────
const STOCKS = ["RELIANCE","TCS","INFY","HDFC","ICICIBANK","SBIN","WIPRO","AXISBANK","BAJFINANCE","HCLTECH"];
const SECTORS = ["Banking","IT","Energy","Pharma","Auto","FMCG"];
const PATTERNS = ["Bullish Engulfing","Cup & Handle","Double Bottom","RSI Oversold","MACD Crossover","Breakout","Hammer","Morning Star","Head & Shoulders","Flag Pattern"];
const EMOTIONS = ["Confident","Greedy","Fearful","Calm","FOMO","Disciplined"];

function rnd(min, max, dec=2) { return +(Math.random()*(max-min)+min).toFixed(dec); }
function randItem(arr) { return arr[Math.floor(Math.random()*arr.length)]; }

function generateSignals(n=8) {
  return Array.from({length:n}, (_,i) => {
    const entry = rnd(200,3000);
    const sl = +(entry * (1 - rnd(0.01,0.04))).toFixed(2);
    const t1 = +(entry * (1 + rnd(0.02,0.06))).toFixed(2);
    const t2 = +(entry * (1 + rnd(0.06,0.12))).toFixed(2);
    return {
      id: i, stock: randItem(STOCKS), pattern: randItem(PATTERNS),
      entry, sl, t1, t2,
      rr: ((t1-entry)/(entry-sl)).toFixed(1),
      conf: rnd(62,97,0),
      type: Math.random()>0.4?"BUY":"SELL",
      time: `${rnd(9,15,0)}:${String(rnd(0,59,0)).padStart(2,'0')}`,
      sector: randItem(SECTORS)
    };
  });
}

function generateCandles(n=60) {
  let price = 19800;
  return Array.from({length:n}, (_,i) => {
    const o = price;
    const change = rnd(-150,150);
    const c = +(o+change).toFixed(0);
    const h = +(Math.max(o,c)+rnd(10,80)).toFixed(0);
    const l = +(Math.min(o,c)-rnd(10,80)).toFixed(0);
    const v = rnd(50,200,0)*1000;
    price = c;
    const d = new Date(2024,0,i+1);
    return { date:`${d.getDate()}/${d.getMonth()+1}`, o, h, l, c, v };
  });
}

const NEWS_DATA = [
  {id:1,title:"RBI keeps repo rate unchanged at 6.5%, signals pause in rate cycle",sentiment:"bullish",sector:"Banking",time:"2h ago",impact:"HIGH"},
  {id:2,title:"IT sector faces headwinds as US recession fears resurface",sentiment:"bearish",sector:"IT",time:"3h ago",impact:"MEDIUM"},
  {id:3,title:"Reliance Industries announces ₹75,000 Cr capex plan for next 3 years",sentiment:"bullish",sector:"Energy",time:"4h ago",impact:"HIGH"},
  {id:4,title:"Auto sales hit record high in May; Maruti leads with 35% growth",sentiment:"bullish",sector:"Auto",time:"5h ago",impact:"MEDIUM"},
  {id:5,title:"FII outflows continue for 5th consecutive session; ₹4,200 Cr sold",sentiment:"bearish",sector:"Market",time:"6h ago",impact:"HIGH"},
  {id:6,title:"Pharma stocks rally as US FDA clears Sun Pharma facility",sentiment:"bullish",sector:"Pharma",time:"7h ago",impact:"MEDIUM"},
];

const YT_VIDEOS = {
  Basics:[
    {id:"v1",title:"Stock Market Basics for Beginners | Hindi",channel:"Pushkar Raj Thakur",thumb:"📈",duration:"45:22",views:"8.2M"},
    {id:"v2",title:"How Stock Market Works | Complete Guide",channel:"CA Rachana Ranade",thumb:"💹",duration:"38:15",views:"5.1M"},
    {id:"v3",title:"Zerodha se Trading Kaise Kare | Step by Step",channel:"Abhishek Kar",thumb:"🏦",duration:"22:10",views:"3.4M"},
  ],
  "Technical Analysis":[
    {id:"v4",title:"Technical Analysis Masterclass | Free Course",channel:"Trading with Vivek",thumb:"📊",duration:"3:24:00",views:"2.8M"},
    {id:"v5",title:"Support & Resistance | Most Important Concept",channel:"Neeraj Joshi",thumb:"📉",duration:"31:45",views:"1.9M"},
    {id:"v6",title:"Candlestick Patterns Complete Guide | Hindi",channel:"CA Rachana Ranade",thumb:"🕯️",duration:"52:30",views:"4.2M"},
  ],
  Options:[
    {id:"v7",title:"Options Trading for Beginners | Zero to Hero",channel:"Pranjal Kamra",thumb:"⚡",duration:"1:12:00",views:"6.7M"},
    {id:"v8",title:"Call & Put Options Explained Simply",channel:"Akshat Shrivastava",thumb:"🎯",duration:"28:40",views:"3.1M"},
  ],
  Psychology:[
    {id:"v9",title:"Trading Psychology | Why 90% Traders Lose Money",channel:"Vivek Bajaj",thumb:"🧠",duration:"41:20",views:"2.3M"},
    {id:"v10",title:"How to Control Emotions in Trading",channel:"Power of Stocks",thumb:"💪",duration:"35:15",views:"1.7M"},
  ],
};

const GLOSSARY = [
  {term:"Support",def:"Price level where buying interest is strong enough to prevent further decline.",example:"NIFTY found support at 19,500"},
  {term:"Resistance",def:"Price level where selling pressure prevents further rise.",example:"BANK NIFTY has resistance at 45,000"},
  {term:"RSI",def:"Relative Strength Index — momentum oscillator (0-100). Below 30 = oversold, above 70 = overbought.",example:"RSI at 28 → potential buy"},
  {term:"MACD",def:"Moving Average Convergence Divergence. Bullish crossover = buy signal.",example:"MACD crossed above signal line"},
  {term:"Breakout",def:"Price moves above resistance with high volume — strong bullish signal.",example:"TCS broke out above ₹3,800"},
  {term:"Stop Loss",def:"Pre-set price to exit trade to limit losses. Never trade without SL!",example:"Entry ₹1,000 → SL ₹960"},
  {term:"VWAP",def:"Volume Weighted Average Price. Price above VWAP = bullish; below = bearish.",example:"Stock trading above VWAP"},
  {term:"OI",def:"Open Interest — total outstanding F&O contracts. Rising OI = strong trend.",example:"Nifty OI up 15% with price rise"},
];

const QUIZ_DATA = [
  {q:"RSI value below 30 indicates?",opts:["Overbought","Oversold","Neutral","Trending"],ans:1},
  {q:"Which pattern indicates a trend reversal at bottom?",opts:["Head & Shoulders","Double Top","Hammer","Doji"],ans:2},
  {q:"MACD stands for?",opts:["Mean Avg Conv Div","Moving Avg Conv Div","Market Avg Conv Div","Moving Avg Conv Diff"],ans:1},
  {q:"Good Risk:Reward ratio for a trade is?",opts:["1:1","1:2","1:0.5","2:1"],ans:1},
  {q:"FII stands for?",opts:["Foreign Institutional Investor","Federal Interest Index","Foreign Interest Index","Fund Institutional Investor"],ans:0},
];

// ─── Sparkline Component ──────────────────────────────────────────────────────
function Sparkline({ data, color="#00F5FF", height=40 }) {
  const min = Math.min(...data), max = Math.max(...data), range = max-min||1;
  const w=120, h=height;
  const pts = data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/range)*h}`).join(" ");
  return (
    <svg width={w} height={h} style={{overflow:"visible"}}>
      <defs>
        <linearGradient id={`sg${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts}/>
    </svg>
  );
}

// ─── Candlestick Chart ────────────────────────────────────────────────────────
function CandleChart({ candles }) {
  const w=800, h=280, pad=40;
  const prices = candles.flatMap(c=>[c.h,c.l]);
  const minP=Math.min(...prices), maxP=Math.max(...prices), rangeP=maxP-minP;
  const barW = (w-pad*2)/candles.length - 2;
  const py = v => pad + (1-(v-minP)/rangeP)*(h-pad*2);
  const px = i => pad + i*((w-pad*2)/candles.length) + barW/2;
  const maxV = Math.max(...candles.map(c=>c.v));

  return (
    <svg viewBox={`0 0 ${w} ${h+60}`} style={{width:"100%",height:"auto"}}>
      <defs>
        <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#00F5FF" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      {/* Grid lines */}
      {[0,0.25,0.5,0.75,1].map((t,i)=>(
        <line key={i} x1={pad} y1={pad+(1-t)*(h-pad*2)} x2={w-pad} y2={pad+(1-t)*(h-pad*2)}
          stroke="#ffffff08" strokeWidth="1"/>
      ))}
      {/* Price labels */}
      {[0,0.25,0.5,0.75,1].map((t,i)=>(
        <text key={i} x={pad-5} y={pad+(1-t)*(h-pad*2)+4} fill="#ffffff40" fontSize="9" textAnchor="end">
          {(minP+t*rangeP).toFixed(0)}
        </text>
      ))}
      {/* Volume bars */}
      {candles.map((c,i)=>(
        <rect key={`v${i}`} x={px(i)-barW/2} y={h+(c.v/maxV)*50} width={barW}
          height={60-(c.v/maxV)*50} fill={c.c>=c.o?"#39FF1440":"#FF2D5540"}/>
      ))}
      {/* Candles */}
      {candles.map((c,i)=>{
        const bull = c.c>=c.o;
        const col = bull?"#39FF14":"#FF2D55";
        return (
          <g key={i}>
            <line x1={px(i)} y1={py(c.h)} x2={px(i)} y2={py(c.l)} stroke={col} strokeWidth="1"/>
            <rect x={px(i)-barW/2} y={Math.min(py(c.o),py(c.c))}
              width={barW} height={Math.max(1,Math.abs(py(c.o)-py(c.c)))}
              fill={bull?"#39FF14":"#FF2D55"} opacity="0.9"/>
          </g>
        );
      })}
      {/* X labels */}
      {candles.filter((_,i)=>i%10===0).map((c,i)=>(
        <text key={i} x={px(i*10)} y={h+65} fill="#ffffff40" fontSize="8" textAnchor="middle">{c.date}</text>
      ))}
    </svg>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function TradeMindApp() {
  const [page, setPage] = useState("dashboard");
  const [signals] = useState(generateSignals(10));
  const [candles] = useState(generateCandles(60));
  const [ticker, setTicker] = useState(0);
  const [toast, setToast] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChat, setAiChat] = useState([
    {role:"ai",text:"Namaste! 🙏 Main TradeMind AI hoon. Aaj ka market analysis, setups, ya koi bhi trading question — poochho!"}
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [journalTrades, setJournalTrades] = useState([
    {id:1,stock:"RELIANCE",date:"2024-06-01",entry:2850,exit:2940,qty:10,pnl:900,emotion:"Confident",notes:"Clean breakout"},
    {id:2,stock:"TCS",date:"2024-06-03",entry:3820,exit:3760,qty:5,pnl:-300,emotion:"FOMO",notes:"Entered late"},
    {id:3,stock:"INFY",date:"2024-06-05",entry:1450,exit:1510,qty:20,pnl:1200,emotion:"Calm",notes:"RSI reversal"},
    {id:4,stock:"HDFC",date:"2024-06-08",entry:1680,exit:1720,qty:15,pnl:600,emotion:"Disciplined",notes:"Support bounce"},
  ]);
  const [newTrade, setNewTrade] = useState({stock:"",date:"",entry:"",exit:"",qty:"",emotion:"Calm",notes:""});
  const [tradeForm, setTradeForm] = useState(false);
  const [quiz, setQuiz] = useState({active:false,idx:0,score:0,done:false,selected:null});
  const [calcInputs, setCalcInputs] = useState({capital:100000,risk:1,entry:1000,sl:960,target:1080});
  const [videoTab, setVideoTab] = useState("Basics");
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [glossSearch, setGlossSearch] = useState("");
  const [aiSetups, setAiSetups] = useState([]);
  const [setupLoading, setSetupLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef(null);

  // Live ticker
  const marketData = [
    {name:"NIFTY 50",val:19847,chg:+142,pct:+0.72},
    {name:"SENSEX",val:66124,chg:+489,pct:+0.74},
    {name:"BANK NIFTY",val:44832,chg:-112,pct:-0.25},
    {name:"NIFTY IT",val:31200,chg:+380,pct:+1.23},
  ];

  useEffect(()=>{
    const t = setInterval(()=>setTicker(p=>(p+1)%1000),30);
    return ()=>clearInterval(t);
  },[]);

  useEffect(()=>{
    if(chatEndRef.current) chatEndRef.current.scrollIntoView({behavior:"smooth"});
  },[aiChat]);

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),3000);
  };

  // AI Chat
  const sendChat = async () => {
    if(!chatInput.trim()||aiLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setAiChat(p=>[...p,{role:"user",text:userMsg}]);
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system:`You are TradeMind AI — an expert Indian stock market trading assistant. 
Answer in Hinglish (mix of Hindi and English in Roman script). 
Be concise, practical, and helpful. Include relevant data, levels, indicators.
Use emojis appropriately. Always add risk disclaimer at end.
Current market: NIFTY 19847 (+0.72%), BANK NIFTY 44832 (-0.25%)`,
          messages:[
            ...aiChat.filter(m=>m.role==="user"||m.role==="ai").slice(-6).map(m=>({
              role:m.role==="ai"?"assistant":"user",content:m.text
            })),
            {role:"user",content:userMsg}
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, kuch error aa gaya. Dobara try karo!";
      setAiChat(p=>[...p,{role:"ai",text:reply}]);
    } catch {
      setAiChat(p=>[...p,{role:"ai",text:"Network error! Please retry. 🔴"}]);
    }
    setAiLoading(false);
  };

  // AI Setups Generator
  const generateAiSetups = async () => {
    setSetupLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          system:"You are a trading analysis AI. Return ONLY valid JSON array, no markdown, no explanation.",
          messages:[{role:"user",content:`Generate 5 realistic Indian stock trading setups for today.
Return JSON array with exactly this structure:
[{"stock":"RELIANCE","pattern":"Breakout","entry":2850,"sl":2800,"t1":2950,"t2":3050,"rr":"2.0","conf":78,"type":"BUY","reason":"Strong volume breakout above resistance"}]
Use real NSE stocks. Make data realistic.`}]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text||"[]";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setAiSetups(parsed);
      showToast("✅ AI Setups Generated!");
    } catch {
      setAiSetups(signals.slice(0,5));
      showToast("Demo setups loaded!","info");
    }
    setSetupLoading(false);
  };

  // Journal
  const addTrade = () => {
    if(!newTrade.stock||!newTrade.entry||!newTrade.exit) return;
    const pnl = (newTrade.exit-newTrade.entry)*newTrade.qty;
    setJournalTrades(p=>[...p,{...newTrade,id:Date.now(),pnl,entry:+newTrade.entry,exit:+newTrade.exit,qty:+newTrade.qty}]);
    setNewTrade({stock:"",date:"",entry:"",exit:"",qty:"",emotion:"Calm",notes:""});
    setTradeForm(false);
    showToast("✅ Trade Saved!");
  };

  // Position size calc
  const calcPos = () => {
    const riskAmt = calcInputs.capital * (calcInputs.risk/100);
    const slPts = calcInputs.entry - calcInputs.sl;
    const qty = slPts>0 ? Math.floor(riskAmt/slPts) : 0;
    const maxLoss = qty*slPts;
    const maxProfit = qty*(calcInputs.target-calcInputs.entry);
    const rr = slPts>0 ? ((calcInputs.target-calcInputs.entry)/slPts).toFixed(2) : 0;
    return {qty,maxLoss:maxLoss.toFixed(0),maxProfit:maxProfit.toFixed(0),rr,riskAmt:riskAmt.toFixed(0)};
  };

  const totalPnL = journalTrades.reduce((a,t)=>a+t.pnl,0);
  const winTrades = journalTrades.filter(t=>t.pnl>0).length;
  const winRate = journalTrades.length ? ((winTrades/journalTrades.length)*100).toFixed(0) : 0;
  const pos = calcPos();

  const NAV = [
    {id:"dashboard",icon:"🏠",label:"Dashboard"},
    {id:"bot",icon:"🤖",label:"AI Bot"},
    {id:"charts",icon:"📊",label:"Charts"},
    {id:"learn",icon:"📚",label:"Learn"},
    {id:"journal",icon:"📓",label:"Journal"},
    {id:"tools",icon:"🧮",label:"Tools"},
    {id:"news",icon:"📰",label:"News"},
  ];

  // ─── Styles ────────────────────────────────────────────────────────────────
  const S = {
    app:{fontFamily:"'Space Grotesk',system-ui,sans-serif",background:"#07070F",color:"#E8E8F0",minHeight:"100vh",display:"flex",overflow:"hidden"},
    sidebar:{width:sidebarOpen?220:64,minWidth:sidebarOpen?220:64,background:"#0D0D1A",borderRight:"1px solid #1a1a2e",display:"flex",flexDirection:"column",transition:"width 0.3s",overflow:"hidden",zIndex:10},
    sidebarLogo:{padding:"20px 16px",borderBottom:"1px solid #1a1a2e",display:"flex",alignItems:"center",gap:10,cursor:"pointer"},
    navItem:(active)=>({display:"flex",alignItems:"center",gap:12,padding:"12px 16px",cursor:"pointer",borderRadius:8,margin:"2px 8px",
      background:active?"linear-gradient(135deg,#00F5FF15,#7B2FFF15)":"transparent",
      borderLeft:active?"3px solid #00F5FF":"3px solid transparent",
      color:active?"#00F5FF":"#888",transition:"all 0.2s",whiteSpace:"nowrap",overflow:"hidden"}),
    main:{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"},
    topbar:{background:"#0D0D1A",borderBottom:"1px solid #1a1a2e",padding:"0 20px",height:56,display:"flex",alignItems:"center",gap:16,flexShrink:0},
    content:{flex:1,overflowY:"auto",padding:20},
    card:{background:"#0D0D1A",border:"1px solid #1a1a2e",borderRadius:12,padding:16},
    cardGlow:{background:"linear-gradient(135deg,#0D0D1A,#111128)",border:"1px solid #00F5FF30",borderRadius:12,padding:16,boxShadow:"0 0 20px #00F5FF08"},
    btn:(col="#00F5FF")=>({background:`linear-gradient(135deg,${col}20,${col}10)`,border:`1px solid ${col}60`,color:col,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,transition:"all 0.2s"}),
    btnSolid:(col="#00F5FF")=>({background:`linear-gradient(135deg,${col},${col}cc)`,border:"none",color:"#000",padding:"10px 20px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,transition:"all 0.2s"}),
    badge:(type)=>{
      const cols={BUY:["#39FF14","#001a00"],SELL:["#FF2D55","#1a0008"],bullish:["#39FF14","#001a00"],bearish:["#FF2D55","#1a0008"],neutral:["#FFD700","#1a1500"],HIGH:["#FF2D55","#1a0008"],MEDIUM:["#FFD700","#1a1500"]};
      const [fg,bg]=cols[type]||["#888","#111"];
      return{background:bg,color:fg,border:`1px solid ${fg}40`,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700};
    },
    input:{background:"#111128",border:"1px solid #2a2a4a",color:"#E8E8F0",padding:"8px 12px",borderRadius:8,fontSize:13,width:"100%",outline:"none"},
    grid:(cols)=>({display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap:16}),
    tag:{fontFamily:"'JetBrains Mono',monospace"},
  };

  // ─── Pages ────────────────────────────────────────────────────────────────

  const PageDashboard = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Stats Row */}
      <div style={S.grid(4)}>
        {[
          {label:"Today's Best Setup",val:"RELIANCE",sub:"Breakout Pattern",col:"#00F5FF"},
          {label:"AI Confidence",val:"87%",sub:"High Conviction",col:"#39FF14"},
          {label:"Signals Today",val:"12",sub:"6 BUY · 6 SELL",col:"#FFD700"},
          {label:"Market Trend",val:"BULLISH",sub:"NIFTY +0.72%",col:"#39FF14"},
        ].map((s,i)=>(
          <div key={i} style={{...S.cardGlow,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:-20,right:-20,fontSize:60,opacity:0.05}}>{["⚡","🎯","📡","📈"][i]}</div>
            <div style={{color:"#666",fontSize:11,marginBottom:4}}>{s.label}</div>
            <div style={{color:s.col,fontSize:22,fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{s.val}</div>
            <div style={{color:"#555",fontSize:11,marginTop:2}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Market Indices */}
      <div style={{...S.card,display:"flex",gap:16,flexWrap:"wrap"}}>
        {marketData.map((m,i)=>(
          <div key={i} style={{flex:1,minWidth:140,padding:"10px 14px",background:m.chg>0?"#39FF1408":"#FF2D5508",borderRadius:8,border:`1px solid ${m.chg>0?"#39FF1430":"#FF2D5530"}`}}>
            <div style={{color:"#888",fontSize:10,marginBottom:2}}>{m.name}</div>
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,fontWeight:700,color:m.chg>0?"#39FF14":"#FF2D55"}}>{m.val.toLocaleString()}</div>
            <div style={{fontSize:11,color:m.chg>0?"#39FF14":"#FF2D55"}}>{m.chg>0?"+":""}{m.chg} ({m.pct>0?"+":""}{m.pct}%)</div>
          </div>
        ))}
      </div>

      {/* Chart + Signals */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:16}}>
        <div style={S.cardGlow}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{color:"#00F5FF",fontWeight:700}}>📊 NIFTY 50 — Live Chart</div>
            <div style={{display:"flex",gap:8}}>
              {["1M","5M","15M","1H","1D"].map(t=>(
                <button key={t} style={{...S.btn(),padding:"4px 10px",fontSize:11}}>{t}</button>
              ))}
            </div>
          </div>
          <CandleChart candles={candles}/>
        </div>
        <div style={{...S.card,display:"flex",flexDirection:"column",gap:0}}>
          <div style={{color:"#00F5FF",fontWeight:700,marginBottom:12,fontSize:13}}>⚡ Live AI Signals</div>
          <div style={{overflowY:"auto",flex:1,maxHeight:320}}>
            {signals.map(s=>(
              <div key={s.id} style={{padding:"10px 0",borderBottom:"1px solid #1a1a2e",display:"flex",flexDirection:"column",gap:4}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:700,fontFamily:"'JetBrains Mono',monospace",fontSize:13}}>{s.stock}</span>
                  <span style={S.badge(s.type)}>{s.type}</span>
                </div>
                <div style={{color:"#666",fontSize:11}}>{s.pattern}</div>
                <div style={{display:"flex",gap:8,fontSize:11,fontFamily:"'JetBrains Mono',monospace"}}>
                  <span style={{color:"#FFD700"}}>E: ₹{s.entry}</span>
                  <span style={{color:"#FF2D55"}}>SL: ₹{s.sl}</span>
                  <span style={{color:"#39FF14"}}>T1: ₹{s.t1}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
                  <span style={{color:"#888"}}>R:R {s.rr}</span>
                  <span style={{color:s.conf>80?"#39FF14":s.conf>70?"#FFD700":"#FF2D55"}}>🎯 {s.conf}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const PageBot = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:20,fontWeight:700,color:"#00F5FF"}}>🤖 AI Trading Bot</div>
          <div style={{color:"#555",fontSize:12}}>Daily setups, scanner & AI analysis</div>
        </div>
        <button onClick={generateAiSetups} style={S.btnSolid()} disabled={setupLoading}>
          {setupLoading?"⏳ Generating...":"⚡ Generate Today's Setups"}
        </button>
      </div>

      {/* AI Generated Setups */}
      {(aiSetups.length>0||setupLoading) && (
        <div style={S.cardGlow}>
          <div style={{color:"#FFD700",fontWeight:700,marginBottom:12}}>✨ AI Generated Setups</div>
          {setupLoading ? (
            <div style={{textAlign:"center",padding:40,color:"#00F5FF"}}>
              <div style={{fontSize:30,marginBottom:8}}>🤖</div>
              <div>AI analyzing markets...</div>
            </div>
          ) : (
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                <thead>
                  <tr style={{borderBottom:"1px solid #1a1a2e",color:"#555",fontSize:11}}>
                    {["Stock","Pattern","Entry","SL","T1","T2","R:R","Conf","Signal","Reason"].map(h=>(
                      <th key={h} style={{padding:"8px 10px",textAlign:"left"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {aiSetups.map((s,i)=>(
                    <tr key={i} style={{borderBottom:"1px solid #0f0f1f"}}>
                      <td style={{padding:"10px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",color:"#E8E8F0"}}>{s.stock}</td>
                      <td style={{padding:"10px",color:"#888",fontSize:11}}>{s.pattern}</td>
                      <td style={{padding:"10px",color:"#FFD700",fontFamily:"'JetBrains Mono',monospace"}}>₹{s.entry}</td>
                      <td style={{padding:"10px",color:"#FF2D55",fontFamily:"'JetBrains Mono',monospace"}}>₹{s.sl}</td>
                      <td style={{padding:"10px",color:"#39FF14",fontFamily:"'JetBrains Mono',monospace"}}>₹{s.t1}</td>
                      <td style={{padding:"10px",color:"#39FF1499",fontFamily:"'JetBrains Mono',monospace"}}>₹{s.t2}</td>
                      <td style={{padding:"10px",color:"#00F5FF"}}>{s.rr}</td>
                      <td style={{padding:"10px"}}>
                        <div style={{...S.badge(+s.conf>75?"BUY":"SELL"),display:"inline-block"}}>{s.conf}%</div>
                      </td>
                      <td style={{padding:"10px"}}><span style={S.badge(s.type)}>{s.type}</span></td>
                      <td style={{padding:"10px",color:"#666",fontSize:11,maxWidth:180}}>{s.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Scanner */}
      <div style={S.card}>
        <div style={{color:"#FFD700",fontWeight:700,marginBottom:12}}>🔍 Signal Scanner — Live Signals</div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {["All","Breakout","RSI Oversold","MACD Cross","Volume Spike"].map(f=>(
            <button key={f} style={{...S.btn("#7B2FFF"),padding:"5px 12px",fontSize:11}}>{f}</button>
          ))}
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1a1a2e",color:"#555",fontSize:11}}>
                {["Stock","Sector","Pattern","Entry","SL","Target","R:R","Confidence","Signal","Time"].map(h=>(
                  <th key={h} style={{padding:"8px",textAlign:"left"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {signals.map((s,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #0f0f1f",background:i%2===0?"#ffffff03":"transparent"}}>
                  <td style={{padding:"9px 8px",fontWeight:700,color:"#E8E8F0"}}>{s.stock}</td>
                  <td style={{padding:"9px 8px",color:"#666"}}>{s.sector}</td>
                  <td style={{padding:"9px 8px",color:"#888",fontSize:11}}>{s.pattern}</td>
                  <td style={{padding:"9px 8px",color:"#FFD700",fontFamily:"'JetBrains Mono',monospace"}}>₹{s.entry}</td>
                  <td style={{padding:"9px 8px",color:"#FF2D55",fontFamily:"'JetBrains Mono',monospace"}}>₹{s.sl}</td>
                  <td style={{padding:"9px 8px",color:"#39FF14",fontFamily:"'JetBrains Mono',monospace"}}>₹{s.t1}</td>
                  <td style={{padding:"9px 8px",color:"#00F5FF"}}>{s.rr}x</td>
                  <td style={{padding:"9px 8px"}}>
                    <div style={{background:"#1a1a2e",borderRadius:4,height:6,width:80}}>
                      <div style={{background:s.conf>80?"#39FF14":s.conf>70?"#FFD700":"#FF2D55",height:"100%",borderRadius:4,width:`${s.conf}%`}}/>
                    </div>
                    <div style={{fontSize:10,color:"#666",marginTop:2}}>{s.conf}%</div>
                  </td>
                  <td style={{padding:"9px 8px"}}><span style={S.badge(s.type)}>{s.type}</span></td>
                  <td style={{padding:"9px 8px",color:"#555",fontSize:11}}>{s.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PageCharts = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{color:"#00F5FF",fontWeight:700,fontSize:18}}>📊 Advanced Charts</div>
      <div style={S.cardGlow}>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",gap:8}}>
            {["NIFTY 50","BANK NIFTY","RELIANCE","TCS","INFY"].map(s=>(
              <button key={s} style={{...S.btn(),padding:"5px 12px",fontSize:11}}>{s}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            {["1M","5M","15M","1H","4H","1D","1W"].map(t=>(
              <button key={t} style={{...S.btn("#7B2FFF"),padding:"4px 10px",fontSize:11}}>{t}</button>
            ))}
          </div>
        </div>
        <CandleChart candles={candles}/>
      </div>
      <div style={S.grid(2)}>
        <div style={S.card}>
          <div style={{color:"#FFD700",fontWeight:700,marginBottom:12}}>📈 Indicators Panel</div>
          {[{name:"RSI (14)",val:"42.3",sig:"Neutral",col:"#FFD700"},{name:"MACD",val:"Bullish Cross",sig:"BUY",col:"#39FF14"},{name:"EMA 20/50",val:"Above EMA",sig:"Bullish",col:"#39FF14"},{name:"Bollinger Bands",val:"Mid Band",sig:"Neutral",col:"#FFD700"},{name:"Supertrend",val:"Green",sig:"BUY",col:"#39FF14"},{name:"Volume",val:"1.8x Avg",sig:"High",col:"#00F5FF"}].map((ind,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a1a2e"}}>
              <span style={{color:"#888",fontSize:13}}>{ind.name}</span>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <span style={{color:"#E8E8F0",fontSize:13,fontFamily:"'JetBrains Mono',monospace"}}>{ind.val}</span>
                <span style={{...S.badge(ind.sig==="BUY"?"BUY":ind.sig==="SELL"?"SELL":"neutral"),fontSize:10}}>{ind.sig}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{color:"#FFD700",fontWeight:700,marginBottom:12}}>👁️ Watchlist</div>
          {STOCKS.map((s,i)=>{
            const chg = rnd(-2,3);
            const sparkData = Array.from({length:15},()=>rnd(0,100,0));
            return (
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #1a1a2e"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13}}>{s}</div>
                  <div style={{fontSize:11,color:"#555"}}>NSE</div>
                </div>
                <Sparkline data={sparkData} color={chg>0?"#39FF14":"#FF2D55"} height={30}/>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13}}>₹{rnd(500,3000)}</div>
                  <div style={{fontSize:11,color:chg>0?"#39FF14":"#FF2D55"}}>{chg>0?"+":""}{chg}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const PageLearn = ()=>{
    const filteredGloss = GLOSSARY.filter(g=>g.term.toLowerCase().includes(glossSearch.toLowerCase())||g.def.toLowerCase().includes(glossSearch.toLowerCase()));
    return (
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{color:"#00F5FF",fontWeight:700,fontSize:18}}>📚 Learning Hub — Zero to Hero</div>
        {/* Progress */}
        <div style={S.cardGlow}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <div style={{color:"#FFD700",fontWeight:700}}>🎯 Your Learning Journey</div>
            <div style={{color:"#00F5FF",fontSize:13}}>Level: Intermediate</div>
          </div>
          <div style={{display:"flex",gap:0,marginBottom:8}}>
            {["Basics","TA","Patterns","F&O","Psychology","Live Trading"].map((step,i)=>(
              <div key={i} style={{flex:1,textAlign:"center",fontSize:10,color:i<3?"#39FF14":i===3?"#FFD700":"#555"}}>
                <div style={{height:6,background:i<3?"#39FF14":i===3?"#FFD700":"#1a1a2e",margin:"0 2px 4px",borderRadius:3}}/>
                {step}
              </div>
            ))}
          </div>
          <div style={{color:"#555",fontSize:11}}>3/6 modules complete · Keep going! 🔥</div>
        </div>

        {/* YouTube Videos */}
        <div style={S.card}>
          <div style={{color:"#FF2D55",fontWeight:700,marginBottom:12,fontSize:15}}>▶️ Free YouTube Courses</div>
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            {Object.keys(YT_VIDEOS).map(tab=>(
              <button key={tab} onClick={()=>setVideoTab(tab)}
                style={{...S.btn(videoTab===tab?"#FF2D55":"#444"),padding:"6px 14px",fontSize:12}}>
                {tab}
              </button>
            ))}
          </div>
          <div style={S.grid(3)}>
            {YT_VIDEOS[videoTab].map(v=>(
              <div key={v.id} style={{...S.card,cursor:"pointer",border:`1px solid ${watchedVideos.has(v.id)?"#39FF1430":"#1a1a2e"}`,position:"relative",transition:"all 0.2s"}}>
                {watchedVideos.has(v.id) && <div style={{position:"absolute",top:8,right:8,background:"#39FF14",color:"#000",fontSize:10,padding:"2px 6px",borderRadius:4,fontWeight:700}}>✓ WATCHED</div>}
                <div style={{fontSize:36,marginBottom:8,textAlign:"center",background:"#1a1a2e",borderRadius:8,padding:"16px"}}>{v.thumb}</div>
                <div style={{fontSize:12,fontWeight:700,marginBottom:4,lineHeight:1.4}}>{v.title}</div>
                <div style={{color:"#666",fontSize:11,marginBottom:8}}>{v.channel} · {v.views} views</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{color:"#555",fontSize:11}}>⏱ {v.duration}</span>
                  <button onClick={()=>setWatchedVideos(p=>new Set([...p,v.id]))} style={{...S.btn("#FF2D55"),padding:"4px 10px",fontSize:11}}>
                    {watchedVideos.has(v.id)?"✓ Done":"Watch"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glossary */}
        <div style={S.card}>
          <div style={{color:"#7B2FFF",fontWeight:700,marginBottom:12,fontSize:15}}>📖 Trading Glossary</div>
          <input placeholder="Search terms..." value={glossSearch} onChange={e=>setGlossSearch(e.target.value)}
            style={{...S.input,marginBottom:12}}/>
          <div style={S.grid(2)}>
            {filteredGloss.map((g,i)=>(
              <div key={i} style={{...S.card,background:"#0a0a14"}}>
                <div style={{color:"#7B2FFF",fontWeight:700,marginBottom:4}}>{g.term}</div>
                <div style={{color:"#aaa",fontSize:12,marginBottom:6,lineHeight:1.5}}>{g.def}</div>
                <div style={{color:"#555",fontSize:11,fontStyle:"italic"}}>Example: {g.example}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz */}
        <div style={S.card}>
          <div style={{color:"#FFD700",fontWeight:700,marginBottom:12,fontSize:15}}>🧠 Test Your Knowledge</div>
          {!quiz.active && !quiz.done && (
            <div style={{textAlign:"center",padding:20}}>
              <div style={{fontSize:40,marginBottom:8}}>🎯</div>
              <div style={{color:"#888",marginBottom:16}}>5 quick questions to test your trading knowledge!</div>
              <button onClick={()=>setQuiz({active:true,idx:0,score:0,done:false,selected:null})} style={S.btnSolid("#FFD700")}>Start Quiz</button>
            </div>
          )}
          {quiz.active && !quiz.done && (
            <div>
              <div style={{color:"#888",fontSize:12,marginBottom:8}}>Question {quiz.idx+1}/5</div>
              <div style={{fontWeight:700,marginBottom:16,fontSize:15}}>{QUIZ_DATA[quiz.idx].q}</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {QUIZ_DATA[quiz.idx].opts.map((opt,i)=>(
                  <button key={i} onClick={()=>{
                    if(quiz.selected!==null)return;
                    const correct = i===QUIZ_DATA[quiz.idx].ans;
                    setQuiz(p=>({...p,selected:i,score:correct?p.score+1:p.score}));
                    setTimeout(()=>{
                      if(quiz.idx<4) setQuiz(p=>({...p,idx:p.idx+1,selected:null}));
                      else setQuiz(p=>({...p,done:true,active:false}));
                    },800);
                  }} style={{padding:"10px 16px",borderRadius:8,textAlign:"left",cursor:"pointer",fontSize:13,
                    background:quiz.selected===null?"#111128":i===QUIZ_DATA[quiz.idx].ans?"#39FF1420":quiz.selected===i?"#FF2D5520":"#111128",
                    border:`1px solid ${quiz.selected===null?"#2a2a4a":i===QUIZ_DATA[quiz.idx].ans?"#39FF14":quiz.selected===i?"#FF2D55":"#2a2a4a"}`,
                    color:"#E8E8F0"}}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
          {quiz.done && (
            <div style={{textAlign:"center",padding:20}}>
              <div style={{fontSize:48,marginBottom:8}}>{quiz.score>=4?"🏆":quiz.score>=3?"🥈":"📚"}</div>
              <div style={{color:"#FFD700",fontSize:24,fontWeight:700,marginBottom:8}}>{quiz.score}/5</div>
              <div style={{color:"#888",marginBottom:16}}>{quiz.score>=4?"Excellent! You're on your way to the top!":quiz.score>=3?"Good job! Keep learning!":"Review the concepts and try again!"}</div>
              <button onClick={()=>setQuiz({active:false,idx:0,score:0,done:false,selected:null})} style={S.btnSolid("#FFD700")}>Try Again</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const PageJournal = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{color:"#00F5FF",fontWeight:700,fontSize:18}}>📓 Trade Journal</div>
        <button onClick={()=>setTradeForm(true)} style={S.btnSolid()}>+ Add Trade</button>
      </div>
      <div style={S.grid(4)}>
        {[
          {label:"Total P&L",val:`₹${totalPnL.toLocaleString()}`,col:totalPnL>=0?"#39FF14":"#FF2D55"},
          {label:"Win Rate",val:`${winRate}%`,col:"#FFD700"},
          {label:"Total Trades",val:journalTrades.length,col:"#00F5FF"},
          {label:"Winning Trades",val:winTrades,col:"#39FF14"},
        ].map((s,i)=>(
          <div key={i} style={S.cardGlow}>
            <div style={{color:"#555",fontSize:11}}>{s.label}</div>
            <div style={{color:s.col,fontSize:22,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>{s.val}</div>
          </div>
        ))}
      </div>

      {tradeForm && (
        <div style={{...S.cardGlow,border:"1px solid #00F5FF40"}}>
          <div style={{color:"#00F5FF",fontWeight:700,marginBottom:16}}>+ Add New Trade</div>
          <div style={S.grid(3)}>
            {[["Stock","stock","text"],["Date","date","date"],["Entry Price","entry","number"],["Exit Price","exit","number"],["Quantity","qty","number"]].map(([label,key,type])=>(
              <div key={key}>
                <div style={{color:"#666",fontSize:11,marginBottom:4}}>{label}</div>
                <input type={type} value={newTrade[key]} onChange={e=>setNewTrade(p=>({...p,[key]:e.target.value}))}
                  placeholder={label} style={S.input}/>
              </div>
            ))}
            <div>
              <div style={{color:"#666",fontSize:11,marginBottom:4}}>Emotion</div>
              <select value={newTrade.emotion} onChange={e=>setNewTrade(p=>({...p,emotion:e.target.value}))}
                style={S.input}>
                {EMOTIONS.map(e=><option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginTop:12}}>
            <div style={{color:"#666",fontSize:11,marginBottom:4}}>Notes</div>
            <input value={newTrade.notes} onChange={e=>setNewTrade(p=>({...p,notes:e.target.value}))}
              placeholder="What happened? Why did you enter?" style={S.input}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <button onClick={addTrade} style={S.btnSolid()}>Save Trade</button>
            <button onClick={()=>setTradeForm(false)} style={S.btn("#FF2D55")}>Cancel</button>
          </div>
        </div>
      )}

      <div style={S.card}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{borderBottom:"1px solid #1a1a2e",color:"#555",fontSize:11}}>
                {["Stock","Date","Entry","Exit","Qty","P&L","Emotion","Notes"].map(h=>(
                  <th key={h} style={{padding:"8px",textAlign:"left"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {journalTrades.map((t,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #0f0f1f"}}>
                  <td style={{padding:"10px 8px",fontWeight:700}}>{t.stock}</td>
                  <td style={{padding:"10px 8px",color:"#666"}}>{t.date}</td>
                  <td style={{padding:"10px 8px",fontFamily:"'JetBrains Mono',monospace",color:"#FFD700"}}>₹{t.entry}</td>
                  <td style={{padding:"10px 8px",fontFamily:"'JetBrains Mono',monospace",color:"#E8E8F0"}}>₹{t.exit}</td>
                  <td style={{padding:"10px 8px",color:"#888"}}>{t.qty}</td>
                  <td style={{padding:"10px 8px",fontFamily:"'JetBrains Mono',monospace",fontWeight:700,color:t.pnl>=0?"#39FF14":"#FF2D55"}}>
                    {t.pnl>=0?"+":""}₹{t.pnl.toLocaleString()}
                  </td>
                  <td style={{padding:"10px 8px",color:"#888"}}>{t.emotion}</td>
                  <td style={{padding:"10px 8px",color:"#555",fontSize:11,maxWidth:150}}>{t.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const PageTools = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{color:"#00F5FF",fontWeight:700,fontSize:18}}>🧮 Trading Calculators</div>
      <div style={S.grid(2)}>
        {/* Position Sizer */}
        <div style={S.cardGlow}>
          <div style={{color:"#FFD700",fontWeight:700,marginBottom:16}}>📐 Position Size Calculator</div>
          {[["Capital (₹)","capital"],["Risk %","risk"],["Entry Price","entry"],["Stop Loss","sl"],["Target Price","target"]].map(([label,key])=>(
            <div key={key} style={{marginBottom:10}}>
              <div style={{color:"#666",fontSize:11,marginBottom:4}}>{label}</div>
              <input type="number" value={calcInputs[key]}
                onChange={e=>setCalcInputs(p=>({...p,[key]:+e.target.value}))}
                style={S.input}/>
            </div>
          ))}
          <div style={{background:"#0a0a14",borderRadius:8,padding:16,marginTop:8}}>
            {[["Quantity",pos.qty+" shares"],["Risk Amount","₹"+pos.riskAmt],["Max Loss","₹"+pos.maxLoss],["Max Profit","₹"+pos.maxProfit],["Risk:Reward",pos.rr+"x"]].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<4?"1px solid #1a1a2e":"none"}}>
                <span style={{color:"#666",fontSize:13}}>{l}</span>
                <span style={{color:["#E8E8F0","#FF2D55","#FF2D55","#39FF14","#00F5FF"][i],fontFamily:"'JetBrains Mono',monospace",fontWeight:700}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Brokerage Calc */}
        <div style={S.card}>
          <div style={{color:"#7B2FFF",fontWeight:700,marginBottom:16}}>💰 Brokerage Calculator</div>
          {[["Buy Price (₹)","1000"],["Sell Price (₹)","1050"],["Quantity","100"],["Segment","Intraday"]].map(([l,p],i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{color:"#666",fontSize:11,marginBottom:4}}>{l}</div>
              <input defaultValue={p} style={S.input} type={i<3?"number":"text"}/>
            </div>
          ))}
          <div style={{background:"#0a0a14",borderRadius:8,padding:16,marginTop:8}}>
            {[["Turnover","₹2,05,000"],["Brokerage","₹40.00"],["STT","₹20.50"],["Exchange Charges","₹4.10"],["GST","₹7.22"],["Total Cost","₹71.82"],["Net P&L","₹4,928.18"]].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:i<6?"1px solid #1a1a2e":"none"}}>
                <span style={{color:i===6?"#39FF14":"#666",fontSize:13,fontWeight:i===6?700:400}}>{l}</span>
                <span style={{color:i===6?"#39FF14":"#E8E8F0",fontFamily:"'JetBrains Mono',monospace",fontWeight:i===6?700:400}}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* F&O Lot Sizes */}
        <div style={S.card}>
          <div style={{color:"#00F5FF",fontWeight:700,marginBottom:12}}>📋 F&O Lot Size Reference</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"1px solid #1a1a2e",color:"#555"}}>
                  {["Symbol","Lot Size","Expiry","Approx Margin"].map(h=><th key={h} style={{padding:"6px 8px",textAlign:"left"}}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {[["NIFTY","50","Monthly","₹1,00,000"],["BANK NIFTY","15","Weekly","₹60,000"],["FINNIFTY","40","Weekly","₹50,000"],["RELIANCE","250","Monthly","₹1,60,000"],["TCS","150","Monthly","₹1,70,000"],["INFY","300","Monthly","₹1,35,000"],["HDFC","300","Monthly","₹1,50,000"],["SBIN","1500","Monthly","₹1,20,000"]].map(([s,l,e,m],i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #0f0f1f"}}>
                    <td style={{padding:"7px 8px",fontWeight:700}}>{s}</td>
                    <td style={{padding:"7px 8px",color:"#FFD700",fontFamily:"'JetBrains Mono',monospace"}}>{l}</td>
                    <td style={{padding:"7px 8px",color:"#888"}}>{e}</td>
                    <td style={{padding:"7px 8px",color:"#39FF14",fontFamily:"'JetBrains Mono',monospace"}}>{m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* R:R Quick Calc */}
        <div style={S.card}>
          <div style={{color:"#39FF14",fontWeight:700,marginBottom:16}}>⚖️ Risk:Reward Visualizer</div>
          <div style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#666",marginBottom:4}}>
              <span>Entry: ₹{calcInputs.entry}</span><span>SL: ₹{calcInputs.sl}</span><span>Target: ₹{calcInputs.target}</span>
            </div>
            <div style={{height:8,background:"#1a1a2e",borderRadius:4,position:"relative",overflow:"visible"}}>
              <div style={{position:"absolute",left:"30%",width:"40%",height:"100%",background:"linear-gradient(90deg,#FF2D55,#FFD700,#39FF14)",borderRadius:4}}/>
              <div style={{position:"absolute",left:"30%",top:-4,width:2,height:16,background:"#FFD700"}}/>
              <div style={{position:"absolute",left:"20%",top:-4,width:2,height:16,background:"#FF2D55"}}/>
              <div style={{position:"absolute",left:"70%",top:-4,width:2,height:16,background:"#39FF14"}}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginTop:16}}>
            {[{l:"Risk",v:`₹${(calcInputs.entry-calcInputs.sl).toFixed(0)}`,col:"#FF2D55"},{l:"Reward",v:`₹${(calcInputs.target-calcInputs.entry).toFixed(0)}`,col:"#39FF14"},{l:"R:R",v:`1:${pos.rr}`,col:"#FFD700"}].map((item,i)=>(
              <div key={i} style={{background:"#0a0a14",borderRadius:8,padding:12,textAlign:"center"}}>
                <div style={{color:"#555",fontSize:11}}>{item.l}</div>
                <div style={{color:item.col,fontFamily:"'JetBrains Mono',monospace",fontWeight:700,fontSize:16,marginTop:4}}>{item.v}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:16,padding:12,background:+pos.rr>=2?"#39FF1408":"#FF2D5508",borderRadius:8,border:`1px solid ${+pos.rr>=2?"#39FF1430":"#FF2D5530"}`}}>
            <div style={{color:+pos.rr>=2?"#39FF14":"#FF2D55",fontWeight:700,fontSize:13}}>
              {+pos.rr>=2?"✅ Good Trade Setup (R:R ≥ 2)":"⚠️ Weak Setup (R:R < 2 — Avoid!)"}
            </div>
            <div style={{color:"#666",fontSize:11,marginTop:4}}>Minimum 1:2 R:R required for consistent profitability</div>
          </div>
        </div>
      </div>
    </div>
  );

  const PageNews = ()=>(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{color:"#00F5FF",fontWeight:700,fontSize:18}}>📰 Market News & Sentiment</div>
      <div style={S.grid(3)}>
        {[{label:"Fear & Greed Index",val:"68",sub:"Greed",col:"#FFD700"},{label:"FII Activity",val:"-₹4,200Cr",sub:"Net Sellers",col:"#FF2D55"},{label:"Market Breadth",val:"62%",sub:"Advancing",col:"#39FF14"}].map((s,i)=>(
          <div key={i} style={S.cardGlow}>
            <div style={{color:"#555",fontSize:11}}>{s.label}</div>
            <div style={{color:s.col,fontSize:22,fontWeight:700,fontFamily:"'JetBrains Mono',monospace",marginTop:4}}>{s.val}</div>
            <div style={{color:s.col,fontSize:11,marginTop:2}}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={{color:"#FFD700",fontWeight:700,marginBottom:12}}>📡 Latest Market News</div>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          {["All","Banking","IT","Energy","Pharma","Auto","Market"].map(f=>(
            <button key={f} style={{...S.btn("#7B2FFF"),padding:"5px 12px",fontSize:11}}>{f}</button>
          ))}
        </div>
        {NEWS_DATA.map(n=>(
          <div key={n.id} style={{padding:"14px 0",borderBottom:"1px solid #1a1a2e",display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{fontSize:24}}>{n.sentiment==="bullish"?"🟢":"🔴"}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13,marginBottom:6,lineHeight:1.4}}>{n.title}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <span style={S.badge(n.sentiment==="bullish"?"BUY":"SELL")}>{n.sentiment.toUpperCase()}</span>
                <span style={S.badge(n.impact)}>{n.impact} IMPACT</span>
                <span style={{color:"#555",fontSize:11}}>{n.sector}</span>
                <span style={{color:"#444",fontSize:11}}>{n.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={{color:"#00F5FF",fontWeight:700,marginBottom:12}}>📅 Economic Calendar</div>
        {[{date:"Jun 12","event":"RBI Monetary Policy Meeting","impact":"HIGH","expected":"6.50%","prev":"6.50%"},
          {date:"Jun 14","event":"US CPI Inflation Data","impact":"HIGH","expected":"3.2%","prev":"3.4%"},
          {date:"Jun 17","event":"NIFTY Weekly Options Expiry","impact":"MEDIUM","expected":"—","prev":"—"},
          {date:"Jun 20","event":"TCS Q1 Results","impact":"HIGH","expected":"—","prev":"₹11,735 Cr"},
          {date:"Jun 27","event":"Nifty Monthly Expiry","impact":"HIGH","expected":"—","prev":"—"},
        ].map((ev,i)=>(
          <div key={i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:"1px solid #1a1a2e",alignItems:"center"}}>
            <div style={{background:"#1a1a2e",borderRadius:8,padding:"6px 10px",textAlign:"center",minWidth:50}}>
              <div style={{color:"#00F5FF",fontWeight:700,fontSize:13}}>{ev.date}</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:13}}>{ev.event}</div>
              <div style={{color:"#555",fontSize:11,marginTop:2}}>Expected: {ev.expected} | Previous: {ev.prev}</div>
            </div>
            <span style={S.badge(ev.impact)}>{ev.impact}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const pages = {dashboard:<PageDashboard/>,bot:<PageBot/>,charts:<PageCharts/>,learn:<PageLearn/>,journal:<PageJournal/>,tools:<PageTools/>,news:<PageNews/>};

  return (
    <div style={S.app}>
      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={S.sidebarLogo} onClick={()=>setSidebarOpen(p=>!p)}>
          <div style={{fontSize:24,flexShrink:0}}>⚡</div>
          {sidebarOpen && <div>
            <div style={{color:"#00F5FF",fontWeight:800,fontSize:15,letterSpacing:1}}>TradeMind</div>
            <div style={{color:"#555",fontSize:9,letterSpacing:2}}>AI TRADING</div>
          </div>}
        </div>
        <div style={{flex:1,paddingTop:8}}>
          {NAV.map(n=>(
            <div key={n.id} style={S.navItem(page===n.id)} onClick={()=>setPage(n.id)}>
              <span style={{fontSize:18,flexShrink:0}}>{n.icon}</span>
              {sidebarOpen && <span style={{fontSize:13,fontWeight:600}}>{n.label}</span>}
            </div>
          ))}
        </div>
        {sidebarOpen && <div style={{padding:"16px",borderTop:"1px solid #1a1a2e"}}>
          <div style={{color:"#555",fontSize:10,marginBottom:4}}>⚠️ DISCLAIMER</div>
          <div style={{color:"#333",fontSize:9,lineHeight:1.5}}>Educational purposes only. Not SEBI registered financial advice.</div>
        </div>}
      </div>

      {/* Main */}
      <div style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div style={{color:"#00F5FF",fontWeight:700,fontSize:15,marginRight:"auto"}}>
            {NAV.find(n=>n.id===page)?.icon} {NAV.find(n=>n.id===page)?.label}
          </div>
          {marketData.map((m,i)=>(
            <div key={i} style={{display:"flex",gap:6,alignItems:"center",fontSize:12}}>
              <span style={{color:"#555"}}>{m.name}</span>
              <span style={{fontFamily:"'JetBrains Mono',monospace",color:m.chg>0?"#39FF14":"#FF2D55",fontWeight:700}}>{m.val.toLocaleString()}</span>
              <span style={{color:m.chg>0?"#39FF14":"#FF2D55",fontSize:11}}>{m.pct>0?"+":""}{m.pct}%</span>
            </div>
          ))}
          <div style={{width:8,height:8,borderRadius:"50%",background:"#39FF14",boxShadow:"0 0 8px #39FF14",animation:"pulse 2s infinite"}}/>
          <span style={{color:"#39FF14",fontSize:11,fontWeight:700}}>MARKET OPEN</span>
        </div>

        {/* Content */}
        <div style={S.content}>
          {pages[page]}
        </div>
      </div>

      {/* AI Chat Button */}
      <div style={{position:"fixed",bottom:24,right:24,zIndex:100}}>
        {chatOpen && (
          <div style={{position:"absolute",bottom:64,right:0,width:340,background:"#0D0D1A",border:"1px solid #00F5FF40",borderRadius:16,boxShadow:"0 0 40px #00F5FF20",display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{background:"linear-gradient(135deg,#00F5FF15,#7B2FFF15)",padding:"12px 16px",borderBottom:"1px solid #1a1a2e",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{color:"#00F5FF",fontWeight:700}}>🤖 TradeMind AI</div>
              <button onClick={()=>setChatOpen(false)} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:16}}>✕</button>
            </div>
            <div style={{height:300,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
              {aiChat.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"85%",padding:"8px 12px",borderRadius:12,fontSize:12,lineHeight:1.5,
                    background:m.role==="user"?"linear-gradient(135deg,#00F5FF20,#7B2FFF20)":"#111128",
                    border:`1px solid ${m.role==="user"?"#00F5FF40":"#1a1a2e"}`,
                    color:"#E8E8F0"}}>
                    {m.text}
                  </div>
                </div>
              ))}
              {aiLoading && <div style={{color:"#00F5FF",fontSize:12,padding:"4px 12px"}}>⏳ Analyzing...</div>}
              <div ref={chatEndRef}/>
            </div>
            <div style={{padding:"8px 12px",borderTop:"1px solid #1a1a2e",display:"flex",gap:8}}>
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&sendChat()}
                placeholder="Ask about any stock..." style={{...S.input,flex:1,padding:"8px 10px"}}/>
              <button onClick={sendChat} style={S.btnSolid()}>↑</button>
            </div>
            <div style={{padding:"8px 12px",display:"flex",gap:6,flexWrap:"wrap",borderTop:"1px solid #0f0f1f"}}>
              {["Best setups today","NIFTY analysis","Explain RSI","Risk management"].map(q=>(
                <button key={q} onClick={()=>{setChatInput(q);}} style={{...S.btn("#7B2FFF"),padding:"3px 8px",fontSize:10}}>{q}</button>
              ))}
            </div>
          </div>
        )}
        <button onClick={()=>setChatOpen(p=>!p)} style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#00F5FF,#7B2FFF)",border:"none",fontSize:22,cursor:"pointer",boxShadow:"0 0 20px #00F5FF50",display:"flex",alignItems:"center",justifyContent:"center"}}>
          🤖
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{position:"fixed",top:72,right:24,background:toast.type==="info"?"#111128":"#0a1f0a",border:`1px solid ${toast.type==="info"?"#00F5FF":"#39FF14"}`,color:toast.type==="info"?"#00F5FF":"#39FF14",padding:"10px 18px",borderRadius:8,fontSize:13,fontWeight:600,zIndex:200,boxShadow:`0 0 20px ${toast.type==="info"?"#00F5FF":"#39FF14"}30`}}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
