import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Photo } from '../../src/types/database'
import { usePhotos } from '../../src/hooks/usePhotos'

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }))

vi.mock('../../src/lib/supabaseClient', () => ({
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

const photos: Photo[] = [
  {
    id: '1',
    series_id: 's1',
    storage_path: 'a.jpg',
    thumb_path: 'a-thumb.jpg',
    medium_path: 'a-medium.jpg',
    caption: null,
    position: 0,
    created_at: '2020-01-01',
  },
  {
    id: '2',
    series_id: 's1',
    storage_path: 'b.jpg',
    thumb_path: 'b-thumb.jpg',
    medium_path: 'b-medium.jpg',
    caption: 'B',
    position: 1,
    created_at: '2020-01-02',
  },
]

describe('usePhotos', () => {
  it('returns all photos ordered by position when no seriesId is given', async () => {
    const builder = createQueryBuilder({ data: photos, error: null })
    fromMock.mockReturnValue(builder)

    const { result } = renderHook(() => usePhotos(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fromMock).toHaveBeenCalledWith('photos')
    expect(builder.order).toHaveBeenCalledWith('position', { ascending: true })
    expect(builder.eq).not.toHaveBeenCalled()
    expect(result.current.data).toEqual(photos)
  })

  it('filters by seriesId when provided', async () => {
    const builder = createQueryBuilder({ data: photos, error: null })
    fromMock.mockReturnValue(builder)

    const { result } = renderHook(() => usePhotos('s1'), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(builder.eq).toHaveBeenCalledWith('series_id', 's1')
    expect(result.current.data).toEqual(photos)
  })

  it('surfaces an error when the query fails', async () => {
    const queryError = new Error('failed to fetch photos')
    const builder = createQueryBuilder({ data: null, error: queryError })
    fromMock.mockReturnValue(builder)

    const { result } = renderHook(() => usePhotos(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(queryError)
  })
})
