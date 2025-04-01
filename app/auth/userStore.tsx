"use client"

import { create } from "zustand"

interface User {
  email: string
  nickname: string
  phone?: string
}

interface UserStore {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
  fetchUser: () => Promise<void>
  restoreFromStorage: () => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (user) => {
    console.log("✅ setUser 호출됨:", user) // 확인용 로그
    set({ user })
    if (typeof window !== "undefined") {
      localStorage.setItem("userInfo", JSON.stringify(user))
    }
  },

  clearUser: () => {
    set({ user: null })
    if (typeof window !== "undefined") {
      localStorage.removeItem("userInfo")
    }
  },

  fetchUser: async () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userInfo")
      if (saved) {
        const user = JSON.parse(saved)
        set({ user })
      }
    }
  },

  restoreFromStorage: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userInfo")
      if (saved) {
        set({ user: JSON.parse(saved) })
      }
    }
  },
}))

export default useUserStore
