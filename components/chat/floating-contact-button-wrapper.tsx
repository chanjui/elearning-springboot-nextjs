"use client"


import useUserStore from "@/app/auth/userStore"
import  FloatingContactButton  from '@/components/chat/new-massage-modal';

export function FloatingContactButtonWrapper() {
  const { user } = useUserStore()

  if (!user) return null

  return <FloatingContactButton />
}