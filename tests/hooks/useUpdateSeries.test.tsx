import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Series } from '../../src/types/database'
import { useUpdateSeries } from '../../src/hooks/useUpdateSeries'

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

const series: Series = {
  id: 's1',
  title: 'Old title',
  location: 'Old location',
  year: 2020,
  position: 0,
  created_at: '2020-01-01',
}

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useUpdateSeries', () => {
  it('optimistically updates the cached series before the request resolves', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['series'], [series])

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

    const { result } = renderHook(() => useUpdateSeries(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ seriesId: 's1', title: 'New title', location: 'New location', year: 2024 })

    await waitFor(() => expect(queryClient.getQueryData<Series[]>(['series'])?.[0].title).toBe('New title'))

    resolveUpdate!({ error: null })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
  })

  it('rolls back the cache when the update fails', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['series'], [series])

    const updateError = new Error('update failed')
    fromMock.mockReturnValue(createUpdateBuilder({ error: updateError }))

    const { result } = renderHook(() => useUpdateSeries(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ seriesId: 's1', title: 'New title', location: 'New location', year: 2024 })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(queryClient.getQueryData<Series[]>(['series'])?.[0].title).toBe('Old title')
  })
})
