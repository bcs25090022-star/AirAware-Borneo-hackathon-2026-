import { GoogleGenAI } from "@google/genai";
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Home, 
  Lightbulb, 
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
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Footprints,
  Bike,
  Activity,
  Calendar,
  Clock,
  ExternalLink,
  Leaf,
  Trees,
  Users,
  Flame,
  Gauge,
  Smile,
  Newspaper,
  Key,
  ArrowRight,
  BrainCircuit,
  CalendarCheck,
  AlertCircle,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LabelList,
  ReferenceLine
} from 'recharts';
import { AQIGauge } from './components/AQIGauge';

// --- Types ---
type Page = 'welcome' | 'login' | 'signup' | 'forgot-password' | 'profile-setup' | 'dashboard' | 'map' | 'ai' | 'chat' | 'insights' | 'premium' | 'account' | 'app-settings' | 'about' | 'help' | 'news-article' | 'event-registration';

interface HealthProfile {
  ageGroup: string;
  respiratoryCondition: string;
  exposureLevel: string;
  activityType: string;
}

// --- Mock Data ---
const hourlyForecast = [
  { time: '00:00', aqi: 42 },
  { time: '02:00', aqi: 38 },
  { time: '04:00', aqi: 35 },
  { time: '06:00', aqi: 40 },
  { time: '08:00', aqi: 45 },
  { time: '10:00', aqi: 52 },
  { time: '12:00', aqi: 58 },
  { time: '14:00', aqi: 65 },
  { time: '16:00', aqi: 72 },
  { time: '18:00', aqi: 68 },
  { time: '20:00', aqi: 55 },
  { time: '22:00', aqi: 48 },
];

const dailyForecast = [
  { 
    day: 'Mon', date: 'Mar 02', aqi: 45, status: 'Good', color: 'bg-aqi-good', risk: 'Low', trend: 'down', wind: 12,
    outdoorScore: 95, recommendation: 'Perfect for all outdoor activities.', bestTime: '6AM - 11AM', 
    activities: ['Walking', 'Jogging', 'Cycling'], mask: 'Not required'
  },
  { 
    day: 'Tue', date: 'Mar 03', aqi: 52, status: 'Moderate', color: 'bg-aqi-moderate', risk: 'Moderate', trend: 'up', wind: 8,
    outdoorScore: 78, recommendation: 'Good, but sensitive groups should limit exertion.', bestTime: '7AM - 10AM',
    activities: ['Walking', 'Light Jogging'], mask: 'Optional for sensitive groups'
  },
  { 
    day: 'Wed', date: 'Mar 04', aqi: 110, status: 'Sensitive', color: 'bg-aqi-sensitive', risk: 'High', trend: 'up', wind: 5,
    outdoorScore: 42, recommendation: 'Limit outdoor exposure. Peak pollution expected.', bestTime: '6AM - 8AM',
    activities: ['Indoor Yoga', 'Short Walk'], mask: 'Recommended (KN95)'
  },
  { 
    day: 'Thu', date: 'Mar 05', aqi: 85, status: 'Moderate', color: 'bg-aqi-moderate', risk: 'Moderate', trend: 'down', wind: 10,
    outdoorScore: 65, recommendation: 'Improving. Afternoon is better for exercise.', bestTime: '4PM - 7PM',
    activities: ['Walking', 'Cycling'], mask: 'Optional'
  },
  { 
    day: 'Fri', date: 'Mar 06', aqi: 40, status: 'Good', color: 'bg-aqi-good', risk: 'Low', trend: 'down', wind: 15,
    outdoorScore: 98, recommendation: 'Excellent air quality. Enjoy the outdoors!', bestTime: 'All Day',
    activities: ['Hiking', 'Jogging', 'Cycling'], mask: 'Not required'
  },
  { 
    day: 'Sat', date: 'Mar 07', aqi: 35, status: 'Good', color: 'bg-aqi-good', risk: 'Low', trend: 'down', wind: 18,
    outdoorScore: 100, recommendation: 'Best air quality of the week.', bestTime: 'All Day',
    activities: ['Any Outdoor Sport'], mask: 'Not required'
  },
  { 
    day: 'Sun', date: 'Mar 08', aqi: 48, status: 'Good', color: 'bg-aqi-good', risk: 'Low', trend: 'up', wind: 14,
    outdoorScore: 92, recommendation: 'Great conditions for family outings.', bestTime: '7AM - 12PM',
    activities: ['Walking', 'Cycling'], mask: 'Not required'
  },
];

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

const newsArticles = [
  {
    id: 'my-1',
    region: 'Malaysia',
    title: 'Kuala Lumpur Air Quality Improves as Monsoon Season Begins',
    summary: 'Recent heavy rainfall across the Klang Valley has led to a significant improvement in air quality indices...',
    content: `
      KUALA LUMPUR - The Department of Environment (DOE) has reported a marked improvement in air quality across the Klang Valley following the onset of the Northeast Monsoon. 
      
      Air Quality Index (AQI) readings in areas like Cheras, Batu Muda, and Petaling Jaya have consistently stayed within the "Good" range (below 50) for the past 48 hours. This is a welcome change from the "Moderate" levels observed during the preceding dry spell.
      
      Meteorologists predict that the increased rainfall will continue to "wash" the atmosphere of particulate matter, particularly PM2.5, which had been slightly elevated due to localized peat fires and traffic emissions. 
      
      However, health experts advise citizens to remain vigilant about sudden weather changes and to monitor the AirAware app for real-time updates as localized haze can still occur during brief dry periods between rainstorms.
    `,
    date: 'March 07, 2026',
    image: 'https://picsum.photos/seed/kl-rain/800/400'
  },
  {
    id: 'gl-1',
    region: 'Global',
    title: 'New WHO Guidelines Set Stricter Limits on Urban Air Pollution',
    summary: 'The World Health Organization has released updated guidelines aimed at reducing the health impact of nitrogen dioxide...',
    content: `
      GENEVA - The World Health Organization (WHO) has issued its most stringent air quality guidelines to date, reflecting the growing body of evidence linking even low levels of pollution to serious health conditions.
      
      The new recommendations significantly lower the recommended annual average levels for key pollutants, including PM2.5 and Nitrogen Dioxide (NO2). The WHO warns that air pollution is now one of the biggest environmental threats to human health, alongside climate change.
      
      "Clean air should be a fundamental human right," said a WHO spokesperson. "These new limits are designed to protect the most vulnerable populations, including children, the elderly, and those with pre-existing respiratory conditions."
      
      Cities worldwide are now being urged to accelerate their transition to green energy and implement more robust public transportation systems to meet these new standards.
    `,
    date: 'March 06, 2026',
    image: 'https://picsum.photos/seed/who-city/800/400'
  }
];

// --- Sub-components ---

const AppIcon = ({ size = 40, className = "" }: { size?: number, className?: string }) => (
  <motion.div 
    animate={{ 
      scale: [1, 1.02, 1],
    }}
    transition={{ 
      duration: 4, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className={`relative flex items-center justify-center shrink-0 ${className}`}
    style={{ width: size, height: size }}
  >
    {/* Dashed Outer Circle */}
    <div className="absolute inset-0 border-2 border-dashed border-emerald-200/60 rounded-full animate-[spin_30s_linear_infinite]" />
    
    {/* Main Circular Container */}
    <div className="absolute inset-[8%] rounded-full bg-white border-[3px] border-emerald-500 shadow-lg overflow-hidden flex items-center justify-center">
      {/* Wavy Background at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-emerald-50/30">
        <svg viewBox="0 0 100 40" className="w-full h-full opacity-60" preserveAspectRatio="none">
          <path d="M0 20 Q 25 10, 50 20 T 100 20 V 40 H 0 Z" fill="#10b981" fillOpacity="0.1" />
          <path d="M0 25 Q 25 15, 50 25 T 100 25 V 40 H 0 Z" fill="#10b981" fillOpacity="0.2" />
        </svg>
      </div>

      {/* Heart-shaped Leaf */}
      <div className="relative z-10 w-[65%] h-[65%] flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
          <defs>
            <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Heart Leaf Shape */}
          <path 
            d="M50 85 C 50 85 15 65 15 35 C 15 15 35 10 50 30 C 65 10 85 15 85 35 C 85 65 50 85 50 85 Z" 
            fill="url(#leafGradient)"
          />
          {/* Leaf Vein */}
          <path d="M50 30 L 50 75" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <path d="M50 45 L 35 38" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M50 45 L 65 38" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M50 60 L 38 55" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M50 60 L 62 55" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </svg>
      </div>
    </div>
  </motion.div>
);

const Logo = ({ className = "h-12 w-auto", showText = true, size = 40 }: { className?: string, showText?: boolean, size?: number }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <AppIcon size={size} />
    {showText && (
      <span className="font-black tracking-tighter text-slate-900 flex items-baseline" style={{ fontSize: size * 0.55 }}>
        Air<span className="text-emerald-600 ml-0.5">Aware</span>
      </span>
    )}
  </div>
);

const SkylineBackground = () => (
  <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
    {/* Floating Particles */}
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={`particle-${i}`}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.12, 0],
          y: [0, -60, 0],
          x: [0, (i % 2 === 0 ? 15 : -15), 0]
        }}
        transition={{ 
          duration: 15 + i * 2, 
          repeat: Infinity, 
          delay: i * 0.3,
          ease: "easeInOut" 
        }}
        className="absolute w-1 h-1 rounded-full bg-[#4A908F]"
        style={{ 
          left: `${(i * 7) % 100}%`, 
          top: `${(i * 13) % 100}%` 
        }}
      />
    ))}

    {/* City Skyline Silhouette */}
    <div 
      className="absolute bottom-0 left-0 right-0 h-64 flex items-end justify-center opacity-[0.04] pointer-events-none"
      style={{
        maskImage: 'linear-gradient(to top, black 40%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 100%)'
      }}
    >
      <div className="flex items-end gap-1 px-4 w-full justify-center">
        <div className="w-10 h-20 bg-[#4A908F]" />
        <div className="w-14 h-36 bg-[#4A908F]" />
        <div className="w-8 h-28 bg-[#4A908F]" />
        <div className="w-18 h-48 bg-[#4A908F] relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-[#4A908F]" />
        </div>
        <div className="w-12 h-40 bg-[#4A908F]" />
        
        {/* Petronas Towers */}
        <div className="flex gap-1 items-end mx-2">
          <div className="w-10 h-64 bg-[#4A908F] relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-[#4A908F]" />
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#4A908F]/20" />
          </div>
          <div className="w-6 h-12 bg-[#4A908F] self-center mb-24 rounded-sm" />
          <div className="w-10 h-64 bg-[#4A908F] relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-[#4A908F]" />
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#4A908F]/20" />
          </div>
        </div>

        <div className="w-16 h-40 bg-[#4A908F]" />
        <div className="w-10 h-32 bg-[#4A908F]" />
        <div className="w-18 h-48 bg-[#4A908F]" />
        <div className="w-14 h-24 bg-[#4A908F]" />
        <div className="w-12 h-36 bg-[#4A908F]" />
        <div className="w-20 h-52 bg-[#4A908F]" />
      </div>
    </div>
  </div>
);

