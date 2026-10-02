import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart3,
  Calendar,
  Clock,
  Download,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  UserCircle2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/src/lib/utils";
import { useLocalStorageState } from "@/src/lib/useLocalStorageState";
import { tryLoadWeeklyTimeFromSupabase } from "@/src/services/supabaseDashboard";

type NavKey = "dashboard" | "progress" | "time" | "sessions" | "settings";

type WeeklyTimePoint = {
  label: string;
  gamesMin: number;
  chatMin: number;
  demoMin: number;
};

type DashboardModel = {
  childName: string;
  role: "Parent" | "Therapist";
  kpis: {
    totalSessions: number;
    wowDeltaPct: number;
    progressScorePct: number;
    avgDailyUseMin: number;
  };
  weeklyTime: WeeklyTimePoint[];
  recentSessions: { title: string; when: string; minutes: number; notes: string }[];
};

const DEFAULT_MODEL: DashboardModel = {
  childName: "Leo",
  role: "Parent",
  kpis: {
    totalSessions: 45,
    wowDeltaPct: 12,
    progressScorePct: 87,
    avgDailyUseMin: 80,
  },
  weeklyTime: [
    { label: "Mon", gamesMin: 52, chatMin: 18, demoMin: 10 },
    { label: "Tue", gamesMin: 60, chatMin: 20, demoMin: 15 },
    { label: "Wed", gamesMin: 55, chatMin: 22, demoMin: 12 },
    { label: "Thu", gamesMin: 70, chatMin: 18, demoMin: 10 },
    { label: "Fri", gamesMin: 48, chatMin: 16, demoMin: 8 },
    { label: "Sat", gamesMin: 82, chatMin: 25, demoMin: 18 },
    { label: "Sun", gamesMin: 68, chatMin: 24, demoMin: 14 },
  ],
  recentSessions: [
    {
      title: "Sound Match • /s/ initiation",
      when: "Today • 4:05 PM",
      minutes: 14,
      notes: "Good attention; minor cueing needed for sustained /s/.",
    },
    {
      title: "Echo Beat • syllable timing",
      when: "Yesterday • 6:20 PM",
      minutes: 18,
      notes: "Improved timing consistency on 3-beat patterns.",
    },
    {
      title: "Animal Sound Fun • volume control",
      when: "2 days ago • 5:10 PM",
      minutes: 12,
      notes: "Strong participation; benefits from modeled breath pacing.",
    },
  ],
};

