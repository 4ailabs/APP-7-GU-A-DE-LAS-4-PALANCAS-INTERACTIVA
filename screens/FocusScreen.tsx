import React, { useState } from 'react';
import { Target, ArrowRight, X, Check, ArrowLeft } from 'lucide-react';

interface FocusScreenProps {
  onComplete: (exerciseName: string) => void;
  onBack: () => void;
}

export const FocusScreen: React.FC<FocusScreenProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [currentFocus, setCurrentFocus] = useState('');
  const [newFocus, setNewFocus] = useState('');

  const suggestions = [
    "Oportunidades que tengo",
    "Lo que sí puedo controlar",
    "Mis fortalezas",
    "Soluciones posibles",
    "Momentos de calma"
  ];

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10 shadow flex items-center">
         <button onClick={onBack} className="mr-4 hover:bg-white/20 p-1 rounded">
             <ArrowLeft size={20} />
         </button>
         <h1 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5" /> Palanca de Enfoque
         </h1>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        {step === 1 && (
            <div className="animate-fade-in flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-green-900 mb-2">¿En qué has estado enfocándote últimamente?</h2>
                <p className="text-green-700 mb-6">Tu mente encuentra lo que busca. Sé honesto contigo mismo.</p>
                <textarea 
                    className="w-full p-4 rounded-xl border-2 border-green-200 focus:border-green-500 outline-none text-lg min-h-[150px]"
                    placeholder="Escribe aquí..."
                    value={currentFocus}
                    onChange={(e) => setCurrentFocus(e.target.value)}
                />
                <button 
                    disabled={!currentFocus.trim()}
                    onClick={() => setStep(2)}
                    className="mt-auto w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                    Siguiente <ArrowRight size={20} />
                </button>
            </div>
        )}

        {step === 2 && (
             <div className="animate-fade-in flex-1 flex flex-col items-center text-center justify-center">
                <h2 className="text-xl text-green-800 mb-6">Lo que escribiste:</h2>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 mb-8 italic text-lg text-gray-700 w-full relative">
                    <span className="text-4xl text-green-200 absolute -top-4 -left-2">"</span>
                    {currentFocus}
                    <span className="text-4xl text-green-200 absolute -bottom-8 -right-2">"</span>
                </div>
                <h3 className="text-2xl font-bold text-green-900 mb-8">¿Este enfoque te ayuda o te limita?</h3>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                    <button 
                        onClick={() => setStep(3)} // Logic path for "Limits me"
                        className="bg-red-50 text-red-600 border border-red-200 p-6 rounded-xl hover:bg-red-100 transition-colors flex flex-col items-center"
                    >
                        <X size={32} className="mb-2" />
                        <span className="font-bold">Me limita</span>
                    </button>
                    <button 
                        onClick={() => {
                            // If it helps, just reinforce it
                            setNewFocus(currentFocus);
                            setStep(4);
                        }}
                        className="bg-green-50 text-green-600 border border-green-200 p-6 rounded-xl hover:bg-green-100 transition-colors flex flex-col items-center"
                    >
                        <Check size={32} className="mb-2" />
                        <span className="font-bold">Me ayuda</span>
                    </button>
                </div>
             </div>
        )}

        {step === 3 && (
            <div className="animate-fade-in flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-green-900 mb-2">¿Hacia dónde QUIERES dirigir tu atención?</h2>
                <p className="text-green-700 mb-6">Elige una dirección constructiva.</p>
                
                <div className="space-y-2 mb-6">
                    {suggestions.map(s => (
                        <button 
                            key={s} 
                            onClick={() => setNewFocus(s)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${newFocus === s ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-green-100 hover:border-green-300'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="mt-auto">
                    <label className="text-sm font-semibold text-gray-600 ml-1">O escribe el tuyo:</label>
                    <input 
                        type="text"
                        className="w-full p-3 rounded-xl border-2 border-green-200 focus:border-green-500 outline-none mb-4"
                        placeholder="Mi nuevo enfoque..."
                        value={newFocus}
                        onChange={(e) => setNewFocus(e.target.value)}
                    />
                    <button 
                        disabled={!newFocus.trim()}
                        onClick={() => setStep(4)}
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 hover:bg-green-700 transition-colors"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        )}

        {step === 4 && (
             <div className="animate-fade-in flex-1 flex flex-col items-center justify-center text-center">
                <div className="mb-8">
                    <Target size={64} className="text-green-600 mx-auto mb-4" />
                    <h2 className="text-xl text-gray-500 uppercase tracking-widest text-sm font-semibold">Tu Nuevo Enfoque</h2>
                </div>
                
                <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-green-500 w-full mb-8 transform hover:scale-105 transition-transform">
                    <p className="text-2xl font-bold text-gray-800 leading-relaxed">
                        "Hoy elijo enfocarme en {newFocus.toLowerCase()}"
                    </p>
                </div>

                <p className="text-gray-600 mb-8 max-w-xs">
                    Repite esto para ti mismo/a y observa cómo cambia tu percepción.
                </p>

                <button 
                    onClick={() => onComplete('Cambio de Enfoque')}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                >
                    Finalizar
                </button>
             </div>
        )}
      </div>
    </div>
  );
};