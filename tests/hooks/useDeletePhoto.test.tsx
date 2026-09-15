import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Photo } from '../../src/types/database'
import { useDeletePhoto } from '../../src/hooks/useDeletePhoto'

const { fromMock, removeMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  removeMock: vi.fn(),
}))

vi.mock('../../src/lib/supabaseClient', () => ({
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

const photo: Photo = {
  id: 'p1',
  series_id: 's1',
  storage_path: 'a.jpg',
  thumb_path: 'a-thumb.jpg',
  medium_path: 'a-medium.jpg',
  caption: null,
  position: 0,
  created_at: '2020-01-01',
}

function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useDeletePhoto', () => {
  it('removes storage objects and the row, then removes the photo from the cache', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['photos', 'all'], [photo])

    removeMock.mockResolvedValueOnce({ error: null })
    fromMock.mockReturnValue(createDeleteBuilder({ error: null }))

    const { result } = renderHook(() => useDeletePhoto(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({
      photoId: 'p1',
      storagePath: photo.storage_path,
      thumbPath: photo.thumb_path,
      mediumPath: photo.medium_path,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(removeMock).toHaveBeenCalledWith(['a.jpg', 'a-thumb.jpg', 'a-medium.jpg'])
    expect(queryClient.getQueryData<Photo[]>(['photos', 'all'])).toEqual([])
  })

  it('surfaces an error and leaves the cache untouched when deletion fails', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(['photos', 'all'], [photo])

    const deleteError = new Error('delete failed')
    removeMock.mockResolvedValueOnce({ error: deleteError })

    const { result } = renderHook(() => useDeletePhoto(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({
      photoId: 'p1',
      storagePath: photo.storage_path,
      thumbPath: photo.thumb_path,
      mediumPath: photo.medium_path,
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(deleteError)
    expect(queryClient.getQueryData<Photo[]>(['photos', 'all'])).toEqual([photo])
  })
})
