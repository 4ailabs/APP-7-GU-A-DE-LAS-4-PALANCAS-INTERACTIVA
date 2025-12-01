export type LeverType = 'physiology' | 'focus' | 'language' | 'imagination';

export interface Session {
  id: string;
  date: string;
  timestamp: number;
  lever: LeverType;
  exerciseName: string;
  moodBefore: number;
  moodAfter: number;
}

export interface LeverConfig {
  id: LeverType;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgStart: string;
  bgEnd: string;
  textColor: string;
  borderColor: string;
}
