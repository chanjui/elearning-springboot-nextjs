"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import NetflixHeader from "@/components/netflix-header"

const CATEGORIES = [
  { id: 1, name: "개발/프로그래밍" },
  { id: 2, name: "게임 개발" },
  { id: 3, name: "보안" },
  { id: 4, name: "데이터 사이언스" },
  { id: 5, name: "크리에이티브/디자인" },
  { id: 6, name: "직무/마케팅" },
  { id: 7, name: "학문/외국어" },
  { id: 8, name: "커리어" },
  { id: 9, name: "기타" },
]

const REFERRAL_SOURCES = [
  { id: "internet", label: "인터넷 검색" },
  { id: "sns", label: "SNS" },
  { id: "friend", label: "지인 추천" },
  { id: "linkedin", label: "링크드인 메시지" },
  { id: "remember", label: "리멤버 광고" },
  { id: "social_ads", label: "구글/페이스북/인스타그램 광고" },
  { id: "other", label: "그 외" },
]

const API_URL = "/api/instructor/signup"

export default function InstructorSignupPage() {
  const router = useRouter()

  const [githubLink, setGithubLink] = useState("")
  const [bio, setBio] = useState("")
  const [desiredField, setDesiredField] = useState<number | null>(null)
  const [referralSource, setReferralSource] = useState<string | null>(null)
  const [otherReferral, setOtherReferral] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const trimmedGithubLink = githubLink.trim()
    const trimmedBio = bio.trim()

    if (!trimmedGithubLink) {
      alert("프로필 링크를 입력해주세요.")
      setIsSubmitting(false)
      return
    }

    if (!trimmedBio) {
      alert("자기소개를 입력해주세요.")
      setIsSubmitting(false)
      return
    }

    if (desiredField === null) {
      alert("희망 분야를 선택해주세요.")
      setIsSubmitting(false)
      return
    }

    if (referralSource === null) {
      alert("유입 경로를 선택해주세요.")
      setIsSubmitting(false)
      return
    }

    if (referralSource === "other" && !otherReferral.trim()) {
      alert("유입 경로 상세 내용을 입력해주세요.")
      setIsSubmitting(false)
      return
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          githubLink: trimmedGithubLink,
          bio: trimmedBio,
          desiredField: desiredField,
          referralSource: referralSource === "other" ? otherReferral : referralSource,
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("서버 응답 오류:", errorText)
        alert("서버에 문제가 발생했습니다.")
        setIsSubmitting(false)
        return
      }

      const result = await res.json()

      if (result.success) {
        router.push("/instructor")
      } else {
        alert(result.message || "강사 전환에 실패했습니다.")
      }
    } catch (error) {
      console.error("요청 오류:", error)
      alert("요청 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="mt-6 text-3xl font-bold">강사 전환</h2>
            <p className="mt-2 text-sm text-gray-400">인프런에서 강의를 제작하고 공유해보세요</p>
          </div>

          <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
            <form className="space-y-6" onSubmit={handleSignupSubmit}>
              <div>
                <Label htmlFor="githubLink" className="block text-sm font-medium text-gray-300">
                  나를 표현할 수 있는 링크 <span className="text-red-500">*</span>
                </Label>
                <div className="mt-1">
                  <Input
                    id="githubLink"
                    name="githubLink"
                    type="url"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    required
                    placeholder="https://github.com/username"
                    className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">GitHub, 블로그, 포트폴리오 등 본인을 표현할 수 있는 링크</p>
              </div>

              <div>
                <Label htmlFor="bio" className="block text-sm font-medium text-gray-300">
                  나를 소개하는 글 <span className="text-red-500">*</span>
                </Label>
                <div className="mt-1">
                  <Textarea
                    id="bio"
                    name="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                    placeholder="강사로서의 경험과 전문 분야에 대해 소개해주세요."
                    className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white min-h-[100px]"
                  />
                </div>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">
                  희망 분야 <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category.id}
                      type="button"
                      variant={desiredField === category.id ? "default" : "outline"}
                      className={`text-sm py-1 h-auto ${
                        desiredField === category.id
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
                      }`}
                      onClick={() => setDesiredField(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-400">가르치고 싶은 분야를 선택해주세요.</p>
              </div>

              <div>
                <Label className="block text-sm font-medium text-gray-300 mb-2">
                  유입 경로 <span className="text-red-500">*</span>
                </Label>
                <RadioGroup value={referralSource || ""} onValueChange={setReferralSource}>
                  {REFERRAL_SOURCES.map((source) => (
                    <div key={source.id} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem value={source.id} id={source.id} className="border-gray-600" />
                      <Label htmlFor={source.id} className="text-gray-300">
                        {source.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                {referralSource === "other" && (
                  <div className="mt-2">
                    <Input
                      type="text"
                      value={otherReferral}
                      onChange={(e) => {
                        if (e.target.value.length <= 20) {
                          setOtherReferral(e.target.value)
                        }
                      }}
                      placeholder="20자 이내로 입력해주세요"
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                    <p className="mt-1 text-xs text-gray-400">{otherReferral.length}/20자</p>
                  </div>
                )}
              </div>

              <div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                  {isSubmitting ? "처리 중..." : "강사 회원가입"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
