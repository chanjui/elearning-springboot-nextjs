"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import NetflixHeader from "@/components/netflix-header"
import axios from 'axios'
import useUserStore from "@/app/auth/userStore";

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

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [purchaseGroups, setPurchaseGroups] = useState<PurchaseGroup[]>([])
  const [visibleCount, setVisibleCount] = useState(5)

  const { user, restoreFromStorage } = useUserStore();

  useEffect(() => {
    restoreFromStorage();  // 페이지 로드 시 사용자 정보 복원
  }, [restoreFromStorage]);

  useEffect(() => {
    if (!user) return;  // 사용자가 없으면 리턴

    // 쿠키에 담긴 자동 인증 정보로 API 호출
    axios.get(`/api/purchases`, { withCredentials: true, params: {userId: user.id} })
      .then((res) => {
        console.log("구매 내역 조회 성공", res.data)
        if (res.data) {
          setPurchases(res.data);
        }
      })
      .catch((err) => {
        console.error("구매 내역 조회 오류", err);
      });
  }, [user]);  // user 상태가 변경될 때마다 실행

  // impUid 기준으로 구매 목록 그룹화
  useEffect(() => {
    if (!purchases.length) return;

    // impUid 기준으로 그룹화
    const groupMap: Record<string, PurchaseGroup> = {};
    
    purchases.forEach(purchase => {
      const { impUid } = purchase;
      
      if (!groupMap[impUid]) {
        groupMap[impUid] = {
          impUid,
          paymentDate: purchase.paymentDate,
          courses: [],
          totalAmount: 0,
          paymentStatus: purchase.paymentStatus,
          paymentMethod: purchase.paymentMethod
        };
      }
      
      groupMap[impUid].courses.push(purchase);
      groupMap[impUid].totalAmount += purchase.discountPrice;
    });
    
    // 객체를 배열로 변환하고 날짜별 정렬
    const groups = Object.values(groupMap).sort((a, b) => 
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    );
    
    setPurchaseGroups(groups);
  }, [purchases]);

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
    );
    
    let matchesPeriod = true;
    if (filterPeriod !== "all") {
      const purchaseDate = new Date(group.paymentDate);
      const today = new Date();
      const monthsAgo = new Date();

      if (filterPeriod === "1month") {
        monthsAgo.setMonth(today.getMonth() - 1);
        matchesPeriod = purchaseDate >= monthsAgo;
      } else if (filterPeriod === "3months") {
        monthsAgo.setMonth(today.getMonth() - 3);
        matchesPeriod = purchaseDate >= monthsAgo;
      } else if (filterPeriod === "6months") {
        monthsAgo.setMonth(today.getMonth() - 6);
        matchesPeriod = purchaseDate >= monthsAgo;
      }
    }

    // 결제 상태 필터링
    const matchesStatus = filterStatus === "all" || group.paymentStatus === filterStatus;
    
    return matchesSearch && matchesPeriod && matchesStatus;
  });

  // 보여줄 항목만 잘라내기
  const visiblePurchaseGroups = filteredPurchaseGroups.slice(0, visibleCount);

  // 더보기 버튼 클릭 시 visibleCount 증가
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  // 환불 요청 함수: 선택한 결제의 impUid refund 금액을 백엔드 환불 API로 요청
  const handleRefund = async (impUid: string, refundAmount: number) => {
    try {
      // JWT 토큰은 jwtProvider.resolveToken을 사용해서 일관되게 추출합니다.
      const token = localStorage.getItem("accessToken") || "";
      console.log("환불 요청 데이터:", { impUid, cancelAmount: refundAmount });

      const response = await axios.post(
        "/api/payment/refund",
        { impUid, cancelAmount: refundAmount },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (response.data && response.data.success) {
        alert("환불이 성공적으로 처리되었습니다.");
        // 환불 성공 후 상태 업데이트
        setPurchaseGroups(prev => 
          prev.map(group => 
            group.impUid === impUid 
              ? { ...group, paymentStatus: "환불완료" } 
              : group
          )
        );
      } else {
        alert("환불 실패: " + response.data.message);
      }
    } catch (error) {
      console.error("환불 요청 오류:", error);
      alert("환불 요청 중 오류가 발생했습니다.");
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

    return methodMap[method] || method;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">구매 내역</h1>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            <Download className="h-4 w-4 mr-1" /> 내역 다운로드
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

          {/* 구매 내역 목록 (impUid별 그룹화) */}
          <div className="mt-0">
            {visiblePurchaseGroups.length > 0 ? (
              <div className="space-y-6">
                {visiblePurchaseGroups.map((group) => (
                  <div key={group.impUid} className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                    {/* 그룹 헤더 */}
                    <div className="mb-3 pb-2 border-b border-gray-700">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div>
                          <h3 className="font-medium">주문번호: ORDER-{group.courses[0]?.orderId || ""}{group.impUid.replace("imp_", "")} {formatDateCustom(group.paymentDate)}</h3>
                          <p className="text-sm text-gray-400">
                            결제수단: {displayPaymentMethod(group.paymentMethod)} | 강의 수: {group.courses.length}개
                          </p>
                        </div>
                        <div className="flex items-center gap-3 mt-2 md:mt-0">
                          <Badge className={group.paymentStatus === "결제완료" ? "bg-green-600" : "bg-red-600"}>
                            {group.paymentStatus === "결제완료" ? "결제완료" : "환불완료"}
                          </Badge>
                          <div className="font-bold">
                            총 금액: ₩{formatPrice(group.totalAmount)}
                          </div>

                        </div>
                      </div>
                    </div>

                    {/* 그룹 내 강의 목록 */}
                    <div className="space-y-4">
                      {group.courses.map((course, idx) => (
                        <div key={idx} className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-shrink-0">
                              <Image
                                src={course.imageUrl || "/placeholder.svg"}
                                alt={course.courseTitle}
                                width={140}
                                height={80}
                                className="w-full md:w-[140px] h-auto object-cover rounded"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                                <div>
                                  <h3 className="font-medium">{course.courseTitle}</h3>
                                  <p className="text-sm text-gray-400">{course.instructorName}</p>
                                </div>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center justify-between text-sm">
                                <div className="font-bold">
                                  {course.originalPrice !== course.discountPrice && (
                                    <span className="line-through text-gray-400 mr-2">
                                      ₩{formatPrice(course.originalPrice)}
                                    </span>
                                  )}
                                  ₩{formatPrice(course.discountPrice)}
                                </div>
                              </div>
                              <div className="flex justify-end items-center mt-4">
                                <Link href={`/user/course/${course.courseId}`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-gray-700 text-gray-300 hover:bg-gray-700"
                                  >
                                    강의 보기
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 그룹 푸터 */}
                    <div className="flex justify-end mt-3 pt-2 border-t border-gray-700 gap-2">
                      {group.paymentStatus === "결제완료" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRefund(group.impUid, group.totalAmount)}
                        >
                          환불 요청
                        </Button>
                      )}
                      <Link href={`/user/dashboard/purchases/${group.impUid}`}>
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
                <p className="text-gray-400 mb-4">
                  아직 구매한 강의가 없습니다. 다양한 강의를 둘러보세요.
                </p>
                <Link href="/user/courses">
                  <Button className="bg-red-600 hover:bg-red-700">강의 둘러보기</Button>
                </Link>
              </div>
            )}
          </div>

          {/* 더보기 버튼: 전체 목록이 visibleCount 보다 많을 경우 */}
          {filteredPurchaseGroups.length > visibleCount && (
            <div className="mt-4 flex justify-center">
              <Button onClick={handleLoadMore} className="bg-gray-700 hover:bg-gray-600">
                더보기
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}