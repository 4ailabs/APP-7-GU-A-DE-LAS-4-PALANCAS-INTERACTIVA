import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Zap, Activity, CheckCircle, Play, ArrowLeft } from 'lucide-react';

interface PhysiologyScreenProps {
  onComplete: (exerciseName: string) => void;
  onBack: () => void;
}

export const PhysiologyScreen: React.FC<PhysiologyScreenProps> = ({ onComplete, onBack }) => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'running' | 'completed'>('idle');

  // Exercise 1: Breathing State
  const [breathText, setBreathText] = useState('');
  const [breathCycle, setBreathCycle] = useState(0);

  // Exercise 2 & 3: Timer State
  const [timeLeft, setTimeLeft] = useState(60);
  const [instructionIndex, setInstructionIndex] = useState(0);

  // Breathing Logic
  useEffect(() => {
    if (activeExercise === 'breathing' && phase === 'running') {
      let mounted = true;
      const cycleDuration = 19000; // 4+7+8 = 19s
      const runCycle = async () => {
        if (!mounted) return;
        setBreathCycle(c => c + 1);
        
        // Inhale 4s
        setBreathText("INHALA (4s)");
        await new Promise(r => setTimeout(r, 4000));
        if (!mounted) return;

        // Hold 7s
        setBreathText("RETÉN (7s)");
        await new Promise(r => setTimeout(r, 7000));
        if (!mounted) return;

        // Exhale 8s
        setBreathText("EXHALA (8s)");
        await new Promise(r => setTimeout(r, 8000));
        
        if (mounted && breathCycle < 3) { // 0, 1, 2, 3 = 4 cycles
             // Loop triggers via dependency or manual recursion, used simple loop here for clarity
             runCycle();
        } else if (mounted) {
            setPhase('completed');
        }
      };
      
      // Reset cycle count on start
      if (breathCycle === 0) runCycle();
      
      return () => { mounted = false; };
    }
  }, [activeExercise, phase, breathCycle]);

  // Timer Logic for Posture & Shake
  useEffect(() => {
    if ((activeExercise === 'posture' || activeExercise === 'shake') && phase === 'running') {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setPhase('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeExercise, phase]);

  // Instruction updates based on time
  useEffect(() => {
    if (activeExercise === 'posture') {
        const elapsed = 60 - timeLeft;
        if (elapsed < 15) setInstructionIndex(0);
        else if (elapsed < 30) setInstructionIndex(1);
        else if (elapsed < 45) setInstructionIndex(2);
        else setInstructionIndex(3);
    } else if (activeExercise === 'shake') {
        const elapsed = 60 - timeLeft;
        if (elapsed < 20) setInstructionIndex(0);
        else if (elapsed < 40) setInstructionIndex(1);
        else setInstructionIndex(2);
    }
  }, [timeLeft, activeExercise]);


  const startExercise = (id: string) => {
    setActiveExercise(id);
    setPhase('running');
    setBreathCycle(0);
    setTimeLeft(60);
    setInstructionIndex(0);
  };

  const getExerciseName = () => {
      switch(activeExercise) {
          case 'breathing': return 'Respiración 4-7-8';
          case 'posture': return 'Postura de Poder';
          case 'shake': return 'Sacudir y Soltar';
          default: return 'Ejercicio';
      }
  };

  if (activeExercise) {
    // ------------------ BREATHING UI ------------------
    if (activeExercise === 'breathing') {
      return (
        <div className="fixed inset-0 bg-blue-900 text-white flex flex-col items-center justify-center p-6 z-50">
          {phase === 'completed' ? (
             <div className="text-center animate-fade-in">
                <CheckCircle size={80} className="mx-auto mb-6 text-green-400" />
                <h2 className="text-3xl font-bold mb-8">¡Completado!</h2>
                <button 
                  onClick={() => onComplete(getExerciseName())}
                  className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
                >
                  Continuar
                </button>
             </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-12 opacity-80">{breathText}</h2>
              <motion.div
                animate={{
                  scale: breathText.includes("INHALA") ? 1.5 : breathText.includes("RETÉN") ? 1.5 : 1,
                  opacity: breathText.includes("RETÉN") ? 0.8 : 1
                }}
                transition={{ duration: breathText.includes("INHALA") ? 4 : breathText.includes("EXHALA") ? 8 : 0.5, ease: "easeInOut" }}
                className="w-48 h-48 rounded-full bg-blue-400 blur-md mb-12 flex items-center justify-center relative"
              >
                  <div className="w-40 h-40 rounded-full bg-white absolute mix-blend-overlay"></div>
              </motion.div>
              <div className="text-sm opacity-50">Ciclo {Math.min(breathCycle + 1, 4)} de 4</div>
            </>
          )}
        </div>
      );
    }

    // ------------------ POSTURE / SHAKE UI ------------------
    const isPosture = activeExercise === 'posture';
    const instructions = isPosture 
        ? ["Ponte de pie. Pies separados al ancho de hombros.", "Hombros hacia atrás. Pecho abierto.", "Manos en la cintura o brazos arriba en V.", "Barbilla ligeramente arriba. Respira profundo."]
        : ["Sacude tus manos y brazos. Suelta la tensión.", "Sacude las piernas. Rebota suavemente.", "Sacude todo el cuerpo. Deja salir cualquier sonido."];

    return (
        <div className={`fixed inset-0 ${isPosture ? 'bg-blue-800' : 'bg-indigo-800'} text-white flex flex-col p-6 z-50`}>
            {phase === 'completed' ? (
                 <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
                    <CheckCircle size={80} className="mx-auto mb-6 text-green-400" />
                    <h2 className="text-3xl font-bold mb-8">¡Energía Cambiada!</h2>
                    <button 
                      onClick={() => onComplete(getExerciseName())}
                      className="bg-white text-blue-900 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors"
                    >
                      Continuar
                    </button>
                 </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
                    <div className="w-full flex justify-between items-center mb-8">
                        <span className="text-lg font-medium opacity-80">{getExerciseName()}</span>
                        <span className="text-4xl font-mono font-bold">{timeLeft}s</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center w-full">
                         <AnimatePresence mode="wait">
                            <motion.div 
                                key={instructionIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center"
                            >
                                <div className="text-6xl mb-6">{isPosture ? '🦸' : '💃'}</div>
                                <h3 className="text-2xl md:text-3xl font-bold leading-tight">
                                    {instructions[instructionIndex]}
                                </h3>
                            </motion.div>
                         </AnimatePresence>
                    </div>
                    
                    <div className="mt-8 w-full bg-white/20 h-2 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-white" 
                            initial={{ width: "0%" }}
                            animate={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
  }

  // ------------------ MENU UI ------------------
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <button onClick={onBack} className="absolute top-6 left-4 hover:bg-white/20 p-2 rounded-full">
             <ArrowLeft size={24} />
        </button>
        <div className="mt-8 text-center">
            <div className="text-5xl mb-2">🫁</div>
            <h1 className="text-3xl font-bold">Fisiología</h1>
            <p className="mt-2 text-blue-100 opacity-90 text-sm max-w-sm mx-auto">
            "Tu cuerpo y tu mente son un sistema integrado. Cambiar tu fisiología cambia tu estado inmediatamente."
            </p>
        </div>
      </div>

      <div className="p-6 space-y-4 flex-1 overflow-y-auto max-w-md mx-auto w-full">
        <h3 className="text-gray-500 font-semibold uppercase text-sm mb-2">Elige un ejercicio</h3>
        
        <button onClick={() => startExercise('breathing')} className="w-full bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-400 hover:shadow-md transition-all text-left flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Wind size={24} />
            </div>
            <div>
                <h4 className="font-bold text-gray-800">Respiración 4-7-8</h4>
                <p className="text-sm text-gray-500">2 min • Activa tu sistema de calma</p>
            </div>
        </button>

        <button onClick={() => startExercise('posture')} className="w-full bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500 hover:shadow-md transition-all text-left flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Zap size={24} />
            </div>
            <div>
                <h4 className="font-bold text-gray-800">Postura de Poder</h4>
                <p className="text-sm text-gray-500">1 min • Expansión física = mental</p>
            </div>
        </button>

        <button onClick={() => startExercise('shake')} className="w-full bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-600 hover:shadow-md transition-all text-left flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Activity size={24} />
            </div>
            <div>
                <h4 className="font-bold text-gray-800">Sacudir y Soltar</h4>
                <p className="text-sm text-gray-500">1 min • Libera la energía atrapada</p>
            </div>
        </button>
      </div>
    </div>
  );
};
