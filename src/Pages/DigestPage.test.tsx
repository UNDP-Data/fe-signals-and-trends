import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Context from '@/Context/Context';
import type { ChoicesDataType, CtxDataType } from '@/Types';
import DigestPage from '@/Pages/DigestPage';

const mockGetChoices = vi.fn();
const mockSearchSignals = vi.fn();

vi.mock('@/API/choicesCalls', () => ({
  getChoices: () => mockGetChoices(),
}));

vi.mock('@/API/signalsCall', () => ({
  searchSignals: (...args: unknown[]) => mockSearchSignals(...args),
  triggerDigestEmail: vi.fn(),
}));

vi.mock('@/Components/SignalViews/SignalGridView', () => ({
  SignalGridView: ({ signals }: { signals: Array<{ id: number }> }) => (
    <div data-testid="signal-grid">Grid count: {signals.length}</div>
  ),
}));

vi.mock('@/Components/SignalViews/SignalHorizontalView', () => ({
  SignalHorizontalView: ({ signals }: { signals: Array<{ id: number }> }) => (
    <div data-testid="signal-list">List count: {signals.length}</div>
  ),
}));

function renderDigestPage(contextOverrides: Partial<CtxDataType> = {}) {
  const contextValue = {
    isAdmin: true,
    userName: 'reviewer@example.com',
    ...contextOverrides,
  } as CtxDataType;

  return render(
    <Context.Provider value={contextValue}>
      <MemoryRouter
        initialEntries={['/digest']}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<div>Home page</div>} />
          <Route path="/digest" element={<DigestPage />} />
        </Routes>
      </MemoryRouter>
    </Context.Provider>,
  );
}

describe('DigestPage', () => {
  beforeEach(() => {
    mockGetChoices.mockReset();
    mockSearchSignals.mockReset();
  });

  it('redirects non-admin users without loading page data', async () => {
    renderDigestPage({ isAdmin: false });

    await waitFor(() => {
      expect(screen.getByText('Home page')).toBeInTheDocument();
    });

    expect(mockGetChoices).not.toHaveBeenCalled();
    expect(mockSearchSignals).not.toHaveBeenCalled();
  });

  it('loads choices and draft signals for admins', async () => {
    const choices = {
      steep: ['Economic'],
      signature: ['Governance'],
      location: ['Kenya'],
      goal: ['Goal 1'],
    } as ChoicesDataType;

    mockGetChoices.mockResolvedValueOnce(choices);
    mockSearchSignals.mockResolvedValueOnce({
      current_page: 1,
      per_page: 20,
      total_pages: 1,
      total_count: 2,
      data: [{ id: 1 }, { id: 2 }],
    });

    renderDigestPage();

    await waitFor(() => {
      expect(mockGetChoices).toHaveBeenCalledTimes(1);
      expect(mockSearchSignals).toHaveBeenCalledTimes(1);
    });

    expect(mockSearchSignals).toHaveBeenCalledWith({
      statuses: ['New'],
      page: 1,
      per_page: 20,
      order_by: 'created_at',
      direction: 'desc',
      query: '',
    });
    expect(
      screen.getByText('2 draft signals pending curator review'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('signal-grid')).toHaveTextContent('Grid count: 2');
  });
});