function minutesToHM(totalMin: number) {
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

function sumTime(weekly: WeeklyTimePoint[]) {
  return weekly.reduce(
    (acc, p) => {
      acc.games += p.gamesMin;
      acc.chat += p.chatMin;
      acc.demo += p.demoMin;
      return acc;
    },
    { games: 0, chat: 0, demo: 0 }
  );
}

function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

export default function Dashboard() {
  const [active, setActive] = React.useState<NavKey>("dashboard");
  const [dataSource, setDataSource] = React.useState<"local" | "supabase">("local");

  const [model, setModel] = useLocalStorageState<DashboardModel>(
    "melodymind.dashboard.v1",
    DEFAULT_MODEL
  );

  const [ui, setUi] = useLocalStorageState("melodymind.dashboard.ui.v1", {
    darkMode: false,
    highContrast: false,
    reducedMotion: false,
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", !!ui.darkMode);
  }, [ui.darkMode]);

  React.useEffect(() => {
    // If Supabase is configured and `screen_time` exists, prefer it for weekly time.
    tryLoadWeeklyTimeFromSupabase()
      .then((weeklyTime) => {
        if (!weeklyTime) return;
        setModel((p) => ({ ...p, weeklyTime }));
        setDataSource("supabase");
      })
      .catch(() => {
        // keep local fallback
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = sumTime(model.weeklyTime);
  const totalMin = totals.games + totals.chat + totals.demo;

  const pie = [
    { name: "Games", value: totals.games, color: "#3B82F6" },
    { name: "AI Chat", value: totals.chat, color: "#10B981" },
    { name: "Demo", value: totals.demo, color: "#F59E0B" },
  ];

  const transition = ui.reducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 300, damping: 20 };

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-0px)] pt-24 md:pt-28 px-4 md:px-6 pb-10",
        "bg-[--color-bg] text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors",
        ui.highContrast && "contrast-125"
      )}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="pro-card dark:bg-slate-900 dark:border-slate-800 p-4 lg:sticky lg:top-28 h-fit">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[--color-navy] text-white flex items-center justify-center shadow-xl">
                <LayoutDashboard size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  MelodyMind
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {model.role} Console
                </div>
              </div>
            </div>
          </div>

          <nav aria-label="Dashboard navigation" className="space-y-1">
            {(
              [
                { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { key: "progress", label: "Progress", icon: TrendingUp },
                { key: "time", label: "Time Reports", icon: BarChart3 },
                { key: "sessions", label: "Sessions", icon: Calendar },
                { key: "settings", label: "Settings", icon: SlidersHorizontal },
              ] as const
            ).map((item) => (
              <button
                key={item.key}
                onClick={() => setActive(item.key)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-primary]/40",
                  active === item.key
                    ? "bg-slate-900 text-white dark:bg-slate-800"
                    : "text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800/60"
                )}
                aria-current={active === item.key ? "page" : undefined}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 px-3 py-2">
              <UserCircle2 className="text-slate-500 dark:text-slate-400" size={20} />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                  {model.role}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Viewing: {model.childName}
                </div>
              </div>
              <button
                className="ml-auto p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut size={18} className="text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="space-y-6">
          {/* Header */}
          <div className="pro-card dark:bg-slate-900 dark:border-slate-800 p-5 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                  Pediatric therapy analytics
                </div>
                <div className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">
                  Dashboard — {model.childName}
                </div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                  Time usage and therapy progress are estimates based on in-app activity.
                  Configure limits and session notes in Settings.
                </div>
                <div className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Data source: {dataSource === "supabase" ? "Supabase (screen_time)" : "Local (mock + localStorage)"}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setUi((p: any) => ({ ...p, darkMode: !p.darkMode }))}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900"
                  aria-label="Toggle dark mode"
                >
                  <span className="inline-flex items-center gap-2">
                    {ui.darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    {ui.darkMode ? "Light" : "Dark"}
                  </span>
                </button>
                <button
                  onClick={() => setUi((p: any) => ({ ...p, highContrast: !p.highContrast }))}
                  className={cn(
                    "px-3 py-2 rounded-xl border text-sm font-semibold",
                    ui.highContrast
                      ? "border-[--color-primary] bg-blue-50 text-[--color-navy] dark:bg-slate-800 dark:text-slate-50"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900"
                  )}
                  aria-label="Toggle high contrast mode"
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Contrast
                  </span>
                </button>
                <button
                  onClick={() => setUi((p: any) => ({ ...p, reducedMotion: !p.reducedMotion }))}
                  className={cn(
                    "px-3 py-2 rounded-xl border text-sm font-semibold",
                    ui.reducedMotion
                      ? "border-[--color-primary] bg-blue-50 text-[--color-navy] dark:bg-slate-800 dark:text-slate-50"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900"
                  )}
                  aria-label="Toggle reduced motion"
                >
                  Reduce motion
                </button>
                <button
                  className="px-3 py-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-semibold inline-flex items-center gap-2"
                  aria-label="Export report"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* KPI row */}
          {active === "dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              {
                title: "Total Sessions",
                value: model.kpis.totalSessions,
                sub: `↑ ${model.kpis.wowDeltaPct}% week over week`,
              },
              {
                title: "App Time (7d)",
                value: minutesToHM(totalMin),
                sub: `Games ${pct(totals.games, totalMin)}% • Chat ${pct(totals.chat, totalMin)}% • Demo ${pct(
                  totals.demo,
                  totalMin
                )}%`,
              },
              {
                title: "Progress Score",
                value: `${model.kpis.progressScorePct}%`,
                sub: model.kpis.progressScorePct >= 85 ? "Level: Gold" : "Level: Bronze",
              },
              {
                title: "Avg Daily Use",
                value: `${minutesToHM(model.kpis.avgDailyUseMin)}`,
                sub: "Per child • rolling 7 days",
              },
            ].map((k, idx) => (
              <motion.div
                key={k.title}
                initial={ui.reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={ui.reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ ...transition, delay: idx * 0.04 }}
                whileHover={ui.reducedMotion ? undefined : { y: -2 }}
                className="pro-card dark:bg-slate-900 dark:border-slate-800 p-5"
              >
                <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
                  {k.title}
                </div>
                <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-50">
                  {k.value}
                </div>
                <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{k.sub}</div>
              </motion.div>
            ))}
          </div>
          )}

          {/* Core grid */}
          {active === "dashboard" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Time usage tracker */}
            <motion.section
              initial={ui.reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={ui.reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={transition}
              className="xl:col-span-2 pro-card dark:bg-slate-900 dark:border-slate-800 p-5 md:p-6"
              aria-label="Time usage tracker"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    Time Usage Tracker
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                    Weekly minutes by activity category. Helps identify engagement patterns
                    and ensure balanced practice across modalities.
                  </div>
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Total: {minutesToHM(totalMin)}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 items-center">
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={model.weeklyTime} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gGames" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gChat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10B981" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gDemo" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.35)" />
                      <XAxis dataKey="label" tick={{ fill: "rgba(100,116,139,1)", fontSize: 12 }} />
                      <YAxis tick={{ fill: "rgba(100,116,139,1)", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid rgba(226,232,240,1)",
                          boxShadow: "0 12px 24px rgba(15,23,42,0.10)",
                        }}
                        formatter={(v: any) => [`${v} min`, ""]}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="gamesMin" name="Games" stroke="#3B82F6" fill="url(#gGames)" strokeWidth={2} />
                      <Area type="monotone" dataKey="chatMin" name="AI Chat" stroke="#10B981" fill="url(#gChat)" strokeWidth={2} />
                      <Area type="monotone" dataKey="demoMin" name="Demo" stroke="#F59E0B" fill="url(#gDemo)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="pro-card dark:bg-slate-950 dark:border-slate-800 p-4">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-3">
                    Breakdown (7d)
                  </div>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pie}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={2}
                        >
                          {pie.map((p) => (
                            <Cell key={p.name} fill={p.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: any) => [`${v} min`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3 space-y-2 text-sm">
                    {pie.map((p) => (
                      <div key={p.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                          <span className="text-slate-700 dark:text-slate-200 font-medium">{p.name}</span>
                        </div>
                        <span className="text-slate-600 dark:text-slate-300">
                          {pct(p.value, totalMin)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Recent activity */}
            <motion.section
              initial={ui.reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={ui.reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ ...transition, delay: 0.05 }}
              className="pro-card dark:bg-slate-900 dark:border-slate-800 p-5 md:p-6"
              aria-label="Recent activity"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Recent Activity
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  last 72h
                </div>
              </div>

              <div className="space-y-3">
                {model.recentSessions.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                          {s.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {s.when} • {s.minutes} min
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <Clock size={14} />
                        {s.minutes}m
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {s.notes}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>
          )}

          {active === "progress" && (
            <motion.section
              initial={ui.reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={ui.reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={transition}
              className="pro-card dark:bg-slate-900 dark:border-slate-800 p-5 md:p-6"
              aria-label="Progress"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Progress
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                This section summarizes skill growth, accuracy trends, and therapy goals. (Mock UI for now.)
              </div>
            </motion.section>
          )}

          {active === "time" && (
            <motion.section
              initial={ui.reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={ui.reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={transition}
              className="pro-card dark:bg-slate-900 dark:border-slate-800 p-5 md:p-6"
              aria-label="Time Reports"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Time Reports
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Weekly activity minutes. If Supabase is connected, this reads from your `screen_time` table.
              </div>
              <div className="h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={model.weeklyTime} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148,163,184,0.35)" />
                    <XAxis dataKey="label" tick={{ fill: "rgba(100,116,139,1)", fontSize: 12 }} />
                    <YAxis tick={{ fill: "rgba(100,116,139,1)", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid rgba(226,232,240,1)",
                        boxShadow: "0 12px 24px rgba(15,23,42,0.10)",
                      }}
                      formatter={(v: any) => [`${v} min`, ""]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="gamesMin" name="Games" stroke="#3B82F6" fillOpacity={0.12} fill="#3B82F6" strokeWidth={2} />
                    <Area type="monotone" dataKey="chatMin" name="AI Chat" stroke="#10B981" fillOpacity={0.12} fill="#10B981" strokeWidth={2} />
                    <Area type="monotone" dataKey="demoMin" name="Demo" stroke="#F59E0B" fillOpacity={0.12} fill="#F59E0B" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.section>
          )}

          {active === "sessions" && (
            <motion.section
              initial={ui.reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={ui.reducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={transition}
              className="pro-card dark:bg-slate-900 dark:border-slate-800 p-5 md:p-6"
              aria-label="Sessions"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                Sessions
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300 mb-4">
                Review session notes and durations. (Stored locally for now.)
              </div>
              <div className="space-y-3">
                {model.recentSessions.map((s, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                          {s.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {s.when} • {s.minutes} min
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <Clock size={14} />
                        {s.minutes}m
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {s.notes}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Settings panel (basic) */}
          <AnimatePresence>
            {active === "settings" && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={transition}
                className="pro-card dark:bg-slate-900 dark:border-slate-800 p-5 md:p-6"
                aria-label="Settings"
              >
                <div className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  Settings
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 mb-5">
                  These preferences are stored locally in your browser.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="pro-card dark:bg-slate-950 dark:border-slate-800 p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Role label</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Display role in the sidebar/header.
                      </div>
                    </div>
                    <select
                      value={model.role}
                      onChange={(e) =>
                        setModel((p) => ({ ...p, role: e.target.value as any }))
                      }
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800"
                      aria-label="Select role"
                    >
                      <option value="Parent">Parent</option>
                      <option value="Therapist">Therapist</option>
                    </select>
                  </label>

                  <label className="pro-card dark:bg-slate-950 dark:border-slate-800 p-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Child name</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Used across headers and reports.
                      </div>
                    </div>
                    <input
                      value={model.childName}
                      onChange={(e) => setModel((p) => ({ ...p, childName: e.target.value }))}
                      className="w-40 px-3 py-2 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800"
                      aria-label="Child name"
                    />
                  </label>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
