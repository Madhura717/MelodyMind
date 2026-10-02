import React, { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'motion/react';
import { Puzzle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import confetti from 'canvas-confetti';
import GameTimerPill from './GameTimerPill';
import { useGameTimer } from './useGameTimer';

const WORDS = [
  { word: 'CAT', letters: ['C', 'A', 'T'], scrambled: ['A', 'T', 'C'] },
  { word: 'DRUM', letters: ['D', 'R', 'U', 'M'], scrambled: ['M', 'R', 'D', 'U'] },
];

export default function WordBuilder({ onBack }: { onBack: () => void }) {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [items, setItems] = useState(WORDS[currentWordIdx].scrambled);
  const [isCorrect, setIsCorrect] = useState(false);
  const timer = useGameTimer(60, true);
  const isExpired = timer.isExpired;

  const currentWord = WORDS[currentWordIdx];

  const playSound = (type: 'pop' | 'success') => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'pop') {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  const handleReorder = (newOrder: string[]) => {
    if (isExpired) return;
    setItems(newOrder);
    playSound('pop');
    if (newOrder.join('') === currentWord.word) {
      setIsCorrect(true);
      playSound('success');
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FB7185', '#38BDF8', '#FBBF24']
      });
      
      setTimeout(() => {
        if (currentWordIdx < WORDS.length - 1) {
          setCurrentWordIdx(prev => prev + 1);
          setItems(WORDS[currentWordIdx + 1].scrambled);
          setIsCorrect(false);
        }
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-bubblegum/5 pt-32 pb-20 px-6 flex flex-col items-center">
      <button 
        onClick={onBack}
        className="absolute top-32 left-6 p-3 bg-white rounded-2xl shadow-md text-slate-600 hover:text-bubblegum transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="max-w-2xl w-full text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bubblegum/10 text-bubblegum font-bold text-sm">
            <Puzzle size={16} />
            <span>Level 2: Word Building</span>
          </div>
          <GameTimerPill secondsLeft={timer.secondsLeft} />
        </div>
        
        <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">Build the Word!</h1>
        <p className="text-slate-500 mb-12">Drag the blocks to spell the word correctly.</p>

        <div className="bg-white p-12 rounded-[3rem] shadow-xl border-4 border-dashed border-bubblegum/20 relative">
          <Reorder.Group 
            axis="x" 
            values={items} 
            onReorder={handleReorder}
            className="flex justify-center gap-4"
          >
            {items.map((letter) => (
              <Reorder.Item
                key={letter}
                value={letter}
                className={cn(
                  "w-20 h-24 bg-white border-4 border-slate-100 rounded-2xl flex items-center justify-center text-4xl font-black text-slate-800 shadow-lg cursor-grab active:cursor-grabbing transition-colors",
                  isCorrect ? "border-emerald-400 bg-emerald-50 text-emerald-600" : "hover:border-bubblegum/50",
                  isExpired && "opacity-60 cursor-not-allowed"
                )}
              >
                {letter}
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <AnimatePresence>
            {isCorrect && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg"
              >
                <CheckCircle2 size={20} />
                <span>Awesome Job!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-20">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Word {currentWordIdx + 1} of {WORDS.length}</div>
          <div className="flex justify-center gap-2">
            {WORDS.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-2 rounded-full transition-all duration-500",
                  i === currentWordIdx ? "w-12 bg-bubblegum" : "w-4 bg-slate-200"
                )} 
              />
            ))}
          </div>
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
                    setCurrentWordIdx(0);
                    setItems(WORDS[0].scrambled);
                    setIsCorrect(false);
                  }}
                  className="px-6 py-3 bg-bubblegum text-white rounded-2xl font-bold jelly-button shadow-lg shadow-bubblegum/20"
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
