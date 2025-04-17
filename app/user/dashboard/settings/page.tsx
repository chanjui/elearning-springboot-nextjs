"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/user/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/user/ui/card"
import { Button } from "@/components/user/ui/button"
import { Separator } from "@/components/user/ui/separator"
import { Badge } from "@/components/user/ui/badge"
import { Star, ChevronRight, Edit2, Bell, Shield, User, BookOpen, Clock, Award, MessageSquare, Code, Trophy, Heart, Bookmark, History, LogOut } from "lucide-react"
import UserHeader from "@/components/user/user-header"
import useUserStore from "@/app/auth/userStore"
import { useRouter } from "next/navigation"
import NetflixHeader from "@/components/netflix-header"
import PurchasesComponent from "@/components/user/purchases"
import CouponList from "@/components/user/CouponList"

interface UserStats {
  enrolledCourses: number
  completedCourses: number
  totalReviews: number
  communityPosts: number
  communityComments: number
  codingTestScore: number
  codingTestRank: number
  bookmarkedCourses: number
  learningStreak: number
}

export default function MyPage() {
  const router = useRouter()
  const { user, isHydrated, clearUser } = useUserStore()
  const [isClient, setIsClient] = useState(false)
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [userStats, setUserStats] = useState<UserStats>({
    enrolledCourses: 0,
    completedCourses: 0,
    totalReviews: 0,
    communityPosts: 0,
    communityComments: 0,
    codingTestScore: 0,
    codingTestRank: 0,
    bookmarkedCourses: 0,
    learningStreak: 0
  })
  const [activeTab, setActiveTab] = useState("account")
  const [activeMenu, setActiveMenu] = useState("mypage")

  // 클라이언트 사이드 렌더링 확인
  useEffect(() => {
    setIsClient(true)
    setDate(new Date())
  }, [])

  useEffect(() => {
    // 사용자 통계 데이터 가져오기
    const fetchUserStats = async () => {
      if (!user?.id) return
      try {
        // API 엔드포인트가 아직 구현되지 않았으므로 더미 데이터 사용
        // const response = await fetch(`/api/user/stats?userId=${user.id}`)
        // if (!response.ok) throw new Error("Failed to fetch user stats")
        // const data = await response.json()
        // setUserStats(data)
        
        // 더미 데이터 사용
        const dummyData: UserStats = {
          enrolledCourses: 3,
          completedCourses: 1,
          totalReviews: 2,
          communityPosts: 5,
          communityComments: 12,
          codingTestScore: 85,
          codingTestRank: 42,
          bookmarkedCourses: 7,
          learningStreak: 5
        }
        
        setUserStats(dummyData)
      } catch (error) {
        console.error("Error fetching user stats:", error)
      }
    }

    if (isClient && user?.id) {
      fetchUserStats()
    }
  }, [user?.id, isClient])

  // 클라이언트 사이드 렌더링이 완료되기 전에는 로딩 상태 표시
  if (!isClient || !isHydrated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4">로딩 중...</p>
        </div>
      </div>
    )
  }

  // 사용자가 로그인하지 않은 경우 로그인 페이지로 리디렉션
  if (!user) {
    router.push('/auth/user/login')
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white">
    
      <NetflixHeader />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 사이드바 */}
          <div className="w-full md:w-64 space-y-4">
            <div className="flex flex-col items-center p-6 bg-gray-900 rounded-lg border border-gray-800">
              <div className="relative mb-4">
                <Image
                  src={user?.profileUrl || "/placeholder.svg?height=120&width=120"}
                  alt="프로필 이미지"
                  width={120}
                  height={120}
                  className="rounded-full bg-gray-800"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <h2 className="text-xl font-bold mb-1">{user?.nickname || "사용자"}</h2>
              <p className="text-sm text-gray-400 mb-4">inflearn.com/users/@{user?.username || "user"}</p>

              <div className="grid grid-cols-2 w-full gap-2 text-center">
                <div className="p-2 bg-gray-800 rounded-md">
                  <p className="text-xs text-gray-400">수강 중</p>
                  <p className="font-bold">{userStats.enrolledCourses}</p>
                </div>
                <div className="p-2 bg-gray-800 rounded-md">
                  <p className="text-xs text-gray-400">완료</p>
                  <p className="font-bold">{userStats.completedCourses}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <div className="p-4 font-medium">메뉴</div>
              <Separator className="bg-gray-800" />
              <nav className="p-2">
                <ul className="space-y-1">
                  <li>
                    <Link href="/user/dashboard" className="flex items-center p-2 rounded-md hover:bg-gray-800">
                      <BookOpen className="h-4 w-4 mr-3 text-gray-400" />
                      <span>대시보드</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab("account")
                        setActiveMenu("mypage")
                      }}
                      className={`flex items-center p-2 rounded-md w-full text-left ${
                        activeMenu === "mypage" ? "bg-gray-800 text-red-500" : "hover:bg-gray-800"
                      }`}
                    >
                      <User className={`h-4 w-4 mr-3 ${activeMenu === "mypage" ? "text-red-500" : "text-gray-400"}`} />
                      <span>마이페이지</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab("purchases")
                        setActiveMenu("purchases")
                      }}
                      className={`flex items-center p-2 rounded-md w-full text-left ${
                        activeMenu === "purchases" ? "bg-gray-800 text-red-500" : "hover:bg-gray-800"
                      }`}
                    >
                      <Award className={`h-4 w-4 mr-3 ${activeMenu === "purchases" ? "text-red-500" : "text-gray-400"}`} />
                      <span>구매 내역</span>
                    </button>
                  </li>
                  <li>
                    <Link href="/user/dashboard/learning" className="flex items-center p-2 rounded-md hover:bg-gray-800">
                      <BookOpen className="h-4 w-4 mr-3 text-gray-400" />
                      <span>내 학습</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/dashboard/community" className="flex items-center p-2 rounded-md hover:bg-gray-800">
                      <MessageSquare className="h-4 w-4 mr-3 text-gray-400" />
                      <span>내 커뮤니티</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/dashboard/coding-test" className="flex items-center p-2 rounded-md hover:bg-gray-800">
                      <Code className="h-4 w-4 mr-3 text-gray-400" />
                      <span>코딩테스트</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/user/dashboard/likes" className="flex items-center p-2 rounded-md hover:bg-gray-800">
                      <Heart className="h-4 w-4 mr-3 text-gray-400" />
                      <span>좋아요</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setActiveTab("coupons")
                        setActiveMenu("coupons")
                      }}
                      className={`flex items-center p-2 rounded-md w-full text-left ${
                        activeMenu === "coupons" ? "bg-gray-800 text-red-500" : "hover:bg-gray-800"
                      }`}
                    >
                      <Award className={`h-4 w-4 mr-3 ${activeMenu === "coupons" ? "text-red-500" : "text-gray-400"}`} />
                      <span>쿠폰</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="account" className="pt-6 space-y-6">
                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">내 프로필</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">이미지</div>
                      <div className="col-span-1">
                        <Image
                          src={user?.profileUrl || "/placeholder.svg?height=80&width=80"}
                          alt="프로필 이미지"
                          width={80}
                          height={80}
                          className="rounded-full bg-gray-800"
                        />
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">닉네임</div>
                      <div className="col-span-1">{user?.nickname || "사용자"}</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">프로필 주소</div>
                      <div className="col-span-1 text-sm">inflearn.com/users/@{user?.username || "user"}</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">자기소개</div>
                      <div className="col-span-1 text-sm">{user?.bio || "자기소개를 작성해주세요."}</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">기본 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">이메일</div>
                      <div className="col-span-1">{user?.email || "이메일을 등록해주세요."}</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">비밀번호</div>
                      <div className="col-span-1">••••••••••</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="text-sm text-gray-400">휴대폰 번호</div>
                      <div className="col-span-1">{user?.phone || "휴대폰 번호를 등록해주세요."}</div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                          수정
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="purchases">
                <PurchasesComponent />
              </TabsContent>
              <TabsContent value="coupons">
                <CouponList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

