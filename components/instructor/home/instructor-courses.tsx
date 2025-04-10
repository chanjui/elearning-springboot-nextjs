"use client"

import Image from "next/image"
import { Star, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Course = {
  courseId: number
  subject: string
  instructor: string
  thumbnailUrl: string
  price: number
  discountRate: number
  rating: number
  categoryName: string
  tags: string[]
}

type InstructorCoursesProps = {
  courses: Course[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function InstructorCourses({ courses, activeTab, setActiveTab }: InstructorCoursesProps) {
  // 가격 형식 변환
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-white">강의</h2>
      {courses.length === 0 ? (
        <p className="text-white">강의가 없습니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(activeTab === "home" ? courses.slice(0, 6) : courses).map((course) => (
              <Card
                key={course.courseId}
                className="border border-gray-800 bg-gray-900 shadow-md netflix-card-hover overflow-hidden"
              >
                <div className="relative">
                  <Image
                    src={course.thumbnailUrl || "/placeholder.svg"}
                    alt={course.subject}
                    width={280}
                    height={160}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 netflix-gradient flex items-end p-3 opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                      <Bookmark className="h-4 w-4 mr-2" /> 수강하기
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium line-clamp-2 h-10 text-white">{course.subject}</h3>
                  <div className="flex items-center mt-2 text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-red-600 text-white bg-red-600/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 font-bold text-white">₩{formatPrice(course.price)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          {activeTab === "home" && courses.length > 6 && (
            <div className="mt-4 flex justify-center">
              <Button variant="ghost" className="text-red-500 hover:underline" onClick={() => setActiveTab("courses")}>
                강의 전체 보기 →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
