import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Activity, Target, MessageCircle, Brain, 
  History as HistoryIcon, Home 
} from 'lucide-react';

import { LeverType, Session, LeverConfig } from './types';
import { MoodSlider } from './components/MoodSlider';
import { HistoryView } from './components/HistoryView';

// Screen imports
import { PhysiologyScreen } from './screens/PhysiologyScreen';
import { FocusScreen } from './screens/FocusScreen';
import { LanguageScreen } from './screens/LanguageScreen';
import { ImaginationScreen } from './screens/ImaginationScreen';

// ------------------- CONFIG -------------------
const levers: LeverConfig[] = [
  {
    id: 'physiology',
    title: 'Fisiología',
    subtitle: 'Cambia tu cuerpo',
    description: 'Respiración, postura, movimiento',
    icon: <Activity size={32} />,
    color: 'bg-blue-500',
    bgStart: 'from-blue-500',
    bgEnd: 'to-blue-600',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-200'
  },
  {
    id: 'focus',
    title: 'Enfoque',
    subtitle: 'Cambia tu atención',
    description: 'Dirige hacia dónde mira tu mente',
    icon: <Target size={32} />,
    color: 'bg-green-500',
    bgStart: 'from-green-500',
    bgEnd: 'to-green-600',
    textColor: 'text-green-600',
    borderColor: 'border-green-200'
  },
  {
    id: 'language',
    title: 'Lenguaje',
    subtitle: 'Cambia tus palabras',
    description: 'Re-etiqueta tu experiencia',
    icon: <MessageCircle size={32} />,
    color: 'bg-orange-500',
    bgStart: 'from-orange-500',
    bgEnd: 'to-orange-600',
    textColor: 'text-orange-600',
    borderColor: 'border-orange-200'
  },
  {
    id: 'imagination',
    title: 'Imaginación',
    subtitle: 'Cambia tu visualización',
    description: 'Ensaya el éxito en tu mente',
    icon: <Brain size={32} />,
    color: 'bg-purple-500',
    bgStart: 'from-purple-500',
    bgEnd: 'to-purple-600',
    textColor: 'text-purple-600',
    borderColor: 'border-purple-200'
  }
];

type ViewState = 'HOME' | 'LEVER_ACTIVE' | 'POST_CHECK' | 'HISTORY';

