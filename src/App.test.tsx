import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./lib/imageUrl', () => ({
  getImageUrl: (path: string) => `https://example.com/${path}`,
}))

vi.mock('./hooks/useSeries', () => ({
  useSeries: () => ({ data: [], isLoading: false, isError: false }),
}))

vi.mock('./hooks/usePhotos', () => ({
  usePhotos: () => ({ data: [], isLoading: false, isError: false }),
}))

vi.mock('./stores/authStore', () => ({
  useAuthStore: (selector: (state: { status: string; signOut: () => Promise<void> }) => unknown) =>
    selector({ status: 'unauthenticated', signOut: vi.fn() }),
}))

function renderApp() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('App', () => {
  it('renders the home page at "/"', () => {
    renderApp()
    expect(screen.getByText('Photography Portfolio')).toBeInTheDocument()
  })

  it('renders the site name in the nav bar', () => {
    renderApp()
    expect(screen.getByRole('link', { name: 'Photography Portfolio' })).toBeInTheDocument()
  })
})
