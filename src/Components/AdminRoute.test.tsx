import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Context from '../Context/Context';
import type { CtxDataType } from '../Types';
import { AdminRoute } from './AdminRoute';

function renderAdminRoute(isAdmin: boolean) {
  const contextValue = {
    isAdmin,
  } as CtxDataType;

  return render(
    <Context.Provider value={contextValue}>
      <MemoryRouter
        initialEntries={['/admin']}
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          <Route path="/" element={<div>Home page</div>} />
          <Route
            path="/admin"
            element={(
              <AdminRoute>
                <div>Admin content</div>
              </AdminRoute>
            )}
          />
        </Routes>
      </MemoryRouter>
    </Context.Provider>,
  );
}

describe('AdminRoute', () => {
  it('renders protected content for admins', () => {
    renderAdminRoute(true);

    expect(screen.getByText('Admin content')).toBeInTheDocument();
  });

  it('redirects non-admin users to the home page', () => {
    renderAdminRoute(false);

    expect(screen.getByText('Home page')).toBeInTheDocument();
    expect(screen.queryByText('Admin content')).not.toBeInTheDocument();
  });
});
