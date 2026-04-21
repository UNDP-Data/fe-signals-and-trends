import { describe, expect, it, vi, beforeEach } from 'vitest';
import { searchSignals } from './signalsCall';
import { axiosInstance } from './apiConfig';

vi.mock('./apiConfig', () => ({
  axiosInstance: {
    get: vi.fn(),
    defaults: {
      baseURL: 'http://localhost:8000',
    },
  },
}));

vi.mock('../logger', () => ({
  default: {
    debug: vi.fn(),
  },
}));

describe('searchSignals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses the expected default search params', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_count: 0,
        data: [],
      },
    });

    const result = await searchSignals();

    expect(axiosInstance.get).toHaveBeenCalledWith('/signals/search', {
      params: {
        page: 1,
        per_page: 10,
        order_by: 'created_at',
        direction: 'desc',
        statuses: ['Approved'],
      },
    });
    expect(result).toEqual({
      current_page: 1,
      per_page: 10,
      total_pages: 1,
      total_count: 0,
      data: [],
    });
  });

  it('includes only the optional params that are provided', async () => {
    vi.mocked(axiosInstance.get).mockResolvedValueOnce({
      data: {
        current_page: 2,
        per_page: 20,
        total_pages: 3,
        total_count: 42,
        data: [],
      },
    });

    await searchSignals({
      page: 2,
      per_page: 20,
      statuses: ['New'],
      query: 'climate',
      created_for: 'General scanning',
      steep_secondary: ['Economic'],
      score: 'High',
    });

    expect(axiosInstance.get).toHaveBeenCalledWith('/signals/search', {
      params: {
        page: 2,
        per_page: 20,
        order_by: 'created_at',
        direction: 'desc',
        statuses: ['New'],
        created_for: 'General scanning',
        steep_secondary: ['Economic'],
        query: 'climate',
        score: 'High',
      },
    });
  });
});
