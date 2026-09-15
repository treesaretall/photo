import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Profile } from '../../src/types/database'
import { useUpdateProfilePicture } from '../../src/hooks/useUpdateProfilePicture'

const { fromMock, uploadMock, removeMock, resizeImageMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  uploadMock: vi.fn(),
  removeMock: vi.fn(),
  resizeImageMock: vi.fn(),
}))

vi.mock('../../src/lib/supabaseClient', () => ({
  supabase: {
    from: fromMock,
    storage: { from: () => ({ upload: uploadMock, remove: removeMock }) },
  },
}))

vi.mock('../../src/lib/resizeImage', () => ({
  resizeImage: resizeImageMock,
}))

function createUpdateBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    update: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    select: vi.fn(() => builder),
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

const file = new File(['image-bytes'], 'avatar.jpg', { type: 'image/jpeg' })

describe('useUpdateProfilePicture', () => {
  it('resizes, uploads under a new path, updates the row, and removes the previous file', async () => {
    resizeImageMock.mockResolvedValue(new Blob(['resized'], { type: 'image/jpeg' }))
    uploadMock.mockResolvedValue({ error: null })
    removeMock.mockResolvedValue({ error: null })

    const updatedProfile: Profile = { id: true, avatar_path: 'profile/new.jpg', updated_at: '2024-01-01' }
    fromMock.mockReturnValue(createUpdateBuilder({ data: updatedProfile, error: null }))

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')

    const { result } = renderHook(() => useUpdateProfilePicture(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ file, previousPath: 'profile/old.jpg' })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(resizeImageMock).toHaveBeenCalledWith(file, 800)
    expect(uploadMock).toHaveBeenCalledTimes(1)
    expect(removeMock).toHaveBeenCalledWith(['profile/old.jpg'])
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['profile'] })
    expect(queryClient.getQueryData(['profile'])).toEqual(updatedProfile)
  })

  it('does not attempt to remove a previous file when there was none', async () => {
    resizeImageMock.mockResolvedValue(new Blob(['resized'], { type: 'image/jpeg' }))
    uploadMock.mockResolvedValue({ error: null })

    const updatedProfile: Profile = { id: true, avatar_path: 'profile/new.jpg', updated_at: '2024-01-01' }
    fromMock.mockReturnValue(createUpdateBuilder({ data: updatedProfile, error: null }))

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useUpdateProfilePicture(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ file, previousPath: null })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(removeMock).not.toHaveBeenCalled()
  })

  it('surfaces an error when the storage upload fails', async () => {
    resizeImageMock.mockResolvedValue(new Blob(['resized'], { type: 'image/jpeg' }))
    const uploadError = new Error('storage upload failed')
    uploadMock.mockResolvedValue({ error: uploadError })

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const { result } = renderHook(() => useUpdateProfilePicture(), { wrapper: createWrapper(queryClient) })

    result.current.mutate({ file, previousPath: null })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(uploadError)
    expect(fromMock).not.toHaveBeenCalled()
  })
})
