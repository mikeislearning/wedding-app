import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Question } from './quiz';

export interface ScoreEntry {
  name: string;
  score: number;
  timeSeconds: number;
}

export interface QuizSession {
  name: string;
  questions: Question[];
  currentIndex: number;
  score: number;
  selectedAnswer: string | null;
  answered: boolean;
  accumulatedMs: number;
  createdAt: number;
}

const SCORES_KEY = 'wedding_trivia_scores';
const SESSION_KEY = 'wedding_trivia_session';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export async function saveScore(entry: ScoreEntry): Promise<void> {
  const existing = await getScores();
  const updated = [...existing, entry];
  await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(updated));
}

export async function getScores(): Promise<ScoreEntry[]> {
  const raw = await AsyncStorage.getItem(SCORES_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as ScoreEntry[];
}

export async function saveSession(session: QuizSession): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<QuizSession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const session = JSON.parse(raw) as QuizSession;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    await clearSession();
    return null;
  }
  return session;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}
