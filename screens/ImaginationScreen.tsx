import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Eye, Ear, User, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

interface ImaginationScreenProps {
  onComplete: (exerciseName: string) => void;
  onBack: () => void;
}

export const ImaginationScreen: React.FC<ImaginationScreenProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  
  // Timer for step 2
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (timerActive && timeLeft === 0) {
      setTimerActive(false);
    }
  }, [timerActive, timeLeft]);

  const next = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col">
       <div className="bg-purple-700 text-white p-4 sticky top-0 z-10 shadow flex items-center">
         <button onClick={onBack} className="mr-4 hover:bg-white/20 p-1 rounded">
             <ArrowLeft size={20} />
         </button>
         <h1 className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5" /> Imaginación
         </h1>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full relative">
        
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
            <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${(step/7)*100}%`}}></div>
        </div>

        {step === 1 && (
             <div className="animate-fade-in flex-1 flex flex-col mt-4">
                <label className="text-xl font-bold text-purple-900 mb-2">
                    Piensa en algo que quieres lograr:
                </label>
                <p className="text-sm text-purple-600 mb-6">Una presentación, una conversación, un proyecto...</p>
                <textarea 
                    className="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none text-lg min-h-[120px]"
                    placeholder="Escribe aquí..."
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                />
                <button onClick={next} disabled={!goal.trim()} className="main-btn mt-auto bg-purple-600 text-white py-4 rounded-xl font-bold disabled:opacity-50">Siguiente</button>
             </div>
        )}

        {step === 2 && (
             <div className="animate-fade-in flex-1 flex flex-col items-center justify-center text-center mt-4">
                {!timerActive && timeLeft === 30 ? (
                    <>
                        <p className="text-xl mb-6">Cierra los ojos e imagina que <span className="font-bold text-purple-700">"{goal}"</span> ya está sucediendo y sale perfecto.</p>
                        <button onClick={() => setTimerActive(true)} className="bg-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-purple-700 transition-transform hover:scale-105">
                            Comenzar Visualización (30s)
                        </button>
                    </>
                ) : (
                    <>
                         <motion.div 
                            animate={{ scale: [1, 1.1, 1] }} 
                            transition={{ repeat: Infinity, duration: 4 }}
                            className="w-48 h-48 rounded-full bg-purple-200 flex items-center justify-center mb-8 relative"
                        >
                            <span className="text-5xl font-mono text-purple-800 font-bold">{timeLeft}s</span>
                            <div className="absolute inset-0 border-4 border-purple-400 rounded-full opacity-30 animate-ping"></div>
                        </motion.div>
                        <p className="text-purple-800 font-medium">Visualiza los detalles...</p>
                        
                        {timeLeft === 0 && (
                             <button onClick={next} className="mt-8 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold animate-bounce">
                                Continuar
                            </button>
                        )}
                    </>
                )}
             </div>
        )}

        {/* VAK Steps */}
        {[3, 4, 5].includes(step) && (
            <div className="animate-fade-in flex-1 flex flex-col mt-4">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center text-purple-600">
                        {step === 3 ? <Eye size={32} /> : step === 4 ? <Ear size={32} /> : <User size={32} />}
                    </div>
                </div>
                
                <h2 className="text-2xl font-bold text-purple-900 text-center mb-2">
                    {step === 3 ? "¿Qué VES?" : step === 4 ? "¿Qué ESCUCHAS?" : "¿Qué SIENTES?"}
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    {step === 3 ? "Colores, brillo, personas, entorno..." : step === 4 ? "Voces, sonidos, música, silencio..." : "Sensaciones físicas en tu cuerpo, emociones..."}
                </p>

                <textarea 
                    className="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none flex-1 max-h-40"
                    placeholder="Detalla tu experiencia..."
                />
                <button onClick={next} className="mt-auto bg-purple-600 text-white py-4 rounded-xl font-bold">Siguiente</button>
            </div>
        )}

        {step === 6 && (
            <div className="animate-fade-in flex-1 flex flex-col mt-4">
                <h2 className="text-2xl font-bold text-purple-900 mb-4">Plan de Resiliencia</h2>
                <p className="mb-6 text-gray-700">Imagina un pequeño contratiempo. ¿Cómo te recuperas con calma?</p>
                <textarea 
                    className="w-full p-4 rounded-xl border-2 border-purple-200 focus:border-purple-500 outline-none flex-1 max-h-40"
                    placeholder="Yo respiro y..."
                />
                <button onClick={next} className="mt-auto bg-purple-600 text-white py-4 rounded-xl font-bold">Terminar</button>
            </div>
        )}

        {step === 7 && (
            <div className="animate-fade-in flex-1 flex flex-col items-center justify-center text-center mt-4">
                <Brain size={80} className="text-purple-500 mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">¡Mapa Mental Creado!</h2>
                <p className="text-gray-600 mb-8 px-4">
                    Tu cerebro ahora tiene una referencia clara de cómo se ve, suena y se siente el éxito.
                </p>
                <button 
                    onClick={() => onComplete('Ensayo Mental')}
                    className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-purple-700 transition-colors"
                >
                    Finalizar
                </button>
            </div>
        )}

      </div>
    </div>
  );
};