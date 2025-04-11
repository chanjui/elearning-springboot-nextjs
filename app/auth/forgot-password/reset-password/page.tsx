"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import NetflixHeader from "@/components/netflix-header"

interface PasswordRequirement {
  id: string
  text: string
  validator: (password: string) => boolean
  isMet: boolean
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [token, setToken] = useState("")

  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    {
      id: "length",
      text: "8자 이상",
      validator: (password) => password.length >= 8,
      isMet: false,
    },
    {
      id: "letter",
      text: "영문 포함",
      validator: (password) => /[a-zA-Z]/.test(password),
      isMet: false,
    },
    {
      id: "number",
      text: "숫자 포함",
      validator: (password) => /[0-9]/.test(password),
      isMet: false,
    },
    {
      id: "special",
      text: "특수문자 포함",
      validator: (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      isMet: false,
    },
  ])

  // Extract token from URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const tokenParam = urlParams.get("token")
      if (tokenParam) {
        setToken(tokenParam)
      }
    }
  }, [])

  // Validate password against requirements
  useEffect(() => {
    setRequirements((prev) =>
      prev.map((req) => ({
        ...req,
        isMet: req.validator(password),
      })),
    )
  }, [password])

  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword)
    } else {
      setPasswordsMatch(true)
    }
  }, [password, confirmPassword])

  const allRequirementsMet = requirements.every((req) => req.isMet)
  const isFormValid = allRequirementsMet && passwordsMatch && password.length > 0 && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid) return

    setIsLoading(true)

    try {
        const response = await fetch("/api/auth/password/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            newPassword: password,
            token,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        if (result.msg?.includes("토큰이 만료")) {
          alert("링크가 만료되었습니다. 다시 비밀번호 찾기를 진행해주세요.")
          window.location.href = "/auth/forgot-password"
        } else {
          alert(result.msg || "비밀번호 재설정에 실패했습니다.")
        }
      }
    } catch (err) {
      console.error("비밀번호 재설정 실패:", err)
      alert("오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <Link href="/auth/user/login" className="inline-flex items-center text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              로그인으로 돌아가기
            </Link>
          </div>

          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="인프런 로고"
                width={120}
                height={40}
                className="h-10 mx-auto"
              />
            </Link>
            <h2 className="mt-6 text-3xl font-bold">비밀번호 재설정</h2>
            <p className="mt-2 text-sm text-gray-400">새로운 비밀번호를 입력해주세요.</p>
          </div>

          <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    새 비밀번호
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className={`appearance-none block w-full px-3 py-2 bg-gray-800 ${!allRequirementsMet && password ? "border-red-500 text-red-500" : "border-gray-700 text-white"}`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="mt-2 space-y-2">
                    {requirements.map((req) => (
                      <div key={req.id} className="flex items-center text-sm">
                        {req.isMet ? (
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <X className="h-4 w-4 text-gray-500 mr-2" />
                        )}
                        <span className={req.isMet ? "text-green-500" : "text-gray-400"}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                    비밀번호 확인
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className={`appearance-none block w-full px-3 py-2 bg-gray-800 ${!passwordsMatch && confirmPassword ? "border-red-500 text-red-500" : "border-gray-700 text-white"}`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  {!passwordsMatch && confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
                  )}
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={isLoading || !isFormValid}
                  >
                    {isLoading ? "처리 중..." : "비밀번호 재설정"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">비밀번호 재설정 완료</h3>
                <p className="text-gray-300 mb-6">
                  비밀번호가 성공적으로 변경되었습니다. 새 비밀번호로 로그인해주세요.
                </p>
                <Button asChild className="bg-red-600 hover:bg-red-700">
                  <Link href="/auth/user/login">로그인 페이지로 이동</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
