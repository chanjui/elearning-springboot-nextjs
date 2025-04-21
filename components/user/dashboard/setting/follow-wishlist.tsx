"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/user/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/user/ui/card"
import { Button } from "@/components/user/ui/button"
import { Heart, Bookmark, ExternalLink, Star } from "lucide-react"
import { Badge } from "@/components/user/ui/badge"

// Mock data for demonstration
const MOCK_INSTRUCTORS = [
  {
    id: 1,
    name: "김개발",
    profileUrl: "/placeholder.svg?height=80&width=80",
    title: "프론트엔드 개발자",
    courseCount: 5,
    rating: 4.8,
  },
  {
    id: 2,
    name: "이코딩",
    profileUrl: "/placeholder.svg?height=80&width=80",
    title: "백엔드 개발자",
    courseCount: 3,
    rating: 4.9,
  },
  {
    id: 3,
    name: "박자바",
    profileUrl: "/placeholder.svg?height=80&width=80",
    title: "풀스택 개발자",
    courseCount: 7,
    rating: 4.7,
  },
]

const MOCK_COURSES = [
  {
    id: 1,
    title: "React 완벽 마스터하기",
    instructor: "김개발",
    thumbnailUrl: "/placeholder.svg?height=120&width=200",
    price: 55000,
    discountPrice: 49500,
    rating: 4.8,
    level: "중급",
  },
  {
    id: 2,
    title: "Node.js 백엔드 개발",
    instructor: "이코딩",
    thumbnailUrl: "/placeholder.svg?height=120&width=200",
    price: 66000,
    discountPrice: 59400,
    rating: 4.9,
    level: "고급",
  },
  {
    id: 3,
    title: "TypeScript 기초부터 실전까지",
    instructor: "박자바",
    thumbnailUrl: "/placeholder.svg?height=120&width=200",
    price: 44000,
    discountPrice: 39600,
    rating: 4.7,
    level: "초급",
  },
]

export default function FollowWishlist() {
  const [activeTab, setActiveTab] = useState("follow")

  // 실제 구현에서는 API 호출로 데이터를 가져올 것입니다
  const [instructors, setInstructors] = useState(MOCK_INSTRUCTORS)
  const [courses, setCourses] = useState(MOCK_COURSES)

  // 강사 팔로우 취소
  const handleUnfollow = async (instructorId: number) => {
    try {
      // API 호출 (실제 구현 시)
      // await fetch(`/api/instructors/${instructorId}/unfollow`, {
      //   method: "POST",
      //   credentials: "include",
      // });

      // 성공 시 UI 업데이트
      setInstructors(instructors.filter((instructor) => instructor.id !== instructorId))
    } catch (error) {
      console.error("팔로우 취소 실패:", error)
      alert("팔로우 취소 중 오류가 발생했습니다.")
    }
  }

  // 위시리스트에서 제거
  const handleRemoveFromWishlist = async (courseId: number) => {
    try {
      // API 호출 (실제 구현 시)
      // await fetch(`/api/courses/${courseId}/wishlist`, {
      //   method: "DELETE",
      //   credentials: "include",
      // });

      // 성공 시 UI 업데이트
      setCourses(courses.filter((course) => course.id !== courseId))
    } catch (error) {
      console.error("위시리스트 제거 실패:", error)
      alert("위시리스트에서 제거 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg">팔로우/위시리스트</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger
                value="follow"
                className={`data-[state=active]:bg-gray-700 ${activeTab === "follow" ? "text-red-500" : "text-gray-400"}`}
              >
                <Heart className="h-4 w-4 mr-2" />
                팔로우
              </TabsTrigger>
              <TabsTrigger
                value="wishlist"
                className={`data-[state=active]:bg-gray-700 ${activeTab === "wishlist" ? "text-red-500" : "text-gray-400"}`}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                위시리스트
              </TabsTrigger>
            </TabsList>

            {/* 팔로우 탭 콘텐츠 */}
            <TabsContent value="follow" className="pt-6">
              {instructors.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Heart className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>팔로우한 강사가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {instructors.map((instructor) => (
                    <div key={instructor.id} className="flex items-center p-4 bg-gray-800 rounded-lg">
                      <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-700 mr-4">
                        <Image
                          src={instructor.profileUrl || "/placeholder.svg"}
                          alt={instructor.name}
                          width={60}
                          height={60}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="font-medium">{instructor.name}</h3>
                          <div className="flex items-center ml-2 text-yellow-400 text-sm">
                            <Star className="h-3 w-3 mr-1" />
                            {instructor.rating}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">{instructor.title}</p>
                        <p className="text-xs text-gray-500">강의 {instructor.courseCount}개</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:bg-gray-700"
                          onClick={() => window.open(`/instructors/${instructor.id}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:bg-gray-700"
                          onClick={() => handleUnfollow(instructor.id)}
                        >
                          <Heart className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                          팔로우 취소
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* 위시리스트 탭 콘텐츠 */}
            <TabsContent value="wishlist" className="pt-6">
              {courses.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>위시리스트에 담긴 강의가 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="flex p-4 bg-gray-800 rounded-lg">
                      <div className="relative w-[120px] h-[80px] rounded-md overflow-hidden bg-gray-700 mr-4">
                        <Image
                          src={course.thumbnailUrl || "/placeholder.svg"}
                          alt={course.title}
                          width={120}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{course.title}</h3>
                        <p className="text-sm text-gray-400">{course.instructor}</p>
                        <div className="flex items-center mt-1 space-x-2">
                          <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                            {course.level}
                          </Badge>
                          <div className="flex items-center text-yellow-400 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {course.rating}
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="text-red-500 font-medium">{course.discountPrice.toLocaleString()}원</span>
                          <span className="text-gray-400 text-sm line-through ml-2">
                            {course.price.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:bg-gray-700"
                          onClick={() => window.open(`/courses/${course.id}`, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gray-700 text-gray-300 hover:bg-gray-700"
                          onClick={() => handleRemoveFromWishlist(course.id)}
                        >
                          <Bookmark className="h-4 w-4 mr-1 fill-red-500 text-red-500" />
                          삭제
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
