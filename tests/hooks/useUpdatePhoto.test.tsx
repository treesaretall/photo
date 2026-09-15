import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Photo } from '../../src/types/database'
import { useUpdatePhoto } from '../../src/hooks/useUpdatePhoto'

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }))

vi.mock('../../src/lib/supabaseClient', () => ({
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

const photo: Photo = {
  id: 'p1',
  series_id: 's1',
  storage_path: 'a.jpg',
  thumb_path: 'a-thumb.jpg',
  medium_path: 'a-medium.jpg',
  caption: 'Old caption',
  position: 0,
  created_at: '2020-01-01',
}

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useUpdatePhoto', () => {
  it('optimistically updates the cached caption before the request resolves', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['photos', 'all'], [photo])

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

    const { result } = renderHook(() => useUpdatePhoto(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ photoId: 'p1', caption: 'New caption' })

    await waitFor(() =>
      expect(queryClient.getQueryData<Photo[]>(['photos', 'all'])?.[0].caption).toBe('New caption'),
    )

    resolveUpdate!({ error: null })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('rolls back the cache when the update fails', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['photos', 'all'], [photo])

    const updateError = new Error('update failed')
    fromMock.mockReturnValue(createUpdateBuilder({ error: updateError }))

    const { result } = renderHook(() => useUpdatePhoto(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ photoId: 'p1', caption: 'New caption' })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(queryClient.getQueryData<Photo[]>(['photos', 'all'])?.[0].caption).toBe('Old caption')
  })
})
