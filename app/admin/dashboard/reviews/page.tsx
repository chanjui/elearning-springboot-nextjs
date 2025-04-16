"use client"

import { useState } from "react"
import { BookOpen, Calendar, Check, Clock, Eye, FileText, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/user/ui/card"
import { Button } from "@/components/user/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/user/ui/avatar"
import { Badge } from "@/components/user/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/user/ui/tabs"      
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/user/ui/dialog"
import { Textarea } from "@/components/user/ui/textarea"
import { Label } from "@/components/user/ui/label"

type CourseReview = {
  id: string
  title: string
  instructor: string
  instructorEmail: string
  category: string
  description: string
  price: number
  submittedAt: string
  status: "pending" | "approved" | "rejected"
  sections: number
  videos: number
  duration: number
}

const pendingReviews: CourseReview[] = [
  {
    id: "1",
    title: "Spring Boot 실전 프로젝트",
    instructor: "박준호",
    instructorEmail: "park@example.com",
    category: "백엔드",
    description:
      "Spring Boot를 활용한 실전 프로젝트 개발 과정을 다룹니다. JPA, Spring Security, REST API 개발 등 실무에서 필요한 기술을 모두 배울 수 있습니다.",
    price: 160000,
    submittedAt: "2023-06-10",
    status: "pending",
    sections: 8,
    videos: 65,
    duration: 1850,
  },
  {
    id: "2",
    title: "GraphQL API 개발",
    instructor: "박준호",
    instructorEmail: "park@example.com",
    category: "백엔드",
    description:
      "GraphQL을 활용한 효율적인 API 개발 방법을 배웁니다. REST API의 한계를 넘어 클라이언트가 필요한 데이터만 요청할 수 있는 유연한 API를 구축하는 방법을 학습합니다.",
    price: 145000,
    submittedAt: "2023-06-20",
    status: "pending",
    sections: 6,
    videos: 48,
    duration: 1420,
  },
  {
    id: "3",
    title: "React Native 모바일 앱 개발",
    instructor: "송태준",
    instructorEmail: "song@example.com",
    category: "모바일",
    description:
      "React Native를 사용하여 iOS와 Android 앱을 동시에 개발하는 방법을 배웁니다. 하나의 코드베이스로 두 플랫폼을 모두 지원하는 앱을 만드는 기술을 습득합니다.",
    price: 155000,
    submittedAt: "2023-06-25",
    status: "pending",
    sections: 10,
    videos: 72,
    duration: 2100,
  },
  {
    id: "4",
    title: "Next.js 13 마스터 클래스",
    instructor: "이지은",
    instructorEmail: "lee@example.com",
    category: "프론트엔드",
    description:
      "Next.js 13의 새로운 기능과 App Router를 활용한 최신 웹 개발 방법론을 배웁니다. SSR, SSG, ISR 등 다양한 렌더링 전략과 최적화 기법을 다룹니다.",
    price: 135000,
    submittedAt: "2023-06-28",
    status: "pending",
    sections: 9,
    videos: 68,
    duration: 1950,
  },
  {
    id: "5",
    title: "Kubernetes 실전 가이드",
    instructor: "조민지",
    instructorEmail: "jo@example.com",
    category: "데브옵스",
    description:
      "Kubernetes를 활용한 컨테이너 오케스트레이션 방법을 배웁니다. 실제 프로덕션 환경에서 마이크로서비스 아키텍처를 구축하고 관리하는 방법을 학습합니다.",
    price: 175000,
    submittedAt: "2023-06-30",
    status: "pending",
    sections: 12,
    videos: 85,
    duration: 2400,
  },
  {
    id: "6",
    title: "TensorFlow와 딥러닝 기초",
    instructor: "최유진",
    instructorEmail: "choi@example.com",
    category: "데이터 사이언스",
    description:
      "TensorFlow를 활용한 딥러닝 모델 개발 방법을 배웁니다. 인공신경망의 기초부터 CNN, RNN 등 다양한 모델 아키텍처를 구현하는 방법을 학습합니다.",
    price: 165000,
    submittedAt: "2023-07-02",
    status: "pending",
    sections: 11,
    videos: 78,
    duration: 2250,
  },
  {
    id: "7",
    title: "Svelte와 SvelteKit 완벽 가이드",
    instructor: "이지은",
    instructorEmail: "lee@example.com",
    category: "프론트엔드",
    description:
      "Svelte와 SvelteKit을 활용한 현대적인 웹 개발 방법을 배웁니다. 적은 코드로 높은 성능을 내는 Svelte의 철학과 SvelteKit의 강력한 기능을 학습합니다.",
    price: 125000,
    submittedAt: "2023-07-05",
    status: "pending",
    sections: 7,
    videos: 55,
    duration: 1650,
  },
  {
    id: "8",
    title: "Go 언어 백엔드 개발",
    instructor: "박준호",
    instructorEmail: "park@example.com",
    category: "백엔드",
    description:
      "Go 언어를 활용한 고성능 백엔드 서비스 개발 방법을 배웁니다. 동시성 프로그래밍과 메모리 효율적인 코드 작성법을 학습합니다.",
    price: 150000,
    submittedAt: "2023-07-08",
    status: "pending",
    sections: 9,
    videos: 70,
    duration: 2000,
  },
]

const approvedReviews: CourseReview[] = [
  {
    id: "9",
    title: "Python 데이터 분석",
    instructor: "최유진",
    instructorEmail: "choi@example.com",
    category: "데이터 사이언스",
    price: 140000,
    description:
      "Python을 활용한 데이터 분석 방법을 배웁니다. Pandas, NumPy, Matplotlib 등 주요 라이브러리를 활용한 데이터 처리와 시각화 기법을 학습합니다.",
    submittedAt: "2023-01-30",
    status: "approved",
    sections: 10,
    videos: 75,
    duration: 2200,
  },
  {
    id: "10",
    title: "Docker & Kubernetes 실전",
    instructor: "조민지",
    instructorEmail: "jo@example.com",
    category: "데브옵스",
    price: 170000,
    description:
      "Docker와 Kubernetes를 활용한 컨테이너화 및 오케스트레이션 방법을 배웁니다. CI/CD 파이프라인 구축과 클라우드 환경에서의 배포 전략을 학습합니다.",
    submittedAt: "2022-12-15",
    status: "approved",
    sections: 12,
    videos: 88,
    duration: 2500,
  },
]

const rejectedReviews: CourseReview[] = [
  {
    id: "11",
    title: "블록체인 기초와 이더리움 개발",
    instructor: "김민수",
    instructorEmail: "kim@example.com",
    category: "블록체인",
    price: 190000,
    description:
      "블록체인의 기초 개념과 이더리움 스마트 컨트랙트 개발 방법을 배웁니다. Solidity 언어를 활용한 DApp 개발 과정을 학습합니다.",
    submittedAt: "2023-05-20",
    status: "rejected",
    sections: 8,
    videos: 60,
    duration: 1800,
  },
  {
    id: "12",
    title: "Unity 3D 게임 개발",
    instructor: "정승호",
    instructorEmail: "jung@example.com",
    category: "게임 개발",
    price: 180000,
    description:
      "Unity 엔진을 활용한 3D 게임 개발 방법을 배웁니다. C# 프로그래밍과 게임 물리, 애니메이션, UI 개발 등을 학습합니다.",
    submittedAt: "2023-04-15",
    status: "rejected",
    sections: 14,
    videos: 95,
    duration: 2800,
  },
]

export default function ReviewsPage() {
  // 모달 상태 관리
  const [selectedCourse, setSelectedCourse] = useState<CourseReview | null>(null)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const [reviewFeedback, setReviewFeedback] = useState("")
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null)
  const [isCourseDetailOpen, setIsCourseDetailOpen] = useState(false)

  const handleReviewAction = () => {
    // 실제 구현에서는 API 호출을 통해 상태 변경
    console.log(
      `Course ${selectedCourse?.id} ${reviewAction === "approve" ? "approved" : "rejected"} with feedback: ${reviewFeedback}`,
    )
    setIsReviewDialogOpen(false)
    setReviewFeedback("")
    setReviewAction(null)
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}시간 ${mins}분`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">강의 심사</h2>
        <p className="text-muted-foreground">새로 등록된 강의를 검토하고 승인 또는 거부하세요.</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="relative">
            대기 중
            <Badge variant="secondary" className="ml-2 px-1.5 py-0.5">
              {pendingReviews.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved">승인됨</TabsTrigger>
          <TabsTrigger value="rejected">거부됨</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingReviews.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant="secondary">검토 필요</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>제출일: {new Date(course.submittedAt).toLocaleDateString("ko-KR")}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/abstract-geometric-shapes.png?height=32&width=32&query=${course.instructor}`}
                          alt={course.instructor}
                        />
                        <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground">{course.instructorEmail}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{course.sections} 섹션</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{course.videos} 강의</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{formatDuration(course.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="h-5 px-1.5 py-0">
                          {course.category}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>

                    <div className="font-medium">
                      {new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                      }).format(course.price)}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCourse(course)
                      setIsCourseDetailOpen(true)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    상세 보기
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course)
                        setReviewAction("reject")
                        setIsReviewDialogOpen(true)
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      거부
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setSelectedCourse(course)
                        setReviewAction("approve")
                        setIsReviewDialogOpen(true)
                      }}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      승인
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {approvedReviews.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant="default">승인됨</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>제출일: {new Date(course.submittedAt).toLocaleDateString("ko-KR")}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/abstract-geometric-shapes.png?height=32&width=32&query=${course.instructor}`}
                          alt={course.instructor}
                        />
                        <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground">{course.instructorEmail}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{course.sections} 섹션</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{course.videos} 강의</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{formatDuration(course.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="h-5 px-1.5 py-0">
                          {course.category}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedCourse(course)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    상세 보기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rejectedReviews.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge variant="destructive">거부됨</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>제출일: {new Date(course.submittedAt).toLocaleDateString("ko-KR")}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`/abstract-geometric-shapes.png?height=32&width=32&query=${course.instructor}`}
                          alt={course.instructor}
                        />
                        <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{course.instructor}</p>
                        <p className="text-xs text-muted-foreground">{course.instructorEmail}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{course.sections} 섹션</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{course.videos} 강의</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{formatDuration(course.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="h-5 px-1.5 py-0">
                          {course.category}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-3">{course.description}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedCourse(course)
                    }}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    상세 보기
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 강의 상세 보기 모달 */}
      <Dialog open={isCourseDetailOpen} onOpenChange={setIsCourseDetailOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>강의 상세 정보</DialogTitle>
            <DialogDescription>강의의 상세 정보와 커리큘럼을 확인합니다.</DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-md bg-muted h-40 w-64 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-semibold">{selectedCourse.title}</h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={`/abstract-geometric-shapes.png?height=24&width=24&query=${selectedCourse.instructor}`}
                        alt={selectedCourse.instructor}
                      />
                      <AvatarFallback>{selectedCourse.instructor.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{selectedCourse.instructor}</span>
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {selectedCourse.category}
                  </Badge>
                  <div className="text-sm font-medium">
                    {new Intl.NumberFormat("ko-KR", {
                      style: "currency",
                      currency: "KRW",
                    }).format(selectedCourse.price)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">강의 설명</h4>
                <p className="text-sm text-muted-foreground">{selectedCourse.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">섹션 수</h4>
                  <p className="text-2xl font-bold">{selectedCourse.sections}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">강의 수</h4>
                  <p className="text-2xl font-bold">{selectedCourse.videos}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">총 시간</h4>
                  <p className="text-2xl font-bold">{formatDuration(selectedCourse.duration)}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2">커리큘럼</h4>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {/* 섹션 1 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">1. 강의 소개 및 환경 설정</h5>
                      <span className="text-xs text-muted-foreground">3개 강의 · 25분</span>
                    </div>
                    <div className="space-y-1 pl-4">
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>1.1 강의 소개 및 목표</span>
                        <span className="text-xs text-muted-foreground ml-auto">8분</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>1.2 개발 환경 설정</span>
                        <span className="text-xs text-muted-foreground ml-auto">10분</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>1.3 프로젝트 구조 설명</span>
                        <span className="text-xs text-muted-foreground ml-auto">7분</span>
                      </div>
                    </div>
                  </div>

                  {/* 섹션 2 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">2. 기본 개념 학습</h5>
                      <span className="text-xs text-muted-foreground">4개 강의 · 45분</span>
                    </div>
                    <div className="space-y-1 pl-4">
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>2.1 핵심 개념 이해하기</span>
                        <span className="text-xs text-muted-foreground ml-auto">12분</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>2.2 컴포넌트 구조</span>
                        <span className="text-xs text-muted-foreground ml-auto">15분</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>2.3 상태 관리 기초</span>
                        <span className="text-xs text-muted-foreground ml-auto">10분</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>2.4 이벤트 처리</span>
                        <span className="text-xs text-muted-foreground ml-auto">8분</span>
                      </div>
                    </div>
                  </div>

                  {/* 섹션 3 */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-medium">3. 실전 프로젝트</h5>
                      <span className="text-xs text-muted-foreground">5개 강의 · 60분</span>
                    </div>
                    <div className="space-y-1 pl-4">
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>3.1 프로젝트 기획 및 설계</span>
                        <span className="text-xs text-muted-foreground ml-auto">10분</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>3.2 기본 구조 구현</span>
                        <span className="text-xs text-muted-foreground ml-auto">12분</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>3.3 핵심 기능 개발</span>
                        <span className="text-xs text-muted-foreground ml-auto">15분</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>3.4 UI/UX 개선</span>
                        <span className="text-xs text-muted-foreground ml-auto">13분</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>3.5 최종 배포 및 마무리</span>
                        <span className="text-xs text-muted-foreground ml-auto">10분</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCourseDetailOpen(false)}>
              닫기
            </Button>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => {
                  setIsCourseDetailOpen(false)
                  setReviewAction("reject")
                  setIsReviewDialogOpen(true)
                }}
              >
                <X className="mr-2 h-4 w-4" />
                거부
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setIsCourseDetailOpen(false)
                  setReviewAction("approve")
                  setIsReviewDialogOpen(true)
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                승인
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 강의 심사 다이얼로그 */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{reviewAction === "approve" ? "강의 승인" : "강의 거부"}</DialogTitle>
            <DialogDescription>
              {reviewAction === "approve"
                ? "이 강의를 승인하시겠습니까? 승인 후 강의가 플랫폼에 공개됩니다."
                : "이 강의를 거부하시겠습니까? 거부 사유를 작성해주세요."}
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="py-2">
              <h3 className="font-medium">{selectedCourse.title}</h3>
              <p className="text-sm text-muted-foreground">강사: {selectedCourse.instructor}</p>
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="feedback">피드백</Label>
              <Textarea
                id="feedback"
                placeholder={
                  reviewAction === "approve" ? "승인 메시지를 입력하세요 (선택사항)" : "거부 사유를 입력하세요"
                }
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                rows={5}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
              취소
            </Button>
            <Button
              variant={reviewAction === "approve" ? "default" : "destructive"}
              onClick={handleReviewAction}
              disabled={reviewAction === "reject" && !reviewFeedback.trim()}
            >
              {reviewAction === "approve" ? "승인하기" : "거부하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
