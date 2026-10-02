import React from 'react';
import { Music, Heart, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-coral rounded-lg flex items-center justify-center text-white">
                <Music size={20} />
              </div>
              <span className="text-xl font-heading font-extrabold text-slate-800">
                Melody<span className="text-sky">Mind</span>
              </span>
            </div>
            <p className="text-slate-500 max-w-md leading-relaxed">
              Empowering children through the universal language of music. 
              Our neuro-inclusive approach makes speech therapy an adventure 
              filled with rhythm, joy, and progress.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-slate-800 mb-6">Explore</h4>
            <ul className="space-y-4 text-slate-500">
              <li><a href="#" className="hover:text-coral transition-colors">How it Works</a></li>
              <li><a href="#" className="hover:text-coral transition-colors">Mini-Games</a></li>
              <li><a href="#" className="hover:text-coral transition-colors">For Therapists</a></li>
              <li><a href="#" className="hover:text-coral transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-slate-800 mb-6">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-sky hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-coral hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                <Github size={18} />
              </a>
            </div>
            <p className="text-sm text-slate-400">
              Questions? <br />
              <a href="mailto:hello@melodymind.com" className="text-sky font-medium">hello@melodymind.com</a>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-50 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-sm text-slate-400 flex items-center gap-1">
            Made with <Heart size={14} className="text-coral fill-coral" /> for extraordinary kids.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-600">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
