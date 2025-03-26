"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { CreditCard, ArrowLeft, CheckCircle2, AlertCircle, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import NetflixHeader from "@/components/netflix-header"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [phoneVerificationStep, setPhoneVerificationStep] = useState(0)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [countdown, setCountdown] = useState(180) // 3분 타이머
  const [termsAgreed, setTermsAgreed] = useState({
    all: false,
    terms1: false,
    terms2: false,
    terms3: false,
  })

  // 예시 데이터
  const cartItems = [
    {
      id: "1",
      title: "비전공자도 이해할 수 있는 Docker 입문/실전",
      instructor: "JSCODE 박재성",
      price: 77000,
      image: "/placeholder.svg?height=80&width=140",
    },
    {
      id: "2",
      title: "Kubernetes 완벽 가이드: 기초부터 실전까지",
      instructor: "JSCODE 박재성",
      price: 88000,
      image: "/placeholder.svg?height=80&width=140",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const discount = 16500
  const total = subtotal - discount

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  // 전체 동의 처리
  const handleAllTermsChange = (checked: boolean) => {
    setTermsAgreed({
      all: checked,
      terms1: checked,
      terms2: checked,
      terms3: checked,
    })
  }

  // 개별 약관 동의 처리
  const handleTermChange = (term: string, checked: boolean) => {
    const newTerms = { ...termsAgreed, [term]: checked }
    setTermsAgreed({
      ...newTerms,
      all: newTerms.terms1 && newTerms.terms2 && newTerms.terms3,
    })
  }

  // 휴대폰 인증 시작
  const startPhoneVerification = () => {
    if (phoneNumber.length < 10) return
    setPhoneVerificationStep(1)
    // 3분 타이머 시작
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 인증번호 확인
  const verifyCode = () => {
    if (verificationCode.length === 6) {
      setPhoneVerificationStep(2)
    }
  }

  // 타이머 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/user/cart" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            장바구니로 돌아가기
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8">결제하기</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 결제 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문 상품 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">주문 상품</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={140}
                      height={80}
                      className="w-[140px] h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.instructor}</p>
                      <p className="font-medium mt-1">₩{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 쿠폰 및 포인트 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">쿠폰 및 포인트</h2>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="coupon" className="border-gray-800">
                  <AccordionTrigger className="py-2 text-gray-200 hover:text-white">쿠폰 사용</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="쿠폰 코드 입력" className="flex-1 bg-gray-800 border-gray-700" />
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-200 hover:text-white hover:bg-gray-800"
                        >
                          적용
                        </Button>
                      </div>
                      <div className="text-sm text-gray-400">사용 가능한 쿠폰이 없습니다.</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="point" className="border-gray-800">
                  <AccordionTrigger className="py-2 text-gray-200 hover:text-white">포인트 사용</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="사용할 포인트 입력"
                          className="flex-1 bg-gray-800 border-gray-700"
                        />
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-200 hover:text-white hover:bg-gray-800"
                        >
                          적용
                        </Button>
                      </div>
                      <div className="text-sm text-gray-400">보유 포인트: 0P</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* 결제 수단 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">결제 수단</h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" className="border-gray-600 text-red-600" />
                  <Label htmlFor="card" className="flex items-center text-gray-200">
                    <CreditCard className="h-5 w-5 mr-2" />
                    신용/체크카드
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank" id="bank" className="border-gray-600 text-red-600" />
                  <Label htmlFor="bank" className="text-gray-200">
                    무통장 입금
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" className="border-gray-600 text-red-600" />
                  <Label htmlFor="phone" className="text-gray-200">
                    휴대폰 결제
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="kakao" id="kakao" className="border-gray-600 text-red-600" />
                  <Label htmlFor="kakao" className="text-gray-200">
                    카카오페이
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-4 p-4 border border-gray-800 rounded-md bg-gray-800/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="card-number" className="text-sm text-gray-300">
                        카드 번호
                      </Label>
                      <Input
                        id="card-number"
                        placeholder="0000-0000-0000-0000"
                        className="mt-1 bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-expiry" className="text-sm text-gray-300">
                        유효 기간
                      </Label>
                      <Input id="card-expiry" placeholder="MM/YY" className="mt-1 bg-gray-800 border-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="card-cvc" className="text-sm text-gray-300">
                        CVC
                      </Label>
                      <Input id="card-cvc" placeholder="000" className="mt-1 bg-gray-800 border-gray-700" />
                    </div>
                    <div>
                      <Label htmlFor="card-password" className="text-sm text-gray-300">
                        비밀번호 앞 2자리
                      </Label>
                      <Input id="card-password" placeholder="**" className="mt-1 bg-gray-800 border-gray-700" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 개인정보 제공 동의 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">개인정보 제공 동의</h2>

              <div className="space-y-2">
                <div className="flex items-start">
                  <Checkbox
                    id="terms-all"
                    className="mt-1 border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    checked={termsAgreed.all}
                    onCheckedChange={(checked) => handleAllTermsChange(checked as boolean)}
                  />
                  <Label htmlFor="terms-all" className="ml-2 font-medium text-gray-200">
                    전체 동의
                  </Label>
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-start">
                  <Checkbox
                    id="terms-1"
                    className="mt-1 border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    checked={termsAgreed.terms1}
                    onCheckedChange={(checked) => handleTermChange("terms1", checked as boolean)}
                  />
                  <Label htmlFor="terms-1" className="ml-2 text-sm text-gray-300">
                    (필수) 구매조건 확인 및 결제진행에 동의
                  </Label>
                </div>
                <div className="flex items-start">
                  <Checkbox
                    id="terms-2"
                    className="mt-1 border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    checked={termsAgreed.terms2}
                    onCheckedChange={(checked) => handleTermChange("terms2", checked as boolean)}
                  />
                  <Label htmlFor="terms-2" className="ml-2 text-sm text-gray-300">
                    (필수) 개인정보 제3자 제공 동의
                  </Label>
                </div>
                <div className="flex items-start">
                  <Checkbox
                    id="terms-3"
                    className="mt-1 border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                    checked={termsAgreed.terms3}
                    onCheckedChange={(checked) => handleTermChange("terms3", checked as boolean)}
                  />
                  <Label htmlFor="terms-3" className="ml-2 text-sm text-gray-300">
                    (필수) 개인정보 수집 및 이용 동의
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 결제 금액 및 휴대폰 인증 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 결제 금액 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-4">
              <h2 className="text-lg font-medium mb-4">결제 금액</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">상품 금액</span>
                  <span>₩{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>할인 금액</span>
                  <span>-₩{formatPrice(discount)}</span>
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span>₩{formatPrice(total)}</span>
                </div>

                <Button
                  className="w-full mt-4 bg-red-600 hover:bg-red-700"
                  disabled={
                    !termsAgreed.terms1 || !termsAgreed.terms2 || !termsAgreed.terms3 || phoneVerificationStep !== 2
                  }
                >
                  결제하기
                </Button>

                {phoneVerificationStep !== 2 && (
                  <Alert className="mt-2 bg-yellow-900/30 border-yellow-800 text-yellow-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>결제를 진행하기 위해 휴대폰 인증이 필요합니다.</AlertDescription>
                  </Alert>
                )}

                {phoneVerificationStep === 2 && (
                  <Alert className="mt-2 bg-green-900/30 border-green-800 text-green-200">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>휴대폰 인증이 완료되었습니다.</AlertDescription>
                  </Alert>
                )}

                <div className="text-xs text-gray-500 mt-2">위 주문 내용을 확인하였으며, 결제에 동의합니다.</div>
              </div>
            </div>

            {/* 휴대폰 인증 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center mb-4">
                <Smartphone className="h-5 w-5 mr-2 text-red-500" />
                <h2 className="text-lg font-medium">휴대폰 본인인증</h2>
              </div>

              {phoneVerificationStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone-number" className="text-sm text-gray-300">
                      휴대폰 번호
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="phone-number"
                        placeholder="01012345678"
                        className="flex-1 bg-gray-800 border-gray-700"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                      <Button
                        onClick={startPhoneVerification}
                        disabled={phoneNumber.length < 10}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        인증번호 받기
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    • 휴대폰 번호는 '-' 없이 입력해주세요.
                    <br />• 본인 명의의 휴대폰만 인증 가능합니다.
                  </div>
                </div>
              )}

              {phoneVerificationStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="verification-code" className="text-sm text-gray-300">
                      인증번호
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <div className="relative flex-1">
                        <Input
                          id="verification-code"
                          placeholder="인증번호 6자리"
                          className="flex-1 bg-gray-800 border-gray-700 pr-16"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                          {formatTime(countdown)}
                        </div>
                      </div>
                      <Button
                        onClick={verifyCode}
                        disabled={verificationCode.length !== 6}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        확인
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    • 인증번호가 전송되었습니다.
                    <br />• 인증번호가 오지 않으면 '인증번호 받기'를 다시 눌러주세요.
                  </div>
                </div>
              )}

              {phoneVerificationStep === 2 && (
                <div className="flex items-center justify-center p-4 text-green-400">
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  <span>휴대폰 인증이 완료되었습니다.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

