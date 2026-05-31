'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/supabaseClient';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Target, 
  CalendarDays, 
  Leaf, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Sun, 
  MoonStar,
  Compass
} from 'lucide-react';

interface PlanResponse {
  morningRoutine: string[];
  eveningRoutine: string[];
  actionableSteps: { title: string; description: string }[];
  habitFormation: string[];
  motivationalQuote: string;
}

export default function Home() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/sign-in');
      } else {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  
  const [formData, setFormData] = useState({
    shortTermGoals: '',
    longTermGoals: '',
    currentRoutine: '',
    desiredHabits: '',
  });

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#5A5A40] animate-spin" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setPlan(null);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error(error);
      alert('An error occurred while generating your plan. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] text-[#2D2D2A] font-sans pb-24">
      {/* Header */}
      <header className="fixed top-0 inset-x-0 bg-[#FDFCF9]/90 backdrop-blur-md border-b border-[#E5E2D9] z-50 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#2D2D2A] font-serif text-xl italic tracking-tight">
            <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-[#FDFCF9] rounded-full"></div>
            </div>
            <span>AI Life Planner</span>
          </div>
        </div>
      </header>

      <main className="pt-32 max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center py-12 sm:py-16 space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.1] text-[#1A1A17]">
              Design your <span className="italic">evolution</span>.
            </h1>
            <p className="mt-6 text-lg text-[#5A5A40] opacity-80 leading-relaxed">
              Transform your aspirations into actionable steps. Enter your goals and constraints, and let AI craft a personalized master plan for your growth.
            </p>
          </motion.div>
        </section>

        <AnimatePresence mode="wait">
          {!plan && !isGenerating && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="max-w-2xl mx-auto bg-white rounded-[32px] shadow-sm p-6 sm:p-10 border border-[#E5E2D9]"
            >
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                
                {/* Short term goals */}
                <div className="space-y-2">
                  <label htmlFor="shortTermGoals" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-tighter text-[#1A1A17] opacity-60">
                    <Target className="w-4 h-4 text-[#5A5A40]" />
                    Short-Term Goals (Next 1-3 Months)
                  </label>
                  <textarea
                    id="shortTermGoals"
                    name="shortTermGoals"
                    required
                    rows={3}
                    className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#5A5A40] resize-none outline-none transition-shadow text-[#2D2D2A]"
                    placeholder="e.g., Run a 5k, read 3 books, finish a coding portfolio..."
                    value={formData.shortTermGoals}
                    onChange={handleChange}
                  />
                </div>

                {/* Long term goals */}
                <div className="space-y-2">
                  <label htmlFor="longTermGoals" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-tighter text-[#1A1A17] opacity-60">
                    <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                    Long-Term Aspirations (1-5 Years)
                  </label>
                  <textarea
                    id="longTermGoals"
                    name="longTermGoals"
                    required
                    rows={3}
                    className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#5A5A40] resize-none outline-none transition-shadow text-[#2D2D2A]"
                    placeholder="e.g., Become a senior engineer, start a business, travel Asia..."
                    value={formData.longTermGoals}
                    onChange={handleChange}
                  />
                </div>

                {/* Current Routine */}
                <div className="space-y-2">
                  <label htmlFor="currentRoutine" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-tighter text-[#1A1A17] opacity-60">
                    <CalendarDays className="w-4 h-4 text-[#5A5A40]" />
                    Your Current Daily Routine
                  </label>
                  <textarea
                    id="currentRoutine"
                    name="currentRoutine"
                    required
                    rows={3}
                    className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#5A5A40] resize-none outline-none transition-shadow text-[#2D2D2A]"
                    placeholder="e.g., Wake up at 8am, work until 5pm, watch TV, sleep at 12am..."
                    value={formData.currentRoutine}
                    onChange={handleChange}
                  />
                </div>

                {/* Desired Habits */}
                <div className="space-y-2">
                  <label htmlFor="desiredHabits" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-tighter text-[#1A1A17] opacity-60">
                    <Leaf className="w-4 h-4 text-[#5A5A40]" />
                    Habits You Want to Build
                  </label>
                  <textarea
                    id="desiredHabits"
                    name="desiredHabits"
                    required
                    rows={3}
                    className="w-full bg-[#F5F5F0] border-none rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-[#5A5A40] resize-none outline-none transition-shadow text-[#2D2D2A]"
                    placeholder="e.g., Meditation for 10 mins, writing a journal, hitting the gym..."
                    value={formData.desiredHabits}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="w-full h-14 flex items-center justify-center gap-2 bg-[#5A5A40] hover:opacity-90 text-white rounded-full font-medium tracking-wide transition-opacity active:scale-[0.98]"
                  >
                    <span>Generate My Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 space-y-4"
            >
              <Loader2 className="w-10 h-10 text-[#5A5A40] animate-spin" />
              <p className="text-[#8C8A82] text-sm uppercase tracking-widest font-bold animate-pulse">Crafting your plan...</p>
            </motion.div>
          )}

          {plan && !isGenerating && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, staggerChildren: 0.1 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <blockquote className="text-xl md:text-2xl font-serif italic text-slate-700">
                  &quot;{plan.motivationalQuote}&quot;
                </blockquote>
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                {/* Actionable Steps */}
                <div className="bg-white rounded-[24px] shadow-sm border border-[#E5E2D9] p-6 md:p-8 space-y-6 md:col-span-2">
                  <div className="flex items-center gap-3 border-b border-[#E5E2D9] pb-4">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F0] flex items-center justify-center">
                      <Target className="w-5 h-5 text-[#5A5A40]" />
                    </div>
                    <h2 className="text-xl font-serif text-[#1A1A17]">Action Plan</h2>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plan.actionableSteps.map((step, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx} 
                        className="bg-[#F5F5F0] rounded-[24px] p-5 border border-[#E5E2D9] shadow-sm"
                      >
                        <h3 className="font-semibold text-lg text-[#2D2D2A] mb-2">{step.title}</h3>
                        <p className="text-sm text-[#8C8A82] leading-relaxed">{step.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Daily Routines */}
                <div className="bg-white rounded-[24px] shadow-sm border border-[#E5E2D9] p-6 space-y-8 h-full">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Sun className="w-5 h-5 text-[#5A5A40]" />
                      <h3 className="text-lg font-serif text-[#1A1A17]">Morning Routine</h3>
                    </div>
                    <ul className="space-y-3">
                      {plan.morningRoutine.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-4 bg-[#FDFCF9] rounded-[24px] p-4 border border-[#E5E2D9] shadow-sm">
                          <div className="w-8 h-8 rounded-full bg-[#F5F5F0] flex items-center justify-center text-[10px] font-bold text-[#5A5A40] shrink-0">
                            AM
                          </div>
                          <span className="text-[#2D2D2A] text-sm leading-relaxed flex-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-[#E5E2D9]">
                    <div className="flex items-center gap-3 mb-4">
                      <MoonStar className="w-5 h-5 text-[#5A5A40]" />
                      <h3 className="text-lg font-serif text-[#1A1A17]">Evening Routine</h3>
                    </div>
                    <ul className="space-y-3">
                      {plan.eveningRoutine.map((item, idx) => (
                        <li key={idx} className="bg-[#5A5A40] text-[#FDFCF9] rounded-[24px] p-4 flex gap-4 items-center shadow-md">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                            PM
                          </div>
                          <span className="text-white text-sm leading-relaxed flex-1 opacity-90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Habit Formation */}
                <div className="bg-white rounded-[24px] shadow-sm border border-[#E5E2D9] p-6 h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#F5F5F0] flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-[#5A5A40]" />
                    </div>
                    <h3 className="text-xl font-serif text-[#1A1A17]">Habit Strategy</h3>
                  </div>
                  <ul className="space-y-4">
                    {plan.habitFormation.map((item, idx) => (
                      <li key={idx} className="flex gap-4 items-start bg-[#F5F5F0] p-4 rounded-[24px] border border-[#E5E2D9]">
                        <div className="w-8 h-8 rounded-full bg-white border border-[#E5E2D9] text-[#5A5A40] flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-[#2D2D2A] text-sm leading-relaxed mt-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setPlan(null)}
                  className="px-6 py-2.5 text-[#5A5A40] font-medium hover:opacity-70 transition-opacity tracking-wide"
                >
                  Regenerate My Plan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
