"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/user/ui/card"
import { Badge } from "@/components/user/ui/badge"
import { Progress } from "@/components/user/ui/progress"
import { Button } from "@/components/user/ui/button"
import {
  Play,
  Clock,
  BarChart3,
  Calendar,
  BookOpen,
  ChevronRight,
  Timer,
  Trophy,
  ChevronLeft,
  User,
  Bell,
  Search,
} from "lucide-react"
import { Skeleton } from "@/components/user/ui/skeleton"
import userStore from "@/app/auth/userStore"
import UserHeader from "@/components/user/user-header"
import NetflixHeader from "@/components/netflix-header"

interface Course {
  id: number
  title: string
  instructor: string
  progress: number | null
  lastAccessed: string | null
  imageUrl: string
  slug: string
  totalLectures: number
  completedLectures: number
  nextLecture?: string
  estimatedTimeLeft?: string
  category: string
  lastStudyDate: string
  completed?: boolean | null
  completedDate?: string | null
  certificateAvailable?: boolean | null
  courseStatus?: string
  courseProgress?: string
  rating?: number
  students?: number
  level?: string
  relatedTo?: string
}

interface LearningStats {
  weeklyStudyTime: number
  monthlyStudyTime: number
  completionRate: number
  totalCertificates: number
}

interface LearningGoals {
  weekly: {
    target: number
    current: number
    progress: number
  }
  courses: {
    target: number
    current: number
    progress: number
  }
}

