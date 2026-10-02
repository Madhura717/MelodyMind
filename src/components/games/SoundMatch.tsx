import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Volume2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';
import GameTimerPill from './GameTimerPill';
import { useGameTimer } from './useGameTimer';

const LEVELS = [
  { 
    letter: 'A', 
    options: [
      { id: 1, img: '🍎', name: 'Apple', correct: true },
      { id: 2, img: '🍌', name: 'Banana', correct: false },
      { id: 3, img: '🐱', name: 'Cat', correct: false },
    ]
  },
  { 
    letter: 'B', 
    options: [
      { id: 4, img: '🐶', name: 'Dog', correct: false },
      { id: 5, img: '🎈', name: 'Balloon', correct: true },
      { id: 6, img: '🐘', name: 'Elephant', correct: false },
    ]
  }
];

export default function SoundMatch({ onBack }: { onBack: () => void }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const timer = useGameTimer(60, true);
  const isExpired = timer.isExpired;

  const currentLevel = LEVELS[levelIdx];

  const playSound = (type: 'correct' | 'wrong') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct') {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.2); // C6
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'wrong') {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2); // A2
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const handleSelect = (option: any) => {
    if (isExpired) return;
    setSelectedId(option.id);
    if (option.correct) {
      setIsCorrect(true);
      playSound('correct');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38BDF8', '#FBBF24']
      });
      setTimeout(() => {
        if (levelIdx < LEVELS.length - 1) {
          setLevelIdx(prev => prev + 1);
          setSelectedId(null);
          setIsCorrect(null);
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      playSound('wrong');
      setTimeout(() => setIsCorrect(null), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-sky/5 pt-32 pb-20 px-6 flex flex-col items-center">
      <button 
        onClick={onBack}
        className="absolute top-32 left-6 p-3 bg-white rounded-2xl shadow-md text-slate-600 hover:text-sky transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="max-w-2xl w-full text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky/10 text-sky font-bold text-sm">
            <Volume2 size={16} />
            <span>Level 1: Sound Matching</span>
          </div>
          <GameTimerPill secondsLeft={timer.secondsLeft} />
        </div>
        
        <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">
          Which one starts with <span className="text-sky text-5xl">"{currentLevel.letter}"</span>?
        </h1>
        <p className="text-slate-500 mb-12">Tap the picture that makes the right sound.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentLevel.options.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(option)}
              className={cn(
                "aspect-square bg-white rounded-[2.5rem] shadow-xl border-4 flex flex-col items-center justify-center gap-4 transition-all duration-300",
                selectedId === option.id 
                  ? (option.correct ? "border-emerald-400 bg-emerald-50" : "border-coral/50 bg-coral/5")
                  : "border-transparent hover:border-sky/20",
                isExpired && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="text-7xl">{option.img}</span>
              <span className="font-bold text-slate-600">{option.name}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {isCorrect === true && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 text-emerald-500 font-black text-2xl flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={32} />
              <span>SUPER!</span>
            </motion.div>
          )}
        </AnimatePresence>

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
                    setLevelIdx(0);
                    setSelectedId(null);
                    setIsCorrect(null);
                  }}
                  className="px-6 py-3 bg-sky text-white rounded-2xl font-bold jelly-button shadow-lg shadow-sky/20"
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
