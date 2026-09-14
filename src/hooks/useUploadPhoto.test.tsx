import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Photo } from '../types/database'
import { useUploadPhoto } from './useUploadPhoto'

const { fromMock, uploadMock, resizeImageMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  uploadMock: vi.fn(),
  resizeImageMock: vi.fn(),
}))

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    from: fromMock,
    storage: { from: () => ({ upload: uploadMock }) },
  },
}))

vi.mock('../lib/resizeImage', () => ({
  resizeImage: resizeImageMock,
}))

function createBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn(() => builder),
    insert: vi.fn(() => builder),
    eq: vi.fn(() => builder),
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

const file = new File(['image-bytes'], 'photo.jpg', { type: 'image/jpeg' })

describe('useUploadPhoto', () => {
  it('resizes, uploads all three sizes, and inserts a row at the next position', async () => {
    resizeImageMock.mockResolvedValue(new Blob(['resized'], { type: 'image/jpeg' }))
    uploadMock.mockResolvedValue({ error: null })

    const insertedRow: Photo = {
      id: 'p1',
      series_id: 's1',
      storage_path: 'x',
      thumb_path: 'y',
      medium_path: 'z',
      caption: 'Caption',
      position: 3,
      created_at: '2020-01-01',
    }
    fromMock
      .mockReturnValueOnce(createBuilder({ data: [{ position: 2 }], error: null }))
      .mockReturnValueOnce(createBuilder({ data: insertedRow, error: null }))

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUploadPhoto(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ seriesId: 's1', file, caption: 'Caption' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(resizeImageMock).toHaveBeenCalledWith(file, 400)
    expect(resizeImageMock).toHaveBeenCalledWith(file, 1600)
    expect(uploadMock).toHaveBeenCalledTimes(3)

    const insertBuilder = fromMock.mock.results[1].value
    expect(insertBuilder.insert).toHaveBeenCalledWith([
      expect.objectContaining({ series_id: 's1', caption: 'Caption', position: 3 }),
    ])
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['photos'] })
    expect(result.current.data).toEqual(insertedRow)
  })

  it('surfaces an error when a storage upload fails', async () => {
    resizeImageMock.mockResolvedValue(new Blob(['resized'], { type: 'image/jpeg' }))
    const uploadError = new Error('storage upload failed')
    uploadMock.mockResolvedValue({ error: uploadError })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useUploadPhoto(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ seriesId: 's1', file, caption: null })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(uploadError)
    expect(fromMock).not.toHaveBeenCalled()
  })
})
