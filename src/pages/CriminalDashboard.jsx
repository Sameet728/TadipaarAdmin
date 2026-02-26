import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, ShieldAlert, MapPin, User, LogOut, 
  Camera, CheckCircle, AlertCircle, Clock, Navigation, 
  ShieldCheck, AlertTriangle, History, LifeBuoy, Timer, 
  ShieldX, Smartphone, ChevronRight
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip 
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

// --- Constants & Style ---
const NAVY_BLUE = "#0B3D91";
const BG_COLOR = "#F8FAFC";

const DEMO_CRIMINAL = {
  id: 4,
  name: "Ramesh Kale",
  role: "CRIMINAL",
  aadhaar: "1234-5678-9012",
  mobile: "9876543210",
  police_station: "Swargate",
  end_date: "2026-06-15",
  prohibited_area: "Pune Central District"
};

// --- Utilities ---
const getStorage = (key, fallback = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) { return fallback; }
};
const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val));

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
};

// --- Components ---

const VisualMap = ({ center = [18.5204, 73.8567], radius = 500, markers = [], isViolating = false }) => (
  <div className="relative w-full h-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0B3D91 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
    
    {/* Restricted Zone Circle */}
    <div 
      className={`absolute border-2 rounded-full animate-pulse flex items-center justify-center ${isViolating ? 'border-red-500 bg-red-500/10' : 'border-slate-300 bg-slate-100/50'}`}
      style={{ width: '120px', height: '120px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow-sm border ${isViolating ? 'bg-red-500 text-white border-red-600' : 'bg-white text-slate-400 border-slate-200'}`}>
        RESTRICTED
      </span>
    </div>

    {/* User Location Marker */}
    <div className="absolute transform -translate-x-1/2 -translate-y-full flex flex-col items-center" style={{ left: '50%', top: '55%' }}>
      <div className="bg-white px-2 py-1 rounded-lg shadow-lg text-[10px] font-bold border border-slate-100 mb-1 text-[#0B3D91] whitespace-nowrap">
        CURRENT LOCATION
      </div>
      <Navigation size={24} className={`fill-current ${isViolating ? 'text-red-500' : 'text-[#0B3D91]'}`} style={{ transform: 'rotate(45deg)' }} />
    </div>
  </div>
);

export default function App() {
  const [user] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : DEMO_CRIMINAL;
  });

  const [activeTab, setActiveTab] = useState('home'); // 'home', 'hazari', 'sos'
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location] = useState({ lat: 18.5204, lng: 73.8567 });
  const [timeLeft, setTimeLeft] = useState("");
  const [isViolating, setIsViolating] = useState(false);

  // Load restriction details
  const myData = useMemo(() => {
    const criminals = getStorage('criminals', []);
    return criminals.find(c => c.aadhaar === user.aadhaar) || user;
  }, [user]);

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(myData.end_date).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      if (diff < 0) { setTimeLeft("COMPLETED"); return; }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, [myData.end_date]);

  // GPS Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsViolating(prev => Math.random() > 0.8 ? !prev : prev);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setReport(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCheckIn = () => {
    if (!report) return toast.error("Selfie Required");
    setLoading(true);
    
    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        name: user.name,
        aadhaar: user.aadhaar,
        image_url: report,
        latitude: location.lat,
        longitude: location.lng,
        police_station: user.police_station,
        is_violation: isViolating,
        timestamp: new Date().toISOString()
      };
      const logs = getStorage('tadipaarLogs', []);
      setStorage('tadipaarLogs', [newLog, ...logs]);
      setLoading(false);
      setReport(null);
      
      if (isViolating) toast.error("VIOLATION LOGGED: In Restricted Zone", { icon: '🚨' });
      else toast.success("Hazari Marked Successfully", { icon: '✅' });
    }, 1500);
  };

  const handleSOS = (reason) => {
    const sosLog = { id: Date.now(), type: 'SOS', name: user.name, reason, latitude: location.lat, longitude: location.lng, timestamp: new Date().toISOString() };
    const logs = getStorage('tadipaarLogs', []);
    setStorage('tadipaarLogs', [sosLog, ...logs]);
    toast.success("SOS Alert Transmitted to " + user.police_station + " PS", { duration: 5000 });
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center overflow-hidden">
      {/* Mobile Wrapper Container */}
      <div className="w-full max-w-md bg-[#F8FAFC] shadow-2xl relative flex flex-col h-full min-h-screen border-x border-slate-300">
        <Toaster position="top-center" />

        {/* Official Header */}
        <div className="sticky top-0 z-50 p-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0B3D91] text-white flex items-center justify-center font-black shadow-md">
               {user.name[0]}
            </div>
            <div>
              <h2 className="font-black text-xs text-[#0B3D91] uppercase tracking-tight">{user.name}</h2>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Hazari Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">GPS LIVE</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide pb-32">
          {activeTab === 'home' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              
              {/* Restrictions Dashboard */}
              <div className="bg-[#0B3D91] p-6 rounded-[32px] shadow-xl relative overflow-hidden text-white">
                <div className="relative z-10 space-y-5">
                   <div className="flex justify-between items-start">
                      <div>
                         <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Time Remaining</p>
                         <h3 className="text-2xl font-black tabular-nums tracking-tighter">{timeLeft}</h3>
                      </div>
                      <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                         <Timer size={20} />
                      </div>
                   </div>
                   <div className="pt-5 border-t border-white/10 grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-[9px] font-bold opacity-50 uppercase mb-0.5">Restriction Zone</p>
                         <p className="text-xs font-black text-yellow-400 underline">{myData.prohibited_area}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[9px] font-bold opacity-50 uppercase mb-0.5">End Date</p>
                         <p className="text-xs font-black">15 JUN 2026</p>
                      </div>
                   </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full translate-x-12 -translate-y-12" />
              </div>

              {/* Geofence Status Card */}
              <div className={`p-6 rounded-[32px] bg-white border shadow-sm transition-all duration-700 ${isViolating ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-100'}`}>
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className={`text-lg font-black tracking-tighter leading-tight ${isViolating ? 'text-red-600' : 'text-[#0B3D91]'}`}>
                         {isViolating ? "PROHIBITED ZONE ALERT" : "LOCATION STATUS: OK"}
                      </h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Geofence v5.2 Active</p>
                    </div>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isViolating ? 'bg-red-500 text-white animate-pulse' : 'bg-green-100 text-green-600'}`}>
                       {isViolating ? <ShieldX size={20} /> : <ShieldCheck size={20} />}
                    </div>
                 </div>
                 
                 <div className="h-40 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 mb-4 shadow-inner">
                    <VisualMap isViolating={isViolating} />
                 </div>

                 <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold italic">
                       Prohibited: Entry forbidden in <span className="text-red-600 font-black">{myData.prohibited_area}</span>. GPS is tracked 24/7.
                    </p>
                 </div>
              </div>

              {/* Digital Hazari Interface */}
              <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                 <div className="flex items-center justify-between">
                    <h4 className="font-black uppercase tracking-widest text-[10px] text-[#0B3D91] flex items-center gap-2">
                       <Clock size={14} /> Mandatory Check-in
                    </h4>
                    <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border">DAILY</span>
                 </div>

                 <div className="relative">
                   {!report ? (
                     <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer group">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#0B3D91] shadow-sm mb-3 group-hover:scale-105 transition-transform">
                          <Camera size={32} />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Take Selfie Hazari</span>
                        <input type="file" capture="user" accept="image/*" className="hidden" onChange={handleCapture} />
                     </label>
                   ) : (
                     <div className="relative animate-in zoom-in-95 duration-300">
                        <img src={report} className="w-full h-72 object-cover rounded-3xl border-4 border-white shadow-xl" alt="Liveness" />
                        <button onClick={() => setReport(null)} className="absolute top-4 right-4 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center font-black backdrop-blur-md">✕</button>
                     </div>
                   )}
                 </div>

                 <button 
                   disabled={!report || loading} 
                   onClick={handleCheckIn}
                   className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 text-[10px] ${report && !loading ? 'bg-[#0B3D91] text-white shadow-blue-900/20' : 'bg-slate-100 text-slate-400'}`}
                 >
                   {loading ? "Syncing GPS..." : "SUBMIT ATTENDANCE"}
                 </button>
              </div>
            </div>
          )}

          {activeTab === 'hazari' && (
            <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
               <div className="flex justify-between items-end">
                  <h2 className="text-xl font-black text-[#0B3D91] tracking-tight flex items-center gap-3">
                     <History size={24} /> Attendance History
                  </h2>
               </div>
               
               <div className="space-y-3">
                  {getStorage('tadipaarLogs', []).filter(l => l.aadhaar === user.aadhaar).map(log => (
                    <div key={log.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm">
                       <img src={log.image_url} className="w-14 h-14 rounded-xl object-cover border border-slate-50" alt="Hazari" />
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-[#0B3D91] truncate">{new Date(log.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(log.timestamp).toLocaleTimeString()}</p>
                       </div>
                       <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${log.is_violation ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {log.is_violation ? "Violation" : "OK"}
                       </div>
                    </div>
                  ))}
                  {getStorage('tadipaarLogs', []).filter(l => l.aadhaar === user.aadhaar).length === 0 && (
                    <div className="py-20 text-center">
                       <History size={40} className="text-slate-100 mx-auto mb-3" />
                       <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">No records found</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {activeTab === 'sos' && (
            <div className="animate-in slide-in-from-left-4 duration-500 space-y-6">
               <div className="bg-red-50 p-6 rounded-3xl border border-red-100 text-center space-y-4">
                  <LifeBuoy size={48} className="text-red-600 mx-auto animate-pulse" />
                  <h3 className="text-lg font-black tracking-tight text-red-700 uppercase">Emergency SOS</h3>
                  <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                    Legitimate emergency entry? Select below to alert the control room.
                  </p>
               </div>
               
               <div className="grid grid-cols-1 gap-3">
                  <SOSButton 
                    icon="🚑" 
                    title="Medical Emergency" 
                    desc="Urgent hospital visit required."
                    onClick={() => handleSOS("Medical Emergency")}
                  />
                  <SOSButton 
                    icon="⚖️" 
                    title="Court Summons" 
                    desc="Legal/Court order appearance."
                    onClick={() => handleSOS("Court Summons")}
                  />
                  <SOSButton 
                    icon="🕊️" 
                    title="Bereavement" 
                    desc="Immediate family death."
                    onClick={() => handleSOS("Family Bereavement")}
                  />
               </div>
            </div>
          )}
        </div>

        {/* Mobile App Bottom Navigation Bar */}
        <div className="absolute bottom-6 left-6 right-6 h-16 bg-white/90 backdrop-blur-xl rounded-full border border-slate-200 flex items-center justify-around px-2 z-50 shadow-2xl">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={LayoutDashboard} />
          <NavButton active={activeTab === 'hazari'} onClick={() => setActiveTab('hazari')} icon={History} />
          <NavButton active={activeTab === 'sos'} onClick={() => setActiveTab('sos')} icon={LifeBuoy} variant="danger" />
        </div>

        {/* Footer Attribution */}
        <div className="p-4 text-center">
           <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em] opacity-60">
              Maharashtra Police Enforcement • v5.2
           </p>
        </div>
      </div>
    </div>
  );
}

// --- Helper UI Components ---

const NavButton = ({ active, onClick, icon: Icon, variant = "primary" }) => (
  <button 
    onClick={onClick} 
    className={`p-3.5 transition-all duration-300 rounded-full flex items-center justify-center ${
      active 
        ? (variant === "danger" ? "bg-red-600 text-white shadow-lg" : "bg-[#0B3D91] text-white shadow-md scale-105") 
        : "text-slate-300"
    }`}
  >
    <Icon size={22} strokeWidth={active ? 3 : 2} />
  </button>
);

const SOSButton = ({ icon, title, desc, onClick }) => (
  <button 
    onClick={onClick} 
    className="w-full bg-white p-5 rounded-3xl border border-slate-100 text-left hover:border-red-300 transition-all shadow-sm active:scale-[0.98] flex gap-4"
  >
     <span className="text-2xl">{icon}</span>
     <div>
        <h5 className="font-black text-xs text-[#0B3D91] uppercase mb-0.5">{title}</h5>
        <p className="text-[9px] text-slate-400 font-bold">{desc}</p>
     </div>
  </button>
);