const WelcomePage = ({ onNavigate, language, setLanguage }: { onNavigate: (page: Page) => void, language: string, setLanguage: (lang: string) => void }) => {
  const [showLangs, setShowLangs] = useState(false);
  const langs = ['English', 'Bahasa Melayu', 'Mandarin', 'Tamil'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E6F7F5 0%, #F8FAFC 100%)' }}>
      <SkylineBackground />

      {/* Language Selector Top-Right */}
      <div className="absolute top-8 right-8 z-20">
        <div 
          onClick={() => setShowLangs(!showLangs)}
          className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/40 shadow-sm cursor-pointer text-slate-700 min-w-[130px] justify-between hover:bg-white/80 transition-all relative"
        >
          <span className="text-sm font-semibold">{language}</span>
          <ChevronDown size={18} className={`text-slate-400 transition-transform ${showLangs ? 'rotate-180' : ''}`} />
          
          <AnimatePresence>
            {showLangs && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full right-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
              >
                {langs.map(lang => (
                  <button
                    key={lang}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLanguage(lang);
                      setShowLangs(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-slate-50 transition-colors ${language === lang ? 'text-primary bg-primary/5' : 'text-slate-600'}`}
                  >
                    {lang}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Logo Top Center */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20">
        <Logo size={80} className="flex-col !gap-4" />
      </div>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-center relative z-10 mt-24"
      >
        <p className="text-[#718096] text-xl font-medium mb-12 tracking-wide max-w-md mx-auto opacity-90">
          Your Personal Air Guardian
        </p>
        <button 
          onClick={() => onNavigate('login')}
          className="bg-[#4A908F] text-white px-16 py-4.5 rounded-[1.25rem] font-bold text-xl shadow-xl shadow-[#4A908F]/25 hover:bg-[#3D7A79] hover:scale-[1.03] transition-all active:scale-95"
        >
          Start
        </button>
      </motion.div>
    </div>
  );
};

const LoginPage = ({ onNavigate, onLogin }: { onNavigate: (page: Page) => void, onLogin: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E6F7F5 0%, #F8FAFC 100%)' }}>
    <SkylineBackground />

    <button 
      onClick={() => onNavigate('welcome')}
      className="absolute top-6 left-6 flex items-center gap-2 text-[#4A5568] hover:text-primary transition-colors z-10"
    >
      <ArrowLeft size={20} />
      <span className="font-medium">Back</span>
    </button>
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white/30 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/40 relative z-10"
    >
      <div className="flex justify-center mb-6">
        <Logo size={48} />
      </div>
      <h2 className="text-2xl font-black text-[#4A5568] mb-2 opacity-80 text-center">Welcome Back</h2>
      <p className="text-[#718096] mb-8 font-medium text-center">Login to your Air Guardian account</p>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Email Address</label>
          <input 
            type="email" 
            placeholder="name@example.com"
            className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-white/40 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-white/40 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400 shadow-sm"
          />
          <div className="flex justify-end mt-2">
            <button 
              onClick={() => onNavigate('forgot-password')}
              className="text-xs font-bold text-[#4A908F] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>
        <button 
          onClick={onLogin}
          className="w-full bg-[#4A908F] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#4A908F]/20 hover:bg-[#3D7A79] hover:scale-[1.02] transition-all active:scale-95 mt-4"
        >
          Login
        </button>
        <div className="text-center mt-6">
          <button 
            onClick={() => onNavigate('signup')}
            className="text-[#4A5568] font-bold hover:underline opacity-70"
          >
            Create Account
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

const ForgotPasswordPage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E6F7F5 0%, #F8FAFC 100%)' }}>
      <SkylineBackground />

      <button 
        onClick={() => onNavigate('login')}
        className="absolute top-6 left-6 flex items-center gap-2 text-[#4A5568] hover:text-primary transition-colors z-10"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Login</span>
      </button>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/30 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/40 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
            <Key size={32} />
          </div>
        </div>
        <h2 className="text-2xl font-black text-[#4A5568] mb-2 opacity-80 text-center">Forgot Password?</h2>
        <p className="text-[#718096] mb-8 font-medium text-center">No worries, we'll send you reset instructions.</p>
        
        {!isSubmitted ? (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-white/40 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400 shadow-sm"
              />
            </div>
            <button 
              onClick={() => setIsSubmitted(true)}
              className="w-full bg-[#4A908F] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#4A908F]/20 hover:bg-[#3D7A79] hover:scale-[1.02] transition-all active:scale-95 mt-4"
            >
              Reset Password
            </button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 text-sm font-medium">
              Check your email! We've sent password reset instructions to <strong className="font-bold">{email}</strong>.
            </div>
            <button 
              onClick={() => onNavigate('login')}
              className="text-[#4A908F] font-bold hover:underline"
            >
              Back to Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const NewsArticlePage = ({ article, onNavigate }: { article: any, onNavigate: (page: Page) => void }) => {
  if (!article) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={() => onNavigate('insights')}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-slate-800 truncate">{article.title}</h2>
      </header>

      <div className="max-w-3xl mx-auto px-6 pt-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
            {article.region}
          </span>
          <span className="text-xs font-bold text-slate-400">{article.date}</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-8 leading-tight">
          {article.title}
        </h1>

        <div className="rounded-[2.5rem] overflow-hidden mb-10 shadow-xl shadow-slate-200/50">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="prose prose-slate max-w-none">
          {article.content.split('\n\n').map((paragraph: string, i: number) => (
            <p key={i} className="text-slate-600 text-lg leading-relaxed mb-6 font-medium">
              {paragraph.trim()}
            </p>
          ))}
        </div>

        <div className="mt-12 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
          <h4 className="font-black text-slate-800 mb-2">Stay Informed with AirAware</h4>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            We monitor air quality trends globally to keep you safe. Enable notifications to get real-time alerts about pollution spikes in your area.
          </p>
        </div>
      </div>
    </div>
  );
};

const SignUpPage = ({ onNavigate, userName, setUserName, onSignUp }: { onNavigate: (page: Page) => void, userName: string, setUserName: (val: string) => void, onSignUp: () => void }) => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E6F7F5 0%, #F8FAFC 100%)' }}>
    <SkylineBackground />

    <button 
      onClick={() => onNavigate('login')}
      className="absolute top-6 left-6 flex items-center gap-2 text-[#4A5568] hover:text-primary transition-colors z-10"
    >
      <ArrowLeft size={20} />
      <span className="font-medium">Back to Login</span>
    </button>
    
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-white/30 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/40 relative z-10"
    >
      <div className="flex justify-center mb-6">
        <Logo size={48} />
      </div>
      <p className="text-[#718096] mb-8 font-medium text-center">Start your journey to cleaner air</p>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Full Name</label>
          <input 
            type="text" 
            placeholder="John Doe"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-white/40 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Email Address</label>
          <input 
            type="email" 
            placeholder="name@example.com"
            className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-white/40 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#4A5568] mb-2 ml-1">Password</label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full px-5 py-4 rounded-2xl bg-white/80 border border-white/40 focus:outline-none focus:ring-4 focus:ring-white/20 focus:bg-white transition-all text-[#4A5568] placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <button 
          onClick={onSignUp}
          className="w-full bg-[#4A908F] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#4A908F]/20 hover:bg-[#3D7A79] hover:scale-[1.02] transition-all active:scale-95 mt-4"
        >
          Create Account
        </button>
        <div className="text-center mt-6">
          <button 
            onClick={() => onNavigate('login')}
            className="text-[#4A5568] font-bold hover:underline opacity-70"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </motion.div>
  </div>
);

const ProfileSetupPage = ({ onNavigate, setupSource, healthProfile, setHealthProfile, onSave }: { onNavigate: (page: Page) => void, setupSource: 'signup' | 'account', healthProfile: HealthProfile, setHealthProfile: (p: HealthProfile) => void, onSave: () => void }) => (
  <div className="min-h-screen p-6 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #E6F7F5 0%, #F8FAFC 100%)' }}>
    <SkylineBackground />

    <div className="max-w-md mx-auto relative z-10">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => onNavigate(setupSource === 'signup' ? 'signup' : 'account')}
          className="p-2 bg-white/60 backdrop-blur-md rounded-full text-[#4A5568] hover:text-primary transition-all shadow-sm border border-white/40"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-3xl font-black text-slate-800">Health Profile</h2>
      </div>
      <p className="text-slate-600 mb-8 font-bold">Help us personalize your air quality recommendations.</p>
      
      <div className="space-y-6">
        <section>
          <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-[0.2em]">Age Group</label>
          <div className="grid grid-cols-2 gap-3">
            {['Under 12', '13-18', '19-40', '41-60', 'Above 60'].map(age => (
              <button 
                key={age}
                onClick={() => setHealthProfile({...healthProfile, ageGroup: age})}
                className={`px-4 py-3 rounded-2xl border-2 text-sm font-black transition-all ${healthProfile.ageGroup === age ? 'bg-white text-emerald-700 border-emerald-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
              >
                {age}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-[0.2em]">Respiratory Condition</label>
          <div className="space-y-2">
            {['None', 'Asthma', 'Chronic condition'].map(cond => (
              <button 
                key={cond}
                onClick={() => setHealthProfile({...healthProfile, respiratoryCondition: cond})}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-sm font-black transition-all ${healthProfile.respiratoryCondition === cond ? 'bg-white text-emerald-700 border-emerald-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
              >
                {cond}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-[0.2em]">Outdoor Exposure</label>
          <div className="flex gap-3">
            {['Low', 'Moderate', 'High'].map(level => (
              <button 
                key={level}
                onClick={() => setHealthProfile({...healthProfile, exposureLevel: level})}
                className={`flex-1 px-4 py-3 rounded-2xl border-2 text-sm font-black transition-all ${healthProfile.exposureLevel === level ? 'bg-white text-emerald-700 border-emerald-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="block text-sm font-black text-slate-700 mb-3 uppercase tracking-[0.2em]">Primary Activity</label>
          <div className="grid grid-cols-2 gap-3">
            {['Jogging', 'Walking', 'Driving', 'Cycling'].map(act => (
              <button 
                key={act}
                onClick={() => setHealthProfile({...healthProfile, activityType: act})}
                className={`px-4 py-3 rounded-2xl border-2 text-sm font-black transition-all ${healthProfile.activityType === act ? 'bg-white text-emerald-700 border-emerald-600 shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
              >
                {act}
              </button>
            ))}
          </div>
        </section>

        <button 
          onClick={onSave}
          className="w-full bg-[#4A908F] text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-[#4A908F]/25 hover:bg-[#3D7A79] hover:scale-[1.02] transition-all active:scale-95 mt-8 mb-12"
        >
          Save Profile
        </button>
      </div>
    </div>
  </div>
);

// --- App Component ---
// --- Sub-pages moved outside App to prevent re-mounting issues ---

const AIChatPage = ({ 
  chatMessages, 
  setChatMessages, 
  isTyping, 
  setIsTyping, 
  healthProfile, 
  navigate,
  Logo
}: { 
  chatMessages: any[], 
  setChatMessages: React.Dispatch<React.SetStateAction<any[]>>, 
  isTyping: boolean, 
  setIsTyping: (typing: boolean) => void, 
  healthProfile: HealthProfile,
  navigate: (page: Page) => void,
  Logo: any
}) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMessage = { role: 'user', content: input };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setInput('');
    setIsTyping(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";
      
      // Prepare history for the model
      const history = chatMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content) }]
      }));

      const response = await ai.models.generateContent({
        model,
        contents: [
          ...history,
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: `You are AirAware AI, a specialized assistant for air quality and respiratory health. 
          Current context: 
          - User Health Profile: ${JSON.stringify(healthProfile)}
          - Current AQI: 110 (Sensitive)
          - Location: San Francisco, CA
          
          Provide concise, helpful, and scientifically accurate advice. 
          
          If the user asks for a "health report", "analysis", or "summary", you MUST respond with a JSON object in this format:
          {
            "type": "report-card",
            "risk": "Risk Level (e.g., Moderate Risk)",
            "riskColor": "Tailwind text color (e.g., text-amber-500)",
            "riskBg": "Tailwind bg color (e.g., bg-amber-50)",
            "summary": "A concise summary of the current situation.",
            "protection": ["Tip 1", "Tip 2"],
            "advisory": {
              "bestTime": "Time range",
              "avoid": "What to avoid"
            },
            "diet": ["Diet tip 1", "Diet tip 2"]
          }
          
          Otherwise, respond with plain text. 
          Always prioritize safety and suggest consulting a doctor for medical emergencies.`,
        }
      });

      const aiText = response.text || "";
      
      // Try to parse as JSON if it looks like a report
      let content: any = aiText;
      if (aiText.trim().startsWith('{')) {
        try {
          const parsed = JSON.parse(aiText.trim());
          if (parsed.type === 'report-card') {
            content = parsed;
          }
        } catch (e) {
          console.warn("Failed to parse AI JSON response", e);
        }
      }
      
      setChatMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble connecting to my brain right now. Please try again in a moment." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden">
      <header className="p-6 border-b border-slate-50 flex items-center justify-between bg-primary/5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 mr-2">
            <ArrowLeft size={20} />
          </button>
          <Logo size={40} showText={false} />
          <div>
            <h3 className="font-bold text-slate-800">AI Assistant</h3>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">
              {isTyping ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar pb-24">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {typeof msg.content === 'object' && msg.content.type === 'report-card' ? (
              <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
                      <Lightbulb size={20} />
                    </div>
                    <h4 className="font-black text-slate-800">AI Health Advisor</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${msg.content.riskBg} ${msg.content.riskColor}`}>
                      {msg.content.risk}
                    </div>
                    <button className="p-2 text-slate-400 hover:text-primary hover:bg-white rounded-lg transition-all shadow-sm border border-slate-100">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {msg.content.summary}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Wind size={18} className="text-primary" />
                        <span className="text-sm font-black uppercase tracking-wider">Respiratory Protection</span>
                      </div>
                      <div className="space-y-2 pl-7">
                        {msg.content.protection.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Navigation size={18} className="text-primary" />
                        <span className="text-sm font-black uppercase tracking-wider">Outdoor Advisory</span>
                      </div>
                      <div className="space-y-2 pl-7">
                        <div className="text-xs text-slate-600 font-medium">
                          <span className="text-slate-400">Best time:</span> {msg.content.advisory.bestTime}
                        </div>
                        <div className="text-xs text-rose-500 font-bold">
                          {msg.content.advisory.avoid}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-800">
                        <Heart size={18} className="text-rose-500" />
                        <span className="text-sm font-black uppercase tracking-wider">Diet & Recovery Support</span>
                      </div>
                      <div className="space-y-2 pl-7">
                        {msg.content.diet.map((item: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <div className="w-1 h-1 rounded-full bg-rose-400" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${
                msg.role === 'user' 
                  ? 'bg-primary text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-700 rounded-tl-none'
              }`}>
                {msg.content as string}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-400 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-50 bg-white absolute bottom-0 left-0 right-0">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button className="p-3 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-2xl transition-all">
            <Plus size={20} />
          </button>
          <button className="p-3 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-2xl transition-all">
            <Mic size={20} />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about air quality..."
            disabled={isTyping}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-primary text-white p-3 rounded-2xl hover:bg-teal-800 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:hover:bg-primary"
          >
            <Zap size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const EventRegistrationPage = ({ event, onBack, userName }: { event: any, onBack: () => void, userName: string }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({ name: userName, email: '', phone: '' });

  if (!event) return null;

  return (
    <div className="min-h-screen bg-white pb-32">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-black text-slate-800 truncate">Event Registration</h2>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm mb-8">
          <div className="relative h-48">
            <img src={event.img} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="p-6">
            <h3 className="text-2xl font-black text-slate-800 mb-4">{event.title}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600">
                <Calendar size={18} className="text-primary" />
                <span className="font-bold">{event.date}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Clock size={18} className="text-primary" />
                <span className="font-bold">{event.time}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin size={18} className="text-primary" />
                <span className="font-bold">{event.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {!isRegistered ? (
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
            <h4 className="text-xl font-bold text-slate-800 mb-6">Registration Form</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your phone number"
                />
              </div>
              <button 
                onClick={() => setIsRegistered(true)}
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-primary/90 transition-all"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50 p-10 rounded-[2.5rem] border border-emerald-100 text-center"
          >
            <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 size={40} />
            </div>
            <h4 className="text-2xl font-black text-emerald-800 mb-2">Registration Successful!</h4>
            <p className="text-emerald-600 font-medium mb-8">
              Thank you for joining us. We've sent a confirmation email to {formData.email || 'your email'}.
            </p>
            <button 
              onClick={onBack}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
            >
              Back to Events
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState(`https://picsum.photos/seed/${Math.random()}/200`);
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    ageGroup: '',
    respiratoryCondition: '',
    exposureLevel: '',
    activityType: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDrivingHealthOn, setIsDrivingHealthOn] = useState(false);
  const [setupSource, setSetupSource] = useState<'signup' | 'account'>('signup');
  const [testAqi, setTestAqi] = useState(68);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'High AQI Alert', message: 'High AQI expected Wednesday (110).', type: 'warning', time: '2h ago' },
    { id: 2, title: 'Health Risk', message: `Moderate risk for your profile.`, type: 'health', time: '4h ago' },
    { id: 3, title: 'AI Report', message: 'New AI Health Report available.', type: 'ai', time: '1d ago' },
  ]);
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hello, what can I help you?' }
  ]);
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  // --- App Settings State ---
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [locationMode, setLocationMode] = useState<'manual' | 'ask'>('ask');
  const [appMode, setAppMode] = useState<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [dataSavingMode, setDataSavingMode] = useState(false);
  const [language, setLanguage] = useState('English');

  // --- Navigation Handlers ---
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // --- Page Components ---

  const DashboardPage = () => {
    const generateHealthReport = () => {
      const hasCondition = healthProfile.respiratoryCondition && healthProfile.respiratoryCondition !== 'None';
      const condition = hasCondition ? healthProfile.respiratoryCondition : 'general health';
      
      return {
        type: 'report-card',
        risk: hasCondition ? 'High Risk' : 'Moderate Risk',
        riskColor: hasCondition ? 'text-rose-500' : 'text-amber-500',
        riskBg: hasCondition ? 'bg-rose-50' : 'bg-amber-50',
        summary: `Based on your ${condition} profile, your exposure risk is ${hasCondition ? 'elevated' : 'moderate'} this week. Peak pollution expected Wednesday (AQI 110).`,
        protection: hasCondition ? [
          'Strictly wear N95/KN95 outdoors',
          'Keep rescue inhaler accessible',
          'Use air purifier in living spaces'
        ] : [
          'Wear KN95 on high AQI days',
          'Surgical mask acceptable below 100',
          'Avoid heavy outdoor exertion'
        ],
        advisory: {
          bestTime: '7AM–10AM',
          avoid: 'Avoid exercise after 3PM (Wed)'
        },
        diet: [
          'Increase Vitamin C & leafy greens',
          'Stay hydrated (2–2.5L daily)',
          'Consume anti-inflammatory foods'
        ]
      };
    };

    const handleNotificationClick = (notif: any) => {
      setIsNotificationsOpen(false);
      const report = generateHealthReport();
      setChatMessages([{ role: 'assistant', content: report }]);
      navigate('chat');
    };

    return (
      <div className="pb-48">
        {/* Side Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
              />
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[101] shadow-2xl p-8 flex flex-col"
              >
                <div className="flex items-center justify-between mb-12">
                  <Logo size={40} />
                  <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                    <X size={24} />
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  {[
                    { icon: User, label: 'Account', page: 'account' },
                    { icon: Zap, label: 'Premium', page: 'premium' },
                    { icon: HelpCircle, label: 'Help Center', page: 'help' },
                    { icon: Info, label: 'About', page: 'about' },
                  ].map(item => (
                    <button 
                      key={item.label}
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (['account', 'premium', 'help', 'about'].includes(item.page)) {
                          navigate(item.page as Page);
                        }
                      }}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 text-slate-600 font-bold transition-all group"
                    >
                      <item.icon size={20} className="group-hover:text-primary transition-colors" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>

                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsLoggedIn(false);
                    navigate('welcome');
                  }}
                  className="mt-auto flex items-center gap-4 p-4 rounded-2xl bg-rose-50 text-rose-500 font-bold hover:bg-rose-100 transition-all"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Top Nav */}
        <header className="sticky top-0 z-50 bg-white backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between mb-8 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="flex items-center gap-3">
            <Logo size={36} />
          </div>
          
          <div className="flex-1 mx-6 hidden md:block">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Enter the location you are looking for"
                  className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <button 
                onClick={() => navigate('map')}
                className="p-2.5 bg-primary/10 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                title="Open Interactive Map"
              >
                <MapIcon size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-xl transition-all relative ${isNotificationsOpen ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                <Bell size={24} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-[320px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden z-[110]"
                  >
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <h4 className="font-black text-slate-800">Notifications</h4>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase">3 New</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                      {notifications.map((notif) => (
                        <button 
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className="w-full p-5 text-left hover:bg-slate-50 transition-all border-b border-slate-50 last:border-none group"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              notif.type === 'warning' ? 'bg-rose-50 text-rose-500' : 
                              notif.type === 'health' ? 'bg-amber-50 text-amber-500' : 'bg-primary/10 text-primary'
                            }`}>
                              {notif.type === 'warning' ? <AlertTriangle size={18} /> : 
                               notif.type === 'health' ? <Heart size={18} /> : <Lightbulb size={18} />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-black text-slate-800">{notif.title}</p>
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{notif.time}</span>
                              </div>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                                {notif.message}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        const report = generateHealthReport();
                        setChatMessages([{ role: 'assistant', content: report }]);
                        navigate('chat');
                      }}
                      className="w-full py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors bg-slate-50/50"
                    >
                      View All Notifications
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                  <div className="flex flex-col gap-1.5 ml-7 mt-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock size={16} className="text-primary" />
                      <span className="text-xl font-black">
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                      <span className="text-sm font-bold text-slate-500">Live AQI</span>
                    </div>
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
                <div className="w-full max-w-[400px]">
                  <AQIGauge aqi={testAqi} />
                </div>
              </div>

              {/* Metrics Grid/Scroll */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {[
                  { icon: Thermometer, label: 'Temperature', value: '31°C', color: 'text-orange-500', bg: 'bg-orange-50' },
                  { icon: Droplets, label: 'Humidity', value: '78%', color: 'text-blue-500', bg: 'bg-blue-50' },
                  { icon: Wind, label: 'Primary pollution', value: 'PM2.5', color: 'text-primary', bg: 'bg-primary/5' },
                  { icon: CloudRain, label: 'Dust', value: '12 µg/m³', color: 'text-slate-500', bg: 'bg-slate-50' },
                  { icon: Heart, label: 'Health Impact', value: 'Moderate', color: 'text-rose-500', bg: 'bg-rose-50' },
                  { icon: Zap, label: 'Suitability Score', value: '7/10', color: 'text-amber-500', bg: 'bg-amber-50' },
                ].map(item => (
                  <div key={item.label} className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-3 card-hover">
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
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 border-l-4 border-l-[#0F766E] shadow-sm mb-8 relative">
                  <div className="absolute top-6 right-6 bg-[#22C55E] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Low Risk Today
                  </div>
                  <h3 className="text-[#0F766E] font-bold text-xl mb-4 flex items-center gap-2">
                    Today's Air Outlook
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0F766E] mt-2 shrink-0" />
                      <span>AQI is expected to increase after <strong className="text-slate-900 font-bold">16:00</strong> due to traffic peak.</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0F766E] mt-2 shrink-0" />
                      <span>Recommended outdoor window: <strong className="text-slate-900 font-bold">08:00 - 11:00</strong> (Low exposure risk).</span>
                    </li>
                  </ul>
                </div>

                {/* Dominant pollution source section */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-8">
                  <h3 className="text-slate-800 font-bold text-xl mb-4 flex items-center gap-2">
                    <Wind size={20} className="text-primary" />
                    Dominant pollution source
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex-1 w-full">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Primary Source</p>
                      <p className="text-base font-bold text-slate-700">Vehicle Emissions (Traffic)</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex-1 w-full">
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Impact Level</p>
                      <p className="text-base font-bold text-slate-700">High (Peak Hours)</p>
                    </div>
                  </div>
                </div>

                {/* 24-Hour Forecast Bar Chart */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-black text-slate-800">24-Hour Forecast</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hourly Air Quality Trend</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl">
                      <Clock size={14} className="text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Next 24 Hours</span>
                    </div>
                  </div>

                  {/* Enhanced AI Insight Section */}
                  <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Lightbulb size={20} />
                        </div>
                        <h4 className="text-lg font-black text-slate-800">AI Forecast Insight</h4>
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                        Expect a <span className="text-rose-500 font-bold">pollution peak between 14:00 and 18:00</span> due to increased afternoon traffic congestion and stagnant air conditions. Air quality will significantly improve after sunset as coastal winds pick up.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">Recommended Activities</p>
                          <div className="flex flex-wrap gap-2">
                            {['Morning Jog', 'Cycling', 'Outdoor Yoga'].map((act, i) => (
                              <span key={i} className="px-2.5 py-1 bg-white rounded-lg text-[10px] font-black text-emerald-700 shadow-sm border border-emerald-100/50">
                                {act}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-2">Health Recommendations</p>
                          <div className="flex items-center gap-2">
                            <Shield size={14} className="text-amber-500" />
                            <p className="text-[10px] font-black text-amber-700">Mask suggested during peak hours (15:00-17:00)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="h-[280px] w-full relative bg-slate-50/30 rounded-[2.5rem] overflow-hidden p-4">
                    {/* Animated Background Layer */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute inset-[-20%] bg-gradient-to-tr from-teal-500/5 via-transparent to-blue-500/5 blur-3xl animate-drift" />
                    </div>

                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyForecast} margin={{ top: 30, right: 10, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={({ x, y, payload }) => (
                            <g transform={`translate(${x},${y})`}>
                              <text 
                                x={0} 
                                y={0} 
                                dy={16} 
                                textAnchor="middle" 
                                fill="#1e293b" 
                                className="text-[11px] font-black uppercase tracking-tight"
                              >
                                {payload.value}
                              </text>
                            </g>
                          )}
                        />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const aqi = payload[0].value as number;
                              const category = aqi > 100 ? 'Sensitive' : aqi > 50 ? 'Moderate' : 'Good';
                              const colorClass = aqi > 100 ? 'text-orange-500' : aqi > 50 ? 'text-yellow-500' : 'text-emerald-500';
                              
                              return (
                                <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-50 min-w-[140px]">
                                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{payload[0].payload.time}</p>
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-lg font-black text-slate-800">{aqi} AQI</span>
                                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-50 ${colorClass}`}>{category}</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400">
                                      {aqi > 70 ? 'Traffic Peak' : 'Normal Conditions'}
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar 
                          dataKey="aqi" 
                          radius={[8, 8, 8, 8]} 
                          isAnimationActive={true}
                          animationDuration={1500}
                          animationBegin={200}
                          barSize={24}
                        >
                          <LabelList 
                            dataKey="aqi" 
                            position="top" 
                            offset={12} 
                            content={({ x, y, value }) => (
                              <text 
                                x={Number(x) + 12} 
                                y={y} 
                                dy={-6} 
                                textAnchor="middle" 
                                fill="#475569" 
                                className="text-[10px] font-black"
                              >
                                {value}
                              </text>
                            )}
                          />
                          {hourlyForecast.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.aqi > 100 ? '#F97316' : entry.aqi > 50 ? '#FBBF24' : '#008080'} 
                              fillOpacity={0.8}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 7 Days Forecast */}
                <div className="bg-[#F5F7FA] -mx-8 px-8 py-12 mt-12 rounded-t-[3rem] border-t border-slate-100">
                  <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-black text-slate-800">7 Days Forecast</h3>
                      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                        <LineChart size={16} className="text-primary" />
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weekly Outlook</span>
                      </div>
                    </div>

                    {/* Weekly AI Summary & Highlights */}
                    <div className="space-y-6 mb-10">
                      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                              <Lightbulb size={20} />
                            </div>
                            <h4 className="text-xl font-black text-slate-800">Weekly AI Trend Analysis</h4>
                          </div>
                          <p className="text-slate-600 font-medium leading-relaxed mb-8">
                            {healthProfile.respiratoryCondition && healthProfile.respiratoryCondition !== 'None' 
                              ? `Our AI models predict a significant pollution spike on Wednesday (AQI 110) due to stagnant air conditions. For your ${healthProfile.respiratoryCondition.toLowerCase()} condition, we recommend shifting high-intensity activities to Monday or Saturday. The overall trend shows improving conditions towards the weekend as wind speeds increase.`
                              : `This week features a "U-shaped" air quality trend. Excellent conditions early in the week will dip on Wednesday before recovering strongly by Friday. We suggest planning your longest ${healthProfile.activityType || 'outdoor'} sessions for Saturday morning when the Outdoor Score hits a perfect 100.`}
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                              <div className="flex items-center gap-2 mb-1">
                                <CalendarCheck size={14} className="text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Optimal Planning</span>
                              </div>
                              <p className="text-sm font-black text-emerald-700">Mon, Fri, Sat</p>
                            </div>
                            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/50">
                              <div className="flex items-center gap-2 mb-1">
                                <AlertCircle size={14} className="text-amber-500" />
                                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Caution Period</span>
                              </div>
                              <p className="text-sm font-black text-amber-700">Wednesday (All Day)</p>
                            </div>
                            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100/50">
                              <div className="flex items-center gap-2 mb-1">
                                <Wind size={14} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Cleansing Trend</span>
                              </div>
                              <p className="text-sm font-black text-blue-700">Improving from Thursday</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                            <Sun size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best Outdoor Day</p>
                            <p className="text-lg font-black text-slate-800">Saturday (Score: 100)</p>
                          </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                          <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                            <AlertTriangle size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Worst Pollution Day</p>
                            <p className="text-lg font-black text-slate-800">Wednesday (AQI: 110)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Daily Cards - Rectangular List Layout */}
                    <div className="grid grid-cols-1 gap-6">
                      {dailyForecast.map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col gap-6 card-hover group transition-all">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            {/* Day & AQI Badge */}
                            <div className="flex items-center gap-6 min-w-[160px]">
                              <div className="flex flex-col w-16">
                                <span className="text-lg font-black text-slate-400 uppercase leading-none">{item.day}</span>
                                <span className="text-xs font-bold text-slate-300 uppercase tracking-tighter">{item.date}</span>
                              </div>
                              <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                                {item.aqi}
                              </div>
                            </div>

                            {/* Risk & Outdoor Score */}
                            <div className="flex items-center gap-8 flex-1">
                              <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Risk & Outdoor Score</p>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      item.risk === 'High' ? 'bg-rose-500' : 
                                      item.risk === 'Moderate' ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`} />
                                    <p className={`text-sm font-black uppercase ${
                                      item.risk === 'High' ? 'text-rose-500' : 
                                      item.risk === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'
                                    }`}>
                                      {item.risk}
                                    </p>
                                  </div>
                                  <div className="h-4 w-px bg-slate-100" />
                                  <div className="flex items-center gap-2">
                                    <Zap size={14} className="text-amber-500" />
                                    <p className="text-sm font-black text-slate-700">{item.outdoorScore}/100</p>
                                  </div>
                                </div>
                              </div>

                              <div className="hidden md:flex flex-col items-center min-w-[60px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Trend</p>
                                {item.trend === 'up' ? (
                                  <TrendingUp size={20} className="text-rose-500" />
                                ) : item.trend === 'down' ? (
                                  <TrendingDown size={20} className="text-emerald-500" />
                                ) : (
                                  <Minus size={20} className="text-slate-300" />
                                )}
                              </div>
                            </div>

                            {/* Best Time Window */}
                            <div className="bg-slate-50 px-6 py-3 rounded-2xl min-w-[180px]">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Best Time Window</p>
                              <div className="flex items-center gap-2 text-slate-700">
                                <Clock size={14} className="text-primary" />
                                <span className="text-sm font-black">{item.bestTime}</span>
                              </div>
                            </div>
                          </div>

                          {/* AI Recommendation & Activities */}
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-slate-50">
                            <div className="lg:col-span-7">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                  <Lightbulb size={16} />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Recommendation</p>
                                  <p className="text-sm font-medium text-slate-600 leading-relaxed">
                                    {item.recommendation}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="lg:col-span-5 flex flex-wrap gap-2 items-center">
                              <div className="w-full mb-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggested Activities</p>
                              </div>
                              {item.activities.map((act, i) => (
                                <span key={i} className="px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                  {act}
                                </span>
                              ))}
                              <div className={`ml-auto px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                item.mask.includes('Recommended') ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
                              }`}>
                                <Shield size={12} />
                                {item.mask}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Simulation Control Removed */}
            </section>
          </div>
        </div>

        {/* Floating AI Chat Button */}
        <button 
          onClick={() => {
            setChatMessages([{ role: 'assistant', content: 'Hello, what can I help you?' }]);
            navigate('chat');
          }}
          className="fixed bottom-32 right-8 z-[60] bg-white border-2 border-primary text-primary px-6 py-3 rounded-full font-bold shadow-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 group"
        >
          <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
          AI Chat
        </button>
      </main>
    </div>
    );
  };

  const [isTyping, setIsTyping] = useState(false);



  const MapPage = () => {
    const [selectedMarker, setSelectedMarker] = useState<any>(null);
    const [showPollutantTooltip, setShowPollutantTooltip] = useState(false);
    const [showAQITooltip, setShowAQITooltip] = useState(false);

    const pollutantExplanations: Record<string, string> = {
      'Ozone (O₃)': "Ozone (O₃) is a gas formed under sunlight from vehicle and industrial emissions. High levels may irritate lungs and cause breathing discomfort.",
      'PM2.5': "Particulate Matter (PM2.5) are tiny particles that can penetrate deep into lungs and bloodstream, causing respiratory and cardiovascular issues.",
      'PM10': "Particulate Matter (PM10) are inhalable particles that can irritate eyes, nose, and throat, and affect the lungs.",
      'NO2': "Nitrogen Dioxide (NO2) primarily gets in the air from the burning of fuel. It can irritate airways in the human respiratory system.",
      'SO2': "Sulfur Dioxide (SO2) is produced from burning fossil fuels. It can cause breathing difficulties and aggravate existing heart and lung conditions.",
    };

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    const markers = [
      { 
        id: 1, name: 'Bukit Bintang', lat: 3.1478, lng: 101.7102, aqi: 45, color: 'bg-aqi-good', hex: '#22C55E', status: 'Good',
        primaryPollutant: 'PM2.5',
        lastUpdated: 'Updated 2 mins ago',
        advice: 'Air quality is satisfactory, and air pollution poses little or no risk.',
        recommendations: ['Great for outdoor exercise', 'Keep windows open', 'No mask needed'],
        trend: 'Improving'
      },
      { 
        id: 2, name: 'KLCC Park', lat: 3.1556, lng: 101.7147, aqi: 112, color: 'bg-aqi-sensitive', hex: '#F97316', status: 'Sensitive',
        primaryPollutant: 'PM2.5',
        lastUpdated: 'Updated 5 mins ago',
        advice: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.',
        recommendations: ['Limit outdoor activity', 'Wear KN95 mask if outside', 'Avoid jogging after 15:00'],
        trend: 'Worsening'
      },
      { 
        id: 3, name: 'Petaling Jaya', lat: 3.1073, lng: 101.6067, aqi: 68, color: 'bg-aqi-moderate', hex: '#EAB308', status: 'Moderate',
        primaryPollutant: 'Ozone (O₃)',
        lastUpdated: 'Updated 8 mins ago',
        advice: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.',
        recommendations: ['Sensitive groups should limit outdoor time', 'Good for light walking', 'Ventilate during low traffic'],
        trend: 'Stable'
      },
      { 
        id: 4, name: 'Cheras', lat: 3.1032, lng: 101.7371, aqi: 32, color: 'bg-aqi-good', hex: '#22C55E', status: 'Good',
        primaryPollutant: 'PM10',
        lastUpdated: 'Updated 12 mins ago',
        advice: 'Enjoy your outdoor activities! The air is clean and fresh.',
        recommendations: ['Perfect for outdoor sports', 'Ideal for ventilation', 'No health precautions'],
        trend: 'Improving'
      },
      { 
        id: 5, name: 'Mont Kiara', lat: 3.1664, lng: 101.6528, aqi: 155, color: 'bg-aqi-unhealthy', hex: '#EF4444', status: 'Unhealthy',
        primaryPollutant: 'PM2.5',
        lastUpdated: 'Updated 3 mins ago',
        advice: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
        recommendations: ['Avoid all outdoor exertion', 'Keep all windows closed', 'Use air purifiers on high'],
        trend: 'Worsening'
      },
    ];

    const getAIInsight = (marker: any) => {
      const isSensitive = healthProfile.respiratoryCondition !== 'None' || healthProfile.ageGroup === '65+' || healthProfile.ageGroup === 'Under 18';
      
      if (marker.aqi > 150) {
        return `Air quality is critical. ${isSensitive ? 'Your respiratory condition makes this extremely dangerous.' : 'Avoid all outdoor activities.'} Conditions likely to persist until 8PM.`;
      }
      if (marker.aqi > 100) {
        return `Air quality likely to worsen after 4PM. ${isSensitive ? 'Pre-emptive medication recommended if prescribed.' : 'Plan indoor activities for the evening.'}`;
      }
      if (marker.aqi > 50) {
        return `Moderate levels detected. ${isSensitive ? 'Monitor your breathing if outdoors.' : 'Safe for most activities, but avoid high-traffic zones.'}`;
      }
      return `Excellent air quality! ${isSensitive ? 'Safe for your profile to enjoy the outdoors.' : 'Perfect day for a long run or outdoor event.'}`;
    };

    useEffect(() => {
      if (mapRef.current && !mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, {
          zoomControl: false,
          attributionControl: false
        }).setView([3.1390, 101.6869], 12);

        // Minimal light basemap (CartoDB Positron)
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          maxZoom: 19,
        }).addTo(mapInstance.current);

        markers.forEach(marker => {
          const icon = L.divIcon({
            className: '',
            html: `<div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white/50 transition-transform hover:scale-110" style="background-color: ${marker.hex}">${marker.aqi}</div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
          });

          L.marker([marker.lat, marker.lng], { icon })
            .addTo(mapInstance.current!)
            .on('click', () => setSelectedMarker(marker));
        });
      }

      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    }, []);

    return (
      <div className="h-screen flex flex-col bg-slate-50 relative overflow-hidden">
        <header className="p-4 flex items-center gap-4 absolute top-0 left-0 right-0 z-20">
          <button onClick={() => navigate('dashboard')} className="p-2 bg-white rounded-full text-slate-600 shadow-md hover:bg-slate-50 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 bg-slate-100 rounded-full px-4 py-2 flex items-center gap-2 text-slate-800 shadow-md border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Enter the location you are looking for" 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400"
            />
          </div>
        </header>

        {/* Real Interactive Map */}
        <div className="flex-1 relative overflow-hidden bg-slate-100 z-0">
          <div 
            ref={mapRef} 
            className="w-full h-full grayscale-[0.3] brightness-[1.05] contrast-[0.9]" 
          />

          {/* Zoom Controls (Bottom Left) */}
          <div className="absolute left-6 bottom-10 z-20 flex flex-col gap-3">
            <button 
              onClick={() => mapInstance.current?.zoomIn()}
              className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-90 border border-slate-100"
              title="Zoom In"
            >
              <Plus size={24} />
            </button>
            <button 
              onClick={() => mapInstance.current?.zoomOut()}
              className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-90 border border-slate-100"
              title="Zoom Out"
            >
              <Minus size={24} />
            </button>
          </div>

          {/* Recenter Control (Bottom Right) */}
          <div className="absolute right-6 bottom-10 z-20">
            <button 
              onClick={() => mapInstance.current?.setView([3.1390, 101.6869], 12)}
              className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 hover:text-primary transition-all active:scale-90 border border-slate-100"
              title="Recenter"
            >
              <Navigation size={24} />
            </button>
          </div>
          
          {/* Selected Marker Info Card */}
          <AnimatePresence>
            {selectedMarker && (
              <motion.div 
                initial={{ opacity: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: 20 }}
                className="absolute bottom-6 right-6 left-6 md:left-auto md:w-[540px] max-h-[calc(100vh-140px)] overflow-y-auto bg-white rounded-[2.5rem] px-8 pb-8 pt-0 shadow-2xl z-30 border border-slate-100"
              >
                {/* Sticky Header Section */}
                <div className="sticky top-0 bg-white pt-8 pb-6 z-20">
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {selectedMarker.lastUpdated}
                    </p>
                    <div className="h-px bg-slate-100 flex-1 ml-4" />
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <button 
                          onClick={() => {
                            setShowAQITooltip(!showAQITooltip);
                            setShowPollutantTooltip(false);
                          }}
                          className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg shrink-0 transition-transform active:scale-95 ${selectedMarker.color}`}
                        >
                          <span className="text-3xl font-black leading-none">{selectedMarker.aqi}</span>
                          <span className="text-[10px] font-bold uppercase opacity-80">AQI</span>
                        </button>

                        <AnimatePresence>
                          {showAQITooltip && (
                            <motion.div
                              initial={{ opacity: 0, x: -10, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -10, scale: 0.95 }}
                              className="absolute left-full ml-4 top-0 w-64 bg-slate-900 text-white text-[11px] p-3 rounded-xl shadow-xl z-[100] leading-relaxed"
                            >
                              <div className="absolute left-[-4px] top-6 w-3 h-3 bg-slate-900 rotate-45" />
                              <p className="font-bold mb-1">Air Quality Index (AQI)</p>
                              The AQI is a scale used to communicate how polluted the air currently is or how polluted it is forecast to become.
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div>
                        <h4 className="text-2xl font-bold text-slate-900 leading-tight">{selectedMarker.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-2.5 h-2.5 rounded-full ${selectedMarker.color}`} />
                          <span className="text-sm font-bold text-slate-600">{selectedMarker.status}</span>
                          <span className="text-slate-300 mx-1">•</span>
                          
                          <div className="relative flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Main Pollutant: <span className="text-slate-600">{selectedMarker.primaryPollutant}</span>
                            </span>
                            <button 
                              onClick={() => {
                                setShowPollutantTooltip(!showPollutantTooltip);
                                setShowAQITooltip(false);
                              }}
                              className="text-slate-400 hover:text-primary transition-colors"
                            >
                              <Info size={14} />
                            </button>
                            
                            <AnimatePresence>
                              {showPollutantTooltip && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-slate-900 text-white text-[11px] p-3 rounded-xl shadow-xl z-[100] leading-relaxed"
                                >
                                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45" />
                                  {pollutantExplanations[selectedMarker.primaryPollutant] || pollutantExplanations['PM2.5']}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedMarker(null)}
                      className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors self-start"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Health Impact Summary */}
                <div className="mb-4">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Health Impact</h5>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedMarker.advice}
                  </p>
                </div>

                {/* Recommendations */}
                <div className="mb-6">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recommendations</h5>
                  <ul className="space-y-2">
                    {selectedMarker.recommendations.map((rec: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${selectedMarker.color}`} />
                        <span className="font-medium">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Insight Section */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb size={14} className="text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Smart Insight</span>
                  </div>
                  <p className="text-xs text-slate-500 italic leading-relaxed">
                    "{getAIInsight(selectedMarker)}"
                  </p>
                </div>

                <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                  View Detailed Report
                  <ChevronRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const SmartAIPage = () => {
    const activity = healthProfile.activityType || 'Walking';
    
    const getRoutes = () => {
      if (activity === 'Driving') {
        return [
          {
            name: 'Route A (EV-Optimized Highway)',
            aqi: 42,
            score: 88,
            risk: 'Low',
            reduction: 15,
            co2: '1.2 kg',
            insight: 'This route avoids heavy congestion zones and utilizes roads with better airflow, reducing overall exposure and optimizing EV efficiency.',
            recommended: true
          },
          {
            name: 'Route B (City Center)',
            aqi: 95,
            score: 45,
            risk: 'High',
            reduction: 0,
            co2: '3.8 kg',
            insight: 'High traffic density in the city center leads to significant CO₂ emissions and elevated pollutant concentrations.',
            recommended: false
          }
        ];
      }
      
      const routeNames: Record<string, string[]> = {
        'Walking': ['Park Side Path', 'Main Street Sidewalk'],
        'Jogging': ['Green Belt Loop', 'Urban Track'],
        'Cycling': ['Dedicated Bike Lane', 'Shared Roadway'],
      };

      const names = routeNames[activity] || ['Route A', 'Route B'];

      return [
        {
          name: `Route A (${names[0]})`,
          aqi: 35,
          score: 92,
          risk: 'Low',
          reduction: 24,
          insight: 'This route passes through parks and residential areas with significantly lower traffic emissions and higher tree density.',
          recommended: true
        },
        {
          name: `Route B (${names[1]})`,
          aqi: 82,
          score: 58,
          risk: 'Medium',
          reduction: 5,
          insight: 'Standard urban route with moderate exposure to vehicle exhaust. Recommended to wear a mask during peak hours.',
          recommended: false
        }
      ];
    };

    const routes = getRoutes();

    return (
      <div className="pb-48 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-3xl font-bold text-slate-800">Smart AI Assistant</h2>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-2xl font-bold text-sm">
            <Zap size={18} />
            PRO ACTIVE
          </div>
        </div>

        {/* Activity Selection Section */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Please select your activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'Walking', icon: Footprints, color: 'bg-blue-50 text-blue-500' },
              { id: 'Jogging', icon: Activity, color: 'bg-emerald-50 text-emerald-500' },
              { id: 'Cycling', icon: Bike, color: 'bg-orange-50 text-orange-500' },
              { id: 'Driving', icon: Car, color: 'bg-purple-50 text-purple-500' },
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => {
                  setHealthProfile({ ...healthProfile, activityType: act.id });
                  if (act.id === 'Driving') {
                    setIsDrivingHealthOn(true);
                  }
                }}
                className={`aspect-square rounded-[2.5rem] border-2 flex flex-col items-center justify-center gap-4 transition-all ${
                  healthProfile.activityType === act.id 
                    ? 'bg-white border-primary shadow-xl scale-105' 
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className={`w-14 h-14 ${act.color} rounded-2xl flex items-center justify-center`}>
                  <act.icon size={32} />
                </div>
                <span className={`font-bold ${healthProfile.activityType === act.id ? 'text-primary' : 'text-slate-600'}`}>
                  {act.id}
                </span>
              </button>
            ))}
          </div>
        </section>
        
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
                <p className="text-base font-bold text-slate-700">{activity}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Departure</p>
                <p className="text-base font-bold text-slate-700">Immediate</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {routes.map((route, idx) => (
                <div 
                  key={idx} 
                  className={`p-6 rounded-3xl border-2 transition-all ${
                    route.recommended 
                      ? 'border-primary bg-primary/5' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      {route.recommended && (
                        <div className="bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-wider mb-2 inline-block">
                          RECOMMENDED
                        </div>
                      )}
                      <p className="text-lg font-bold text-slate-800">{route.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Clean Air Score</p>
                      <p className={`text-xl font-black ${route.score > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {route.score}/100
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Wind size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">AQI: {route.aqi}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle size={16} className="text-slate-400" />
                      <span className="text-xs font-bold text-slate-600">Traffic Risk: {route.risk}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-secondary" />
                      <span className="text-xs font-bold text-secondary">{route.reduction}% Reduction</span>
                    </div>
                    {route.co2 && (
                      <div className="flex items-center gap-2">
                        <Leaf size={16} className="text-primary" />
                        <span className="text-xs font-bold text-primary">CO₂: {route.co2}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={14} className="text-primary" />
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">AI Insight</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      {route.insight}
                    </p>
                  </div>
                </div>
              ))}
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
                <button 
                  onClick={() => setIsDrivingHealthOn(!isDrivingHealthOn)}
                  className={`w-14 h-7 rounded-full relative transition-all duration-300 ${isDrivingHealthOn ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${isDrivingHealthOn ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {isDrivingHealthOn ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Navigation size={14} className="text-emerald-500" />
                        <p className="text-[10px] text-emerald-600 uppercase font-bold">Travelled Distance</p>
                      </div>
                      <p className="text-xl font-black text-emerald-700">12.4 km</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Leaf size={14} className="text-primary" />
                        <p className="text-[10px] text-primary uppercase font-bold">CO₂ Saved Today</p>
                      </div>
                      <p className="text-xl font-black text-primary">2.8 kg</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind size={14} className="text-blue-500" />
                        <p className="text-[10px] text-blue-600 uppercase font-bold">Cabin Air Quality</p>
                      </div>
                      <p className="text-xl font-black text-blue-700">EXCELLENT</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={14} className="text-indigo-500" />
                        <p className="text-[10px] text-indigo-600 uppercase font-bold">PM2.5 Level Inside</p>
                      </div>
                      <p className="text-xl font-black text-indigo-700">8 µg/m³</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={14} className="text-amber-500" />
                        <p className="text-[10px] text-amber-600 uppercase font-bold">Traffic Exposure</p>
                      </div>
                      <p className="text-xl font-black text-amber-700">LOW</p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Flame size={14} className="text-rose-500" />
                        <p className="text-[10px] text-rose-600 uppercase font-bold">Smoke Detection</p>
                      </div>
                      <p className="text-xl font-black text-rose-700">NONE</p>
                    </div>
                    <div className="col-span-2 p-4 bg-emerald-500 text-white rounded-2xl border border-emerald-600 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Gauge size={24} />
                        <div>
                          <p className="text-[10px] uppercase font-bold opacity-80">Green Driving Score</p>
                          <p className="text-2xl font-black">94/100</p>
                        </div>
                      </div>
                      <Smile size={32} className="opacity-50" />
                    </div>
                  </div>

                  <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-bold text-amber-800 mb-1">AI Health Insight</p>
                        <p className="text-xs text-amber-700 leading-relaxed">
                          Traffic jam detected ahead. High external CO₂ levels. Internal air recirculation activated. 
                          <span className="block mt-2 font-bold text-amber-900 italic">Note: Smoking inside the vehicle significantly degrades cabin air quality even with filtration.</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center">
                  <p className="text-sm text-slate-500 font-medium">Turn on Smart Driving Health to monitor EV performance, CO₂ savings, and cabin air quality.</p>
                </div>
              )}
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
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-bold text-emerald-600 uppercase">Low</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                  <span className="text-base text-slate-500 font-medium">Daily Exposure Limit</span>
                  <span className="text-sm font-bold text-slate-700">85% Remaining</span>
                </div>
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Based on your profile, today is an excellent day for outdoor activities. Your respiratory health is well-protected at current AQI levels.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };




  const InsightsPage = () => (
    <div className="pb-48 pt-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-slate-800">Air Insights</h2>
      </div>
      
      <div className="space-y-12">
        <div className="space-y-12">
          <section>
            <h3 className="font-bold text-xl text-slate-800 mb-6">Latest Malaysia & Global News</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newsArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col group card-hover">
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                        {article.region}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-2">{article.date}</span>
                    <h4 className="text-lg font-black text-slate-800 mb-3 leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-sm text-slate-500 font-medium mb-6 line-clamp-2">
                      {article.summary}
                    </p>
                    <button 
                      onClick={() => {
                        setSelectedArticle(article);
                        navigate('news-article');
                      }}
                      className="mt-auto flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:gap-3 transition-all"
                    >
                      Read Full Article
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-xl text-slate-800 mb-6">Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Kuala Lumpur Car Free Morning',
                  date: 'Mar 15, 2026',
                  time: '7:00 AM - 9:00 AM',
                  venue: 'Dataran Merdeka, KL',
                  deadline: 'Mar 12, 2026',
                  link: '#',
                  img: 'https://picsum.photos/seed/jogging/800/400',
                  benefit: 'Reduce up to 5 tons of CO₂ emissions in the city center.',
                  opportunity: 'Join the exclusive EV car test drive session and experience the future of green mobility.'
                },
                {
                  title: 'Bike-to-Work Week Malaysia',
                  date: 'Apr 05-12, 2026',
                  time: 'All Day',
                  venue: 'Nationwide',
                  deadline: 'Apr 01, 2026',
                  link: '#',
                  img: 'https://picsum.photos/seed/cycling/800/400',
                  benefit: 'Improve personal health while contributing to zero-emission commuting.',
                  opportunity: 'Register to win a premium electric bicycle and free cycling safety gear.'
                },
                {
                  title: 'Tree Planting Campaign 2026',
                  date: 'May 20, 2026',
                  time: '8:00 AM - 12:00 PM',
                  venue: 'FRIM, Kepong',
                  deadline: 'May 15, 2026',
                  link: '#',
                  img: 'https://picsum.photos/seed/planting/800/400',
                  benefit: 'Help restore urban green lungs and naturally filter air pollutants.',
                  opportunity: 'Participate in the "Green Tech" workshop showcasing EV-powered landscaping tools.'
                },
                {
                  title: 'Clean Air Awareness Walk',
                  date: 'Jun 05, 2026',
                  time: '7:30 AM - 10:30 AM',
                  venue: 'Taman Tasik Perdana, KL',
                  deadline: 'Jun 01, 2026',
                  link: '#',
                  img: 'https://picsum.photos/seed/nature/800/400',
                  benefit: 'Raise awareness about PM2.5 health risks and promote active lifestyles.',
                  opportunity: 'Visit our EV mobility hub for a free test drive of the latest eco-friendly vehicles.'
                }
              ].map((event, i) => (
                <div key={i} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col">
                  <div className="relative h-48">
                    <img src={event.img} alt={event.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">Featured Event</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h4 className="font-black text-xl text-slate-800 leading-tight mb-4">{event.title}</h4>
                    
                    <div className="space-y-2 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Calendar size={14} className="text-primary" />
                        <span className="text-xs font-bold">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} className="text-primary" />
                        <span className="text-xs font-bold">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <MapPin size={14} className="text-primary" />
                        <span className="text-xs font-bold">{event.venue}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
                      <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Deadline: <span className="text-rose-500">{event.deadline}</span></p>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-600 leading-tight"><strong>Benefit:</strong> {event.benefit}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap size={16} className="text-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-600 leading-tight"><strong>Event Highlight:</strong> {event.opportunity}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setSelectedEvent(event);
                        navigate('event-registration');
                      }}
                      className="w-full bg-primary text-white py-3 rounded-xl font-bold text-center hover:bg-primary/90 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      Register Now <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-xl text-slate-800 mb-6">You Must Know</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { 
                  fact: 'Traffic congestion can significantly increase PM2.5 levels in urban areas, posing severe risks to commuters.',
                  icon: AlertTriangle,
                  color: 'bg-amber-50 text-amber-500 border-amber-100'
                },
                { 
                  fact: 'Smoking inside a car can cause extremely high PM2.5 levels, lingering for hours and affecting all passengers.',
                  icon: Flame,
                  color: 'bg-rose-50 text-rose-500 border-rose-100'
                },
                { 
                  fact: 'Switching to electric vehicles helps reduce carbon emissions and improves local air quality significantly.',
                  icon: Zap,
                  color: 'bg-emerald-50 text-emerald-500 border-emerald-100'
                },
                { 
                  fact: 'Children and elderly people are more vulnerable to air pollution due to developing or weakened respiratory systems.',
                  icon: Users,
                  color: 'bg-blue-50 text-blue-500 border-blue-100'
                }
              ].map((item, i) => (
                <div key={i} className={`p-6 rounded-[2rem] border ${item.color} flex gap-4 items-start`}>
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                    <item.icon size={20} />
                  </div>
                  <p className="text-sm font-medium leading-relaxed opacity-90">{item.fact}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="font-bold text-xl text-slate-800 mb-6">Self-Protection Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {[
                {
                  title: "How to Choose the Right Mask",
                  icon: ShieldCheck,
                  summary: "N95 or KN95 are more effective than surgical masks.",
                  explanation: "Masks such as N95 or KN95 are specifically designed to filter out 95% of airborne particles, including fine particles like PM2.5. Regular surgical masks are primarily designed to protect others from your respiratory droplets and do not provide a tight seal against fine dust."
                },
                {
                  title: "When to Avoid Outdoor Activities",
                  icon: Activity,
                  summary: "Reduce outdoor activities when AQI exceeds 100.",
                  explanation: "When AQI levels exceed 100, the air quality is considered unhealthy for sensitive groups. You should reduce prolonged or heavy exertion outdoors. Activities like jogging or cycling increase your breathing rate, leading to higher inhalation of pollutants."
                },
                {
                  title: "How to Improve Indoor Air Quality",
                  icon: Home,
                  summary: "Keep windows closed and use air purifiers.",
                  explanation: "To maintain clean air indoors, keep windows and doors closed during high pollution periods. Use air purifiers with HEPA filters if available, and avoid indoor smoke sources like candles, incense, or frying food which can generate significant indoor PM2.5."
                }
              ].map((tip, i) => (
                <div 
                  key={i} 
                  className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm cursor-pointer transition-all hover:shadow-md ${expandedTip === i ? 'ring-2 ring-primary/20' : ''}`}
                  onClick={() => setExpandedTip(expandedTip === i ? null : i)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <tip.icon size={24} />
                    </div>
                    <h4 className="font-bold text-slate-800 leading-tight">{tip.title}</h4>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{tip.summary}</p>
                  <AnimatePresence>
                    {expandedTip === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-slate-50 mt-4">
                          <p className="text-xs text-slate-500 leading-relaxed">{tip.explanation}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="mt-4 flex justify-center">
                    <ChevronDown 
                      size={20} 
                      className={`text-slate-300 transition-transform duration-300 ${expandedTip === i ? 'rotate-180' : ''}`} 
                    />
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
      <header className="flex items-center gap-4 mb-10 mt-6">
        <button onClick={() => navigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Premium</h2>
      </header>

      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Logo size={56} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Premium Pricing</h2>
        <p className="text-slate-500 font-medium">Upgrade to premium to unlock full power of our AI features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Freemium</h3>
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="text-lg font-bold text-slate-400">RM</span>
            <span className="text-5xl font-black text-slate-800">0</span>
          </div>
          <p className="text-sm text-slate-400 mb-8">Basic features for everyone</p>
        </div>
        <div className="bg-primary/5 p-8 rounded-[2.5rem] border-2 border-primary shadow-xl text-center relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-4 py-1.5 rounded-full font-black tracking-widest">MOST POPULAR</div>
          <h3 className="text-xl font-bold text-primary mb-4">Pro</h3>
          <div className="flex items-baseline justify-center gap-1 mb-6">
            <span className="text-lg font-bold text-primary">RM</span>
            <span className="text-5xl font-black text-primary">15</span>
            <span className="text-lg font-bold text-primary">/month</span>
          </div>
          <p className="text-sm text-primary/60 mb-8">Full access to AI features</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-8">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Features</th>
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

  const HelpCenterPage = () => {
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const faqs = [
      {
        q: "What is AQI?",
        a: "AQI (Air Quality Index) is a system used to indicate how clean or polluted the air is and what potential health effects might be a concern for you. It focuses on health effects you may experience within a few hours or days after breathing polluted air."
      },
      {
        q: "How to read AQI data?",
        a: "AQI levels are categorized by color and health risk: \n• Good (0-50): Air quality is satisfactory.\n• Moderate (51-100): Acceptable, but some pollutants may be a concern for sensitive people.\n• Unhealthy (101-200): Everyone may begin to experience health effects.\n• Hazardous (300+): Health warning of emergency conditions."
      },
      {
        q: "How to connect air purifier?",
        a: "To connect your smart air purifier: \n1. Go to 'Devices' in the menu.\n2. Click 'Add New Device'.\n3. Ensure your purifier is in pairing mode.\n4. Select your device from the list and follow the on-screen instructions."
      },
      {
        q: "How to enable smart automation?",
        a: "You can activate automation by going to 'Smart AI' -> 'Automation'. There you can set rules, such as 'Turn on air purifier when AQI exceeds 100' or 'Close windows when pollution spikes'."
      },
      {
        q: "How to enable AQI alerts?",
        a: "Go to 'Account' -> 'App Settings'. Under the 'Notification' section, toggle 'Air Quality Alerts' to ON. You will receive push notifications when AQI levels change significantly."
      },
      {
        q: "How to change alert settings?",
        a: "Alert preferences can be modified in 'Account' -> 'App Settings'. You can adjust the sensitivity of alerts and choose which types of notifications you wish to receive."
      }
    ];

    const categories = [
      { title: "AQI Data", icon: Wind, color: "bg-blue-50 text-blue-500" },
      { title: "Alert & Notifications", icon: Bell, color: "bg-amber-50 text-amber-500" },
      { title: "Device Setup", icon: Zap, color: "bg-emerald-50 text-emerald-500" },
      { title: "Premium Features", icon: CreditCard, color: "bg-purple-50 text-purple-500" }
    ];

    return (
      <div className="pb-48 p-4 space-y-10">
        <header className="flex items-center gap-4 mb-6 mt-4">
          <button onClick={() => navigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-bold text-slate-800">Help Center</h2>
        </header>

        <section className="space-y-6">
          <h3 className="font-black text-2xl text-slate-800 px-2">Common Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <button 
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-5 flex items-center justify-between text-left"
                >
                  <span className="font-bold text-slate-800">{faq.q}</span>
                  <ChevronDown size={20} className={`text-slate-400 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 text-sm text-slate-500 leading-relaxed border-t border-slate-50">
                        {faq.a.split('\n').map((line, idx) => (
                          <p key={idx} className={idx > 0 ? 'mt-1' : ''}>{line}</p>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="font-black text-2xl text-slate-800 px-2">Help Categories</h3>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <button key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center gap-4 hover:shadow-md transition-all group">
                <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <cat.icon size={28} />
                </div>
                <span className="text-xs font-black text-slate-800 text-center uppercase tracking-wider">{cat.title}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="font-black text-2xl text-slate-800 px-2">Contact Support</h3>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <MessageSquare size={32} />
            </div>
            <div>
              <h4 className="font-black text-lg text-slate-800">Live Chat</h4>
              <p className="text-sm text-slate-500 font-medium">Chat with us in real time if you need help.</p>
            </div>
            <button className="ml-auto p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:bg-teal-800 transition-all">
              <ChevronRight size={24} />
            </button>
          </div>
        </section>
      </div>
    );
  };

  const AppSettingsPage = () => (
    <div className="pb-24 p-4 space-y-8">
      <header className="flex items-center gap-4 mb-6 mt-4">
        <button onClick={() => navigate('account')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">App Settings</h2>
      </header>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Notification</h3>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Bell size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Air Quality Alerts</p>
                <p className="text-[10px] text-slate-500">Get notified about AQI changes</p>
              </div>
            </div>
            <button 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full relative transition-all ${notificationsEnabled ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notificationsEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Location Settings</h3>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <MapPin size={20} />
              </div>
              <p className="font-bold text-slate-800">Location Access</p>
            </div>
            <button 
              onClick={() => setLocationEnabled(!locationEnabled)}
              className={`w-12 h-6 rounded-full relative transition-all ${locationEnabled ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${locationEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          
          {locationEnabled && (
            <div className="p-4 space-y-3">
              <button 
                onClick={() => setLocationMode('manual')}
                className="w-full flex items-center justify-between group"
              >
                <span className={`text-sm font-medium ${locationMode === 'manual' ? 'text-primary' : 'text-slate-600'}`}>Select location manually</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${locationMode === 'manual' ? 'border-primary' : 'border-slate-200'}`}>
                  {locationMode === 'manual' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </button>
              <button 
                onClick={() => setLocationMode('ask')}
                className="w-full flex items-center justify-between group"
              >
                <span className={`text-sm font-medium ${locationMode === 'ask' ? 'text-primary' : 'text-slate-600'}`}>Ask every time when accessing</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${locationMode === 'ask' ? 'border-primary' : 'border-slate-200'}`}>
                  {locationMode === 'ask' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                </div>
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">App Preferences</h3>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                {appMode === 'light' ? <Sun size={20} /> : <CloudRain size={20} />}
              </div>
              <p className="font-bold text-slate-800">Appearance Mode</p>
            </div>
            <select 
              value={appMode}
              onChange={(e) => setAppMode(e.target.value as 'light' | 'dark')}
              className="bg-slate-50 border-none rounded-lg text-sm font-bold text-slate-700 px-3 py-1 focus:ring-0"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                <span className="font-bold text-lg">A</span>
              </div>
              <p className="font-bold text-slate-800">Font Size</p>
            </div>
            <select 
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
              className="bg-slate-50 border-none rounded-lg text-sm font-bold text-slate-700 px-3 py-1 focus:ring-0"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <Zap size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Data Saving Mode</p>
                <p className="text-[10px] text-slate-500">Reduce background data usage</p>
              </div>
            </div>
            <button 
              onClick={() => setDataSavingMode(!dataSavingMode)}
              className={`w-12 h-6 rounded-full relative transition-all ${dataSavingMode ? 'bg-primary' : 'bg-slate-200'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${dataSavingMode ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );

  const AboutPage = () => {
    const [expandedSdg, setExpandedSdg] = useState<number | null>(null);
    const [expandedFeature, setExpandedFeature] = useState<number | null>(null);

    const sdgs = [
      { 
        id: 3, 
        title: "Good Health and Well-being", 
        desc: "Ensure healthy lives and promote well-being for all at all ages by reducing deaths and illnesses from hazardous chemicals and air, water and soil pollution and contamination.",
        color: "bg-emerald-50 text-emerald-600 border-emerald-100"
      },
      { 
        id: 11, 
        title: "Sustainable Cities and Communities", 
        desc: "Make cities and human settlements inclusive, safe, resilient and sustainable by paying special attention to air quality and municipal and other waste management.",
        color: "bg-orange-50 text-orange-600 border-orange-100"
      },
      { 
        id: 13, 
        title: "Climate Action", 
        desc: "Take urgent action to combat climate change and its impacts by strengthening resilience and adaptive capacity to climate-related hazards.",
        color: "bg-blue-50 text-blue-600 border-blue-100"
      }
    ];

    const features = [
      { title: "Real-time AQI Monitoring", desc: "Live tracking of PM2.5, PM10, and other key pollutants in your immediate vicinity using high-precision sensors and satellite data." },
      { title: "AI Personal Health Advisor", desc: "Personalized health recommendations based on your unique respiratory profile, age, and current environmental conditions." },
      { title: "AI Chatbox", desc: "A smart assistant ready to answer your questions about air quality, health risks, and protective measures anytime." },
      { title: "Smart Route Suggestion", desc: "Navigation that prioritizes your health by suggesting paths with the lowest pollution exposure for walking or cycling." },
      { title: "Smart Health Driving", desc: "Monitors cabin air quality and provides insights on how your driving habits affect your exposure and the environment." },
      { title: "Air Insight", desc: "Educational content and data-driven insights to help you understand air pollution trends and how to stay safe." }
    ];

    return (
      <div className="pb-48 p-4 space-y-10">
        <header className="flex items-center gap-4 mb-6 mt-4">
          <button onClick={() => navigate('account')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <h2 className="text-xl font-bold text-slate-800">About</h2>
          </div>
        </header>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Leaf size={20} />
            </div>
            <h3 className="font-black text-2xl text-slate-800">Our Mission</h3>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            To empower individuals with real-time, personalized air quality data, helping them make healthier decisions every day and raising global awareness about the critical impact of air pollution on our lives.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Globe size={20} />
            </div>
            <h3 className="font-black text-2xl text-slate-800">Our Vision</h3>
          </div>
          <p className="text-slate-600 leading-relaxed font-medium">
            Creating a smarter, healthier, and more sustainable environment where technology and awareness work together to reduce human exposure to pollution and encourage behaviors that protect our planet's air.
          </p>
        </section>

        <section className="space-y-6">
          <h3 className="font-black text-2xl text-slate-800">Supported SDGs</h3>
          <div className="space-y-4">
            {sdgs.map((sdg, i) => (
              <div key={i} className={`p-6 rounded-[2rem] border ${sdg.color} transition-all`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-lg">SDG {sdg.id}: {sdg.title}</h4>
                  <button 
                    onClick={() => setExpandedSdg(expandedSdg === i ? null : i)}
                    className="text-xs font-black uppercase tracking-widest underline underline-offset-4"
                  >
                    {expandedSdg === i ? 'Close' : 'Details'}
                  </button>
                </div>
                <AnimatePresence>
                  {expandedSdg === i && (
                    <motion.p
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="text-sm leading-relaxed mt-4 overflow-hidden"
                    >
                      {sdg.desc}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="font-black text-2xl text-slate-800">Key Features</h3>
          <div className="grid grid-cols-1 gap-3">
            {features.map((feature, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 flex items-center justify-between">
                  <span className="font-bold text-slate-800">{feature.title}</span>
                  <button 
                    onClick={() => setExpandedFeature(expandedFeature === i ? null : i)}
                    className="p-2 hover:bg-slate-50 rounded-full text-primary transition-all"
                  >
                    {expandedFeature === i ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                </div>
                <AnimatePresence>
                  {expandedFeature === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-5 pb-5 overflow-hidden"
                    >
                      <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                        {feature.desc}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };
  const AccountPage = () => (
    <div className="pb-48 p-4 space-y-6">
      <header className="flex items-center gap-4 mb-6 mt-4">
        <button onClick={() => navigate('dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Account</h2>
      </header>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">{userName || 'User Profile'}</h2>
          <p className="text-sm text-slate-500">Premium Member</p>
        </div>
      </div>

      <section className="bg-white/70 backdrop-blur-sm p-5 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">Health Profile</h3>
          <button 
            onClick={() => {
              setSetupSource('account');
              navigate('profile-setup');
            }} 
            className="text-xs font-bold text-primary"
          >
            EDIT
          </button>
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
        <button 
          onClick={() => navigate('app-settings')}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 text-slate-700 font-medium"
        >
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-slate-400" />
            <span>App Settings</span>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </button>
        <button 
          onClick={() => navigate('about')}
          className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 text-slate-700 font-medium"
        >
          <div className="flex items-center gap-3">
            <Info size={20} className="text-slate-400" />
            <span>About</span>
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
          {currentPage === 'welcome' && <WelcomePage onNavigate={navigate} language={language} setLanguage={setLanguage} />}
          {currentPage === 'login' && (
            <LoginPage 
              onNavigate={navigate} 
              onLogin={() => {
                setIsLoggedIn(true);
                navigate('dashboard');
              }} 
            />
          )}
          {currentPage === 'signup' && (
            <SignUpPage 
              onNavigate={navigate} 
              userName={userName} 
              setUserName={setUserName} 
              onSignUp={() => {
                setSetupSource('signup');
                navigate('profile-setup');
              }} 
            />
          )}
          {currentPage === 'forgot-password' && (
            <ForgotPasswordPage onNavigate={navigate} />
          )}
          {currentPage === 'news-article' && (
            <NewsArticlePage article={selectedArticle} onNavigate={navigate} />
          )}
          {currentPage === 'profile-setup' && (
            <ProfileSetupPage 
              onNavigate={navigate} 
              setupSource={setupSource} 
              healthProfile={healthProfile} 
              setHealthProfile={setHealthProfile} 
              onSave={() => {
                setIsLoggedIn(true);
                navigate('dashboard');
              }} 
            />
          )}
          {currentPage === 'chat' && (
            <AIChatPage 
              chatMessages={chatMessages} 
              setChatMessages={setChatMessages} 
              isTyping={isTyping} 
              setIsTyping={setIsTyping} 
              healthProfile={healthProfile} 
              navigate={navigate}
              Logo={Logo}
            />
          )}
          
          {/* Main App Container for Dashboard-like pages */}
          {['dashboard', 'map', 'ai', 'insights', 'premium', 'account', 'app-settings', 'about', 'help', 'event-registration'].includes(currentPage) && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {currentPage === 'dashboard' && <DashboardPage />}
              {currentPage === 'map' && <MapPage />}
              {currentPage === 'ai' && <SmartAIPage />}
              {currentPage === 'insights' && <InsightsPage />}
              {currentPage === 'event-registration' && (
                <EventRegistrationPage 
                  event={selectedEvent} 
                  onBack={() => navigate('insights')} 
                  userName={userName}
                />
              )}
              {currentPage === 'premium' && <PremiumPage />}
              {currentPage === 'account' && <AccountPage />}
              {currentPage === 'app-settings' && <AppSettingsPage />}
              {currentPage === 'about' && <AboutPage />}
              {currentPage === 'help' && <HelpCenterPage />}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Navigation - Fixed to bottom, not floating */}
      {['dashboard', 'ai', 'insights', 'account', 'premium', 'app-settings', 'about', 'help'].includes(currentPage) && (
        <nav className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100 px-10 pt-4 pb-4 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
          {[
            { icon: Home, label: 'Home', page: 'dashboard' },
            { icon: BookOpen, label: 'Do You Know?', page: 'insights' },
            { icon: Lightbulb, label: 'Smart AI', page: 'ai' },
          ].map(item => (
            <button 
              key={item.label}
              onClick={() => navigate(item.page as Page)}
              className={`flex flex-col items-center gap-1.5 transition-all group ${currentPage === item.page ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className={`p-2.5 rounded-2xl transition-all duration-300 ${currentPage === item.page ? 'bg-primary/10 scale-110' : 'group-hover:bg-slate-50'}`}>
                <item.icon size={26} strokeWidth={currentPage === item.page ? 2.5 : 2} className={currentPage === item.page ? 'text-primary' : 'text-slate-400'} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${currentPage === item.page ? 'text-primary' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
