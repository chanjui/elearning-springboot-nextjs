"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import NetflixHeader from "@/components/netflix-header"

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // 예시 구매 내역 데이터
  const purchases = [
    {
      id: "order-1",
      date: "2024-03-15",
      courseTitle: "비전공자도 이해할 수 있는 Docker 입문/실전",
      instructor: "JSCODE 박재성",
      price: 77000,
      discountPrice: 61600,
      paymentMethod: "신용카드",
      status: "결제완료",
      image: "/placeholder.svg?height=80&width=140&text=Docker",
    },
    {
      id: "order-2",
      date: "2024-02-28",
      courseTitle: "Kubernetes 완벽 가이드: 기초부터 실전까지",
      instructor: "JSCODE 박재성",
      price: 88000,
      discountPrice: 70400,
      paymentMethod: "카카오페이",
      status: "결제완료",
      image: "/placeholder.svg?height=80&width=140&text=Kubernetes",
    },
    {
      id: "order-3",
      date: "2024-01-10",
      courseTitle: "React와 TypeScript로 배우는 프론트엔드 개발",
      instructor: "프론트엔드 개발자",
      price: 88000,
      discountPrice: 88000,
      paymentMethod: "무통장입금",
      status: "결제완료",
      image: "/placeholder.svg?height=80&width=140&text=React",
    },
    {
      id: "order-4",
      date: "2023-12-05",
      courseTitle: "AWS 클라우드 서비스 마스터하기",
      instructor: "클라우드 엔지니어",
      price: 99000,
      discountPrice: 79200,
      paymentMethod: "신용카드",
      status: "결제완료",
      image: "/placeholder.svg?height=80&width=140&text=AWS",
    },
    {
      id: "order-5",
      date: "2023-11-20",
      courseTitle: "파이썬으로 시작하는 데이터 분석",
      instructor: "데이터 사이언티스트",
      price: 66000,
      discountPrice: 59400,
      paymentMethod: "네이버페이",
      status: "환불완료",
      image: "/placeholder.svg?height=80&width=140&text=Python",
    },
  ]

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  // 필터링된 구매 내역
  const filteredPurchases = purchases.filter((purchase) => {
    // 검색어 필터링
    const matchesSearch = purchase.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())

    // 기간 필터링
    let matchesPeriod = true
    if (filterPeriod !== "all") {
      const purchaseDate = new Date(purchase.date)
      const today = new Date()
      const monthsAgo = new Date()

      if (filterPeriod === "1month") {
        monthsAgo.setMonth(today.getMonth() - 1)
        matchesPeriod = purchaseDate >= monthsAgo
      } else if (filterPeriod === "3months") {
        monthsAgo.setMonth(today.getMonth() - 3)
        matchesPeriod = purchaseDate >= monthsAgo
      } else if (filterPeriod === "6months") {
        monthsAgo.setMonth(today.getMonth() - 6)
        matchesPeriod = purchaseDate >= monthsAgo
      }
    }

    // 상태 필터링
    const matchesStatus = filterStatus === "all" || purchase.status === filterStatus

    return matchesSearch && matchesPeriod && matchesStatus
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">구매 내역</h1>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Download className="h-4 w-4 mr-1" />
            내역 다운로드
          </Button>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="강의명 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">전체 기간</SelectItem>
                  <SelectItem value="1month">최근 1개월</SelectItem>
                  <SelectItem value="3months">최근 3개월</SelectItem>
                  <SelectItem value="6months">최근 6개월</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px] bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="결제완료">결제완료</SelectItem>
                  <SelectItem value="환불완료">환불완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="bg-gray-800 mb-4">
              <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
                전체
              </TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-gray-700">
                강의
              </TabsTrigger>
              <TabsTrigger value="books" className="data-[state=active]:bg-gray-700">
                도서
              </TabsTrigger>
              <TabsTrigger value="mentoring" className="data-[state=active]:bg-gray-700">
                멘토링
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              {filteredPurchases.length > 0 ? (
                <div className="space-y-4">
                  {filteredPurchases.map((purchase) => (
                    <div key={purchase.id} className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <Image
                            src={purchase.image || "/placeholder.svg"}
                            alt={purchase.courseTitle}
                            width={140}
                            height={80}
                            className="w-full md:w-[140px] h-auto object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <div>
                              <h3 className="font-medium">{purchase.courseTitle}</h3>
                              <p className="text-sm text-gray-400">{purchase.instructor}</p>
                            </div>
                            <Badge className={purchase.status === "결제완료" ? "bg-green-600" : "bg-red-600"}>
                              {purchase.status}
                            </Badge>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center justify-between text-sm">
                            <div className="text-gray-400">
                              주문일: {purchase.date} | 결제수단: {purchase.paymentMethod}
                            </div>
                            <div className="font-bold">
                              {purchase.price !== purchase.discountPrice && (
                                <span className="line-through text-gray-400 mr-2">₩{formatPrice(purchase.price)}</span>
                              )}
                              ₩{formatPrice(purchase.discountPrice)}
                            </div>
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <Link href={`/user/course/${purchase.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-gray-300 hover:bg-gray-700"
                              >
                                강의 보기
                              </Button>
                            </Link>
                            <Link href={`/user/dashboard/purchases/${purchase.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gray-700 text-gray-300 hover:bg-gray-700"
                              >
                                상세 내역
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <Image
                      src="/placeholder.svg?height=120&width=120"
                      alt="구매 내역 없음"
                      width={120}
                      height={120}
                      className="mx-auto"
                    />
                  </div>
                  <h3 className="text-lg font-medium mb-2">구매 내역이 없습니다</h3>
                  <p className="text-gray-400 mb-4">아직 구매한 강의가 없습니다. 다양한 강의를 둘러보세요.</p>
                  <Link href="/user/courses">
                    <Button className="bg-red-600 hover:bg-red-700">강의 둘러보기</Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            <TabsContent value="courses" className="mt-0">
              {/* 강의 탭 내용 - 위와 동일한 형식이지만 강의만 필터링 */}
              <div className="space-y-4">
                {filteredPurchases.map((purchase) => (
                  <div key={purchase.id} className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                    {/* 내용은 위와 동일 */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={purchase.image || "/placeholder.svg"}
                          alt={purchase.courseTitle}
                          width={140}
                          height={80}
                          className="w-full md:w-[140px] h-auto object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{purchase.courseTitle}</h3>
                            <p className="text-sm text-gray-400">{purchase.instructor}</p>
                          </div>
                          <Badge className={purchase.status === "결제완료" ? "bg-green-600" : "bg-red-600"}>
                            {purchase.status}
                          </Badge>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between text-sm">
                          <div className="text-gray-400">
                            주문일: {purchase.date} | 결제수단: {purchase.paymentMethod}
                          </div>
                          <div className="font-bold">
                            {purchase.price !== purchase.discountPrice && (
                              <span className="line-through text-gray-400 mr-2">₩{formatPrice(purchase.price)}</span>
                            )}
                            ₩{formatPrice(purchase.discountPrice)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <Link href={`/user/course/${purchase.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-700"
                            >
                              강의 보기
                            </Button>
                          </Link>
                          <Link href={`/user/dashboard/purchases/${purchase.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-700 text-gray-300 hover:bg-gray-700"
                            >
                              상세 내역
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="books" className="mt-0">
              <div className="text-center py-12">
                <div className="mb-4">
                  <Image
                    src="/placeholder.svg?height=120&width=120"
                    alt="구매 내역 없음"
                    width={120}
                    height={120}
                    className="mx-auto"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">도서 구매 내역이 없습니다</h3>
                <p className="text-gray-400 mb-4">아직 구매한 도서가 없습니다. 다양한 도서를 둘러보세요.</p>
                <Button className="bg-red-600 hover:bg-red-700">도서 둘러보기</Button>
              </div>
            </TabsContent>

            <TabsContent value="mentoring" className="mt-0">
              <div className="text-center py-12">
                <div className="mb-4">
                  <Image
                    src="/placeholder.svg?height=120&width=120"
                    alt="구매 내역 없음"
                    width={120}
                    height={120}
                    className="mx-auto"
                  />
                </div>
                <h3 className="text-lg font-medium mb-2">멘토링 구매 내역이 없습니다</h3>
                <p className="text-gray-400 mb-4">아직 구매한 멘토링이 없습니다. 다양한 멘토링을 둘러보세요.</p>
                <Button className="bg-red-600 hover:bg-red-700">멘토링 둘러보기</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

