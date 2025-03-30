"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, ArrowLeft, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import NetflixHeader from "@/components/netflix-header"
import axios from "axios"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter();
  const API_URL = "/api/user/signup";

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: 회원가입 폼, 2: 프로필 선택, 3: 이메일 인증
  // 회원가입 폼 데이터
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [phone, setPhone] = useState("")
  // 프로필 이미지
  const [profileImage, setProfileImage] = useState<string | null>(null)
  // 이메일 인증
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타이머
  const [timerActive, setTimerActive] = useState(false);

  const profileImages = [
    { id: 1, src: "/profile/Profile1.png?height=200&width=200", alt: "Profile1"},
    { id: 2, src: "/profile/Profile2.png?height=200&width=200", alt: "Profile2"},
    { id: 3, src: "/profile/Profile3.png?height=200&width=200", alt: "Profile3"},
    { id: 4, src: "/profile/Profile4.png?height=200&width=200", alt: "Profile4"},
    { id: 5, src: "/profile/Profile5.png?height=200&width=200", alt: "Profile5 "}
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      const profileId = searchParams.get("profileId")

      if (profileId) {
        setProfileImage(`/auth/user/profile.svg?height=200&width=200`)
      }
    }
  }, [])

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    // 실제로는 여기서 서버에 회원가입 요청을 보내고, 이메일 인증 코드를 발송합니다.
    setStep(2)
    setTimerActive(true)
    // 타이머 시작
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setTimerActive(false)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setVerificationError("")

    // 실제로는 여기서 서버에 인증 코드 확인 요청을 보냅니다.
    setTimeout(() => {
      if (verificationCode === "123456") {
        // 예시 코드
        // 인증 성공 시 회원가입 완료 처리
        window.location.href = "/user/dashboard"
      } else {
        setVerificationError("인증 코드가 일치하지 않습니다. 다시 확인해주세요.")
      }
      setIsVerifying(false)
    }, 1500)
  }

  const resendVerificationCode = () => {
    // 실제로는 여기서 서버에 인증 코드 재발송 요청을 보냅니다.
    setTimeLeft(180)
    setTimerActive(true)
    setVerificationError("")

    // 타이머 재시작
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setTimerActive(false)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
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
            <h2 className="mt-6 text-3xl font-bold">회원가입</h2>
            <p className="mt-2 text-sm text-gray-400">인프런에서 준비된 강의를 학습해보세요</p>
          </div>

          {step === 1 && (
            <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
              <form className="space-y-6" onSubmit={handleSignupSubmit}>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">프로필 이미지</Label>
                  <div className="flex items-start space-x-4">
                    <button onClick={() => setStep(2)} className="w-20 h-20 rounded-md bg-gray-800 flex items-center justify-center hover:ring-2 ring-red-500">
                      {profileImage ? (
                        <Image src={profileImage} alt="Selected profile" width={80} height={80} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <span className="text-gray-400 text-4xl">?</span>
                      )}
                    </button>
                    <div className="flex-1">
                      <Label htmlFor="name" className="block text-sm font-medium text-gray-300">이름</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="홍길동"
                        className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-300">이메일</Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    비밀번호
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="********"
                      className="appearance-none block w-full px-3 py-2 pr-10 bg-gray-800 border-gray-700 text-white"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">8자 이상, 영문, 숫자, 특수문자 조합</p>
                </div>
                <div>
                  <Label htmlFor="password-confirm" className="block text-sm font-medium text-gray-300">
                    비밀번호 확인
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="password-confirm"
                      name="password-confirm"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="********"
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    휴대폰
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="phone"
                      name="phone"
                      type="phone"
                      autoComplete="phone"
                      value={phone}
                      required
                      placeholder="01000000000"
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox id="terms" required className="border-gray-600" />
                    </div>
                    <div className="ml-3 text-sm">
                      <Label htmlFor="terms" className="text-gray-300">
                        <span>
                          인프런의{" "}
                          <Link href="/terms" className="text-red-500 hover:text-red-400">
                            이용약관
                          </Link>{" "}
                          및{" "}
                          <Link href="/privacy" className="text-red-500 hover:text-red-400">
                            개인정보취급방침
                          </Link>
                          에 동의합니다.
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    회원가입
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">또는</span>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image
                      src="/login/google.svg?height=20&width=20"
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5"
                    />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image
                      src="/login/kakao.svg?height=20&width=20"
                      alt="Kakao"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5"
                    />
                    Kakao
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image
                      src="/login/github.svg?height=20&width=20"
                      alt="GitHub"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5"
                    />
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold text-center mb-6">프로필 이미지 선택</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {profileImages.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      setProfileImage(profile.src)
                      setStep(1)
                    }}
                    className={`relative group transition-transform duration-200 ${
                      profileImage === profile.src ? "scale-105 ring-4 ring-red-500" : "hover:scale-105"
                    }`}
                  >
                    <div className="aspect-square rounded-md overflow-hidden">
                      <Image
                        src={profile.src}
                        alt={profile.alt}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {profileImage === profile.src && (
                      <div className="absolute -bottom-2 -right-2 bg-red-600 rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <Button variant="outline" onClick={() => setStep(1)}>돌아가기</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
              <button onClick={() => setStep(2)} className="flex items-center text-gray-400 hover:text-white mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                돌아가기
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">이메일 인증</h3>
                <p className="text-sm text-gray-400 mt-2">
                  {email}로 인증 코드를 발송했습니다.
                  <br />
                  이메일을 확인하고 아래에 인증 코드를 입력해주세요.
                </p>
              </div>

              {verificationError && (
                <Alert variant="destructive" className="mb-4 bg-red-900 border-red-800 text-white">
                  <AlertDescription>{verificationError}</AlertDescription>
                </Alert>
              )}

              <form className="space-y-6" onSubmit={handleVerificationSubmit}>
                <Input
                  id="verification-code"
                  name="verification-code"
                  type="text"
                  required
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-400">
                    인증 코드 유효시간: <span className={timeLeft < 60 ? "text-red-500" : "text-gray-300"}>{formatTime(timeLeft)}</span>
                  </p>
                  <button
                    type="button"
                    onClick={resendVerificationCode}
                    disabled={timerActive && timeLeft > 0}
                    className="text-xs text-red-500 hover:text-red-400 disabled:text-gray-500"
                  >
                    인증 코드 재발송
                  </button>
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isVerifying}>
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      인증 중...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      인증 완료
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
          {/* {step === 1 ? (
            <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
              <form className="space-y-6" onSubmit={handleSignupSubmit}>
                <div>
                  <Label className="block text-sm font-medium text-gray-300 mb-2">프로필 이미지</Label>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      {profileImage ? (
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-red-600">
                          <Image
                            src={profileImage || "/placeholder.svg"}
                            alt="Selected profile"
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-md bg-gray-800 flex items-center justify-center">
                          <span className="text-gray-400 text-4xl">?</span>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => setStep(2)}
                    >
                      {profileImage ? "프로필 이미지 변경" : "프로필 이미지 선택"}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    이름
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="홍길동"
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    이메일
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="example@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">회원가입 후 이메일 인증이 필요합니다.</p>
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-300">
                    비밀번호
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="********"
                      className="appearance-none block w-full px-3 py-2 pr-10 bg-gray-800 border-gray-700 text-white"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">8자 이상, 영문, 숫자, 특수문자 조합</p>
                </div>

                <div>
                  <Label htmlFor="password-confirm" className="block text-sm font-medium text-gray-300">
                    비밀번호 확인
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="password-confirm"
                      name="password-confirm"
                      type="password"
                      autoComplete="new-password"
                      required
                      placeholder="********"
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    휴대폰
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="phone"
                      name="phone"
                      type="phone"
                      autoComplete="phone"
                      value={phone}
                      required
                      placeholder="01000000000"
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox id="terms" required className="border-gray-600" />
                    </div>
                    <div className="ml-3 text-sm">
                      <Label htmlFor="terms" className="text-gray-300">
                        <span>
                          인프런의{" "}
                          <Link href="/terms" className="text-red-500 hover:text-red-400">
                            이용약관
                          </Link>{" "}
                          및{" "}
                          <Link href="/privacy" className="text-red-500 hover:text-red-400">
                            개인정보취급방침
                          </Link>
                          에 동의합니다.
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                    회원가입
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full bg-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-900 text-gray-400">또는</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="Google"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5"
                    />
                    Google
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="Kakao"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5"
                    />
                    Kakao
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                    <Image
                      src="/placeholder.svg?height=20&width=20"
                      alt="GitHub"
                      width={20}
                      height={20}
                      className="mr-2 h-5 w-5"
                    />
                    GitHub
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
              <button onClick={() => setStep(1)} className="flex items-center text-gray-400 hover:text-white mb-4">
                <ArrowLeft className="h-4 w-4 mr-1" />
                돌아가기
              </button>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold">이메일 인증</h3>
                <p className="text-sm text-gray-400 mt-2">
                  {email}로 인증 코드를 발송했습니다.
                  <br />
                  이메일을 확인하고 아래에 인증 코드를 입력해주세요.
                </p>
              </div>

              {verificationError && (
                <Alert variant="destructive" className="mb-4 bg-red-900 border-red-800 text-white">
                  <AlertDescription>{verificationError}</AlertDescription>
                </Alert>
              )}
            {step === 2 && (
              <div className="bg-gray-900 py-8 px-6 shadow-lg rounded-lg border border-gray-800">
                <h3 className="text-xl font-bold text-center mb-6">프로필 이미지 선택</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {profileImages.map((profile) => (
                    <button
                      key={profile.id}
                      onClick={() => {
                        setProfileImage(profile.src)
                        setStep(1)
                      }}
                      className={`relative group transition-transform duration-200 ${
                        profileImage === profile.src ? "scale-105 ring-4 ring-red-500" : "hover:scale-105"
                      }`}
                    >
                      <div className="aspect-square rounded-md overflow-hidden">
                        <Image
                          src={profile.src}
                          alt={profile.alt}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {profileImage === profile.src && (
                        <div className="absolute -bottom-2 -right-2 bg-red-600 rounded-full p-1">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    돌아가기
                  </Button>
                </div>
              </div>
            )}
            {step === 3 && (
              <form className="space-y-6" onSubmit={handleVerificationSubmit}>
                <div>
                  <Label htmlFor="verification-code" className="block text-sm font-medium text-gray-300">
                    인증 코드
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="verification-code"
                      name="verification-code"
                      type="text"
                      required
                      placeholder="123456"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">
                      인증 코드 유효시간:{" "}
                      <span className={timeLeft < 60 ? "text-red-500" : "text-gray-300"}>{formatTime(timeLeft)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={resendVerificationCode}
                      disabled={timerActive && timeLeft > 0}
                      className="text-xs text-red-500 hover:text-red-400 disabled:text-gray-500"
                    >
                      인증 코드 재발송
                    </button>
                  </div>
                </div>

                <div>
                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isVerifying}>
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        인증 중...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        인증 완료
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
          )} */}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              이미 인프런 회원이신가요?{" "}
              <Link href="/auth/user/login" className="font-medium text-red-500 hover:text-red-400">
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

