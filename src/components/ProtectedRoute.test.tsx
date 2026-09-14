import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'

const { authState } = vi.hoisted(() => ({
  authState: { status: 'loading' as 'loading' | 'authenticated' | 'unauthenticated' },
}))

vi.mock('../stores/authStore', () => ({
  useAuthStore: (selector: (state: typeof authState) => unknown) => selector(authState),
}))

function renderProtectedRoute() {
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin/login" element={<p>Login Page</p>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<p>Admin Content</p>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('ProtectedRoute', () => {
  it('shows a loading state while auth status is loading', () => {
    authState.status = 'loading'
    renderProtectedRoute()

    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
  })

  it('redirects to /admin/login when unauthenticated', () => {
    authState.status = 'unauthenticated'
    renderProtectedRoute()

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument()
  })

  it('renders the protected content when authenticated', () => {
    authState.status = 'authenticated'
    renderProtectedRoute()

    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })
})
