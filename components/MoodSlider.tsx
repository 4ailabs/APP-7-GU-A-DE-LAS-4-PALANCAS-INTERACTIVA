import React from 'react';

interface MoodSliderProps {
  value: number;
  onChange: (val: number) => void;
  label?: string;
  disabled?: boolean;
}

export const MoodSlider: React.FC<MoodSliderProps> = ({ value, onChange, label, disabled = false }) => {
  const getEmoji = (val: number) => {
    if (val <= 2) return '😫'; // Muy mal
    if (val <= 4) return '😕'; // Mal
    if (val <= 6) return '😐'; // Regular
    if (val <= 8) return '🙂'; // Bien
    return '😄'; // Excelente
  };

  const getColor = (val: number) => {
    if (val <= 2) return 'text-red-500';
    if (val <= 4) return 'text-orange-500';
    if (val <= 6) return 'text-yellow-600';
    if (val <= 8) return 'text-blue-500';
    return 'text-green-500';
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      {label && <h3 className="text-center text-lg font-medium mb-4 text-gray-700">{label}</h3>}
      
      <div className="flex flex-col items-center space-y-4">
        <div className={`text-6xl transition-all duration-300 transform ${disabled ? 'opacity-50' : 'hover:scale-110'}`}>
          {getEmoji(value)}
        </div>
        
        <div className={`text-2xl font-bold ${getColor(value)}`}>
          {value} / 10
        </div>

        <input
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex justify-between w-full text-xs text-gray-400 px-1">
          <span>Muy mal</span>
          <span>Regular</span>
          <span>Excelente</span>
        </div>
      </div>
    </div>
  );
};