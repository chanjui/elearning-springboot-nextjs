"use client"


import useUserStore from "@/app/auth/userStore"
import { FloatingContactButton } from "./floating-contact-button"


export function FloatingContactButtonWrapper() {
  const { user } = useUserStore()

  if (!user) return null

  return <FloatingContactButton/>
}