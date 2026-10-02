import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Accessibility, LogIn, Volume2, VolumeX, Settings, Menu, X, Baby, User } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface NavbarProps {
  onLoginClick: () => void;
  userType: 'child' | 'adult' | null;
  accessibility: {
    dyslexiaFont: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  setAccessibility: React.Dispatch<React.SetStateAction<{
    dyslexiaFont: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  }>>;
}

export default function Navbar({ onLoginClick, userType, accessibility, setAccessibility }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleAccess = (key: keyof typeof accessibility) => {
    setAccessibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled ? "glass py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 20, scale: 1.1 }}
            className="w-10 h-10 bg-coral rounded-xl flex items-center justify-center text-white shadow-lg shadow-coral/30"
          >
            <Music size={24} />
          </motion.div>
          <span className="text-2xl font-heading font-extrabold text-slate-800">
            Melody<span className="text-sky">Mind</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setIsAudioEnabled(!isAudioEnabled)}
            className="p-2 rounded-full hover:bg-white/50 transition-colors text-slate-600"
            title={isAudioEnabled ? "Disable Audio" : "Enable Audio"}
          >
            {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          
          <button 
            onClick={() => setIsAccessMenuOpen(!isAccessMenuOpen)}
            className={cn(
              "p-2 rounded-full transition-colors",
              isAccessMenuOpen ? "bg-sky text-white" : "hover:bg-white/50 text-slate-600"
            )}
            title="Accessibility Settings"
          >
            <Accessibility size={20} />
          </button>

          {userType ? (
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white",
                userType === 'child' ? "bg-sky" : "bg-coral"
              )}>
                {userType === 'child' ? <Baby size={16} /> : <User size={16} />}
              </div>
              <span className="text-sm font-bold text-slate-700 capitalize">{userType} Mode</span>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full font-semibold jelly-button shadow-xl shadow-slate-900/20"
            >
              <LogIn size={18} />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-slate-600">
          <Menu size={24} />
        </button>
      </div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isAccessMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full right-6 mt-2 w-64 glass rounded-2xl p-4 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-bold text-slate-800">Accessibility</h3>
              <button onClick={() => setIsAccessMenuOpen(false)}><X size={16} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Dyslexia Font", key: "dyslexiaFont" as const },
                { label: "High Contrast", key: "highContrast" as const },
                { label: "Reduced Motion", key: "reducedMotion" as const },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <button 
                    onClick={() => toggleAccess(item.key)}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors",
                      accessibility[item.key] ? "bg-sky" : "bg-slate-200"
                    )}
                  >
                    <motion.div 
                      animate={{ x: accessibility[item.key] ? 20 : 0 }}
                      className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" 
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

