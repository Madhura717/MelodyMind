import React, { useMemo, useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Mic, Volume2, Star } from "lucide-react";
import { cn } from "@/src/lib/utils";
import confetti from "canvas-confetti";
import GameTimerPill from "./GameTimerPill";
import { useGameTimer } from "./useGameTimer";

const ANIMALS = [
  { id: "cow", img: "🐮", sound: "Moo!", say: "Moooo!", color: "bg-orange-100" },
  { id: "lion", img: "🦁", sound: "Roar!", say: "Rooaaar!", color: "bg-yellow-100" },
  { id: "monkey", img: "🐵", sound: "Ooh Ooh!", say: "Ooh ooh ah ah!", color: "bg-amber-100" },
];

export default function AnimalSoundFun({ onBack }: { onBack: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [volume, setVolume] = useState(0);
  const [stars, setStars] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [micReady, setMicReady] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const avgRef = useRef<{ sum: number; n: number }>({ sum: 0, n: 0 });
  const maxRef = useRef(0);

  const animal = ANIMALS[currentIdx];
  const timer = useGameTimer(45, true);
  const isExpired = timer.isExpired;
  const canInteract = useMemo(() => !isExpired, [isExpired]);

  const stopMic = () => {
    if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    analyserRef.current = null;
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopMic();
  }, []);

  const playSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Small chime to "boost" perceived loudness + signal attention
    playSound();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1.15;
    u.volume = 1.0;
    window.speechSynthesis.speak(u);
  };

  const startMic = async () => {
    try {
      setMicReady(true);
      setMessage(null);
      avgRef.current = { sum: 0, n: 0 };
      maxRef.current = 0;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      analyserRef.current = analyser;
      source.connect(analyser);

      const data = new Uint8Array(analyser.fftSize);
      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(data);
        let sumSq = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sumSq += v * v;
        }
        const rms = Math.sqrt(sumSq / data.length); // ~0..1
        // More sensitive scaling so soft voices register.
        const level = Math.min(100, Math.max(0, rms * 320));
        setVolume(level);
        avgRef.current.sum += level;
        avgRef.current.n += 1;
        maxRef.current = Math.max(maxRef.current, level);
        rafRef.current = window.requestAnimationFrame(tick);
      };
      rafRef.current = window.requestAnimationFrame(tick);
    } catch {
      setMicReady(false);
      setMessage("Mic permission blocked. You can still tap “Hear it” and copy the sound!");
      setVolume(0);
      stopMic();
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    stopMic();

    if (!micReady) return;

    // Use max level to detect even brief/soft sounds.
    const max = maxRef.current;
    const didSpeak = max >= 4;

    if (didSpeak) {
      setMessage("Yay! I heard you! ⭐⭐⭐");
      setStars(3);
      playSound();
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => {
        setStars(0);
        setMessage(null);
        setCurrentIdx((prev) => (prev + 1) % ANIMALS.length);
      }, 2000);
    } else {
      setMessage("I barely heard you—try a tiny bit louder, like a whisper-to-speech voice.");
      setTimeout(() => setMessage(null), 1800);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 pt-32 pb-20 px-6 flex flex-col items-center">
      <button
        onClick={onBack}
        className="absolute top-32 left-6 p-3 bg-white rounded-2xl shadow-md text-slate-600 hover:text-emerald-500 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="max-w-2xl w-full text-center">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
            <Mic size={16} />
            <span>Vocal Practice</span>
          </div>
          <GameTimerPill secondsLeft={timer.secondsLeft} />
        </div>

        <h1 className="text-4xl font-heading font-extrabold text-slate-900 mb-4">
          Animal <span className="text-emerald-500">Sound Fun</span>
        </h1>
        <p className="text-slate-500 mb-12">Listen to the animal and mimic its sound!</p>

        <div className="flex justify-center mb-12">
          <motion.div
            key={animal.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "w-64 h-64 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center gap-4 border-8 border-white",
              animal.color
            )}
          >
            <span className="text-8xl">{animal.img}</span>
            <span className="text-2xl font-black text-slate-700 uppercase tracking-widest">{animal.sound}</span>
            <button
              onClick={() => speak(animal.say)}
              disabled={!canInteract}
              className={cn(
                "mt-2 inline-flex items-center gap-2 px-5 py-3 bg-white rounded-2xl shadow-md font-bold text-slate-700 hover:text-emerald-600 transition-colors",
                !canInteract && "opacity-50 cursor-not-allowed"
              )}
              title="Hear the sound"
            >
              <Volume2 size={18} />
              <span>Hear it</span>
            </button>
          </motion.div>
        </div>

        {/* Volume Bar */}
        <div className="max-w-xs mx-auto h-8 bg-white rounded-full border-4 border-slate-100 overflow-hidden mb-12">
          <motion.div animate={{ width: `${volume}%` }} className="h-full bg-emerald-400" />
        </div>

        <div className="flex flex-col items-center gap-8">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onPointerDown={() => {
              if (!canInteract) return;
              setIsRecording(true);
              startMic();
            }}
            onPointerUp={handleStop}
            onPointerCancel={handleStop}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300",
              isRecording ? "bg-coral scale-110" : "bg-emerald-500",
              !canInteract && "opacity-50 cursor-not-allowed"
            )}
          >
            <Mic size={40} />
          </motion.button>
          <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">
            {!canInteract ? "Time’s up!" : isRecording ? "Listening..." : "Hold to Speak"}
          </p>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14 }}
              className="mt-8 font-black text-slate-700"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stars > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-12 flex justify-center gap-4"
            >
              {[1, 2, 3].map((i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: "spring" }}>
                  <Star size={48} fill="#FBBF24" className="text-yellow" />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isExpired && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6 max-w-md mx-auto"
            >
              <div className="text-2xl font-heading font-extrabold text-slate-900 mb-2">Time’s up!</div>
              <div className="text-slate-500 font-bold mb-5">Want to play again?</div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    timer.reset();
                    setStars(0);
                    setMessage(null);
                    setVolume(0);
                  }}
                  className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold jelly-button shadow-lg shadow-emerald-500/20"
                >
                  Try again
                </button>
                <button onClick={onBack} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold jelly-button">
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