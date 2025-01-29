import nlp from 'compromise';

export const extractKeywords = (phrase: string): string => {
  const doc = nlp(phrase);
  const keywords = [
    ...doc.nouns().out('array'), // Extract nouns
    ...doc.verbs().out('array'), // Extract verbs
  ];

  return [...new Set(keywords)].join(' ');
};
