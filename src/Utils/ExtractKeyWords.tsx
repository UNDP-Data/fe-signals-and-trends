import nlp from 'compromise';

export const extractKeywords = (phrase: string): string => {
  const doc = nlp(phrase);
  const keywords = [...doc.nouns().out('array'), ...doc.verbs().out('array')];
  console.log(keywords);
  return keywords.length > 0 ? [...new Set(keywords)].join(' ') : phrase.trim();
  // return [...new Set(keywords)].join(' ');
};
