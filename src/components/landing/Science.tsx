import React from 'react';
import { motion } from 'motion/react';
import { Brain, Ear, MessageCircle, Heart } from 'lucide-react';

const scienceCards = [
  {
    title: "Dyslexia Support",
    description: "Rhythmic patterns help strengthen phonological awareness and word recognition.",
    icon: Brain,
    color: "bg-sky",
    shadow: "shadow-sky/20"
  },
  {
    title: "Aphasia Recovery",
    description: "Melodic intonation therapy uses the brain's musical centers to bypass speech blocks.",
    icon: Ear,
    color: "bg-coral",
    shadow: "shadow-coral/20"
  },
  {
    title: "Speech Delays",
    description: "Predictable beats provide a temporal scaffold for motor planning and articulation.",
    icon: MessageCircle,
    color: "bg-yellow",
    shadow: "shadow-yellow/20"
  }
];

export default function Science() {
  return (
    <section id="science" className="scroll-mt-28 py-24 px-6 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-6"
          >
            Grounded in <span className="text-sky">Neuroscience</span>
          </motion.h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            We combine music theory with speech pathology to create a powerful, 
            evidence-based tool for neuro-diverse learners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {scienceCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="glass p-8 rounded-3xl border-none shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className={`w-16 h-16 ${card.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg ${card.shadow} group-hover:scale-110 transition-transform`}>
                <card.icon size={32} />
              </div>
              <h3 className="text-2xl font-heading font-bold text-slate-800 mb-4">{card.title}</h3>
              <p className="text-slate-500 leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center gap-8"
        >
          <div className="flex-1">
            <h3 className="text-2xl font-heading font-bold mb-4 flex items-center gap-2">
              <Heart className="text-coral fill-coral" />
              <span>Built for Every Child</span>
            </h3>
            <p className="text-slate-400">
              Our interface is designed with sensory-friendly colors, clear typography, 
              and intuitive navigation to ensure every child feels successful and empowered.
            </p>
          </div>
          <button className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold jelly-button whitespace-nowrap">
            Read Whitepaper
          </button>
        </motion.div>
      </div>
    </section>
  );
}
