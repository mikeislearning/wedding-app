import questionsData from '../data/questions.json';

export interface Question {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctAnswer: string;
  caption?: string;
  images?: string[];
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRandomQuestions(): Question[] {
  const all = questionsData.questions as Question[];
  const alan = shuffle(all.filter(q => q.category === 'alan')).slice(0, 3);
  const amber = shuffle(all.filter(q => q.category === 'amber')).slice(0, 3);
  const couples = shuffle(all.filter(q => q.category === 'couples')).slice(0, 4);
  const selected = shuffle([...alan, ...amber, ...couples]);
  return selected.map(q => ({
    ...q,
    options: shuffle(q.options),
  }));
}
