import { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Bell,
  Maximize2,
  Minimize2,
  Image as ImageIcon,
  Upload,
  Link,
  Settings2,
  X,
  Monitor,
  ArrowLeft,
  ChevronUp,
  Sun,
  Moon,
} from 'lucide-react';

// ============ Theme Context ============
interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}
const ThemeContext = createContext<ThemeContextType>({ theme: 'light', setTheme: () => {} });
function useTheme() { return useContext(ThemeContext); }

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);
  const setTheme = useCallback((t: string) => setThemeState(t), []);
  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}



// ============ Theme Toggle ============
function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-white/10 text-yellow-300 hover:bg-white/20' : 'bg-blue-100/60 text-blue-600 hover:bg-blue-200/60'} ${className}`} title={isDark ? '切换亮色模式' : '切换暗色模式'}>
      {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
    </button>
  );
}

// ============ Analog Clock ============
function AnalogClock({ now }: { now: Date }) {
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();
  const smoothSeconds = seconds + milliseconds / 1000;
  const smoothMinutes = minutes + smoothSeconds / 60;
  const smoothHours = hours + smoothMinutes / 60;
  const secondAngle = smoothSeconds * 6;
  const minuteAngle = smoothMinutes * 6;
  const hourAngle = smoothHours * 30;
  const hourMarkers = Array.from({ length: 12 }, (_, i) => i);
  const minuteMarkers = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 dark:from-blue-500/10 via-transparent to-cyan-300/20 animate-pulse-glow" />
      <div className="relative w-full h-full rounded-full glass overflow-hidden">
        <div className="flow-light-wide animate-flow" style={{ top: '30%' }} />
        <div className="flow-light-wide animate-flow-slow" style={{ top: '60%' }} />
        <div className="absolute inset-4 rounded-full border border-white/20" />
        <div className="absolute inset-8 rounded-full border border-white/10" />
        {minuteMarkers.map((i) => {
          const angle = i * 6;
          const isHour = i % 5 === 0;
          return (
            <div key={`min-${i}`} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '0 0' }}>
              <div className={`rounded-full ${isHour ? 'w-1 h-3 bg-blue-600/60 dark:bg-blue-400/70' : 'w-0.5 h-1.5 bg-blue-300/40 dark:bg-blue-500/30'}`} style={{ transform: `translateX(-50%) translateY(-${isHour ? 130 : 134}px)` }} />
            </div>
          );
        })}
        {hourMarkers.map((i) => {
          const angle = i * 30;
          const rad = (angle - 90) * (Math.PI / 180);
          const radius = 105;
          const x = Math.cos(rad) * radius;
          const y = Math.sin(rad) * radius;
          const num = i === 0 ? 12 : i;
          return (
            <div key={`hour-${i}`} className="absolute left-1/2 top-1/2 text-sm font-semibold text-blue-900/70 dark:text-blue-200/80 select-none" style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>{num}</div>
          );
        })}
        <div className="absolute left-1/2 top-1/2 hand-shadow" style={{ transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`, transformOrigin: '50% 100%' }}>
          <div className="w-1.5 h-20 bg-gradient-to-t from-blue-800 to-blue-600 dark:from-blue-400 dark:to-blue-300 rounded-full origin-bottom" />
        </div>
        <div className="absolute left-1/2 top-1/2 hand-shadow" style={{ transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`, transformOrigin: '50% 100%' }}>
          <div className="w-1 h-28 bg-gradient-to-t from-blue-700 to-blue-400 dark:from-blue-300 dark:to-blue-200 rounded-full origin-bottom" />
        </div>
        <div className="absolute left-1/2 top-1/2" style={{ transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`, transformOrigin: '50% 100%' }}>
          <div className="w-0.5 h-32 bg-gradient-to-t from-red-400 to-red-300 dark:from-red-300 dark:to-red-200 rounded-full origin-bottom" />
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-300 dark:to-blue-500 shadow-lg z-10">
          <div className="absolute inset-0.5 rounded-full bg-white/40" />
        </div>
        <div className="absolute inset-0 rounded-full overflow-hidden"><div className="flow-light animate-flow" style={{ top: '50%' }} /></div>
      </div>
    </div>
  );
}

// ============ Digital Display ============
function DigitalDisplay({ now }: { now: Date }) {
  const time = now.toLocaleTimeString('zh-CN', { hour12: false });
  const date = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
  const [mainTime, seconds] = time.split(':').reduce((acc, val, idx, arr) => { if (idx === arr.length - 1) return [acc[0], val]; return [acc[0] + val + ':', acc[1]]; }, ['', '']);
  const [hours, minutes] = mainTime.split(':');
  return (
    <div className="text-center mt-8">
      <div className="flex items-baseline justify-center gap-1">
        <span className="text-6xl sm:text-7xl font-light tracking-wider text-blue-900/80 dark:text-white tabular-nums">{hours}</span>
        <span className="text-6xl sm:text-7xl font-light text-blue-400/80 dark:text-blue-300 animate-pulse">:</span>
        <span className="text-6xl sm:text-7xl font-light tracking-wider text-blue-900/80 dark:text-white tabular-nums">{minutes}</span>
        <span className="text-2xl sm:text-3xl font-light text-blue-400/60 dark:text-blue-300 ml-2 tabular-nums self-end mb-2">{seconds}</span>
      </div>
      <p className="mt-2 text-sm text-blue-600/50 dark:text-blue-400/50 tracking-widest uppercase">{date}</p>
    </div>
  );
}

// ============ Stopwatch ============
function Stopwatch({ elapsed, running, laps, onStart, onPause, onReset, onLap, onClear }: { elapsed: number; running: boolean; laps: number[]; onStart: () => void; onPause: () => void; onReset: () => void; onLap: () => void; onClear: () => void }) {
  const formatTime = (ms: number) => { const m = Math.floor(ms / 60000); const s = Math.floor((ms % 60000) / 1000); const cs = Math.floor((ms % 1000) / 10); return { min: String(m).padStart(2, '0'), sec: String(s).padStart(2, '0'), cs: String(cs).padStart(2, '0') }; };
  const t = formatTime(elapsed);
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass rounded-3xl p-8 mb-6 text-center relative overflow-hidden">
        <div className="flow-light-wide animate-flow" style={{ top: '20%' }} />
        <div className="relative z-10">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-5xl sm:text-6xl font-light tabular-nums text-blue-900/80 dark:text-white">{t.min}</span>
            <span className="text-5xl sm:text-6xl font-light text-blue-400/60 dark:text-blue-300">:</span>
            <span className="text-5xl sm:text-6xl font-light tabular-nums text-blue-900/80 dark:text-white">{t.sec}</span>
            <span className="text-2xl sm:text-3xl font-light text-blue-400/50 dark:text-blue-300 ml-1 tabular-nums self-end mb-1">.{t.cs}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 mb-6">
        {!running ? (
          <button onClick={onStart} className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-blue-500/50 hover:scale-105 transition-all duration-200"><Play className="w-6 h-6 ml-0.5" /></button>
        ) : (
          <button onClick={onPause} className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center hover:shadow-amber-500/50 hover:scale-105 transition-all duration-200"><Pause className="w-6 h-6" /></button>
        )}
        {running && <button onClick={onLap} className="w-14 h-14 rounded-full glass text-blue-700 dark:text-blue-200 flex items-center justify-center hover:bg-white/60 hover:scale-105 transition-all duration-200"><Plus className="w-5 h-5" /></button>}
        {elapsed > 0 && !running && <button onClick={onReset} className="w-14 h-14 rounded-full glass text-blue-700 dark:text-blue-200 flex items-center justify-center hover:bg-white/60 hover:scale-105 transition-all duration-200"><RotateCcw className="w-5 h-5" /></button>}
        {(elapsed > 0 || laps.length > 0) && <button onClick={onClear} className="w-14 h-14 rounded-full glass text-red-500/70 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 hover:scale-105 transition-all duration-200" title="清空数据"><Trash2 className="w-5 h-5" /></button>}
      </div>
      {laps.length > 0 && (
        <div className="glass rounded-2xl p-4 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {laps.map((lap, i) => {
              const lt = formatTime(lap);
              const diff = i < laps.length - 1 ? lap - laps[i + 1] : lap;
              const dt = formatTime(diff);
              return (
                <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/30">
                  <span className="text-sm text-blue-600/60 dark:text-blue-400/60">计次 {laps.length - i}</span>
                  <span className="text-sm tabular-nums text-blue-800/70 dark:text-blue-200/70">+{dt.min}:{dt.sec}.{dt.cs}</span>
                  <span className="text-sm font-medium tabular-nums text-blue-900/80 dark:text-blue-50">{lt.min}:{lt.sec}.{lt.cs}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Number Picker ============
function NumberPicker({ value, onChange, max, label }: { value: number; onChange: (v: number) => void; max: number; label: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const numbers = Array.from({ length: max + 1 }, (_, i) => i);
  useEffect(() => {
    if (scrollRef.current && !isScrollingRef.current) {
      const itemHeight = 40;
      scrollRef.current.scrollTop = value * itemHeight;
    }
  }, [value]);
  const handleScroll = () => {
    if (!scrollRef.current) return;
    isScrollingRef.current = true;
    const itemHeight = 40;
    const index = Math.round(scrollRef.current.scrollTop / itemHeight);
    const clamped = Math.max(0, Math.min(max, index));
    if (clamped !== value) onChange(clamped);
    clearTimeout((handleScroll as any)._timer);
    (handleScroll as any)._timer = setTimeout(() => { isScrollingRef.current = false; }, 150);
  };
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-blue-500/60 dark:text-blue-200/70 font-medium">{label}</span>
      <div className="relative w-16 h-[120px] rounded-xl bg-white/25 dark:bg-[hsl(215_25%_20%)]/40 border border-white/25 dark:border-white/20">
        <div className="absolute top-0 left-0 right-0 h-10 z-10 bg-gradient-to-b from-white/60 dark:from-[hsl(215_25%_20%)]/25 to-transparent pointer-events-none rounded-t-xl" />
        <div className="absolute bottom-0 left-0 right-0 h-10 z-10 bg-gradient-to-t from-white/60 dark:from-[hsl(215_25%_20%)]/25 to-transparent pointer-events-none rounded-b-xl" />
        <div className="absolute top-10 left-1 right-1 h-10 bg-blue-100/40 dark:bg-blue-400/20 border-y border-blue-300/25 dark:border-blue-400/25 z-[5] pointer-events-none rounded-lg" />
        <div ref={scrollRef} onScroll={handleScroll} className="absolute inset-0 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          <div className="h-10" />
          {numbers.map((n) => (
            <div key={n} className={`h-10 flex items-center justify-center text-lg tabular-nums transition-colors duration-150 cursor-pointer select-none ${n === value ? 'text-blue-700 dark:text-white font-bold' : 'text-blue-500/50 dark:text-blue-50/85 font-light'}`} onClick={() => onChange(n)}>
              {String(n).padStart(2, '0')}
            </div>
          ))}
          <div className="h-10" />
        </div>
      </div>
    </div>
  );
}

// ============ Countdown Timer ============
interface CountdownItem { id: number; targetMs: number; totalSeconds: number; label: string; finished: boolean; }
interface CountdownTimerProps { items: CountdownItem[]; onAdd: (h: number, m: number, s: number, label: string) => void; onRemove: (id: number) => void; onClearAll: () => void; }

function CountdownTimer({ items, onAdd, onRemove, onClearAll }: CountdownTimerProps) {
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('05');
  const [seconds, setSeconds] = useState('00');
  const [label, setLabel] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const interval = setInterval(() => setNow(Date.now()), 100); return () => clearInterval(interval); }, []);
  const handleAdd = () => {
    const h = parseInt(hours) || 0; const m = parseInt(minutes) || 0; const s = parseInt(seconds) || 0;
    if (h * 3600 + m * 60 + s <= 0) return;
    onAdd(h, m, s, label); setLabel('');
  };
  const formatRemaining = (ms: number) => {
    if (ms <= 0) return { h: '00', m: '00', s: '00', done: true };
    const totalSec = Math.ceil(ms / 1000);
    return { h: String(Math.floor(totalSec / 3600)).padStart(2, '0'), m: String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0'), s: String(totalSec % 60).padStart(2, '0'), done: false };
  };
  const getProgress = (item: CountdownItem) => { const r = item.targetMs - now; return r <= 0 ? 0 : Math.min(1, r / (item.totalSeconds * 1000)); };
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass rounded-3xl p-6 mb-6 relative overflow-hidden">
        <div className="flow-light-wide animate-flow" style={{ top: '50%' }} />
        <div className="relative z-10">
          <h3 className="text-sm font-medium text-blue-600/70 dark:text-white mb-4 tracking-wider uppercase">新建倒计时</h3>
          <div className="flex justify-end mb-3">
            <button onClick={() => setIsEditing(!isEditing)} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${isEditing ? 'bg-blue-500/25 text-blue-500 dark:bg-blue-500/30 dark:text-blue-100' : 'bg-white/30 dark:bg-white/10 text-blue-600/70 dark:text-blue-200/80 hover:bg-white/40 dark:hover:bg-white/15'}`}>
              {isEditing ? (<><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>滚轮选择</>) : (<><svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6" /><path d="M9 13h6" /></svg>手动输入</>)}
            </button>
          </div>
          {isEditing ? (
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-blue-400/50 dark:text-blue-100/90 font-medium">时</span>
                <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} min="0" max="99" className="w-16 h-12 text-center text-xl font-light tabular-nums bg-white/50 dark:bg-white/10 rounded-xl border-2 border-blue-400/40 dark:border-blue-400/30 text-blue-900/90 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/30" style={{ appearance: 'textfield', MozAppearance: 'textfield' }} />
              </div>
              <span className="text-2xl text-blue-400/50 dark:text-blue-200/80 font-light self-end mb-2">:</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-blue-400/50 dark:text-blue-100/90 font-medium">分</span>
                <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} min="0" max="59" className="w-16 h-12 text-center text-xl font-light tabular-nums bg-white/50 dark:bg-white/10 rounded-xl border-2 border-blue-400/40 dark:border-blue-400/30 text-blue-900/90 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/30" style={{ appearance: 'textfield', MozAppearance: 'textfield' }} />
              </div>
              <span className="text-2xl text-blue-400/50 dark:text-blue-200/80 font-light self-end mb-2">:</span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs text-blue-400/50 dark:text-blue-100/90 font-medium">秒</span>
                <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} min="0" max="59" className="w-16 h-12 text-center text-xl font-light tabular-nums bg-white/50 dark:bg-white/10 rounded-xl border-2 border-blue-400/40 dark:border-blue-400/30 text-blue-900/90 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400/30" style={{ appearance: 'textfield', MozAppearance: 'textfield' }} />
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-center gap-4 sm:gap-6 mb-4">
              <NumberPicker value={parseInt(hours) || 0} onChange={(v) => setHours(String(v))} max={99} label="时" />
              <div className="flex flex-col items-center justify-center pt-6"><span className="text-2xl text-blue-400/50 dark:text-blue-200/70 font-light">:</span></div>
              <NumberPicker value={parseInt(minutes) || 0} onChange={(v) => setMinutes(String(v))} max={59} label="分" />
              <div className="flex flex-col items-center justify-center pt-6"><span className="text-2xl text-blue-400/50 dark:text-blue-200/70 font-light">:</span></div>
              <NumberPicker value={parseInt(seconds) || 0} onChange={(v) => setSeconds(String(v))} max={59} label="秒" />
            </div>
          )}
          <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="标签（可选）" className="w-full h-10 px-4 text-sm bg-white/40 dark:bg-white/10 rounded-xl border border-white/30 dark:border-white/15 text-blue-900/80 dark:text-white placeholder-blue-500/50 dark:placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 mb-4" />
          <button onClick={handleAdd} className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.02] transition-all duration-200">开始倒计时</button>
        </div>
      </div>
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => {
            const remaining = item.targetMs - now;
            const time = formatRemaining(remaining);
            const progress = getProgress(item);
            const isDone = remaining <= 0;
            return (
              <div key={item.id} className={`glass rounded-2xl p-4 relative overflow-hidden transition-all duration-300 ${isDone ? 'ring-2 ring-blue-400/50' : ''}`}>
                <div className="flow-light-wide animate-flow" style={{ top: '50%' }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {isDone && <Bell className="w-4 h-4 text-blue-500 animate-bounce" />}
                      <span className="text-sm font-medium text-blue-800/80 dark:text-white">{item.label}</span>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="w-7 h-7 rounded-lg bg-white/30 flex items-center justify-center text-blue-600/50 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-100" style={{ width: `${progress * 100}%` }} />
                  </div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-light tabular-nums text-blue-900/90 dark:text-white">{time.h}</span>
                    <span className="text-3xl font-light text-blue-400/70 dark:text-blue-300">:</span>
                    <span className="text-3xl font-light tabular-nums text-blue-900/90 dark:text-white">{time.m}</span>
                    <span className="text-3xl font-light text-blue-400/70 dark:text-blue-300">:</span>
                    <span className="text-3xl font-light tabular-nums text-blue-900/90 dark:text-white">{time.s}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {items.length > 0 && (
        <div className="mt-4 flex justify-center">
          <button onClick={onClearAll} className="px-4 py-2 rounded-xl bg-red-500/10 dark:bg-red-500/15 text-red-500/70 dark:text-red-400/70 text-sm flex items-center gap-1.5 hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" />清空所有</button>
        </div>
      )}
      {items.length === 0 && <div className="text-center py-12 text-blue-400/60 dark:text-blue-200/70"><p className="text-sm">暂无倒计时</p></div>}
    </div>
  );
}

// ============ Windows Lock Screen Clock ============
function LockScreenClock({ onBack }: { onBack: () => void }) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const [now, setNow] = useState(new Date());
  const [wallpaper, setWallpaper] = useState<string>('');
  const [wallpaperFit, setWallpaperFit] = useState<string>(() => localStorage.getItem('lockscreen-wallpaper-fit') || 'cover');
  const [showSettings, setShowSettings] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [textColor, setTextColor] = useState('rgba(255, 255, 255, 0.8)');
  const [textShadow, setTextShadow] = useState('0 0 20px rgba(147,197,253,0.1), 0 2px 15px rgba(0,0,0,0.3)');
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const resetHideTimer = useCallback(() => {
    if (showSettings) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setShowControls(true);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 5000);
  }, [showSettings]);

  const handleInteraction = useCallback(() => { resetHideTimer(); }, [resetHideTimer]);

  useEffect(() => { resetHideTimer(); return () => { if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }; }, [resetHideTimer]);
  useEffect(() => {
    if (showSettings) { setShowControls(true); if (hideTimerRef.current) clearTimeout(hideTimerRef.current); }
    else resetHideTimer();
  }, [showSettings, resetHideTimer]);

  useEffect(() => { const interval = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(interval); }, []);
  useEffect(() => { const saved = localStorage.getItem('lockscreen-wallpaper'); if (saved) setWallpaper(saved); }, []);
  useEffect(() => { const handler = () => setIsFullscreen(!!document.fullscreenElement); document.addEventListener('fullscreenchange', handler); return () => document.removeEventListener('fullscreenchange', handler); }, []);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (document.fullscreenElement) document.exitFullscreen(); else onBack(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onBack]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-settings-panel]')) { touchStartRef.current = null; return; }
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (dy < -80 && Math.abs(dy) > Math.abs(dx)) onBack();
    touchStartRef.current = null;
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      const el = document.documentElement as any;
      if (!document.fullscreenElement && el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      else if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const analyzeImage = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to image size
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw image to canvas
    ctx.drawImage(image, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calculate average brightness
    let totalBrightness = 0;
    let pixelCount = 0;

    // Sample every 10th pixel to improve performance
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Calculate brightness using HSL formula
      const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      totalBrightness += brightness;
      pixelCount++;
    }

    const averageBrightness = totalBrightness / pixelCount;

    // Adjust text color based on average brightness
    if (averageBrightness > 0.6) {
      // Bright image, use dark text
      setTextColor('rgba(0, 0, 0, 0.8)');
      setTextShadow('0 0 20px rgba(0, 0, 0, 0.1), 0 2px 15px rgba(255, 255, 255, 0.3)');
    } else {
      // Dark image, use light text
      setTextColor('rgba(255, 255, 255, 0.8)');
      setTextShadow('0 0 20px rgba(147,197,253,0.1), 0 2px 15px rgba(0,0,0,0.3)');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const imageUrl = ev.target?.result as string;
      setWallpaper(imageUrl);
      localStorage.setItem('lockscreen-wallpaper', imageUrl);
      setShowSettings(false);
      
      // Create an image element to analyze
      const img = new Image();
      img.onload = () => {
        analyzeImage(img);
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      const imageUrl = urlInput.trim();
      setWallpaper(imageUrl);
      localStorage.setItem('lockscreen-wallpaper', imageUrl);
      setUrlInput('');
      setShowSettings(false);
      
      // Create an image element to analyze
      const img = new Image();
      img.onload = () => {
        analyzeImage(img);
      };
      img.src = imageUrl;
    }
  };
  const clearWallpaper = () => { 
    setWallpaper(''); 
    localStorage.removeItem('lockscreen-wallpaper'); 
    localStorage.removeItem('lockscreen-wallpaper-fit'); 
    setShowSettings(false);
    // Reset to default text color
    setTextColor('rgba(255, 255, 255, 0.8)');
    setTextShadow('0 0 20px rgba(147,197,253,0.1), 0 2px 15px rgba(0,0,0,0.3)');
  };

  const fitModes = [
    { key: 'cover', label: '覆盖' },
    { key: 'contain', label: '包含' },
    { key: 'fill', label: '拉伸' },
    { key: 'center', label: '居中' },
  ];
  const fitClasses: Record<string, string> = {
    cover: 'w-full h-full object-cover',
    contain: 'w-full h-full object-contain bg-black',
    fill: 'w-full h-full object-fill',
    center: 'w-full h-full object-center bg-black',
  };

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const dateStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none" onMouseMove={handleInteraction} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Wallpaper */}
      {wallpaper ? (
        <img src={wallpaper} alt="wallpaper" className={`absolute inset-0 ${fitClasses[wallpaperFit] || 'w-full h-full object-cover'}`} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      ) : (
        <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950' : 'bg-gradient-to-br from-blue-900 via-blue-800 to-sky-900'}`} />
      )}
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[200%] h-32 bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ top: '30%', animation: 'flow 15s linear infinite', transform: 'rotate(-15deg)' }} />
        <div className="absolute w-[200%] h-24 bg-gradient-to-r from-transparent via-white/3 to-transparent" style={{ top: '60%', animation: 'flow-slow 20s linear infinite', transform: 'rotate(10deg)' }} />
      </div>

      {/* Center clock content - always visible */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
        <div className="text-center w-full">
          <div className="flex items-end justify-center whitespace-nowrap">
            <span className="font-extralight tracking-tight tabular-nums drop-shadow-2xl" style={{ fontSize: 'clamp(4.5rem, 18vw, 16rem)', lineHeight: '0.85', color: textColor, textShadow: textShadow }}>
              {String(hours).padStart(2, '0')}
            </span>
            <span className="font-extralight tabular-nums animate-pulse mx-[0.1em]" style={{ fontSize: 'clamp(4rem, 16vw, 14rem)', lineHeight: '0.85', color: textColor }}>
              :</span>
            <span className="relative inline-flex items-end">
              <span className="font-extralight tracking-tight tabular-nums drop-shadow-2xl" style={{ fontSize: 'clamp(4.5rem, 18vw, 16rem)', lineHeight: '0.85', color: textColor, textShadow: textShadow }}>
                {String(minutes).padStart(2, '0')}
              </span>
              <span className="font-extralight tabular-nums absolute -bottom-[0.15em] -right-[2.8em]" style={{ fontSize: 'clamp(1.2rem, 4.5vw, 2.8rem)', color: textColor, textShadow: textShadow }}>
                {String(now.getSeconds()).padStart(2, '0')}
              </span>
            </span>
          </div>
          <p className="font-light mt-4 sm:mt-6 tracking-wide" style={{ fontSize: 'clamp(0.85rem, 2.2vw, 1.5rem)', color: textColor, textShadow: textShadow }}>
            {dateStr}
          </p>
        </div>
      </div>

      {/* Top bar - auto-hide */}
      <div className={`absolute top-0 left-0 right-0 z-20 p-3 sm:p-4 transition-all duration-500 ease-in-out ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/80 text-sm hover:bg-white/20 hover:text-white transition-all duration-200">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">返回主页</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(isDark ? 'light' : 'dark')} className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/70 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-200" title={isDark ? '切换亮色模式' : '切换暗色模式'}>
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button onClick={toggleFullscreen} className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/70 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-200" title={isFullscreen ? '退出全屏' : '全屏'}>
              {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
            <button onClick={() => setShowSettings(!showSettings)} className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl backdrop-blur-md border text-white/70 flex items-center justify-center hover:bg-white/20 hover:text-white transition-all duration-200 ${showSettings ? 'bg-white/20 border-white/20' : 'bg-white/10 border-white/10'}`} title="设置壁纸">
              <Settings2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom hint - auto-hide */}
      <div className={`absolute bottom-0 left-0 right-0 z-20 pb-6 sm:pb-8 flex flex-col items-center gap-2 transition-all duration-500 ease-in-out ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="sm:hidden flex flex-col items-center gap-1" style={{ color: textColor }}>
          <ChevronUp className="w-5 h-5 animate-bounce" style={{ color: textColor }} />
          <span className="text-xs tracking-wider" style={{ color: textColor }}>上滑返回</span>
        </div>
        <p className="hidden sm:block text-xs tracking-widest uppercase" style={{ color: textColor }}>按 ESC 返回</p>
      </div>

      {/* Tap area to show controls when hidden */}
      {!showControls && <button onClick={handleInteraction} className="absolute inset-0 z-[5] bg-transparent" aria-label="显示控制按钮" />}

      {/* Settings panel */}
      {showSettings && (
        <div data-settings-panel className="absolute top-16 right-3 sm:right-4 z-30 w-80 sm:w-96 max-h-[70vh] overflow-y-auto">
          <div className={`rounded-2xl backdrop-blur-xl border border-white/10 p-5 shadow-2xl ${isDark ? 'bg-gray-900/80 border-gray-700/30' : 'bg-black/50 border-white/10'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white/90 text-sm font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4" />自定义壁纸</h3>
              <button onClick={() => setShowSettings(false)} className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/20 transition-colors"><X className="w-3.5 h-3.5" /></button>
            </div>
            {wallpaper && (
              <>
                <div className="mb-4 rounded-xl overflow-hidden border border-white/10 bg-black">
                  <img src={wallpaper} alt="preview" className={`w-full h-28 ${fitClasses[wallpaperFit] || 'object-cover'}`} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="flex gap-1.5 mb-4">
                  {fitModes.map((mode) => (
                    <button key={mode.key} onClick={() => { setWallpaperFit(mode.key); localStorage.setItem('lockscreen-wallpaper-fit', mode.key); }} className={`flex-1 h-8 rounded-lg text-xs font-medium transition-all duration-200 ${wallpaperFit === mode.key ? 'bg-blue-500/40 text-white border border-blue-400/30' : 'bg-white/10 text-white/50 border border-white/10 hover:bg-white/15 hover:text-white/70'}`}>{mode.label}</button>
                  ))}
                </div>
              </>
            )}
            <button onClick={() => { const input = document.getElementById('wallpaper-file') as HTMLInputElement; input?.click(); }} className="w-full h-11 rounded-xl bg-white/10 border border-white/10 text-white/80 text-sm flex items-center justify-center gap-2 hover:bg-white/15 transition-colors mb-3"><Upload className="w-4 h-4" />从本地选择图片</button>
            <input id="wallpaper-file" type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()} placeholder="输入图片 URL" className="w-full h-11 pl-9 pr-3 rounded-xl bg-white/10 border border-white/10 text-white/80 text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/20" />
              </div>
              <button onClick={handleUrlSubmit} className="h-11 px-4 rounded-xl bg-blue-500/60 text-white text-sm font-medium hover:bg-blue-500/80 transition-colors">应用</button>
            </div>
            {wallpaper && <button onClick={clearWallpaper} className="w-full h-9 rounded-lg bg-red-500/20 border border-red-500/20 text-red-300/80 text-xs flex items-center justify-center gap-1.5 hover:bg-red-500/30 transition-colors"><Monitor className="w-3.5 h-3.5" />恢复默认背景</button>}
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Main App ============
type TabType = 'clock' | 'stopwatch' | 'countdown' | 'lockscreen';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('clock');
  const [now, setNow] = useState(new Date());
  const [swElapsed, setSwElapsed] = useState(() => { const s = localStorage.getItem('stopwatch-elapsed'); return s ? parseInt(s) : 0; });
  const [swRunning, setSwRunning] = useState(false);
  const [swLaps, setSwLaps] = useState<number[]>(() => { const s = localStorage.getItem('stopwatch-laps'); return s ? JSON.parse(s) : []; });
  const swStartRef = useRef<number>(0);
  const swRafRef = useRef<number>(0);
  const [countdownItems, setCountdownItems] = useState<CountdownItem[]>(() => { const s = localStorage.getItem('countdown-items'); return s ? JSON.parse(s) : []; });

  useEffect(() => { localStorage.setItem('stopwatch-elapsed', String(swElapsed)); }, [swElapsed]);
  useEffect(() => { localStorage.setItem('stopwatch-laps', JSON.stringify(swLaps)); }, [swLaps]);
  useEffect(() => { localStorage.setItem('countdown-items', JSON.stringify(countdownItems)); }, [countdownItems]);

  const swUpdate = useCallback(() => { setSwElapsed(Date.now() - swStartRef.current); swRafRef.current = requestAnimationFrame(swUpdate); }, []);
  useEffect(() => { return () => cancelAnimationFrame(swRafRef.current); }, []);

  const handleSwStart = useCallback(() => { swStartRef.current = Date.now() - swElapsed; setSwRunning(true); swRafRef.current = requestAnimationFrame(swUpdate); }, [swElapsed, swUpdate]);
  const handleSwPause = useCallback(() => { setSwRunning(false); cancelAnimationFrame(swRafRef.current); }, []);
  const handleSwReset = useCallback(() => { setSwRunning(false); cancelAnimationFrame(swRafRef.current); setSwElapsed(0); setSwLaps([]); localStorage.removeItem('stopwatch-elapsed'); localStorage.removeItem('stopwatch-laps'); }, []);
  const handleSwClear = useCallback(() => { setSwRunning(false); cancelAnimationFrame(swRafRef.current); setSwElapsed(0); setSwLaps([]); localStorage.removeItem('stopwatch-elapsed'); localStorage.removeItem('stopwatch-laps'); }, []);
  const handleSwLap = useCallback(() => { setSwLaps((prev) => [swElapsed, ...prev]); }, [swElapsed]);

  const handleCountdownAdd = useCallback((h: number, m: number, s: number, label: string) => {
    const totalSeconds = h * 3600 + m * 60 + s; if (totalSeconds <= 0) return;
    setCountdownItems((prev) => [...prev, { id: Date.now(), targetMs: Date.now() + totalSeconds * 1000, totalSeconds, label: label || `倒计时 ${totalSeconds}s`, finished: false }]);
  }, []);
  const handleCountdownRemove = useCallback((id: number) => { setCountdownItems((prev) => prev.filter((item) => item.id !== id)); }, []);
  const handleCountdownClearAll = useCallback(() => { setCountdownItems([]); localStorage.removeItem('countdown-items'); }, []);

  useEffect(() => { const interval = setInterval(() => setNow(new Date()), 50); return () => clearInterval(interval); }, []);

  if (activeTab === 'lockscreen') return <LockScreenClock onBack={() => setActiveTab('clock')} />;

  const tabs: { key: TabType; label: string; icon?: React.ReactNode }[] = [
    { key: 'clock', label: '时钟' },
    { key: 'stopwatch', label: '计时' },
    { key: 'countdown', label: '倒计时' },
    { key: 'lockscreen', label: '锁屏', icon: (<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M12 17v4" /><path d="M8 21h8" /></svg>) },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 transition-colors duration-500" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-blue-300/20 dark:bg-blue-500/10 animate-float" style={{ top: '10%', left: '-5%', filter: 'blur(80px)' }} />
        <div className="absolute w-80 h-80 rounded-full bg-cyan-300/15 dark:bg-cyan-500/8 animate-float" style={{ top: '40%', right: '-10%', filter: 'blur(100px)', animationDelay: '2s' }} />
        <div className="absolute w-72 h-72 rounded-full bg-blue-200/20 dark:bg-blue-400/10 animate-float" style={{ bottom: '10%', left: '20%', filter: 'blur(90px)', animationDelay: '4s' }} />
        <div className="absolute w-64 h-64 rounded-full bg-sky-200/15 dark:bg-sky-400/8 animate-float" style={{ bottom: '20%', right: '15%', filter: 'blur(70px)', animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: `linear-gradient(hsl(210 70% 45%) 1px, transparent 1px), linear-gradient(90deg, hsl(210 70% 45%) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-3 py-6 sm:px-4 sm:py-8">
        <div className="relative mb-6 sm:mb-8 w-full max-w-lg flex items-center justify-center">
          <div className="glass rounded-2xl p-1 sm:p-1.5 flex gap-0.5 sm:gap-1 flex-grow justify-center flex-nowrap">
            {tabs.map((tab, idx) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-1 flex-shrink-0 whitespace-nowrap px-2 py-1.5 sm:px-5 sm:py-2.5 text-[11px] sm:text-sm min-w-0 ${activeTab === tab.key ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-blue-600/60 dark:text-blue-200/70 hover:text-blue-700/80 dark:hover:text-blue-100 hover:bg-white/30 dark:hover:bg-white/10'}`}>
                {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                <span className="truncate">{idx === 2 ? <><span className="sm:hidden">倒计</span><span className="hidden sm:inline">倒计时</span></> : tab.label}</span>
              </button>
            ))}
            <ThemeToggle className="ml-1 sm:ml-2 flex-shrink-0" />
          </div>
        </div>
        <div className="w-full flex justify-center">
          {activeTab === 'clock' && (<div className="flex flex-col items-center animate-in fade-in duration-300"><AnalogClock now={now} /><DigitalDisplay now={now} /></div>)}
          {activeTab === 'stopwatch' && (<div className="animate-in fade-in duration-300"><Stopwatch elapsed={swElapsed} running={swRunning} laps={swLaps} onStart={handleSwStart} onPause={handleSwPause} onReset={handleSwReset} onLap={handleSwLap} onClear={handleSwClear} /></div>)}
          {activeTab === 'countdown' && (<div className="animate-in fade-in duration-300"><CountdownTimer items={countdownItems} onAdd={handleCountdownAdd} onRemove={handleCountdownRemove} onClearAll={handleCountdownClearAll} /></div>)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
