import { create } from 'zustand'

export interface User {
  id: string;
  nickname: string;
  isInstructor: number;  // 명시적으로 number 타입으로 정의
  // ... 기타 필요한 유저 속성들
}

export interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  restoreFromStorage: () => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  
  setUser: (user: User) => {
    set({ user })
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
  },
  
  setToken: (token: string) => {
    set({ token })
    if (token) {
      localStorage.setItem('token', token)
    }
  },
  
  clearUser: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
  
  restoreFromStorage: () => {
    try {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      
      if (storedUser) {
        set({ user: JSON.parse(storedUser) })
      }
      if (storedToken) {
        set({ token: storedToken })
      }
    } catch (error) {
      console.error('Failed to restore auth state:', error)
    }
  }
}))

export default useUserStore 