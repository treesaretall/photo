import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Photo, Series } from '../types/database'
import { useDeleteSeries } from './useDeleteSeries'

const { fromMock, removeMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  removeMock: vi.fn(),
}))

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: fromMock,
    storage: { from: () => ({ remove: removeMock }) },
  },
}))

function createDeleteBuilder(result: { error: unknown }) {
  const builder = {
    delete: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    then: (resolve: (value: { error: unknown }) => void, reject?: (reason: unknown) => void) =>
      Promise.resolve(result).then(resolve, reject),
  }
  return builder
}

const series: Series = {
  id: 's1',
  title: 'Quiet Places',
  location: 'Berlin',
  year: 2022,
  position: 0,
  created_at: '2020-01-01',
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
    created_at: '2020-01-01',
  },
]

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useDeleteSeries', () => {
  it('removes every photo storage object, deletes the series row, and removes it from the cache', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['series'], [series])

    removeMock.mockResolvedValueOnce({ error: null })
    fromMock.mockReturnValue(createDeleteBuilder({ error: null }))

    const { result } = renderHook(() => useDeleteSeries(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ seriesId: 's1', photos })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(removeMock).toHaveBeenCalledWith(['a.jpg', 'a-thumb.jpg', 'a-medium.jpg', 'b.jpg', 'b-thumb.jpg', 'b-medium.jpg'])
    expect(queryClient.getQueryData<Series[]>(['series'])).toEqual([])
  })

  it('deletes the series row without touching storage when it has no photos', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['series'], [series])

    fromMock.mockReturnValue(createDeleteBuilder({ error: null }))

    const { result } = renderHook(() => useDeleteSeries(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ seriesId: 's1', photos: [] })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(removeMock).not.toHaveBeenCalled()
  })

  it('surfaces an error and leaves the cache untouched when deletion fails', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['series'], [series])

    const deleteError = new Error('delete failed')
    removeMock.mockResolvedValueOnce({ error: deleteError })

    const { result } = renderHook(() => useDeleteSeries(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ seriesId: 's1', photos })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(deleteError)
    expect(queryClient.getQueryData<Series[]>(['series'])).toEqual([series])
  })
})
