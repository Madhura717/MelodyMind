import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Music, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const PADS = [
  { id: 'top', color: 'bg-coral', shadow: 'shadow-coral/40', key: 'ArrowUp' },
  { id: 'left', color: 'bg-sky', shadow: 'shadow-sky/40', key: 'ArrowLeft' },
  { id: 'right', color: 'bg-yellow', shadow: 'shadow-yellow/40', key: 'ArrowRight' },
];

export default function Demo() {
  const [activePad, setActivePad] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showPerfect, setShowPerfect] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const triggerPad = useCallback((id: string) => {
    setActivePad(id);
    setScore(s => s + 10);
    setShowPerfect(true);
    
    // Confetti on every 5th hit
    if ((score + 10) % 50 === 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FB7185', '#38BDF8', '#FBBF24']
      });
    }

    setTimeout(() => setActivePad(null), 200);
    setTimeout(() => setShowPerfect(false), 800);
  }, [score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pad = PADS.find(p => p.key === e.key);
      if (pad) triggerPad(pad.id);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerPad]);

  const addRipple = (e: React.MouseEvent | React.TouchEvent) => {
    const id = Date.now();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setRipples(prev => [...prev, { id, x: clientX, y: clientY }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 1000);
  };

  return (
    <section id="demo" className="scroll-mt-28 py-24 px-6 bg-peach/10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">
          The <span className="text-coral">AlgoRhythm</span> Engine
        </h2>
        <p className="text-slate-500 mb-12">
          Experience the magic. Tap the pads in rhythm to see how we turn 
          speech patterns into interactive music.
        </p>

        <div className="relative aspect-square max-w-md mx-auto flex items-center justify-center">
          {/* Central Target */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-32 h-32 bg-white rounded-full shadow-2xl flex items-center justify-center z-10 border-4 border-slate-50"
          >
            <Music size={48} className="text-slate-300" />
          </motion.div>

          {/* Beat Pads */}
          <div className="absolute inset-0">
            {PADS.map((pad, idx) => {
              const angles = [270, 150, 30]; // Triangle layout
              const angle = angles[idx];
              const radius = 140;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <motion.button
                  key={pad.id}
                  style={{ x, y }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    addRipple(e);
                    triggerPad(pad.id);
                  }}
                  className={cn(
                    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-100",
                    pad.color,
                    pad.shadow,
                    activePad === pad.id ? "scale-110 brightness-110" : "scale-100"
                  )}
                >
                  <Sparkles className="text-white/50" />
                </motion.button>
              );
            })}
          </div>

          {/* Visual Pulses */}
          <AnimatePresence>
            {activePad && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 border-4 border-white rounded-full pointer-events-none"
              />
            )}
          </AnimatePresence>

          {/* Perfect Badge */}
          <AnimatePresence>
            {showPerfect && (
              <motion.div
                initial={{ scale: 0, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: -100, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="absolute z-20 bg-yellow text-slate-900 font-black px-6 py-2 rounded-full shadow-xl"
              >
                PERFECT!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-12 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-3xl font-heading font-black text-slate-800">{score}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-black text-slate-800">x1.5</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Multiplier</div>
          </div>
        </div>
      </div>

      {/* Ripples */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          style={{ left: ripple.x, top: ripple.y }}
          className="fixed w-10 h-10 border-2 border-sky rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-[100]"
        />
      ))}
    </section>
  );
}
