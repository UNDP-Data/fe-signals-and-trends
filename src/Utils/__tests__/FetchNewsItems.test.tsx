import { describe, expect, it } from 'vitest';
import { autocomplete, convertToSignals, searchNews } from '../FetchNewsItems';

describe('FetchNewsItems Integration Tests', () => {
  // const delay = (ms: number) =>
  //   new Promise<void>(resolve => setTimeout(resolve, ms));

  // beforeEach(async () => {
  //   await delay(2000);
  // });

  describe('searchNews', () => {
    it('should fetch news successfully with default parameters', async () => {
      const result = await searchNews('test');
      expect(result.news).toBeDefined();
      const firstArticle = result.news[0];
      expect(firstArticle).toHaveProperty('id');
      expect(firstArticle).toHaveProperty('url');
      expect(firstArticle).toHaveProperty('text');
      expect(firstArticle).toHaveProperty('title');
    });

    it('should fetch news with custom parameters', async () => {
      const result = await searchNews('climate change', 'fr', 2, 0);

      expect(result).toBeDefined();
      expect(Array.isArray(result.news)).toBe(true);
      expect(result.news.length).toBeLessThanOrEqual(2);
      // Verify French language results if available
      if (result.news.length > 0) {
        const article = result.news[0];
        expect(article.language).toBe('fr');
      }
    });

    it('should handle empty query gracefully', async () => {
      const result = await searchNews('');
      expect(result).toBeDefined();
      expect(Array.isArray(result.news)).toBe(true);
    });
  });

  describe('convertToSignals', () => {
    it('should convert real API response to signals format', async () => {
      const newsResponse = await searchNews('technology innovation');
      const signals = convertToSignals(newsResponse);

      expect(Array.isArray(signals)).toBe(true);
      if (signals.length > 0) {
        const firstSignal = signals[0];
        expect(firstSignal).toHaveProperty('headline');
        expect(firstSignal).toHaveProperty('url');
        expect(firstSignal).toHaveProperty('description');
        expect(Array.isArray(firstSignal.keywords)).toBe(true);
        expect(firstSignal.keywords.length).toBeLessThanOrEqual(3);
        expect(firstSignal).toHaveProperty('location');
      }
    });
  });

  describe('autocomplete', () => {
    it('should return suggestions for valid query', async () => {
      const suggestions = await autocomplete('artificial intelligence');

      expect(Array.isArray(suggestions)).toBe(true);
      if (suggestions.length > 0) {
        const firstSuggestion = suggestions[0];
        expect(firstSuggestion).toHaveProperty('headline');
        expect(firstSuggestion).toHaveProperty('url');
        expect(firstSuggestion).toHaveProperty('description');
        expect(Array.isArray(firstSuggestion.keywords)).toBe(true);
      }
    });

    it('should return empty array for short query', async () => {
      const suggestions = await autocomplete('a');
      expect(suggestions).toHaveLength(0);
    });

    it('should return empty array for empty query', async () => {
      const suggestions = await autocomplete('');
      expect(suggestions).toHaveLength(0);
    });
  });
});
