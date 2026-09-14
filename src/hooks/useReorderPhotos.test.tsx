import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Photo } from '../types/database'
import { useReorderPhotos } from './useReorderPhotos'

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }))

vi.mock('../lib/supabaseClient', () => ({
  supabase: { from: fromMock },
}))

function createUpdateBuilder(result: { error: unknown }) {
  const builder = {
    update: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    then: (resolve: (value: { error: unknown }) => void, reject?: (reason: unknown) => void) =>
      Promise.resolve(result).then(resolve, reject),
  }
  return builder
}

const photos: Photo[] = [
  {
    id: 'p1',
    series_id: 's1',
    storage_path: 'a.jpg',
    thumb_path: 'a-thumb.jpg',
    medium_path: 'a-medium.jpg',
    caption: null,
    position: 0,
    created_at: '2020-01-01',
  },
  {
    id: 'p2',
    series_id: 's1',
    storage_path: 'b.jpg',
    thumb_path: 'b-thumb.jpg',
    medium_path: 'b-medium.jpg',
    caption: null,
    position: 1,
    created_at: '2020-01-02',
  },
]

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useReorderPhotos', () => {
  it('optimistically reorders the cache before the request resolves', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['photos', 'all'], photos)

    let resolveUpdate: (value: { error: unknown }) => void
    const pending = new Promise<{ error: unknown }>((resolve) => {
      resolveUpdate = resolve
    })
    const builder = {
      update: vi.fn(() => builder),
      eq: vi.fn(() => builder),
      then: (resolve: (value: { error: unknown }) => void, reject?: (reason: unknown) => void) =>
        pending.then(resolve, reject),
    }
    fromMock.mockReturnValue(builder)

    const { result } = renderHook(() => useReorderPhotos(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ seriesId: 's1', photoIds: ['p2', 'p1'] })

    await waitFor(() =>
      expect(queryClient.getQueryData<Photo[]>(['photos', 'all'])?.map((p) => p.id)).toEqual(['p2', 'p1']),
    )

    resolveUpdate!({ error: null })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('rolls back the cache order when the request fails', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['photos', 'all'], photos)

    const reorderError = new Error('reorder failed')
    fromMock.mockReturnValue(createUpdateBuilder({ error: reorderError }))

    const { result } = renderHook(() => useReorderPhotos(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ seriesId: 's1', photoIds: ['p2', 'p1'] })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(queryClient.getQueryData<Photo[]>(['photos', 'all'])?.map((p) => p.id)).toEqual(['p1', 'p2'])
  })
})
