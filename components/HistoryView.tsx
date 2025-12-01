import React from 'react';
import { Session, LeverType } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, TrendingUp, Calendar, Activity } from 'lucide-react';

interface HistoryViewProps {
  sessions: Session[];
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ sessions, onBack }) => {
  
  const getLeverColor = (lever: LeverType) => {
    switch(lever) {
      case 'physiology': return 'text-blue-600 bg-blue-50';
      case 'focus': return 'text-green-600 bg-green-50';
      case 'language': return 'text-orange-600 bg-orange-50';
      case 'imagination': return 'text-purple-600 bg-purple-50';
    }
  };

  const getLeverLabel = (lever: LeverType) => {
    switch(lever) {
      case 'physiology': return 'Fisiología';
      case 'focus': return 'Enfoque';
      case 'language': return 'Lenguaje';
      case 'imagination': return 'Imaginación';
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => b.timestamp - a.timestamp);
  
  // Calculate Stats
  const totalSessions = sessions.length;
  const averageImprovement = totalSessions > 0 
    ? (sessions.reduce((acc, s) => acc + (s.moodAfter - s.moodBefore), 0) / totalSessions).toFixed(1)
    : '0';

  const leverCounts = sessions.reduce((acc, session) => {
    acc[session.lever] = (acc[session.lever] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const bestLever = Object.entries(leverCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  // Chart Data (Last 10 sessions)
  const chartData = [...sessions]
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-10)
    .map(s => ({
      name: new Date(s.timestamp).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit'}),
      mood: s.moodAfter
    }));

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 max-w-2xl mx-auto w-full">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-200 mr-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Historial</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <TrendingUp size={16} />
            <span className="text-xs font-medium uppercase">Mejora Promedio</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">+{averageImprovement}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Activity size={16} />
            <span className="text-xs font-medium uppercase">Favorita</span>
          </div>
          <p className="text-xl font-bold text-gray-800 capitalize">
            {bestLever ? getLeverLabel(bestLever as LeverType) : '-'}
          </p>
        </div>
      </div>

      {chartData.length > 1 && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 h-48">
          <h3 className="text-xs font-medium uppercase text-gray-500 mb-4">Tendencia (Últimas 10 sesiones)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="name" fontSize={10} stroke="#94a3b8" />
              <YAxis domain={[0, 10]} hide />
              <Tooltip />
              <Line type="monotone" dataKey="mood" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="space-y-3 flex-1 overflow-y-auto pb-8">
        <h3 className="text-lg font-semibold text-gray-800">Sesiones Recientes</h3>
        {sortedSessions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No hay sesiones registradas.</p>
        ) : (
          sortedSessions.map((session) => {
            const diff = session.moodAfter - session.moodBefore;
            return (
              <div key={session.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getLeverColor(session.lever)}`}>
                      {getLeverLabel(session.lever)}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(session.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700">{session.exerciseName}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Antes: {session.moodBefore} → Ahora: {session.moodAfter}</div>
                  <div className={`font-bold ${diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {diff > 0 ? '+' : ''}{diff}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
