"use client"

import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, Award, Calendar, Play, CheckCircle2 } from "lucide-react"
import NetflixHeader from "@/components/netflix-header"

export default function DashboardPage() {
  // 예시 데이터
  const enrolledCourses = [
    {
      id: "1",
      title: "비전공자도 이해할 수 있는 Docker 입문/실전",
      instructor: "JSCODE 박재성",
      progress: 35,
      lastAccessed: "2023년 10월 27일",
      image: "/placeholder.svg?height=160&width=280",
    },
    {
      id: "2",
      title: "데이터 분석 입문자를 위한 기초 파이썬 with ChatGPT",
      instructor: "김현다",
      progress: 68,
      lastAccessed: "2023년 10월 25일",
      image: "/placeholder.svg?height=160&width=280",
    },
    {
      id: "3",
      title: "비전공자도 합격하는 개발자 이력서/포트폴리오 작성법",
      instructor: "JSCODE 박재성",
      progress: 12,
      lastAccessed: "2023년 10월 20일",
      image: "/placeholder.svg?height=160&width=280",
    },
  ]

  const completedCourses = [
    {
      id: "4",
      title: "[2024 업데이트] UX/UI 시작하기 : Figma 입문 (Inflearn Original)",
      instructor: "인프런",
      completedDate: "2023년 9월 15일",
      image: "/placeholder.svg?height=160&width=280",
    },
  ]

  const upcomingEvents = [
    {
      id: "1",
      title: "Docker 네트워킹 심화 라이브 강의",
      date: "2023년 11월 5일",
      time: "오후 7:00 - 9:00",
      instructor: "JSCODE 박재성",
    },
    {
      id: "2",
      title: "취업 준비생을 위한 포트폴리오 리뷰 세션",
      date: "2023년 11월 12일",
      time: "오후 2:00 - 4:00",
      instructor: "커리어코치 김멘토",
    },
  ]

  const achievements = [
    {
      id: "1",
      title: "첫 강의 완료",
      description: "처음으로 강의를 100% 완료했습니다",
      date: "2023년 9월 15일",
      icon: <CheckCircle2 className="h-8 w-8 text-green-500" />,
    },
    {
      id: "2",
      title: "학습 스트릭 7일",
      description: "7일 연속으로 학습했습니다",
      date: "2023년 10월 20일",
      icon: <Award className="h-8 w-8 text-yellow-500" />,
    },
  ]

  return (
    <main className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">안녕하세요, 사용자님!</h1>
          <p className="text-gray-400">오늘도 새로운 지식을 쌓아보세요.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">학습 중인 강의</CardTitle>
              <CardDescription className="text-gray-400">현재 수강 중인 강의 수</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">{enrolledCourses.length}</div>
                <BookOpen className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">총 학습 시간</CardTitle>
              <CardDescription className="text-gray-400">이번 달 학습한 시간</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">24시간 36분</div>
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">완료한 강의</CardTitle>
              <CardDescription className="text-gray-400">100% 수료한 강의 수</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">{completedCourses.length}</div>
                <Award className="h-6 w-6 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="in-progress" className="mb-8">
          <TabsList className="bg-gray-800 mb-4">
            <TabsTrigger value="in-progress" className="data-[state=active]:bg-gray-700">
              학습 중인 강의
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-gray-700">
              완료한 강의
            </TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress" className="mt-0">
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        width={280}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-lg mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{course.instructor}</p>
                        <div className="flex items-center mb-2">
                          <Progress value={course.progress} className="h-2 flex-1 bg-gray-700" />
                          <span className="ml-2 text-sm text-gray-400">{course.progress}%</span>
                        </div>
                        <p className="text-xs text-gray-500">마지막 학습: {course.lastAccessed}</p>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Link href={`/user/course/${course.id}/learn`}>
                          <Button className="bg-red-600 hover:bg-red-700">
                            <Play className="h-4 w-4 mr-1" /> 이어서 학습하기
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <div className="space-y-4">
              {completedCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/4">
                      <Image
                        src={course.image || "/placeholder.svg"}
                        alt={course.title}
                        width={280}
                        height={160}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <h3 className="font-medium text-lg">{course.title}</h3>
                          <Badge className="ml-2 bg-green-600">완료</Badge>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{course.instructor}</p>
                        <p className="text-xs text-gray-500">완료일: {course.completedDate}</p>
                      </div>
                      <div className="flex justify-end mt-4">
                        <Link href={`/user/course/${course.id}/learn`}>
                          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                            다시 보기
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>예정된 이벤트</span>
                <Calendar className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="bg-gray-800 rounded-lg p-3">
                      <h4 className="font-medium mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-400 mb-1">{event.instructor}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>
                          {event.date}, {event.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">예정된 이벤트가 없습니다</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800 text-white">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>나의 성취</span>
                <Award className="h-5 w-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-gray-800 rounded-lg p-3 flex items-center">
                      <div className="mr-3">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{achievement.title}</h4>
                        <p className="text-sm text-gray-400 mb-1">{achievement.description}</p>
                        <p className="text-xs text-gray-500">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">아직 성취한 업적이 없습니다</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

