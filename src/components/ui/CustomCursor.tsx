import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function CustomCursor({ disabled }: { disabled?: boolean }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [stardust, setStardust] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (disabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Add stardust
      if (Math.random() > 0.8) {
        const id = Date.now();
        setStardust(prev => [...prev, { id, x: e.clientX, y: e.clientY }].slice(-10));
        setTimeout(() => setStardust(prev => prev.filter(s => s.id !== id)), 500);
      }

      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <motion.div
        className="custom-cursor"
        animate={{
          x: position.x - 10,
          y: position.y - 10,
          scale: isPointer ? 1.5 : 1,
          backgroundColor: isPointer ? 'rgba(251, 113, 133, 0.4)' : 'rgba(56, 189, 248, 0.3)'
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 250, mass: 0.5 }}
      />
      {stardust.map(s => (
        <div key={s.id} className="stardust" style={{ left: s.x, top: s.y }} />
      ))}
    </>
  );
}

