import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppRoutes from '../../src/routes/index'

vi.mock('../../src/lib/imageUrl', () => ({
  getImageUrl: (path: string) => `https://example.com/${path}`,
}))

vi.mock('../../src/hooks/useSeries', () => ({
  useSeries: () => ({ data: [], isLoading: false, isError: false }),
}))

vi.mock('../../src/hooks/usePhotos', () => ({
  usePhotos: () => ({ data: [], isLoading: false, isError: false }),
}))

vi.mock('../../src/hooks/useProfile', () => ({
  useProfile: () => ({ data: { id: true, avatar_path: null, updated_at: '2020-01-01' }, isLoading: false, isError: false }),
}))

vi.mock('../../src/stores/authStore', () => ({
  useAuthStore: (selector: (state: { status: string; signOut: () => Promise<void> }) => unknown) =>
    selector({ status: 'authenticated', signOut: vi.fn() }),
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
    ['/info', 'Matthew Hurst'],
    ['/admin/login', 'Admin Login'],
    ['/admin', 'Admin Dashboard'],
  ])('renders the correct page for %s', (path, heading) => {
    renderPath(path)
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
  })

  it('renders the contacts page with a link to Instagram', () => {
    renderPath('/contacts')
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute(
      'href',
      'https://instagram.com/mwhurst',
    )
  })

  it('renders the home page with an empty photo grid when there is no data', () => {
    renderPath('/')
    expect(screen.getByText('Matthew Hurst')).toBeInTheDocument()
  })
})
