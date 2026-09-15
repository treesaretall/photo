import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { Profile } from '../types/database'
import { useProfile } from './useProfile'

const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }))

vi.mock('../lib/supabaseClient', () => ({
  supabase: { from: fromMock },
}))

function createQueryBuilder(result: { data: unknown; error: unknown }) {
  const builder = {
    select: vi.fn(() => builder),
    single: vi.fn(() => builder),
    then: (resolve: (value: { data: unknown; error: unknown }) => void, reject?: (reason: unknown) => void) =>
      Promise.resolve(result).then(resolve, reject),
  }
  return builder
}

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useProfile', () => {
  it('returns the singleton profile row on success', async () => {
    const profile: Profile = { id: true, avatar_path: 'profile/abc.jpg', updated_at: '2020-01-01' }
    const builder = createQueryBuilder({ data: profile, error: null })
    fromMock.mockReturnValue(builder)

    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(fromMock).toHaveBeenCalledWith('profile')
    expect(result.current.data).toEqual(profile)
  })

  it('surfaces an error when the query fails', async () => {
    const queryError = new Error('failed to fetch profile')
    const builder = createQueryBuilder({ data: null, error: queryError })
    fromMock.mockReturnValue(builder)

    const { result } = renderHook(() => useProfile(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBe(queryError)
  })
})
