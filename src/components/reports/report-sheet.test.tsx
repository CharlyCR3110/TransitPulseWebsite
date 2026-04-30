import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { ReportSheet } from './report-sheet';

vi.mock('@/data/providers', () => ({
  reportsProvider: { submit: vi.fn() },
}));
vi.mock('@/components/providers/lang-provider', () => ({
  useLang: () => ({ lang: 'en', t: (k: string) => k }),
}));

import { reportsProvider } from '@/data/providers';

afterEach(() => {
  vi.clearAllMocks();
});

function withQuery(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>;
}

const created = {
  id: 1, userId: null, routeId: null, stopId: 's1',
  type: 'delay', description: 'late', status: 'pending',
  createdAt: '2026-04-29T00:00:00Z',
};

describe('ReportSheet', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      withQuery(<ReportSheet open={false} onClose={() => {}} stopId="s1" />),
    );
    expect(container.firstChild).toBeNull();
  });

  it('submits with stopId, calls onClose on success', async () => {
    vi.mocked(reportsProvider.submit).mockResolvedValue(created);
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(withQuery(<ReportSheet open onClose={onClose} stopId="s1" />));
    await user.type(screen.getByPlaceholderText(/Tell us what happened/), 'bus is late');
    fireEvent.submit(screen.getByRole('button', { name: /Submit/ }).closest('form')!);

    await waitFor(() => expect(reportsProvider.submit).toHaveBeenCalledOnce());
    expect(reportsProvider.submit).toHaveBeenCalledWith({
      type: 'delay',
      routeId: undefined,
      stopId: 's1',
      description: 'bus is late',
    });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it('keeps the sheet open and renders an error on failure', async () => {
    vi.mocked(reportsProvider.submit).mockRejectedValue(new Error('boom'));
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(withQuery(<ReportSheet open onClose={onClose} routeId="100" />));
    await user.type(screen.getByPlaceholderText(/Tell us what happened/), 'lleno');
    fireEvent.submit(screen.getByRole('button', { name: /Submit/ }).closest('form')!);

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(onClose).not.toHaveBeenCalled();
  });

  it('disables submit when description is empty', () => {
    render(withQuery(<ReportSheet open onClose={() => {}} stopId="s1" />));
    expect(screen.getByRole('button', { name: /Submit/ })).toBeDisabled();
  });
});
