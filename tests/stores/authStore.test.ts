import type { Session } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { signInWithPasswordMock, signOutMock, getSessionMock, onAuthStateChangeMock } = vi.hoisted(() => ({
  signInWithPasswordMock: vi.fn(),
  signOutMock: vi.fn(),
  getSessionMock: vi.fn().mockResolvedValue({ data: { session: null } }),
  onAuthStateChangeMock: vi.fn(),
}))

vi.mock('../../src/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: signInWithPasswordMock,
      signOut: signOutMock,
      getSession: getSessionMock,
      onAuthStateChange: onAuthStateChangeMock,
    },
  },
}))

const { useAuthStore } = await import('../../src/stores/authStore')

const fakeSession = { access_token: 'token', user: { id: 'u1' } } as unknown as Session

beforeEach(() => {
  useAuthStore.setState({ session: null, status: 'unauthenticated' })
  signInWithPasswordMock.mockReset()
  signOutMock.mockReset()
})

describe('authStore', () => {
  it('sets session and status to authenticated on successful sign-in', async () => {
    signInWithPasswordMock.mockResolvedValueOnce({ data: { session: fakeSession }, error: null })

    const result = await useAuthStore.getState().signIn('admin@example.com', 'password')

    expect(result.error).toBeNull()
    expect(useAuthStore.getState().session).toEqual(fakeSession)
    expect(useAuthStore.getState().status).toBe('authenticated')
  })

  it('returns an error message and leaves state unchanged on failed sign-in', async () => {
    signInWithPasswordMock.mockResolvedValueOnce({
      data: { session: null },
      error: { message: 'Invalid login credentials' },
    })

    const result = await useAuthStore.getState().signIn('admin@example.com', 'wrong-password')

    expect(result.error).toBe('Invalid login credentials')
    expect(useAuthStore.getState().session).toBeNull()
    expect(useAuthStore.getState().status).toBe('unauthenticated')
  })

  it('clears session and sets status to unauthenticated on sign-out', async () => {
    useAuthStore.setState({ session: fakeSession, status: 'authenticated' })
    signOutMock.mockResolvedValueOnce({ error: null })

    await useAuthStore.getState().signOut()

    expect(signOutMock).toHaveBeenCalledTimes(1)
    expect(useAuthStore.getState().session).toBeNull()
    expect(useAuthStore.getState().status).toBe('unauthenticated')
  })
})
