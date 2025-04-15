import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import axios from 'axios'
import useUserStore from "@/app/auth/userStore"

interface Purchase {
  orderId: string
  paymentDate: string
  courseId: string
  courseTitle: string
  instructorName: string
  originalPrice: number
  discountPrice: number
  paymentMethod: string
  paymentStatus: string
  imageUrl: string
  impUid: string
  payMethod: string
}

// 그룹 정보 (UI 표시용)
interface PurchaseGroup {
  impUid: string
  paymentDate: string
  courses: Purchase[]
  totalAmount: number
  paymentStatus: string
  paymentMethod: string
}

export default function PurchasesComponent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [purchaseGroups, setPurchaseGroups] = useState<PurchaseGroup[]>([])
  const [visibleCount, setVisibleCount] = useState(5)
  const [isLoading, setIsLoading] = useState(true)

  const { user, restoreFromStorage } = useUserStore()

  useEffect(() => {
    restoreFromStorage()  // 페이지 로드 시 사용자 정보 복원
  }, [restoreFromStorage])

  useEffect(() => {
    if (!user) return  // 사용자가 없으면 리턴

    setIsLoading(true)
    // 쿠키에 담긴 자동 인증 정보로 API 호출
    axios.get(`/api/purchases`, { withCredentials: true, params: {userId: user.id} })
      .then((res) => {
        console.log("구매 내역 조회 성공", res.data)
        if (res.data) {
          setPurchases(res.data)
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("구매 내역 조회 오류", err)
        setIsLoading(false)
      })
  }, [user])  // user 상태가 변경될 때마다 실행

  // impUid 기준으로 구매 목록 그룹화
  useEffect(() => {
    if (!purchases.length) return

    // impUid 기준으로 그룹화
    const groupMap: Record<string, PurchaseGroup> = {}
    
    purchases.forEach(purchase => {
      const { impUid } = purchase
      
      if (!groupMap[impUid]) {
        groupMap[impUid] = {
          impUid,
          paymentDate: purchase.paymentDate,
          courses: [],
          totalAmount: 0,
          paymentStatus: purchase.paymentStatus,
          paymentMethod: purchase.paymentMethod
        }
      }
      
      groupMap[impUid].courses.push(purchase)
      groupMap[impUid].totalAmount += purchase.discountPrice
    })
    
    // 객체를 배열로 변환하고 날짜별 정렬
    const groups = Object.values(groupMap).sort((a, b) => 
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    )
    
    setPurchaseGroups(groups)
  }, [purchases])

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  // 날짜 포맷팅 함수 (예: "2025.04.02 23:30")
  const formatDateCustom = (dateStr: string) => {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = ('0' + (date.getMonth() + 1)).slice(-2)
    const day = ('0' + date.getDate()).slice(-2)
    const hours = date.getHours()
    const minutes = ('0' + date.getMinutes()).slice(-2)
    // 예: "2025-04-07 오후 04:29"
    const ampm = hours >= 12 ? "오후" : "오전"
    const adjustedHour = hours % 12 === 0 ? 12 : hours % 12
    return `${year}-${month}-${day} ${ampm} ${('0' + adjustedHour).slice(-2)}:${minutes}`
  }

  // 필터링된 구매 그룹
  const filteredPurchaseGroups = purchaseGroups.filter((group) => {
    // 그룹 내 아이템 중 하나라도 검색어와 일치하는지 확인
    const matchesSearch = group.courses.some(item => 
      item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    let matchesPeriod = true
    if (filterPeriod !== "all") {
      const purchaseDate = new Date(group.paymentDate)
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
      } else if (filterPeriod === "1year") {
        monthsAgo.setMonth(today.getMonth() - 12)
        matchesPeriod = purchaseDate >= monthsAgo
      }
    }

    // 결제 상태 필터링
    const matchesStatus = filterStatus === "all" || group.paymentStatus === filterStatus
    
    return matchesSearch && matchesPeriod && matchesStatus
  })

  // 보여줄 항목만 잘라내기
  const visiblePurchaseGroups = filteredPurchaseGroups.slice(0, visibleCount)

  // 더보기 버튼 클릭 시 visibleCount 증가
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  // 환불 요청 함수: 선택한 결제의 impUid refund 금액을 백엔드 환불 API로 요청
  const handleRefund = async (impUid: string, refundAmount: number) => {
    try {
      // JWT 토큰은 jwtProvider.resolveToken을 사용해서 일관되게 추출합니다.
      const token = localStorage.getItem("accessToken") || ""
      console.log("환불 요청 데이터:", { impUid, cancelAmount: refundAmount })

      const response = await axios.post(
        "/api/payment/refund",
        { impUid, cancelAmount: refundAmount },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      if (response.data && response.data.success) {
        alert("환불이 성공적으로 처리되었습니다.")
        // 환불 성공 후 상태 업데이트
        setPurchaseGroups(prev => 
          prev.map(group => 
            group.impUid === impUid 
              ? { ...group, paymentStatus: "환불완료" } 
              : group
          )
        )
      } else {
        alert("환불 실패: " + response.data.message)
      }
    } catch (error) {
      console.error("환불 요청 오류:", error)
      alert("환불 요청 중 오류가 발생했습니다.")
    }
  }
  
  const displayPaymentMethod = (method: string) => {
    const methodMap: { [key: string]: string } = {
      card: "카드",
      point: "포인트",
      phone: "휴대폰 결제",
      vbank: "가상계좌",
      trans: "실시간 계좌이체",
    }

    return methodMap[method] || method
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold">구매내역</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="강의명 검색"
              className="pl-8 bg-gray-900 border-gray-800 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-full sm:w-32 bg-gray-900 border-gray-800 text-white">
                <SelectValue placeholder="기간 선택" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-white">
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="1month">1개월</SelectItem>
                <SelectItem value="3months">3개월</SelectItem>
                <SelectItem value="6months">6개월</SelectItem>
                <SelectItem value="1year">1년</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-32 bg-gray-900 border-gray-800 text-white">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-800 text-white">
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="paid">결제완료</SelectItem>
                <SelectItem value="refunded">환불완료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {visiblePurchaseGroups.length > 0 ? (
            visiblePurchaseGroups.map((group) => (
              <div key={group.impUid} className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <p className="text-sm text-gray-400">주문번호: {group.impUid}</p>
                    <p className="text-sm text-gray-400">결제일: {formatDateCustom(group.paymentDate)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={group.paymentStatus === "paid" ? "default" : "secondary"} className="bg-gray-800 text-white">
                      {group.paymentStatus === "paid" ? "결제완료" : "환불완료"}
                    </Badge>
                    <Badge variant="outline" className="border-gray-700 text-gray-300">
                      {displayPaymentMethod(group.paymentMethod)}
                    </Badge>
                  </div>
                </div>
                <div className="divide-y divide-gray-800">
                  {group.courses.map((course) => (
                    <div key={course.orderId} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden">
                          {course.imageUrl && (
                            <Image
                              src={course.imageUrl}
                              alt={course.courseTitle}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{course.courseTitle}</h3>
                          <p className="text-sm text-gray-400">{course.instructorName} 강사</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatPrice(course.discountPrice)}</p>
                        {course.originalPrice > course.discountPrice && (
                          <p className="text-sm text-gray-400 line-through">{formatPrice(course.originalPrice)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-800 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-400">총 결제금액</p>
                    <p className="font-medium">{formatPrice(group.totalAmount)}</p>
                  </div>
                  {group.paymentStatus === "paid" && (
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                      onClick={() => handleRefund(group.impUid, group.totalAmount)}
                    >
                      환불 요청
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">구매 내역이 없습니다.</p>
            </div>
          )}
          
          {filteredPurchaseGroups.length > visibleCount && (
            <div className="text-center">
              <Button
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
                onClick={handleLoadMore}
              >
                더 보기
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 