"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Download, Printer, Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import NetflixHeader from "@/components/netflix-header"

export default function PurchaseDetailPage({ params }: { params: { id: string } }) {
  // 예시 구매 상세 데이터
  const purchase = {
    id: params.id,
    orderNumber: "ORDER-2024-" + params.id,
    date: "2024-03-15 14:30:22",
    courseTitle: "비전공자도 이해할 수 있는 Docker 입문/실전",
    instructor: "JSCODE 박재성",
    price: 77000,
    discountPrice: 61600,
    discountAmount: 15400,
    paymentMethod: "신용카드",
    cardInfo: "신한카드 (1234)",
    status: "결제완료",
    image: "/placeholder.svg?height=160&width=280&text=Docker",
    buyer: {
      name: "홍길동",
      email: "example@example.com",
      phone: "010-1234-5678",
    },
  }

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/user/dashboard/purchases" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            구매 내역으로 돌아가기
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">주문 상세 내역</h1>
            <div className="flex gap-2">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Printer className="h-4 w-4 mr-1" />
                인쇄
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Download className="h-4 w-4 mr-1" />
                PDF 다운로드
              </Button>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold">주문번호: {purchase.orderNumber}</h2>
                <p className="text-gray-400">주문일시: {purchase.date}</p>
              </div>
              <Badge className={purchase.status === "결제완료" ? "bg-green-600" : "bg-red-600"}>
                {purchase.status}
              </Badge>
            </div>

            <Separator className="bg-gray-800 mb-6" />

            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-shrink-0">
                <Image
                  src={purchase.image || "/placeholder.svg"}
                  alt={purchase.courseTitle}
                  width={280}
                  height={160}
                  className="w-full md:w-[280px] h-auto object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">{purchase.courseTitle}</h3>
                <p className="text-gray-400 mb-4">{purchase.instructor}</p>

                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-gray-300">평생 무제한 수강</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-400">정가</div>
                    <div className="line-through">₩{formatPrice(purchase.price)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">할인</div>
                    <div className="text-green-500">-₩{formatPrice(purchase.discountAmount)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">결제 금액</div>
                    <div className="font-bold">₩{formatPrice(purchase.discountPrice)}</div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-800 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">결제 정보</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>결제 방법</span>
                    <span>{purchase.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>카드 정보</span>
                    <span>{purchase.cardInfo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>결제일</span>
                    <span>{purchase.date.split(" ")[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>주문 상태</span>
                    <span className="font-medium text-green-500">{purchase.status}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">구매자 정보</h3>
                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>이름</span>
                    <span>{purchase.buyer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>이메일</span>
                    <span>{purchase.buyer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>연락처</span>
                    <span>{purchase.buyer.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">영수증 정보</h2>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-lg mr-3">
                  <Download className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium">전자 영수증</div>
                  <div className="text-sm text-gray-400">PDF 형식으로 다운로드할 수 있습니다.</div>
                </div>
              </div>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                <Download className="h-4 w-4 mr-1" />
                다운로드
              </Button>
            </div>

            <Separator className="bg-gray-800 my-4" />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-lg mr-3">
                  <Copy className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <div className="font-medium">세금계산서</div>
                  <div className="text-sm text-gray-400">사업자 회원은 세금계산서를 발급받을 수 있습니다.</div>
                </div>
              </div>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                발급 신청
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <Link href="/user/dashboard/purchases">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                구매 내역으로 돌아가기
              </Button>
            </Link>
            <Link href={`/user/course/${purchase.id}`}>
              <Button className="bg-red-600 hover:bg-red-700">강의 바로가기</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

