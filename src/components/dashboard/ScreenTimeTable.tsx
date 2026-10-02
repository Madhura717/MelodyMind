import React from "react";
import { motion } from "motion/react";
import { Clock, ShieldCheck } from "lucide-react";
import { cn } from "@/src/lib/utils";

export default function ScreenTimeTable({
  data,
}: {
  data: { name: string; minutes: number; limit: number }[];
}) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky/10 rounded-full" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-coral/10 rounded-full" />

      <div className="relative flex items-start justify-between gap-6 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint text-emerald-700 font-bold text-xs uppercase tracking-wider mb-3">
            <ShieldCheck size={16} />
            <span>Parent Controls</span>
          </div>
          <h3 className="text-xl font-heading font-extrabold text-slate-900">Screen Time</h3>
          <p className="text-slate-500 font-medium text-sm">Minutes per day (therapy & games)</p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 text-slate-700 font-black">
          <Clock size={16} className="text-slate-500" />
          <span>This Week</span>
        </div>
      </div>

      <div className="relative grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {data.map((d, i) => {
          const pct = d.limit ? Math.min(100, Math.round((d.minutes / d.limit) * 100)) : 0;
          const over = d.minutes > d.limit;
          return (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={cn(
                "rounded-3xl border border-slate-100 bg-slate-50 p-4 text-left shadow-sm",
                over && "bg-coral/5 border-coral/20"
              )}
            >
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{d.name}</div>
              <div className="mt-2 text-2xl font-heading font-extrabold text-slate-900">
                {d.minutes}
                <span className="text-sm font-black text-slate-400 ml-1">min</span>
              </div>
              <div className="mt-2 h-3 w-full bg-white rounded-full border border-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={cn("h-full", over ? "bg-coral" : "bg-sky")}
                />
              </div>
              <div className={cn("mt-2 text-[11px] font-bold", over ? "text-coral" : "text-slate-500")}>
                Limit {d.limit} min
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

