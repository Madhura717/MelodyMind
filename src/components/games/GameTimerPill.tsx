import React from "react";
import { motion } from "motion/react";
import { Clock } from "lucide-react";
import { cn } from "@/src/lib/utils";

function format(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function GameTimerPill({
  secondsLeft,
  className,
}: {
  secondsLeft: number;
  className?: string;
}) {
  const isLow = secondsLeft <= 10;
  return (
    <motion.div
      animate={isLow ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={isLow ? { repeat: Infinity, duration: 0.6 } : undefined}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-white/30 shadow-sm",
        isLow && "bg-coral/10 border-coral/20",
        className
      )}
    >
      <Clock size={16} className={cn(isLow ? "text-coral" : "text-slate-500")} />
      <span className={cn("text-sm font-black tracking-wider", isLow ? "text-coral" : "text-slate-700")}>
        {format(secondsLeft)}
      </span>
    </motion.div>
  );
}

