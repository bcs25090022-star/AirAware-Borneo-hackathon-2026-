import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Brain, 
  LineChart, 
  User, 
  Search, 
  Menu, 
  MapPin, 
  Wind, 
  Thermometer, 
  Droplets,
  ChevronRight,
  ShieldCheck,
  Zap,
  Navigation,
  Car,
  Heart,
  AlertTriangle,
  ArrowLeft,
  Globe,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  CreditCard,
  CheckCircle2,
  Bell,
  MessageSquare,
  BookOpen,
  CloudRain,
  Sun,
  ChevronDown,
  Mic,
  Plus,
  Map as MapIcon,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { AQIGauge } from './components/AQIGauge';

// --- Types ---
type Page = 'welcome' | 'login' | 'signup' | 'profile-setup' | 'dashboard' | 'map' | 'ai' | 'chat' | 'insights' | 'premium' | 'account';

interface HealthProfile {
  ageGroup: string;
  respiratoryCondition: string;
  exposureLevel: string;
  activityType: string;
}

// --- Mock Data ---
const trendData = [
  { time: '00:00', aqi: 45 },
  { time: '04:00', aqi: 38 },
  { time: '08:00', aqi: 62 },
  { time: '12:00', aqi: 85 },
  { time: '16:00', aqi: 70 },
  { time: '20:00', aqi: 55 },
  { time: '23:59', aqi: 48 },
];

const forecastData = [
  { day: 'Mon', aqi: 42, label: 'Good' },
  { day: 'Tue', aqi: 58, label: 'Moderate' },
  { day: 'Wed', aqi: 95, label: 'Moderate' },
  { day: 'Thu', aqi: 110, label: 'Sensitive' },
  { day: 'Fri', aqi: 75, label: 'Moderate' },
  { day: 'Sat', aqi: 35, label: 'Good' },
  { day: 'Sun', aqi: 30, label: 'Good' },
];

