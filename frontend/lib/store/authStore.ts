'use client'

import { create } from 'zustand'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'teacher' | 'parent' | 'admin'
}

interface AuthStore {
  user: User | null
  token: string | null
  loading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  loading: true,
  login: (user, token) => {
    set({ user, token })
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  },
  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
  setLoading: (loading) => set({ loading }),
}))

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  if (token && user) {
    useAuthStore.setState({
      token,
      user: JSON.parse(user),
      loading: false,
    })
  } else {
    useAuthStore.setState({ loading: false })
  }
}
