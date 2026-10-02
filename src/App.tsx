/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/landing/Hero';
import Science from './components/landing/Science';
import Demo from './components/landing/Demo';
import LoginModal from './components/auth/LoginModal';
import GameHub from './components/games/GameHub';
import Dashboard from './components/dashboard/Dashboard';
import CustomCursor from './components/ui/CustomCursor';
import { cn } from './lib/utils';

import LoginPage from './components/auth/LoginPage';

function LandingPage() {
  return (
    <main>
      <Hero />
      <Demo />
      <Science />
    </main>
  );
}

export default function App() {
  const [userType, setUserType] = useState<'child' | 'adult' | null>(null);

  const handleLogin = (type: 'child' | 'adult') => {
    setUserType(type);
  };

  return (
    <Router>
      <AppContent 
        userType={userType} 
        handleLogin={handleLogin} 
      />
    </Router>
  );
}

import KidChatBot from './components/ui/KidChatBot';

function AppContent({ userType, handleLogin }: any) {
  const [accessibility, setAccessibility] = useState({
    dyslexiaFont: false,
    highContrast: false,
    reducedMotion: false
  });

  const navigate = useNavigate();

  // Use a wrapper component to handle navigation
  return (
    <div className={cn(
      "min-h-screen flex flex-col selection:bg-sky/30 selection:text-slate-900 transition-all duration-500",
      accessibility.dyslexiaFont && "font-[Nunito]",
      accessibility.highContrast && "contrast-125 brightness-90"
    )}>
      <CustomCursor disabled={accessibility.reducedMotion} />
      <KidChatBot />
      
      <Navbar 
        onLoginClick={() => navigate('/login')} 
        userType={userType}
        accessibility={accessibility}
        setAccessibility={setAccessibility}
      />
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route 
            path="/games" 
            element={userType === 'child' ? <GameHub /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={userType === 'adult' ? <Dashboard /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}



import { User } from 'lucide-react';

