"use client"

import {create} from "zustand"

// 사용자 정보를 저장하는 인터페이스
interface User {
  id: number
  email: string
  nickname: string
  phone?: string
  profileUrl?: string
  isInstructor: number
}

// Zustand에서 사용할 사용자 상태 인터페이스
interface UserStore {
  user: User | null
  accessToken: string | null
  setUser: (userData: any) => void
  clearUser: () => void
  fetchUser: () => Promise<void>
  restoreFromStorage: () => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  accessToken: null,

  // 로그인 후 사용자 정보와 accessToken 저장
  setUser: (userData) => {
    // JWT 토큰에서 id 추출
    const token = userData.accessToken;
    // accessToken의 payload 디코딩 (Base64)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // User 객체 구성
    const user: User = {
      id: payload.id,
      email: userData.email,
      nickname: userData.nickname,
      phone: userData.phone,
      isInstructor: payload.isInstructor ?? 0,
    };

    console.log("✅ setUser 저장:", user)

    // Zustand 상태 업데이트
    set({ user, accessToken: token })

    // localStorage에 동기화 저장
    if (typeof window !== "undefined") {
      localStorage.setItem("userInfo", JSON.stringify(user))
      localStorage.setItem("accessToken", token)
    }
  },

  // 로그아웃 시 상태 초기화 및 로컬 저장소 정리
  clearUser: () => {
    set({user: null, accessToken: null})
    if (typeof window !== "undefined") {
      localStorage.removeItem("userInfo")
      localStorage.removeItem("accessToken")
    }
  },

  // localStorage에서 유저 정보 불러오기 (초기 마운트 등에서 사용)
  fetchUser: async () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userInfo")
      if (saved) {
        const user = JSON.parse(saved)
        set({user})
      }
    }
  },

  // 상태 복원 (SSR 고려 없이 client-only hydration에 유용)
  restoreFromStorage: () => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("userInfo")
      const savedToken = localStorage.getItem("accessToken");
      if (savedUser && savedToken) {
        set({
          user: JSON.parse(savedUser),
          accessToken: savedToken
        });
      }
    }
  },
}))

export default useUserStore
