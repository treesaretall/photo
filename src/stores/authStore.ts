import type { Session } from '@supabase/supabase-js'
import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthState {
  session: Session | null
  status: AuthStatus
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  status: 'loading',
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      return { error: error.message }
    }

    set({ session: data.session, status: 'authenticated' })
    return { error: null }
  },
  signOut: async () => {
    await supabase.auth.signOut()
    set({ session: null, status: 'unauthenticated' })
  },
}))

supabase.auth.getSession().then(({ data }) => {
  useAuthStore.setState({
    session: data.session,
    status: data.session ? 'authenticated' : 'unauthenticated',
  })
})

supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.setState({
    session,
    status: session ? 'authenticated' : 'unauthenticated',
  })
})