// --- App Component ---
export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    ageGroup: '',
    respiratoryCondition: '',
    exposureLevel: '',
    activityType: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [testAqi, setTestAqi] = useState(68);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Navigation Handlers ---
  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // --- Page Components ---

  const WelcomePage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-b from-[#F3E8D8] via-[#FADADD] to-[#DCE6ED]">
      {/* Floating Air Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Soft Circular Air Bubbles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            initial={{ opacity: 0, y: '100%' }}
            animate={{ 
              opacity: [0, 0.15, 0],
              y: '-20%',
              x: `${Math.sin(i) * 50}px`
            }}
            transition={{ 
              duration: 15 + i * 2, 
              repeat: Infinity, 
              delay: i * 3,
              ease: "linear" 
            }}
            className="absolute w-12 h-12 rounded-full bg-white blur-md"
            style={{ left: `${10 + i * 12}%` }}
          />
        ))}

        {/* Small Cloud Icons (SVG) */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            initial={{ opacity: 0, x: -100 }}
            animate={{ 
              opacity: [0, 0.1, 0],
              x: '110vw'
            }}
            transition={{ 
              duration: 25 + i * 5, 
              repeat: Infinity, 
              delay: i * 7,
              ease: "linear" 
            }}
            className="absolute text-white/20"
            style={{ top: `${15 + i * 20}%` }}
          >
            <svg width="64" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5,19c-3.037,0-5.5-2.463-5.5-5.5c0-0.104,0.003-0.207,0.009-0.31C11.385,13.07,10.706,13,10,13c-2.761,0-5,2.239-5,5 c0,2.761,2.239,5,5,5h7.5c2.485,0,4.5-2.015,4.5-4.5S19.985,14,17.5,14c-0.104,0-0.207,0.003-0.31,0.009 C17.07,11.385,17,10.706,17,10c0-2.761-2.239-5-5-5c-2.485,0-4.5,2.015-4.5,4.5c0,0.104,0.003,0.207,0.009,0.31 C7.385,9.93,6.706,10,6,10c-2.761,0-5,2.239-5,5c0,2.761,2.239,5,5,5h11.5c3.037,0,5.5-2.463,5.5-5.5S20.537,9,17.5,9" />
            </svg>
          </motion.div>
        ))}

        {/* Faint Wind Lines */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`line-${i}`}
            initial={{ opacity: 0, scaleX: 0, x: -200 }}
            animate={{ 
              opacity: [0, 0.05, 0],
              scaleX: [0.5, 1.5, 0.5],
              x: '120vw'
            }}
            transition={{ 
              duration: 12 + i * 3, 
              repeat: Infinity, 
              delay: i * 4,
              ease: "linear" 
            }}
            className="absolute h-[1px] bg-white/30 w-64 blur-[1px]"
            style={{ top: `${30 + i * 15}%` }}
          />
        ))}

        {/* Soft City Skyline Silhouette at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center gap-1 px-4 opacity-10 blur-[2px] pointer-events-none">
          <div className="w-12 h-24 bg-[#BCC6CC]" />
          <div className="w-16 h-40 bg-[#BCC6CC]" />
          <div className="w-10 h-32 bg-[#BCC6CC]" />
          <div className="w-20 h-56 bg-[#BCC6CC]" />
          <div className="w-14 h-48 bg-[#BCC6CC]" />
          <div className="w-24 h-64 bg-[#BCC6CC]" />
          <div className="w-18 h-44 bg-[#BCC6CC]" />
          <div className="w-12 h-36 bg-[#BCC6CC]" />
          <div className="w-20 h-52 bg-[#BCC6CC]" />
          <div className="w-16 h-28 bg-[#BCC6CC]" />
          <div className="w-14 h-40 bg-[#BCC6CC]" />
          <div className="w-24 h-60 bg-[#BCC6CC]" />
          <div className="w-18 h-44 bg-[#BCC6CC]" />
          <div className="w-12 h-36 bg-[#BCC6CC]" />
          <div className="w-20 h-52 bg-[#BCC6CC]" />
        </div>
      </div>

      {/* Language Selector Top-Right */}
      <div className="absolute top-8 right-8 z-20">
        <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20 shadow-sm cursor-pointer text-slate-700 min-w-[120px] justify-between">
          <span className="text-sm font-medium">English</span>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center relative z-10"
      >
        <h1 className="text-8xl font-black text-[#4A5568] tracking-tighter mb-6 opacity-80">
          AirAware
        </h1>
        <p className="text-[#718096] text-xl font-medium mb-12 tracking-wide max-w-md mx-auto leading-relaxed">
          Your Personal Air Guardian
        </p>
        <button 
          onClick={() => navigate('login')}
          className="bg-white/60 backdrop-blur-md text-[#4A5568] px-12 py-4 rounded-2xl font-bold text-xl shadow-sm border border-white/40 hover:bg-white/80 hover:scale-105 transition-all active:scale-95"
        >
          Start
        </button>
      </motion.div>
    </div>
  );

  const LoginPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-b from-[#F3E8D8] via-[#FADADD] to-[#DCE6ED]">
      {/* Background Decorative Elements (Simplified from Welcome) */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-30">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-[10%] right-[5%] w-48 h-48 rounded-full bg-white blur-3xl" />
      </div>

      <button 
        onClick={() => navigate('welcome')}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#4A5568] hover:text-primary transition-colors z-10"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back</span>
      </button>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/40 relative z-10"
      >
        <h2 className="text-3xl font-black text-[#4A5568] mb-2 opacity-80">Welcome Back</h2>
        <p className="text-[#718096] mb-8 font-medium">Login to your Air Guardian account</p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400"
            />
          </div>
          <button 
            onClick={() => navigate('profile-setup')}
            className="w-full bg-white/60 backdrop-blur-md text-[#4A5568] py-4 rounded-2xl font-bold text-lg shadow-sm border border-white/40 hover:bg-white/80 hover:scale-[1.02] transition-all active:scale-95 mt-4"
          >
            Login
          </button>
          <div className="text-center mt-6">
            <button 
              onClick={() => navigate('signup')}
              className="text-[#4A5568] font-bold hover:underline opacity-70"
            >
              Create Account
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const SignUpPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-b from-[#F3E8D8] via-[#FADADD] to-[#DCE6ED]">
      <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-30">
        <div className="absolute top-[20%] right-[10%] w-40 h-40 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-[20%] left-[10%] w-32 h-32 rounded-full bg-white blur-3xl" />
      </div>

      <button 
        onClick={() => navigate('login')}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#4A5568] hover:text-primary transition-colors z-10"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Login</span>
      </button>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/40 relative z-10"
      >
        <h2 className="text-3xl font-black text-[#4A5568] mb-2 opacity-80">Join AirAware</h2>
        <p className="text-[#718096] mb-8 font-medium">Start your journey to cleaner air</p>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe"
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="name@example.com"
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl bg-white/50 border border-white/60 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400"
            />
          </div>
          <button 
            onClick={() => navigate('profile-setup')}
            className="w-full bg-white/60 backdrop-blur-md text-[#4A5568] py-4 rounded-2xl font-bold text-lg shadow-sm border border-white/40 hover:bg-white/80 hover:scale-[1.02] transition-all active:scale-95 mt-4"
          >
            Create Account
          </button>
          <div className="text-center mt-6">
            <button 
              onClick={() => navigate('login')}
              className="text-[#4A5568] font-bold hover:underline opacity-70"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const ProfileSetupPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-[#F3E8D8] via-[#FADADD] to-[#DCE6ED] p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none select-none opacity-20">
        <div className="absolute top-[5%] left-[10%] w-64 h-64 rounded-full bg-white blur-[100px]" />
        <div className="absolute bottom-[5%] right-[10%] w-96 h-96 rounded-full bg-white blur-[120px]" />
      </div>

      <div className="max-w-md mx-auto relative z-10">
        <h2 className="text-3xl font-black text-[#4A5568] mb-2 opacity-80">Health Profile</h2>
        <p className="text-[#718096] mb-8 font-medium">Help us personalize your air quality recommendations.</p>
        
        <div className="space-y-6">
          <section>
            <label className="block text-sm font-bold text-[#4A5568] mb-3 uppercase tracking-[0.2em] opacity-60">Age Group</label>
            <div className="grid grid-cols-2 gap-3">
              {['Under 12', '13-18', '19-40', '41-60', 'Above 60'].map(age => (
                <button 
                  key={age}
                  onClick={() => setHealthProfile({...healthProfile, ageGroup: age})}
                  className={`px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${healthProfile.ageGroup === age ? 'bg-white/80 text-[#4A5568] border-white shadow-sm' : 'bg-white/30 border-white/40 text-[#4A5568]/60 hover:bg-white/50'}`}
                >
                  {age}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-bold text-[#4A5568] mb-3 uppercase tracking-[0.2em] opacity-60">Respiratory Condition</label>
            <div className="space-y-2">
              {['None', 'Asthma', 'Chronic condition'].map(cond => (
                <button 
                  key={cond}
                  onClick={() => setHealthProfile({...healthProfile, respiratoryCondition: cond})}
                  className={`w-full text-left px-5 py-4 rounded-2xl border text-sm font-bold transition-all ${healthProfile.respiratoryCondition === cond ? 'bg-white/80 text-[#4A5568] border-white shadow-sm' : 'bg-white/30 border-white/40 text-[#4A5568]/60 hover:bg-white/50'}`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-bold text-[#4A5568] mb-3 uppercase tracking-[0.2em] opacity-60">Outdoor Exposure</label>
            <div className="flex gap-3">
              {['Low', 'Moderate', 'High'].map(level => (
                <button 
                  key={level}
                  onClick={() => setHealthProfile({...healthProfile, exposureLevel: level})}
                  className={`flex-1 px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${healthProfile.exposureLevel === level ? 'bg-white/80 text-[#4A5568] border-white shadow-sm' : 'bg-white/30 border-white/40 text-[#4A5568]/60 hover:bg-white/50'}`}
                >
                  {level}
                </button>
              ))}
            </div>
          </section>

          <section>
            <label className="block text-sm font-bold text-[#4A5568] mb-3 uppercase tracking-[0.2em] opacity-60">Primary Activity</label>
            <div className="grid grid-cols-2 gap-3">
              {['Jogging', 'Walking', 'Driving', 'Cycling'].map(act => (
                <button 
                  key={act}
                  onClick={() => setHealthProfile({...healthProfile, activityType: act})}
                  className={`px-4 py-3 rounded-2xl border text-sm font-bold transition-all ${healthProfile.activityType === act ? 'bg-white/80 text-[#4A5568] border-white shadow-sm' : 'bg-white/30 border-white/40 text-[#4A5568]/60 hover:bg-white/50'}`}
                >
                  {act}
                </button>
              ))}
            </div>
          </section>

          <button 
            onClick={() => {
              setIsLoggedIn(true);
              navigate('dashboard');
            }}
            className="w-full bg-white/60 backdrop-blur-md text-[#4A5568] py-5 rounded-[2.5rem] font-black text-xl shadow-sm border border-white/40 hover:bg-white/80 hover:scale-[1.02] transition-all active:scale-95 mt-8 mb-12"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );

  const DashboardPage = () => (
    <div className="pb-32">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-4 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="font-bold text-primary text-2xl tracking-tight">AirAware</span>
        </div>
        
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Enter name of the location your looking"
                className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <button 
              onClick={() => navigate('map')}
              className="p-3 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
              title="Open Interactive Map"
            >
              <MapIcon size={20} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl relative">
            <Bell size={24} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Gauge & Weather */}
          <div className="lg:col-span-12 space-y-8">
            <section className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div 
                  onClick={() => navigate('map')}
                  className="flex flex-col gap-1 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-primary" />
                    <h2 className="text-2xl font-bold text-slate-800">Bukit Bintang, Kuala Lumpur</h2>
                  </div>
                  <div className="flex items-center gap-2 ml-7">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                    <span className="text-sm font-bold text-slate-500">Live AQI</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-secondary/10 px-3 py-1.5 rounded-full">
                    <ShieldCheck size={16} className="text-secondary" />
                    <span className="text-sm font-bold text-secondary">Safe for Outdoor</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center py-8">
                <AQIGauge aqi={testAqi} size={400} />
              </div>

              {/* Horizontal Metrics Scroll */}
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {[
                  { icon: Thermometer, label: 'Temperature', value: '31°C', color: 'text-orange-500', bg: 'bg-orange-50' },
                  { icon: Droplets, label: 'Humidity', value: '78%', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { icon: Wind, label: 'Primary pollution', value: 'PM2.5', color: 'text-primary', bg: 'bg-primary/5' },
                  { icon: CloudRain, label: 'Dust', value: '12 µg/m³', color: 'text-slate-500', bg: 'bg-slate-50' },
                  { icon: Sun, label: 'UV Index', value: '8.5 (High)', color: 'text-yellow-500', bg: 'bg-yellow-50' },
                ].map(item => (
                  <div key={item.label} className="min-w-[160px] bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-3 card-hover">
                    <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center ${item.color} shrink-0`}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50">
                <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                  <h3 className="text-purple-600 font-bold text-lg mb-4 flex items-center gap-2">
                    Today's Air Outlook
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-slate-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                      Air Quality worsen after 4PM
                    </li>
                    <li className="flex items-start gap-3 text-slate-700 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 shrink-0" />
                      Best outdoor time: 8AM - 11AM
                    </li>
                  </ul>
                </div>
              </div>

              {/* Simulation Control Removed */}
            </section>
          </div>
        </div>

        {/* Floating AI Chat Button */}
        <button 
          onClick={() => navigate('chat')}
          className="fixed bottom-32 right-8 z-[60] bg-white border-2 border-primary text-primary px-6 py-3 rounded-full font-bold shadow-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 group"
        >
          <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
          AI Chat
        </button>
      </main>
    </div>
  );

  const AIChatPage = () => {
    const [messages, setMessages] = useState([
      { role: 'assistant', content: 'Hello, what can i help you?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
      if (!input.trim()) return;
      const newMessages = [...messages, { role: 'user', content: input }];
      setMessages(newMessages);
      setInput('');
      
      // Mock response
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: "I'm your AirAware assistant. I can help you with local air quality data, health tips, and route optimization. How can I assist you further?" 
        }]);
      }, 1000);
    };

    return (
      <div className="h-[80vh] flex flex-col bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden mt-4">
        <header className="p-6 border-b border-slate-50 flex items-center justify-between bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <Brain size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">AirAware AI Assistant</h3>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <button onClick={() => navigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <ArrowLeft size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <button className="p-3 text-slate-400 hover:text-primary hover:bg-white rounded-2xl transition-all">
              <Plus size={20} />
            </button>
            <button className="p-3 text-slate-400 hover:text-primary hover:bg-white rounded-2xl transition-all">
              <Mic size={20} />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about air quality..."
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button 
              onClick={handleSend}
              className="bg-primary text-white p-3 rounded-2xl hover:bg-teal-800 transition-all shadow-lg shadow-primary/20"
            >
              <Zap size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MapPage = () => {
    const [selectedMarker, setSelectedMarker] = useState<any>(null);

    const markers = [
      { id: 1, name: 'Bukit Bintang', top: '30%', left: '40%', aqi: 45, color: 'bg-aqi-good', status: 'Good' },
      { id: 2, name: 'KLCC Park', top: '50%', left: '60%', aqi: 112, color: 'bg-aqi-sensitive', status: 'Sensitive' },
      { id: 3, name: 'Petaling Jaya', top: '20%', left: '70%', aqi: 68, color: 'bg-aqi-moderate', status: 'Moderate' },
      { id: 4, name: 'Cheras', top: '70%', left: '30%', aqi: 32, color: 'bg-aqi-good', status: 'Good' },
      { id: 5, name: 'Mont Kiara', top: '45%', left: '25%', aqi: 155, color: 'bg-aqi-unhealthy', status: 'Unhealthy' },
    ];

    return (
      <div className="h-screen flex flex-col bg-slate-900 relative overflow-hidden">
        <header className="p-4 flex items-center gap-4 bg-white/10 backdrop-blur-md absolute top-0 left-0 right-0 z-20">
          <button onClick={() => navigate('dashboard')} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 bg-white/20 rounded-full px-4 py-2 flex items-center gap-2 text-white border border-white/10">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Search other areas in KL..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-white/60"
            />
          </div>
        </header>

        {/* Simulated Interactive Map */}
        <div className="flex-1 relative overflow-hidden bg-slate-800">
          <motion.img 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src="https://picsum.photos/seed/kualalumpur/1200/1200" 
            alt="Map" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
          
          {/* Map Markers */}
          {markers.map((marker, idx) => (
            <motion.div 
              key={marker.id}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: idx * 0.1 + 0.5, type: 'spring' }}
              style={{ top: marker.top, left: marker.left }}
              onClick={() => setSelectedMarker(marker)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-white/30 flex items-center justify-center text-white text-xs font-black shadow-2xl cursor-pointer hover:scale-125 transition-all z-10 ${marker.color}`}
            >
              {marker.aqi}
              {/* Pulse effect */}
              <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${marker.color}`} />
            </motion.div>
          ))}

          {/* Selected Marker Info Card */}
          <AnimatePresence>
            {selectedMarker && (
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-[2.5rem] p-6 shadow-2xl z-30"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-xl font-black text-slate-800">{selectedMarker.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">Kuala Lumpur, Malaysia</p>
                  </div>
                  <button 
                    onClick={() => setSelectedMarker(null)}
                    className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white ${selectedMarker.color}`}>
                    <span className="text-2xl font-black">{selectedMarker.aqi}</span>
                    <span className="text-[8px] font-bold uppercase">AQI</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                      <span className={`text-xs font-black uppercase ${selectedMarker.color.replace('bg-', 'text-')}`}>
                        {selectedMarker.status}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${selectedMarker.color}`} 
                        style={{ width: `${(selectedMarker.aqi / 300) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('dashboard')}
                  className="w-full mt-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-teal-800 transition-all"
                >
                  View Full Details
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-32 right-6 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 z-10 hidden md:block">
          <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-3 opacity-60">AQI Legend</p>
          <div className="space-y-2">
            {[
              { label: 'Good', color: 'bg-aqi-good' },
              { label: 'Moderate', color: 'bg-aqi-moderate' },
              { label: 'Sensitive', color: 'bg-aqi-sensitive' },
              { label: 'Unhealthy', color: 'bg-aqi-unhealthy' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[10px] font-bold text-white uppercase">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const SmartAIPage = () => (
    <div className="pb-32 pt-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Smart AI Assistant</h2>
        <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-2xl font-bold text-sm">
          <Zap size={18} />
          PRO ACTIVE
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section 1: Route Suggestion */}
        <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Navigation size={24} />
            </div>
            <h3 className="font-bold text-xl text-slate-800">Smart Route Suggestion</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Current Activity</p>
              <p className="text-base font-bold text-slate-700">{healthProfile.activityType || 'Walking'}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Departure</p>
              <p className="text-base font-bold text-slate-700">Immediate</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-6 rounded-3xl border-2 border-primary bg-primary/5 relative group cursor-pointer transition-all">
              <div className="absolute top-4 right-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wider">RECOMMENDED</div>
              <p className="text-lg font-bold text-slate-800 mb-2">Route A (Park Side Path)</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <span className="text-sm text-slate-500 font-medium">AQI: 35</span>
                </div>
                <span className="text-sm text-secondary font-bold flex items-center gap-1">
                  <ShieldCheck size={16} /> 24% Exposure Reduction
                </span>
              </div>
            </div>
            <div className="p-6 rounded-3xl border border-slate-100 bg-white hover:border-slate-200 cursor-pointer transition-all">
              <p className="text-lg font-bold text-slate-800 mb-2">Route B (Main Roadway)</p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-aqi-moderate" />
                  <span className="text-sm text-slate-500 font-medium">AQI: 82</span>
                </div>
                <span className="text-sm text-slate-400">Standard Exposure</span>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-8">
          {/* Section 2: Driving Mode */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                  <Car size={24} />
                </div>
                <h3 className="font-bold text-xl text-slate-800">Smart Driving Health</h3>
              </div>
              <div className="w-14 h-7 bg-primary rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-md" />
              </div>
            </div>
            <div className="p-6 bg-accent/5 rounded-3xl border border-accent/10 mb-4">
              <p className="text-sm text-slate-700 leading-relaxed">
                <strong className="text-accent">AI Insight:</strong> Particulate matter (PM2.5) is rising on your route. We recommend activating internal air recirculation and keeping windows closed for the next 15 minutes.
              </p>
            </div>
            <div className="flex items-center gap-3 text-red-500 bg-red-50 p-4 rounded-2xl border border-red-100">
              <AlertTriangle size={20} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest">High Emission Zone Alert</span>
                <span className="text-xs font-medium">Entering congestion zone in 500m</span>
              </div>
            </div>
          </section>

          {/* Section 3: Health Advisor */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                <Heart size={24} />
              </div>
              <h3 className="font-bold text-xl text-slate-800">Personal Health Advisor</h3>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                <span className="text-base text-slate-500 font-medium">Personal Risk Level</span>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                  <span className="text-base font-bold text-secondary">Low Risk</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3">Tailored Recommendation</p>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Based on your <span className="font-bold text-primary">{healthProfile.respiratoryCondition || 'standard'}</span> profile and current {testAqi} AQI, outdoor {healthProfile.activityType || 'exercise'} is considered safe.
                </p>
              </div>
              {testAqi > 100 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-100 flex items-center gap-4"
                >
                  <div className="w-12 h-12 bg-orange-200 rounded-2xl flex items-center justify-center shadow-sm">
                    <Wind size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider block">Mask Suggestion</span>
                    <span className="text-sm font-bold">N95 or FFP2 Recommended</span>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const InsightsPage = () => (
    <div className="pb-32 pt-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Air Insights</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h3 className="font-bold text-xl text-slate-800 mb-6">Latest Global News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'New Urban Green Zone Initiative Launches in Sydney', tag: 'Environment', img: 'https://picsum.photos/seed/park/600/400', date: 'Feb 28, 2026' },
                { title: 'Understanding PM2.5: The Invisible Health Threat', tag: 'Health', img: 'https://picsum.photos/seed/micro/600/400', date: 'Feb 25, 2026' },
                { title: 'Electric Vehicle Adoption Reduces City Smog by 15%', tag: 'Technology', img: 'https://picsum.photos/seed/car/600/400', date: 'Feb 22, 2026' },
                { title: 'New Air Filtration Standards for Public Schools', tag: 'Policy', img: 'https://picsum.photos/seed/school/600/400', date: 'Feb 20, 2026' },
              ].map((news, i) => (
                <div key={i} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm card-hover flex flex-col">
                  <img src={news.img} alt={news.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-lg">{news.tag}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{news.date}</span>
                    </div>
                    <h4 className="font-bold text-lg text-slate-800 leading-snug mb-4 flex-1">{news.title}</h4>
                    <button className="text-sm font-bold text-primary flex items-center gap-1 hover:gap-2 transition-all">Read Full Article <ChevronRight size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-primary text-white p-8 rounded-[3rem] shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-2xl mb-6">3-Layer Protection</h3>
              <div className="space-y-8">
                {[
                  { layer: '1. Awareness', desc: 'Monitor live AQI and receive real-time alerts for your specific location.', icon: Wind },
                  { layer: '2. Planning', desc: 'Use Smart AI to choose clean routes and optimal times for outdoor activities.', icon: Navigation },
                  { layer: '3. Action', desc: 'Wear appropriate protection and adjust indoor filtration systems.', icon: ShieldCheck },
                ].map(item => (
                  <div key={item.layer} className="flex gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-accent text-lg mb-1">{item.layer}</p>
                      <p className="text-sm text-white/80 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
          </section>

          <section className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-xl text-slate-800 mb-6">AQI Scale Guide</h3>
            <div className="space-y-3">
              {[
                { label: 'Good', range: '0-50', color: 'bg-aqi-good', desc: 'Air quality is satisfactory.' },
                { label: 'Moderate', range: '51-100', color: 'bg-aqi-moderate', desc: 'Acceptable quality.' },
                { label: 'Sensitive', range: '101-150', color: 'bg-aqi-sensitive', desc: 'Health effects for some.' },
                { label: 'Unhealthy', range: '151-200', color: 'bg-aqi-unhealthy', desc: 'Everyone may experience effects.' },
                { label: 'Very Unhealthy', range: '201-300', color: 'bg-aqi-very-unhealthy', desc: 'Health alert.' },
                { label: 'Hazardous', range: '301+', color: 'bg-aqi-hazardous', desc: 'Emergency conditions.' },
              ].map(level => (
                <div key={level.label} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className={`w-4 h-4 rounded-full ${level.color} shrink-0 shadow-sm`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-bold text-slate-800">{level.label}</p>
                      <p className="text-[10px] font-bold text-slate-400">{level.range}</p>
                    </div>
                    <p className="text-[10px] text-slate-500">{level.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const PremiumPage = () => (
    <div className="pb-24 p-4">
      <div className="text-center mb-10 mt-6">
        <div className="inline-flex p-3 bg-accent/10 rounded-2xl text-accent mb-4">
          <Zap size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Go Premium</h2>
        <p className="text-slate-500">Unlock the full power of AirAware AI</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Feature</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">Free</th>
              <th className="p-4 text-xs font-bold text-primary uppercase text-center">Pro</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {[
              { name: 'Live AQI', free: true, pro: true },
              { name: 'Basic Forecast', free: true, pro: true },
              { name: 'Limited AI Chat', free: true, pro: true },
              { name: 'Smart Route Suggestion', free: false, pro: true },
              { name: 'Smart Driving Mode', free: false, pro: true },
              { name: 'Health Advisor', free: false, pro: true },
            ].map((row, i) => (
              <tr key={i} className="border-b border-slate-50">
                <td className="p-4 font-medium text-slate-700">{row.name}</td>
                <td className="p-4 text-center">
                  {row.free ? <CheckCircle2 size={18} className="text-secondary mx-auto" /> : <span className="text-slate-300">-</span>}
                </td>
                <td className="p-4 text-center">
                  <CheckCircle2 size={18} className="text-primary mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <button className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-teal-800 transition-all">
          Upgrade to Premium
        </button>
        <p className="text-center text-xs text-slate-400">Cancel anytime. $4.99/month</p>
      </div>
    </div>
  );

  const AccountPage = () => (
    <div className="pb-24 p-4 space-y-6">
      <div className="flex items-center gap-4 mb-8 mt-4">
        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">User Profile</h2>
          <p className="text-sm text-slate-500">Premium Member</p>
        </div>
      </div>

      <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Health Profile</h3>
          <button onClick={() => navigate('profile-setup')} className="text-xs font-bold text-primary">EDIT</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Age Group</p>
            <p className="text-sm font-medium text-slate-700">{healthProfile.ageGroup || 'Not set'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Condition</p>
            <p className="text-sm font-medium text-slate-700">{healthProfile.respiratoryCondition || 'None'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Exposure</p>
            <p className="text-sm font-medium text-slate-700">{healthProfile.exposureLevel || 'Moderate'}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Activity</p>
            <p className="text-sm font-medium text-slate-700">{healthProfile.activityType || 'Walking'}</p>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 text-slate-700 font-medium">
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-slate-400" />
            <span>Subscription Status</span>
          </div>
          <span className="text-xs font-bold text-secondary">ACTIVE</span>
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 text-slate-700 font-medium">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-slate-400" />
            <span>App Settings</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>
      </section>

      <button 
        onClick={() => navigate('welcome')}
        className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-bold mt-8 border border-red-100"
      >
        Logout
      </button>
    </div>
  );

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-background relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {currentPage === 'welcome' && <WelcomePage />}
          {currentPage === 'login' && <LoginPage />}
          {currentPage === 'signup' && <SignUpPage />}
          {currentPage === 'profile-setup' && <ProfileSetupPage />}
          {currentPage === 'chat' && <AIChatPage />}
          
          {/* Main App Container for Dashboard-like pages */}
          {['dashboard', 'map', 'ai', 'insights', 'premium', 'account'].includes(currentPage) && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {currentPage === 'dashboard' && <DashboardPage />}
              {currentPage === 'map' && <MapPage />}
              {currentPage === 'ai' && <SmartAIPage />}
              {currentPage === 'insights' && <InsightsPage />}
              {currentPage === 'premium' && <PremiumPage />}
              {currentPage === 'account' && <AccountPage />}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation - Centered and wider on desktop */}
      {['dashboard', 'ai', 'insights', 'account', 'premium'].includes(currentPage) && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white/80 backdrop-blur-xl border border-slate-200 px-8 py-4 flex items-center justify-between z-50 rounded-3xl shadow-2xl shadow-primary/10">
          {[
            { icon: Home, label: 'Home', page: 'dashboard' },
            { icon: BookOpen, label: 'Do you know?', page: 'insights' },
            { icon: Brain, label: 'Smart AI', page: 'ai' },
          ].map(item => (
            <button 
              key={item.label}
              onClick={() => navigate(item.page as Page)}
              className={`flex flex-col items-center gap-1.5 transition-all group ${currentPage === item.page ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${currentPage === item.page ? 'bg-primary/10' : 'group-hover:bg-slate-100'}`}>
                <item.icon size={24} strokeWidth={currentPage === item.page ? 2.5 : 2} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
