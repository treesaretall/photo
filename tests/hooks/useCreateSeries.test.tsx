import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Series } from '../../src/types/database'
import { useCreateSeries } from '../../src/hooks/useCreateSeries'

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }))

vi.mock('../../src/lib/supabaseClient', () => ({
  supabase: { from: fromMock },
}))

function createBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    order: vi.fn(() => builder),
    limit: vi.fn(() => builder),
    single: vi.fn(() => builder),
    then: (resolve: (value: { data: unknown; error: unknown }) => void, reject?: (reason: unknown) => void) =>
      Promise.resolve(result).then(resolve, reject),
  }
  return builder
}

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useCreateSeries', () => {
  it('creates a series at the next position and invalidates the series cache', async () => {
    const createdSeries: Series = {
      id: 's1',
      title: 'Quiet Places',
      location: 'Berlin',
      year: 2022,
      position: 2,
      created_at: '2020-01-01',
    }
    fromMock
      .mockReturnValueOnce(createBuilder({ data: [{ position: 1 }], error: null }))
      .mockReturnValueOnce(createBuilder({ data: createdSeries, error: null }))

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useCreateSeries(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ title: 'Quiet Places', location: 'Berlin', year: 2022 })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const insertBuilder = fromMock.mock.results[1].value
    expect(insertBuilder.insert).toHaveBeenCalledWith([
      { title: 'Quiet Places', location: 'Berlin', year: 2022, position: 2 },
    ])
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['series'] })
    expect(result.current.data).toEqual(createdSeries)
  })

  it('surfaces an error when the insert fails', async () => {
    const insertError = new Error('insert failed')
    fromMock
      .mockReturnValueOnce(createBuilder({ data: [], error: null }))
      .mockReturnValueOnce(createBuilder({ data: null, error: insertError }))

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useCreateSeries(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ title: 'Quiet Places', location: 'Berlin', year: 2022 })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(insertError)
  })
})