interface DashboardData {
  lastLearningCourse: Course | null
  enrolledCourses: Course[]
  completedCourses: Course[]
  recommendedCourses: Course[]
  learningStats: LearningStats
  learningGoals: LearningGoals
  attendanceData: {
    month: number
    days: number[]
  }[]
  studyTimeByMonth: {
    month: string
    hours: number
  }[]
  todoCount: number
  noteCount: number
  upcomingEvents: {
    id: number
    title: string
    date: string
    type: string
  }[]
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  unit = "",
}: { title: string; value: number; icon: any; unit?: string }) => (
  <Card className="bg-gray-900 border-gray-800 shadow-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-white">
            {value}
            {unit}
          </h3>
        </div>
        <div className="p-3 bg-red-900/30 rounded-full">
          <Icon className="w-6 h-6 text-red-500" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function DashboardPage() {
  const { user } = userStore()
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    lastLearningCourse: null,
    enrolledCourses: [],
    completedCourses: [],
    recommendedCourses: [],
    learningStats: {
      weeklyStudyTime: 0,
      monthlyStudyTime: 0,
      completionRate: 0,
      totalCertificates: 0
    },
    learningGoals: {
      weekly: { target: 0, current: 0, progress: 0 },
      courses: { target: 0, current: 0, progress: 0 }
    },
    attendanceData: [],
    studyTimeByMonth: [],
    todoCount: 0,
    noteCount: 0,
    upcomingEvents: []
  })
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        console.log(user.id)
        const response = await fetch(`/api/user/dashboard?userId=${user.id}`)
        console.log(response)
        if (!response.ok) throw new Error("Failed to fetch dashboard data")
        const result = await response.json()
        
        // 데이터 유효성 검사
        if (!result || typeof result !== 'object') {
          throw new Error("Invalid data format")
        }

        // 필수 필드가 없는 경우 기본값 설정
        const validatedData = {
          lastLearningCourse: result.lastLearningCourse || null,
          enrolledCourses: Array.isArray(result.enrolledCourses) ? result.enrolledCourses : [],
          completedCourses: Array.isArray(result.completedCourses) ? result.completedCourses : [],
          recommendedCourses: Array.isArray(result.recommendedCourses) ? result.recommendedCourses : [],
          learningStats: {
            weeklyStudyTime: Number(result.learningStats?.weeklyStudyTime) || 0,
            monthlyStudyTime: Number(result.learningStats?.monthlyStudyTime) || 0,
            completionRate: Number(result.learningStats?.completionRate) || 0,
            totalCertificates: Number(result.learningStats?.totalCertificates) || 0
          },
          learningGoals: {
            weekly: {
              target: Number(result.learningGoals?.weekly?.target) || 0,
              current: Number(result.learningGoals?.weekly?.current) || 0,
              progress: Number(result.learningGoals?.weekly?.progress) || 0
            },
            courses: {
              target: Number(result.learningGoals?.courses?.target) || 0,
              current: Number(result.learningGoals?.courses?.current) || 0,
              progress: Number(result.learningGoals?.courses?.progress) || 0
            }
          },
          attendanceData: Array.isArray(result.attendanceData) ? result.attendanceData : [],
          studyTimeByMonth: Array.isArray(result.studyTimeByMonth) ? result.studyTimeByMonth : [],
          todoCount: Number(result.todoCount) || 0,
          noteCount: Number(result.noteCount) || 0,
          upcomingEvents: Array.isArray(result.upcomingEvents) ? result.upcomingEvents : []
        }

        setDashboardData(validatedData)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user?.id])

  const prevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 bg-gray-200 mb-2" />
            <Skeleton className="h-4 w-96 bg-gray-200" />
          </div>

          <Skeleton className="h-[300px] w-full bg-gray-200 rounded-xl mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <Skeleton className="h-[200px] w-full bg-gray-200 rounded-lg" />
            <Skeleton className="h-[200px] w-full bg-gray-200 rounded-lg" />
          </div>

          <Skeleton className="h-8 w-48 bg-gray-200 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[280px] w-full bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (!dashboardData.lastLearningCourse) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-lg">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-800">데이터를 불러올 수 없습니다</h2>
              <p className="text-gray-500 mb-4">대시보드 정보를 가져오는 중 문제가 발생했습니다.</p>
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                다시 시도하기
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const {
    lastLearningCourse,
    enrolledCourses,
    completedCourses,
    recommendedCourses,
    learningStats,
    learningGoals,
    attendanceData,
    studyTimeByMonth,
  } = dashboardData

  // 현재 월의 일수 계산
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)

  // 현재 월의 첫 날의 요일 (0: 일요일, 1: 월요일, ...)
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay()

  // 달력 날짜 배열 생성
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // 현재 월의 출석 데이터
  const currentMonthAttendance = dashboardData?.attendanceData?.find((data) => data.month === currentMonth)?.days || []

  return (
    <main className="min-h-screen bg-black text-white">
      <NetflixHeader />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-4 mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white">{user?.nickname || "사용자"}</h2>
                  <p className="text-sm text-gray-400">@{user?.username || "username"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center border-t border-b border-gray-800 py-3 mb-4">
                <div>
                  <p className="text-xs text-gray-400">수강과목</p>
                  <p className="font-bold text-white">{enrolledCourses.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">수강일수</p>
                  <p className="font-bold text-white">{learningStats.monthlyStudyTime}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">강의평점</p>
                  <p className="font-bold text-white">-</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/dashboard" className="flex items-center text-red-500 font-medium">
                  <span className="text-sm">대시보드</span>
                </Link>
                <Link href="/courses" className="flex items-center text-gray-400 hover:text-red-500">
                  <span className="text-sm">코드랩</span>
                </Link>
                <Link href="/schedule" className="flex items-center text-gray-400 hover:text-red-500">
                  <span className="text-sm">게시글</span>
                </Link>
                <Link href="/settings" className="flex items-center text-gray-400 hover:text-red-500">
                  <span className="text-sm">블로그</span>
                </Link>
              </div>
            </div>

            {/* 최근 학습 강의 */}
            {lastLearningCourse && (
              <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-white text-sm">최근 학습 강의</h2>
                  <Badge className="bg-red-900/50 text-red-400 hover:bg-red-900/70">진행중</Badge>
                </div>

                <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                  <Image
                    src={lastLearningCourse.imageUrl || "/placeholder.svg?height=200&width=400&query=course thumbnail"}
                    alt={lastLearningCourse.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <h3 className="text-white text-sm font-medium line-clamp-2">{lastLearningCourse.title}</h3>
                  </div>
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 shadow-lg transform hover:scale-105 transition-transform"
                    >
                      <Play className="h-4 w-4 mr-1" /> 이어보기
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">진행률</span>
                    <span className="text-gray-300">{lastLearningCourse.progress}%</span>
                  </div>
                  <Progress value={lastLearningCourse.progress} className="h-2 bg-gray-800" />
                </div>

                <div className="text-xs text-gray-400 space-y-1">
                  <div className="flex items-center">
                    <BookOpen className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                    <span>
                      {lastLearningCourse.completedLectures}/{lastLearningCourse.totalLectures} 강의 완료
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                    <span>최근 학습: {lastLearningCourse.lastStudyDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Timer className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                    <span>남은 시간: {lastLearningCourse.estimatedTimeLeft}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 출석 캘린더 */}
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-sm">학습 캘린더</h2>
                <div className="flex items-center space-x-2">
                  <button onClick={prevMonth} className="p-1 rounded hover:bg-gray-800">
                    <ChevronLeft className="h-4 w-4 text-gray-400" />
                  </button>
                  <span className="text-sm text-gray-300">
                    {currentYear}년 {currentMonth}월
                  </span>
                  <button onClick={nextMonth} className="p-1 rounded hover:bg-gray-800">
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
                  <div key={i} className="text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* 첫 날 이전의 빈 칸 */}
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={`empty-${i}`} className="h-8"></div>
                ))}

                {/* 날짜 */}
                {calendarDays.map((day) => {
                  const isToday =
                    day === new Date().getDate() &&
                    currentMonth === new Date().getMonth() + 1 &&
                    currentYear === new Date().getFullYear()
                  const hasAttendance = currentMonthAttendance.includes(day)

                  return (
                    <div
                      key={day}
                      className={`h-8 flex items-center justify-center text-xs rounded-full
                        ${isToday ? "bg-red-900 text-red-400 font-bold" : ""}
                        ${hasAttendance && !isToday ? "bg-gray-800" : ""}
                      `}
                    >
                      {day}
                      {hasAttendance && <div className="absolute w-1 h-1 bg-red-500 rounded-full -mt-4"></div>}
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-800 rounded-full mr-1"></div>
                    <span>학습일: {currentMonthAttendance.length}일</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-900 rounded-full mr-1"></div>
                    <span>오늘</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 학습 통계 */}
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-sm">학습 통계</h2>
                <Link href="/dashboard/stats" className="text-xs text-red-500 hover:underline">
                  전체 보기
                </Link>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">총 학습 시간</span>
                    <span className="text-gray-300 font-medium">{learningStats.monthlyStudyTime}시간</span>
                  </div>
                  <Progress value={learningStats.monthlyStudyTime * 2} className="h-2 bg-gray-800" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">강의 완료율</span>
                    <span className="text-gray-300 font-medium">{Math.round(learningStats.completionRate)}%</span>
                  </div>
                  <Progress value={learningStats.completionRate} className="h-2 bg-gray-800" />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">주간 목표 달성</span>
                    <span className="text-gray-300 font-medium">{learningGoals.weekly.progress}%</span>
                  </div>
                  <Progress value={learningGoals.weekly.progress} className="h-2 bg-gray-800" />
                </div>
              </div>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2">
            {/* 학습 통계 카드 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatsCard
                title="주간 학습 시간"
                value={dashboardData.learningStats.weeklyStudyTime}
                icon={Clock}
                unit="시간"
              />
              <StatsCard
                title="월간 학습 시간"
                value={dashboardData.learningStats.monthlyStudyTime}
                icon={Calendar}
                unit="시간"
              />
              <StatsCard
                title="강의 완료율"
                value={Math.round(dashboardData.learningStats.completionRate)}
                icon={BarChart3}
                unit="%"
              />
              <StatsCard
                title="수료한 강의"
                value={dashboardData.learningStats.totalCertificates}
                icon={Trophy}
                unit="개"
              />
            </div>

            {/* 학습 그래프 */}
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-sm">월별 학습 시간</h2>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-red-900/50 text-red-400">최근 매핑</Badge>
                  <Badge className="bg-green-900/50 text-green-400">보유중</Badge>
                </div>
              </div>

              <div className="h-48 flex items-end justify-between">
                {(dashboardData?.studyTimeByMonth || []).map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className="w-8 bg-red-600 rounded-t-sm"
                      style={{ height: `${Math.min(item.hours * 5, 100)}%` }}
                    ></div>
                    <span className="text-xs text-gray-400 mt-1">{item.month}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800">
                <div className="text-xs text-gray-400">월별 학습 시간을 확인하고 꾸준한 학습 습관을 만들어보세요.</div>
              </div>
            </div>

            {/* 수강 중인 강의 */}
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-sm">수강 중인 강의</h2>
                <Link href="/courses" className="text-xs text-red-500 hover:underline">
                  전체 보기
                </Link>
              </div>

              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map((course, index) => (
                  <div
                    key={index}
                    className="flex border border-gray-800 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    <div className="w-1/4 relative">
                      <Image
                        src={course.imageUrl || "/placeholder.svg?height=100&width=100&query=course thumbnail"}
                        alt={course.title}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="w-3/4 p-3">
                      <h3 className="text-sm font-medium text-white line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-gray-400 mb-2">{course.instructor}</p>

                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">
                          {course.completedLectures}/{course.totalLectures} 강의
                        </span>
                        <span className="text-gray-300">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-1.5 bg-gray-800 mb-2" />

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">{course.lastStudyDate}</span>
                        <Link href={`/course/${course.slug}/learn`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs border-gray-700 text-gray-300 hover:bg-gray-800">
                            이어보기
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {enrolledCourses.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-10 w-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">수강 중인 강의가 없습니다.</p>
                    <Link href="/courses">
                      <Button className="mt-3 bg-red-600 hover:bg-red-700">강의 둘러보기</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* 추천 강의 */}
            <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-white text-sm">추천 강의</h2>
                <Link href="/courses/recommended" className="text-xs text-red-500 hover:underline">
                  전체 보기
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedCourses.slice(0, 4).map((course, index) => (
                  <div
                    key={index}
                    className="border border-gray-800 rounded-lg overflow-hidden hover:shadow-sm transition-shadow"
                  >
                    <div className="aspect-video relative">
                      <Image
                        src={course.imageUrl || "/placeholder.svg?height=150&width=300&query=course thumbnail"}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-gray-800/80 text-xs text-white backdrop-blur-sm">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-white line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-gray-400 mb-2">{course.instructor}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-yellow-500 mr-1">★</span>
                          <span className="text-xs text-gray-700">{course.rating}</span>
                        </div>
                        <Link href={`/course/${course.slug}`}>
                          <Button size="sm" variant="outline" className="h-7 text-xs border-gray-700 text-gray-300 hover:bg-gray-800">
                            자세히 보기
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
