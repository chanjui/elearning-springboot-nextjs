"use client"

import {create} from "zustand"

interface User {
  id: number
  email: string
  nickname: string
  phone?: string
  profileUrl?: string
  isInstructor: number
}

interface UserStore {
  user: User | null
  setUser: (userData: any) => void
  clearUser: () => void
  fetchUser: () => Promise<void>
  restoreFromStorage: () => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: (userData) => {
    // JWT 토큰에서 id 추출
    const token = userData.accessToken;
    const payload = JSON.parse(atob(token.split('.')[1]));

    // User 객체 구성
    const user: User = {
      id: payload.id,
      email: userData.email,
      nickname: userData.nickname,
      phone: userData.phone,
      isInstructor: 0
    };

    console.log(" setUser 호출됨:", user)
    set({user})
    if (typeof window !== "undefined") {
      localStorage.setItem("userInfo", JSON.stringify(user))
    }
  },

  clearUser: () => {
    set({user: null})
    if (typeof window !== "undefined") {
      localStorage.removeItem("userInfo")
    }
  },

  fetchUser: async () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userInfo")
      if (saved) {
        const user = JSON.parse(saved)
        set({user})
      }
    }
  },

  restoreFromStorage: () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userInfo")
      if (saved) {
        set({user: JSON.parse(saved)})
      }
    }
  },
}))

export default useUserStore
