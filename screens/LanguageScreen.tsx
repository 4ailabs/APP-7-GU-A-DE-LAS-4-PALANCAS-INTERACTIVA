import React, { useState } from 'react';
import { MessageCircle, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

interface LanguageScreenProps {
  onComplete: (exerciseName: string) => void;
  onBack: () => void;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0); // 0: Intro/Examples, 1: Input Limit, 2: Input Better, 3: Compare
  const [limitPhrase, setLimitPhrase] = useState('');
  const [empowerPhrase, setEmpowerPhrase] = useState('');

  const examples = [
    { from: "Estoy ansioso", to: "Estoy activado" },
    { from: "Tengo un problema", to: "Tengo un desafío" },
    { from: "No puedo", to: "Todavía no sé cómo" },
    { from: "Tengo que...", to: "Elijo..." },
  ];

  const suggestReframing = (text: string) => {
      const lower = text.toLowerCase();
      if (lower.includes("no puedo")) return "Todavía estoy aprendiendo a...";
      if (lower.includes("siempre")) return "A veces sucede que...";
      if (lower.includes("odio")) return "Prefiero otra cosa...";
      if (lower.includes("nunca")) return "Hasta ahora...";
      if (lower.includes("problema")) return "Es un reto que puedo manejar...";
      return "";
  };

  const handleLimitSubmit = () => {
      const suggestion = suggestReframing(limitPhrase);
      if (suggestion) setEmpowerPhrase(suggestion);
      setStep(2);
  }

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
       <div className="bg-orange-500 text-white p-4 sticky top-0 z-10 shadow flex items-center">
         <button onClick={onBack} className="mr-4 hover:bg-white/20 p-1 rounded">
             <ArrowLeft size={20} />
         </button>
         <h1 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" /> Palanca de Lenguaje
         </h1>
      </div>

      <div className="flex-1 flex flex-col p-6 max-w-md mx-auto w-full">
        
        {step === 0 && (
            <div className="animate-fade-in">
                <p className="text-orange-900 text-lg mb-6 leading-relaxed">
                    "Las palabras crean bioquímica. Cambiar tus palabras cambia tu experiencia."
                </p>

                <h3 className="text-sm font-bold uppercase text-orange-400 mb-4 tracking-wider">Re-etiquetados Poderosos</h3>
                
                <div className="space-y-3 mb-8">
                    {examples.map((ex, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex items-center justify-between">
                            <span className="text-gray-400 line-through text-sm w-1/2">{ex.from}</span>
                            <ArrowRight size={16} className="text-orange-300 mx-2" />
                            <span className="text-orange-700 font-bold text-sm w-1/2 text-right">{ex.to}</span>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => setStep(1)}
                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                >
                    Probar ahora
                </button>
            </div>
        )}

        {step === 1 && (
            <div className="animate-fade-in flex-1 flex flex-col">
                <label className="text-xl font-bold text-orange-900 mb-2 block">
                    Escribe una frase limitante que uses:
                </label>
                <input 
                    type="text"
                    className="w-full p-4 rounded-xl border-2 border-orange-200 focus:border-orange-500 outline-none text-lg mb-4"
                    placeholder="Ej: Nunca voy a poder..."
                    value={limitPhrase}
                    onChange={(e) => setLimitPhrase(e.target.value)}
                />
                <button 
                    disabled={!limitPhrase.trim()}
                    onClick={handleLimitSubmit}
                    className="mt-auto w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition-colors"
                >
                    Siguiente
                </button>
            </div>
        )}

        {step === 2 && (
            <div className="animate-fade-in flex-1 flex flex-col">
                 <div className="mb-6 opacity-60">
                    <p className="text-sm">Dijiste:</p>
                    <p className="line-through italic text-gray-600">"{limitPhrase}"</p>
                 </div>

                <label className="text-xl font-bold text-orange-900 mb-2 block">
                    Ahora, re-etiquétala de manera útil:
                </label>
                <p className="text-sm text-orange-600 mb-4">¿Cómo lo diría tu mejor versión?</p>
                
                <input 
                    type="text"
                    className="w-full p-4 rounded-xl border-2 border-green-400 focus:ring-2 focus:ring-green-200 outline-none text-lg mb-4 bg-white"
                    placeholder="Escribe la versión potenciadora..."
                    value={empowerPhrase}
                    onChange={(e) => setEmpowerPhrase(e.target.value)}
                />
                <button 
                    disabled={!empowerPhrase.trim()}
                    onClick={() => setStep(3)}
                    className="mt-auto w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg disabled:opacity-50 transition-colors"
                >
                    Transformar
                </button>
            </div>
        )}

        {step === 3 && (
             <div className="animate-fade-in flex-1 flex flex-col items-center justify-center text-center">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-orange-100 w-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                        <RefreshCw size={100} />
                    </div>
                    
                    <div className="mb-6 pb-6 border-b border-gray-100">
                        <span className="text-xs uppercase font-bold text-red-400 block mb-1">Antes (Limitante)</span>
                        <p className="text-lg text-gray-400 line-through decoration-red-300 decoration-2">{limitPhrase}</p>
                    </div>
                    
                    <div>
                        <span className="text-xs uppercase font-bold text-green-500 block mb-1">Ahora (Potenciador)</span>
                        <p className="text-2xl font-bold text-orange-600">{empowerPhrase}</p>
                    </div>
                </div>

                <p className="mt-8 text-gray-600 mb-8">
                    Repite la nueva versión en voz alta <strong>3 veces</strong> para integrarla.
                </p>

                <button 
                    onClick={() => onComplete('Transformación de Lenguaje')}
                    className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                >
                    Hecho
                </button>
             </div>
        )}
      </div>
    </div>
  );
};