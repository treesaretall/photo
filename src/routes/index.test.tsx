import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppRoutes from './index'

vi.mock('../lib/imageUrl', () => ({
  getImageUrl: (path: string) => `https://example.com/${path}`,
}))

vi.mock('../hooks/useSeries', () => ({
  useSeries: () => ({ data: [], isLoading: false, isError: false }),
}))

vi.mock('../hooks/usePhotos', () => ({
  usePhotos: () => ({ data: [], isLoading: false, isError: false }),
}))

function renderPath(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AppRoutes', () => {
  it.each([
    ['/info', 'Jane Doe'],
    ['/contacts', 'hello@example.com'],
    ['/admin/login', 'Admin Login'],
    ['/admin', 'Admin Dashboard'],
  ])('renders the correct page for %s', (path, heading) => {
    renderPath(path)
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })

  it('renders the home page with an empty photo grid when there is no data', () => {
    renderPath('/')
    expect(screen.getByText('Photography Portfolio')).toBeInTheDocument()
  })
})
