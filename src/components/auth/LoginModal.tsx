import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Baby, Mail, Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (type: 'child' | 'adult') => void;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [mode, setMode] = useState<'selection' | 'adult-form'>('selection');

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors z-10"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row h-full min-h-[400px]">
              {/* Left Side: Child Quick Entry */}
              <div className={cn(
                "flex-1 p-10 flex flex-col items-center justify-center text-center transition-all duration-500",
                mode === 'selection' ? "bg-sky/10" : "bg-slate-50 opacity-50"
              )}>
                <div className="w-20 h-20 bg-sky rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg shadow-sky/20">
                  <Baby size={40} />
                </div>
                <h3 className="text-2xl font-heading font-bold text-slate-800 mb-2">Kids Zone</h3>
                <p className="text-slate-500 mb-8 text-sm">Jump straight into the musical adventure!</p>
                <button 
                  onClick={() => onLogin('child')}
                  className="w-full py-4 bg-sky text-white rounded-2xl font-bold jelly-button shadow-xl shadow-sky/20 flex items-center justify-center gap-2"
                >
                  <span>Play Now</span>
                  <ArrowRight size={20} />
                </button>
              </div>

              {/* Right Side: Adult Login */}
              <div className={cn(
                "flex-1 p-10 flex flex-col items-center justify-center text-center transition-all duration-500",
                mode === 'adult-form' ? "bg-coral/10" : "bg-white"
              )}>
                {mode === 'selection' ? (
                  <>
                    <div className="w-20 h-20 bg-coral rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg shadow-coral/20">
                      <User size={40} />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-slate-800 mb-2">Parents & Teachers</h3>
                    <p className="text-slate-500 mb-8 text-sm">Track progress and manage therapy goals.</p>
                    <button 
                      onClick={() => setMode('adult-form')}
                      className="w-full py-4 bg-coral text-white rounded-2xl font-bold jelly-button shadow-xl shadow-coral/20"
                    >
                      Adult Login
                    </button>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="w-full"
                  >
                    <h3 className="text-2xl font-heading font-bold text-slate-800 mb-6">Welcome Back</h3>
                    <div className="space-y-4 mb-6">
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="email" 
                          placeholder="Email Address"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="password" 
                          placeholder="Password"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral transition-all"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => onLogin('adult')}
                      className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold jelly-button mb-4"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setMode('selection')}
                      className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Go Back
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
