import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Volume2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import MascotLogo from './MascotLogo';

export default function KidChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: "Hi there, little explorer! I'm MelodyBot. Want to play a game or hear a funny sound? 🎵" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Pre-load voices so they're ready when we need them
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis?.getVoices();
      if (voices && voices.length > 0) setVoicesLoaded(true);
    };
    loadVoices();
    window.speechSynthesis?.addEventListener('voiceschanged', loadVoices);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', loadVoices);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a smooth female voice — priority order for natural girl voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(v => 
      v.name.includes('Microsoft Zira') ||
      v.name.includes('Google US English Female') ||
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.name.includes('Moira') ||
      v.name.includes('Fiona') ||
      v.name.includes('Victoria') ||
      v.name.includes('Tessa')
    ) || voices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('woman') ||
      v.name.toLowerCase().includes('girl')
    ) || voices.find(v =>
      // Common female voice names across platforms
      /zira|hazel|susan|jenny|aria|sara|cortana|samantha|karen|moira|fiona|tessa|victoria|allison|ava/i.test(v.name)
    );
    
    if (femaleVoice) utterance.voice = femaleVoice;
    
    // Smooth, natural girl voice settings
    utterance.pitch = 1.3;   // Slightly higher for feminine tone, but not cartoonish
    utterance.rate = 0.95;   // Slightly slower for smooth, clear delivery
    utterance.volume = 1.0;  // Maximum volume
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.slice(-8);
      const res = await fetch('/api/kid-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history }),
      });

      const data = await res.json().catch(() => null);
      const botMsg =
        (res.ok && typeof data?.reply === 'string' && data.reply.trim()) ||
        "Oops! I couldn’t think of an answer. Try asking about music, rhythms, or practicing a word!";

      setMessages(prev => [...prev, { role: 'bot', text: botMsg }]);
      setIsTyping(false);
      speak(botMsg);
    } catch {
      const botMsg =
        "I’m having trouble connecting right now. Try again in a moment, okay?";
      setMessages(prev => [...prev, { role: 'bot', text: botMsg }]);
      setIsTyping(false);
      speak(botMsg);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-80 md:w-96 glass rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border-4 border-white"
          >
            {/* Header — matches landing page branding */}
            <div className="bg-linear-to-r from-sky to-mint p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 20, scale: 1.1 }}
                  className="w-12 h-12 bg-coral rounded-xl flex items-center justify-center text-white shadow-lg shadow-coral/30"
                >
                  <MascotLogo size={32} />
                </motion.div>
                <div>
                  <h3 className="font-heading font-bold text-slate-800 leading-none">MelodyBot</h3>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Online & Happy</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} className="text-slate-700" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-grow h-80 overflow-y-auto p-4 space-y-4 bg-cream/50"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "max-w-[80%] p-4 rounded-2xl font-medium text-sm shadow-sm",
                    msg.role === 'bot' 
                      ? "bg-white text-slate-800 rounded-tl-none border border-slate-100" 
                      : "bg-sky text-white ml-auto rounded-tr-none"
                  )}
                >
                  {msg.text}
                  {/* Speaker button for bot messages */}
                  {msg.role === 'bot' && (
                    <button 
                      onClick={() => speak(msg.text)}
                      className="ml-2 inline-flex items-center text-sky hover:text-coral transition-colors"
                      title="Listen again"
                    >
                      <Volume2 size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
              {isTyping && (
                <div className="bg-white p-3 rounded-2xl rounded-tl-none w-16 flex gap-1 shadow-sm">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-grow px-4 py-3 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky/20 text-sm font-medium"
              />
              <button 
                onClick={handleSend}
                className="p-3 bg-sky text-white rounded-xl jelly-button shadow-lg shadow-sky/20"
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button — uses same logo style as landing page */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-coral rounded-xl flex items-center justify-center text-white shadow-2xl shadow-coral/40 relative group"
      >
        <MascotLogo size={40} />
        <motion.div 
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-sky rounded-full border-2 border-white"
        />
      </motion.button>
    </div>
  );
}
