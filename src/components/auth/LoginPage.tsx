import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Baby, User, Mail, Lock, ArrowRight, Music, Sparkles } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }: { onLogin: (type: 'child' | 'adult') => void }) {
  const [mode, setMode] = useState<'selection' | 'adult-form'>('selection');
  const [isHoveringChild, setIsHoveringChild] = useState(false);
  const [isHoveringAdult, setIsHoveringAdult] = useState(false);
  const navigate = useNavigate();

  const [isFocused, setIsFocused] = useState(false);

  const handleLogin = (type: 'child' | 'adult') => {
    onLogin(type);
    navigate(type === 'child' ? '/games' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Mascot Playground */}
      <div className="flex-1 bg-linear-to-br from-sky/20 to-mint/20 relative flex items-center justify-center p-12 overflow-hidden">
        {/* Floating Shapes */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-64 h-64 border-4 border-dashed border-sky/20 rounded-full"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-10 right-10 text-coral/20"
        >
          <Music size={120} />
        </motion.div>

        {/* The Mascot */}
        <motion.div
          animate={{
            y: isFocused ? 20 : (isHoveringChild ? -20 : isHoveringAdult ? 10 : 0),
            rotate: isFocused ? 10 : (isHoveringChild ? 5 : isHoveringAdult ? -5 : 0),
            scale: isFocused ? 1.2 : (isHoveringChild || isHoveringAdult ? 1.1 : 1),
            x: isFocused ? 20 : 0
          }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="relative z-10"
        >
          <svg width="300" height="300" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <motion.circle 
              animate={{ r: isFocused ? 135 : (isHoveringChild ? 130 : 120) }}
              cx="200" cy="200" r="120" fill="#38BDF8" 
            />
            {/* Headphones */}
            <path d="M100 200C100 144.772 144.772 100 200 100C255.228 100 300 144.772 300 200" stroke="#FB7185" strokeWidth="40" strokeLinecap="round" />
            <rect x="60" y="180" width="60" height="80" rx="30" fill="#FB7185" />
            <rect x="280" y="180" width="60" height="80" rx="30" fill="#FB7185" />
            {/* Eyes - React to focus/hover */}
            <motion.g animate={{ y: isFocused ? 10 : (isHoveringChild ? -5 : isHoveringAdult ? 5 : 0) }}>
              <circle cx="160" cy="180" r="15" fill="white" />
              <circle cx="240" cy="180" r="15" fill="white" />
              <motion.circle 
                animate={{ 
                  x: isFocused ? 172 : (isHoveringChild ? 168 : isHoveringAdult ? 162 : 165),
                  y: isFocused ? 185 : 180
                }}
                cx="165" cy="180" r="7" fill="black" 
              />
              <motion.circle 
                animate={{ 
                  x: isFocused ? 252 : (isHoveringChild ? 248 : isHoveringAdult ? 242 : 245),
                  y: isFocused ? 185 : 180
                }}
                cx="245" cy="180" r="7" fill="black" 
              />
            </motion.g>
            {/* Beak */}
            <path d="M190 210L210 210L200 230L190 210Z" fill="#FBBF24" />
          </svg>
          
          {/* Speech Bubble */}
          <AnimatePresence>
            {(isHoveringChild || isHoveringAdult || isFocused) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                className="absolute -top-20 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-2xl shadow-xl whitespace-nowrap"
              >
                <span className="font-heading font-bold text-slate-800">
                  {isFocused ? "I'm watching you type! 👀" : (isHoveringChild ? "Let's play music!" : "Welcome back, teacher!")}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Right Side: Login Gateway */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {mode === 'selection' ? (
              <motion.div
                key="selection"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">Magical Gateway</h2>
                  <p className="text-slate-500">Choose your path to start the adventure.</p>
                </div>

                <div className="grid gap-6">
                  <button
                    onMouseEnter={() => setIsHoveringChild(true)}
                    onMouseLeave={() => setIsHoveringChild(false)}
                    onClick={() => handleLogin('child')}
                    className="group relative flex items-center gap-6 p-6 bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-sky/20"
                  >
                    <div className="w-20 h-20 bg-sky rounded-3xl flex items-center justify-center text-white shadow-lg shadow-sky/20 group-hover:scale-110 transition-transform">
                      <Baby size={40} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-heading font-bold text-slate-800">Kids Zone</h3>
                      <p className="text-slate-500 text-sm">Play games and earn stars!</p>
                    </div>
                    <ArrowRight className="ml-auto text-slate-300 group-hover:text-sky group-hover:translate-x-2 transition-all" />
                  </button>

                  <button
                    onMouseEnter={() => setIsHoveringAdult(true)}
                    onMouseLeave={() => setIsHoveringAdult(false)}
                    onClick={() => setMode('adult-form')}
                    className="group relative flex items-center gap-6 p-6 bg-white rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all border-4 border-transparent hover:border-coral/20"
                  >
                    <div className="w-20 h-20 bg-coral rounded-3xl flex items-center justify-center text-white shadow-lg shadow-coral/20 group-hover:scale-110 transition-transform">
                      <User size={40} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-2xl font-heading font-bold text-slate-800">Adults</h3>
                      <p className="text-slate-500 text-sm">Parents & Therapists</p>
                    </div>
                    <ArrowRight className="ml-auto text-slate-300 group-hover:text-coral group-hover:translate-x-2 transition-all" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-8"
              >
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">Adult Login</h2>
                  <p className="text-slate-500">Manage therapy goals and track progress.</p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="email" 
                      placeholder="Email Address"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-coral/10 focus:border-coral transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="password" 
                      placeholder="Password"
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-coral/10 focus:border-coral transition-all"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => handleLogin('adult')}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg jelly-button shadow-2xl shadow-slate-900/20"
                >
                  Enter Dashboard
                </button>

                <button 
                  onClick={() => setMode('selection')}
                  className="w-full text-slate-400 font-bold hover:text-slate-600 transition-colors"
                >
                  Go Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
