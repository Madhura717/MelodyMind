import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Music } from 'lucide-react';

export default function Hero() {
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Breathing Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-mint/30 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-peach/30 blur-[120px] rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/20 shadow-sm mb-6">
            <Sparkles size={16} className="text-yellow" />
            <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Neuro-Inclusive Therapy</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-slate-900 leading-[1.1] mb-6">
            Find Your Voice <br />
            <span className="text-gradient">Through Rhythm.</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
            The gamified, music-driven speech therapy app designed specifically 
            for extraordinary kids. Turning therapy into playtime, one beat at a time.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scrollToId("demo")}
              className="px-8 py-4 bg-coral text-white rounded-full font-bold text-lg jelly-button shadow-2xl shadow-coral/30 flex items-center gap-2"
              aria-label="Scroll to demo section"
            >
              <Play size={20} fill="currentColor" />
              <span>Try the Demo</span>
            </button>
            <button
              onClick={() => scrollToId("science")}
              className="px-8 py-4 bg-white text-slate-800 rounded-full font-bold text-lg jelly-button shadow-xl shadow-slate-200 border border-slate-100"
              aria-label="Scroll to science section"
            >
              Learn the Science
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative flex justify-center"
        >
          {/* Mascot Placeholder (Animated SVG) */}
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative z-10"
          >
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Body */}
              <circle cx="200" cy="200" r="120" fill="#38BDF8" />
              {/* Headphones */}
              <path d="M100 200C100 144.772 144.772 100 200 100C255.228 100 300 144.772 300 200" stroke="#FB7185" strokeWidth="40" strokeLinecap="round" />
              <rect x="60" y="180" width="60" height="80" rx="30" fill="#FB7185" />
              <rect x="280" y="180" width="60" height="80" rx="30" fill="#FB7185" />
              {/* Eyes */}
              <circle cx="160" cy="180" r="15" fill="white" />
              <circle cx="240" cy="180" r="15" fill="white" />
              <circle cx="165" cy="180" r="7" fill="black" />
              <circle cx="245" cy="180" r="7" fill="black" />
              {/* Beak */}
              <path d="M190 210L210 210L200 230L190 210Z" fill="#FBBF24" />
            </svg>
            
            {/* Floating Musical Notes */}
            <motion.div 
              animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              className="absolute top-10 right-10 text-sky"
            >
              <Music size={40} />
            </motion.div>
            <motion.div 
              animate={{ y: [0, -40, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              className="absolute bottom-20 left-0 text-coral"
            >
              <Music size={32} />
            </motion.div>
          </motion.div>
          
          {/* Decorative Rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border-2 border-dashed border-slate-200 rounded-full -z-10 animate-[spin_60s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] border border-slate-100 rounded-full -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
