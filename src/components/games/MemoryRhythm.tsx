import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Music, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';
import GameTimerPill from './GameTimerPill';
import { useGameTimer } from './useGameTimer';

const PADS = [
  { id: 'red', color: 'bg-coral', shadow: 'shadow-coral/30', tone: 261.63 }, // C4
  { id: 'blue', color: 'bg-sky', shadow: 'shadow-sky/30', tone: 293.66 },  // D4
  { id: 'green', color: 'bg-emerald-400', shadow: 'shadow-emerald-400/30', tone: 329.63 }, // E4
  { id: 'yellow', color: 'bg-yellow', shadow: 'shadow-yellow/30', tone: 349.23 } // F4
];

export default function MemoryRhythm({ onBack }: { onBack: () => void }) {
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePad, setActivePad] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const timer = useGameTimer(75, true);
  const isExpired = timer.isExpired;

  const playTone = (freq: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const startNewRound = () => {
    if (isExpired) return;
    const nextPad = PADS[Math.floor(Math.random() * PADS.length)].id;
    const newSequence = [...sequence, nextPad];
    setSequence(newSequence);
    playSequence(newSequence);
  };

  const playSequence = async (seq: string[]) => {
    setIsPlaying(true);
    for (const padId of seq) {
      await new Promise(r => setTimeout(r, 600));
      const pad = PADS.find(p => p.id === padId);
      setActivePad(padId);
      if (pad) playTone(pad.tone);
      await new Promise(r => setTimeout(r, 300));
      setActivePad(null);
    }
    setIsPlaying(false);
    setUserSequence([]);
  };

  const handlePadClick = (padId: string) => {
    if (isPlaying || isExpired) return;
    
    const pad = PADS.find(p => p.id === padId);
    if (pad) playTone(pad.tone);
    
    const newUserSequence = [...userSequence, padId];
    setUserSequence(newUserSequence);

    // Check if correct
    if (padId !== sequence[newUserSequence.length - 1]) {
      // Wrong
      setSequence([]);
      setUserSequence([]);
      setScore(0);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(s => s + 1);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
      setTimeout(startNewRound, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-yellow/5 pt-32 pb-20 px-6 flex flex-col items-center">
      <button 
        onClick={onBack}
        className="absolute top-32 left-6 p-3 bg-white rounded-2xl shadow-md text-slate-600 hover:text-yellow transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="max-w-2xl w-full text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow/10 text-yellow font-bold text-sm">
            <Music size={16} />
            <span>Score: {score}</span>
          </div>
          <GameTimerPill secondsLeft={timer.secondsLeft} />
        </div>
        
        <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">
          Memory <span className="text-yellow">Rhythm</span>
        </h1>
        <p className="text-slate-500 mb-12">Watch the lights and repeat the pattern!</p>

        <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
          {PADS.map((pad) => (
            <motion.button
              key={pad.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => handlePadClick(pad.id)}
              className={cn(
                "aspect-square rounded-[2rem] shadow-xl transition-all duration-200 border-8 border-white",
                pad.color,
                pad.shadow,
                activePad === pad.id ? "brightness-125 scale-105" : "brightness-100",
                (isPlaying || isExpired) && "cursor-not-allowed opacity-60"
              )}
            />
          ))}
        </div>

        {sequence.length === 0 && !isPlaying && !isExpired && (
          <button
            onClick={startNewRound}
            className="mt-12 px-8 py-4 bg-yellow text-white rounded-2xl font-bold text-xl jelly-button shadow-xl shadow-yellow/20"
          >
            Start Game
          </button>
        )}

        {/* Caterpillar Progress */}
        <div className="mt-16 flex justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: i < score ? 1.2 : 1,
                backgroundColor: i < score ? '#FBBF24' : '#E2E8F0'
              }}
              className="w-8 h-8 rounded-full"
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
                    setSequence([]);
                    setUserSequence([]);
                    setIsPlaying(false);
                    setActivePad(null);
                    setScore(0);
                  }}
                  className="px-6 py-3 bg-yellow text-white rounded-2xl font-bold jelly-button shadow-lg shadow-yellow/20"
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
