const questionImages: Record<string, any> = {
  'q01-earls.jpg': require('../assets/images/questions/q01-earls.jpg'),
  'q02-halifax.jpg': require('../assets/images/questions/q02-halifax.jpg'),
  'q04-lorde.jpg': require('../assets/images/questions/q04-lorde.jpg'),
  'q05-it-takes-two.jpg': require('../assets/images/questions/q05-it-takes-two.jpg'),
  'q05-costume.jpg': require('../assets/images/questions/q05-costume.jpg'),
  'q06-proposal.jpg': require('../assets/images/questions/q06-proposal.jpg'),
  'q11-tuesday-nooners.jpg': require('../assets/images/questions/q11-tuesday-nooners.jpg'),
  'q14-tex-murphy-merch.jpg': require('../assets/images/questions/q14-tex-murphy-merch.jpg'),
  'q14-tex-murphy-collection.jpg': require('../assets/images/questions/q14-tex-murphy-collection.jpg'),
  'q15-acting.jpg': require('../assets/images/questions/q15-acting.jpg'),
  'q22-horse-jumping.jpg': require('../assets/images/questions/q22-horse-jumping.jpg'),
  'q23-alomar.jpg': require('../assets/images/questions/q23-alomar.jpg'),
  'q24-falcon-lake.jpg': require('../assets/images/questions/q24-falcon-lake.jpg'),
  'q25-pets.jpg': require('../assets/images/questions/q25-pets.jpg'),
  'q27-win-heart.jpg': require('../assets/images/questions/q27-win-heart.jpg'),
  'q29-jobs.jpg': require('../assets/images/questions/q29-jobs.jpg'),
  'q30-hobbiton.jpg': require('../assets/images/questions/q30-hobbiton.jpg'),
};

export function getQuestionImage(key: string): any | undefined {
  return questionImages[key];
}
