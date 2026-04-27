import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScoreEntry {
  name: string;
  score: number;
  timeSeconds: number;
}

const SCORES_KEY = 'wedding_trivia_scores';

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
