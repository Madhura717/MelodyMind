import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Volume2, ArrowLeft } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';
import GameTimerPill from './GameTimerPill';
import { useGameTimer } from './useGameTimer';

export default function EchoBeat({ onBack }: { onBack: () => void }) {
  const [isPulsing, setIsPulsing] = useState(false);
  const [taps, setTaps] = useState<number[]>([]);
  const timer = useGameTimer(45, true);
  const isExpired = timer.isExpired;

  const playSound = (type: 'tap' | 'success') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'tap') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const handleTap = () => {
    if (isExpired) return;
    setIsPulsing(true);
    playSound('tap');
    const newTaps = [...taps, Date.now()];
    setTaps(newTaps);
    
    if (newTaps.length >= 5) {
      playSound('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => setTaps([]), 2000);
    }
    
    setTimeout(() => setIsPulsing(false), 300);
  };

  return (
    <div className="min-h-screen bg-coral/5 pt-32 pb-20 px-6 flex flex-col items-center">
      <button 
        onClick={onBack}
        className="absolute top-32 left-6 p-3 bg-white rounded-2xl shadow-md text-slate-600 hover:text-coral transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="max-w-2xl w-full text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral/10 text-coral font-bold text-sm">
            <Music size={16} />
            <span>Level 1: Rhythm Basics</span>
          </div>
          <GameTimerPill secondsLeft={timer.secondsLeft} />
        </div>
        
        <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">Echo the Beat!</h1>
        <p className="text-slate-500 mb-12">Listen to the word "Apple" and tap the rhythm you hear.</p>

        <div className="relative flex flex-col items-center gap-12">
          {/* Speaker */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center text-coral border-4 border-coral/20"
          >
            <Volume2 size={48} />
          </motion.button>

          {/* Large Rhythm Pad */}
          <motion.button
            onPointerDown={handleTap}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "w-64 h-64 rounded-[3rem] shadow-2xl flex items-center justify-center transition-all duration-200",
              isPulsing ? "bg-coral scale-105 shadow-coral/40" : "bg-white shadow-slate-200",
              isExpired && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "w-20 h-20 rounded-full border-4 transition-all duration-200",
              isPulsing ? "border-white scale-125" : "border-coral/20"
            )} />
          </motion.button>

          {/* Tap Feedback Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <AnimatePresence>
              {isPulsing && (
                <motion.div
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-64 h-64 border-8 border-coral rounded-[3rem]"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-16 flex justify-center gap-4">
          {taps.slice(-5).map((t, i) => (
            <motion.div
              key={t}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 bg-coral rounded-full"
            />
          ))}
        </div>

        <AnimatePresence>
          {isExpired && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 max-w-md mx-auto"
            >
              <div className="text-2xl font-heading font-extrabold text-slate-900 mb-2">Time’s up!</div>
              <div className="text-slate-500 font-bold mb-5">Want to play again?</div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    timer.reset();
                    setTaps([]);
                  }}
                  className="px-6 py-3 bg-coral text-white rounded-2xl font-bold jelly-button shadow-lg shadow-coral/20"
                >
                  Try again
                </button>
                <button
                  onClick={onBack}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold jelly-button"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
