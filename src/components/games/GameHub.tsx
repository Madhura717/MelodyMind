import React from 'react';
import { motion } from 'motion/react';
import { Music, Star, Trophy, Play, Gamepad2, Mic2, Brain, Puzzle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const games = [
  {
    id: 'echo-beat',
    title: "Echo Beat",
    description: "Listen to the word and tap the rhythm back!",
    icon: Music,
    color: "bg-coral",
    shadow: "shadow-coral/20",
    difficulty: "Easy"
  },
  {
    id: 'sound-match',
    title: "Sound Match",
    description: "Match the starting sounds to the right letters.",
    icon: Brain,
    color: "bg-sky",
    shadow: "shadow-sky/20",
    difficulty: "Medium"
  },
  {
    id: 'memory-rhythm',
    title: "Memory Rhythm",
    description: "Repeat the sequence of musical drum pads.",
    icon: Trophy,
    color: "bg-yellow",
    shadow: "shadow-yellow/20",
    difficulty: "Hard"
  },
  {
    id: 'word-builder',
    title: "Word Builder",
    description: "Drag letter blocks to build complete words.",
    icon: Puzzle,
    color: "bg-bubblegum",
    shadow: "shadow-bubblegum/20",
    difficulty: "Medium"
  },
  {
    id: 'animal-fun',
    title: "Animal Sound Fun",
    description: "Mimic animal sounds into the magic microphone.",
    icon: Mic2,
    color: "bg-mint",
    shadow: "shadow-mint/20",
    difficulty: "Easy"
  }
];

import EchoBeat from './EchoBeat';
import WordBuilder from './WordBuilder';
import SoundMatch from './SoundMatch';
import MemoryRhythm from './MemoryRhythm';
import AnimalSoundFun from './AnimalSoundFun';

export default function GameHub() {
  const [activeGame, setActiveGame] = React.useState<string | null>(null);
  const [stars, setStars] = React.useState(1250);

  React.useEffect(() => {
    fetch('/api/user/progress')
      .then(res => res.json())
      .then(data => setStars(data.stars))
      .catch(err => console.error("Failed to fetch progress", err));
  }, []);

  if (activeGame === 'echo-beat') {
    return <EchoBeat onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'word-builder') {
    return <WordBuilder onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'sound-match') {
    return <SoundMatch onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'memory-rhythm') {
    return <MemoryRhythm onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'animal-fun') {
    return <AnimalSoundFun onBack={() => setActiveGame(null)} />;
  }

  return (
    <div className="min-h-screen bg-cream pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-sky font-bold mb-2">
              <Gamepad2 size={20} />
              <span className="uppercase tracking-widest text-xs">Adventure Map</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900">
              Pick Your <span className="text-coral">Musical Mission</span>
            </h1>
          </div>
          
          <div className="flex gap-4">
            <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow rounded-xl flex items-center justify-center text-white shadow-lg shadow-yellow/20">
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <div className="text-lg font-black text-slate-800">{stars.toLocaleString()}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Stars</div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              onClick={() => setActiveGame(game.id)}
              className="glass p-8 rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all group cursor-pointer relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className={cn(
                "absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-5 group-hover:scale-150 transition-transform duration-500",
                game.color
              )} />

              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-transform group-hover:scale-110",
                game.color,
                game.shadow
              )}>
                <game.icon size={32} />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                  game.difficulty === 'Easy' ? "bg-mint text-emerald-700" :
                  game.difficulty === 'Medium' ? "bg-peach text-orange-700" :
                  "bg-coral/20 text-coral"
                )}>
                  {game.difficulty}
                </span>
              </div>

              <h3 className="text-2xl font-heading font-bold text-slate-800 mb-3">{game.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                {game.description}
              </p>

              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold jelly-button flex items-center justify-center gap-2">
                <Play size={18} fill="currentColor" />
                <span>Start Playing</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