export default function App() {
  const [view, setView] = useState<ViewState>('HOME');
  const [moodBefore, setMoodBefore] = useState<number>(5);
  const [moodAfter, setMoodAfter] = useState<number>(5);
  
  const [selectedLever, setSelectedLever] = useState<LeverType | null>(null);
  const [completedExercise, setCompletedExercise] = useState<string>('');
  
  const [sessions, setSessions] = useState<Session[]>([]);

  // Load History
  useEffect(() => {
    const saved = localStorage.getItem('4palancas_sessions');
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading sessions", e);
      }
    }
  }, []);

  const saveSession = () => {
    if (!selectedLever) return;
    
    const newSession: Session = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      lever: selectedLever,
      exerciseName: completedExercise,
      moodBefore,
      moodAfter
    };

    const updated = [...sessions, newSession];
    setSessions(updated);
    localStorage.setItem('4palancas_sessions', JSON.stringify(updated));

    if (moodAfter > moodBefore) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#22c55e', '#f97316', '#a855f7']
      });
    }
  };

  const handleLeverSelect = (id: LeverType) => {
    setSelectedLever(id);
    setView('LEVER_ACTIVE');
    window.scrollTo(0, 0);
  };

  const handleExerciseComplete = (name: string) => {
    setCompletedExercise(name);
    // Reset moodAfter to match moodBefore initially, or keep 5, user will adjust
    setMoodAfter(moodBefore); 
    setView('POST_CHECK');
    window.scrollTo(0, 0);
  };

  const handleFinishSession = () => {
    saveSession();
    // Reset
    setSelectedLever(null);
    setCompletedExercise('');
    setView('HOME');
  };

  // ---------------- VIEW ROUTING ----------------

  if (view === 'HISTORY') {
    return <HistoryView sessions={sessions} onBack={() => setView('HOME')} />;
  }

  if (view === 'LEVER_ACTIVE' && selectedLever) {
    switch (selectedLever) {
      case 'physiology':
        return <PhysiologyScreen onComplete={handleExerciseComplete} onBack={() => setView('HOME')} />;
      case 'focus':
        return <FocusScreen onComplete={handleExerciseComplete} onBack={() => setView('HOME')} />;
      case 'language':
        return <LanguageScreen onComplete={handleExerciseComplete} onBack={() => setView('HOME')} />;
      case 'imagination':
        return <ImaginationScreen onComplete={handleExerciseComplete} onBack={() => setView('HOME')} />;
    }
  }

  if (view === 'POST_CHECK') {
    const diff = moodAfter - moodBefore;
    const isImproved = diff > 0;
    
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col p-6 animate-fade-in">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">¿Cómo te sientes AHORA?</h2>
          
          <div className="mb-10">
             <MoodSlider value={moodAfter} onChange={setMoodAfter} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 text-center border border-gray-100">
             <div className="flex justify-center gap-8 mb-4">
               <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Antes</span>
                  <div className="text-2xl font-bold text-gray-600">{moodBefore}</div>
               </div>
               <div className="h-10 w-px bg-gray-200"></div>
               <div>
                  <span className="text-xs text-gray-400 uppercase font-bold">Ahora</span>
                  <div className={`text-2xl font-bold ${isImproved ? 'text-green-500' : 'text-gray-800'}`}>{moodAfter}</div>
               </div>
             </div>
             
             <p className="text-lg">
                {isImproved 
                  ? `¡Mejoró tu estado! (+${diff}) 🎉` 
                  : diff === 0 
                    ? "Tu estado se mantuvo estable." 
                    : "Parece que bajó un poco. ¿Intentamos otra?"
                }
             </p>
             <p className="text-sm text-gray-400 mt-2">Ejercicio: {completedExercise}</p>
          </div>

          <div className="space-y-4">
             <button 
                onClick={handleFinishSession}
                className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-900 transition-colors"
             >
                Terminar y Guardar
             </button>
             {!isImproved && (
                 <button 
                    onClick={() => { saveSession(); setView('HOME'); }}
                    className="w-full bg-white text-slate-600 border border-slate-200 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
                 >
                    Probar otra palanca
                 </button>
             )}
          </div>
        </div>
      </div>
    );
  }

  // ---------------- HOME VIEW ----------------
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-white p-6 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center max-w-lg mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">4 Palancas</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Gestión de Estado</p>
          </div>
          <button onClick={() => setView('HISTORY')} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <HistoryIcon />
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-lg mx-auto w-full">
        
        {/* MOOD INPUT */}
        <section className="mb-10 animate-fade-in-up">
           <MoodSlider 
              label="¿Cómo te sientes ahora?" 
              value={moodBefore} 
              onChange={setMoodBefore} 
           />
           <p className="text-center text-gray-400 text-sm mt-3">
             Selecciona una palanca para cambiar tu estado
           </p>
        </section>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levers.map((lever, index) => (
            <button
              key={lever.id}
              onClick={() => handleLeverSelect(lever.id)}
              className={`
                group relative overflow-hidden rounded-2xl p-6 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1
                bg-gradient-to-br ${lever.bgStart} ${lever.bgEnd} text-white
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 transition-transform duration-500">
                {lever.icon}
              </div>
              
              <div className="relative z-10">
                <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                   {lever.icon}
                </div>
                <h3 className="text-xl font-bold mb-1">{lever.title}</h3>
                <p className="text-white/80 text-sm font-medium mb-3">{lever.subtitle}</p>
                <p className="text-white/60 text-xs leading-relaxed border-t border-white/20 pt-3">
                  {lever.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </main>
      
      <footer className="p-6 text-center text-gray-400 text-xs">
        <p>Tu estado determina tu realidad.</p>
      </footer>
    </div>
  );
}
