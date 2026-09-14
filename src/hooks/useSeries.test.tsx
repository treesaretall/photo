import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Series } from '../types/database'
import { useSeries } from './useSeries'

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }))

vi.mock('../lib/supabaseClient', () => ({
  supabase: { from: fromMock },
}))

function createQueryBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn(() => builder),
    order: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    then: (
      resolve: (value: { data: unknown; error: unknown }) => void,
      reject?: (reason: unknown) => void,
    ) => Promise.resolve(result).then(resolve, reject),
  }
  return builder
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useSeries', () => {
  it('returns series ordered by position on success', async () => {
    const series: Series[] = [
      { id: '1', title: 'A', location: 'X', year: 2020, position: 0, created_at: '2020-01-01' },
      { id: '2', title: 'B', location: 'Y', year: 2021, position: 1, created_at: '2021-01-01' },
    ]
    const builder = createQueryBuilder({ data: series, error: null })
    fromMock.mockReturnValue(builder)

    const { result } = renderHook(() => useSeries(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fromMock).toHaveBeenCalledWith('series')
    expect(builder.order).toHaveBeenCalledWith('position', { ascending: true })
    expect(result.current.data).toEqual(series)
  })

  it('surfaces an error when the query fails', async () => {
    const queryError = new Error('failed to fetch series')
    const builder = createQueryBuilder({ data: null, error: queryError })
    fromMock.mockReturnValue(builder)

    const { result } = renderHook(() => useSeries(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(queryError)
  })
})
