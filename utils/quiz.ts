import questionsData from '../data/questions.json';

export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRandomQuestions(count = 10): Question[] {
  const shuffled = shuffle(questionsData.questions as Question[]);
  const selected = shuffled.slice(0, count);
  // shuffle options for each question
  return selected.map(q => ({
    ...q,
    options: shuffle(q.options),
  }));
}
