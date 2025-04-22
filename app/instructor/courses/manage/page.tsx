"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import { Search, Filter, ChevronDown, Plus } from "lucide-react"
import { Button } from "@/components/user/ui/button"
import { Input } from "@/components/user/ui/input"
import { Badge } from "@/components/user/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/user/ui/dropdown-menu"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"

interface Course {
  id: string;
  title: string;
  thumbnailUrl: string;
  status: "PREPARING" | "ACTIVE" | "CLOSED";
  updateDate: string;
  price: number;
  discountRate: number;
  isDel: boolean;
}

export default function InstructorCoursesManagePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("온라인 강의")
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchCourses = async (pageNumber = 0) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/courses/instructor/courses?page=${pageNumber}&size=5`, {
        withCredentials: true,
      })
      console.log("📦 백엔드 응답:", res.data)
      setCourses(res.data.content)
      setTotalPages(res.data.totalPages)
      setPage(res.data.number)
    } catch (err) {
      console.error("강의 데이터를 불러오지 못했습니다:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchCourses(page)
  }, [page])

  const formatPrice = (price: number) => new Intl.NumberFormat("ko-KR").format(price)

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      ? course.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    const matchesStatus = filterStatus === "all" || course.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />
      <div className="flex">
        <InstructorSidebar />

        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">강의 관리</h1>
            <Link href="/instructor/courses/create">
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-1" />새 강의 만들기
              </Button>
            </Link>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="강의 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Filter className="h-4 w-4 mr-1" />
                  필터
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      상태: {filterStatus === "all" ? "전체" : filterStatus === "ACTIVE" ? "공개" : "임시저장"}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>전체</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("ACTIVE")}>공개</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("PREPARING")}>임시저장</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="mb-4 border-b border-gray-800">
              <div className="flex">
                <button
                  className={`px-4 py-2 ${activeTab === "온라인 강의" ? "border-b-2 border-red-600 text-white" : "text-gray-400"}`}
                  onClick={() => setActiveTab("온라인 강의")}
                >
                  온라인 강의
                </button>
                <button
                  className={`px-4 py-2 ${activeTab === "오프라인 강의" ? "border-b-2 border-red-600 text-white" : "text-gray-400"}`}
                  onClick={() => setActiveTab("오프라인 강의")}
                >
                  오프라인 강의
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">강의 정보를 불러오는 중입니다...</div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                        <th className="pb-3 pl-4">이미지</th>
                        <th className="pb-3">강의명</th>
                        <th className="pb-3">평점</th>
                        <th className="pb-3">수강생수</th>
                        <th className="pb-3">질문</th>
                        <th className="pb-3">가격</th>
                        <th className="pb-3">상태</th>
                        <th className="pb-3">관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCourses.map((course) => (
                        <tr key={course.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-4 pl-4">
                            <div className="flex items-center">
                              <Image
                                src={course.thumbnailUrl || "/placeholder.svg"}
                                alt={course.title}
                                width={80}
                                height={45}
                                className="w-16 h-10 object-cover rounded"
                              />
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="max-w-xs truncate">{course.title}</div>
                          </td>
                          <td className="py-4">-</td>
                          <td className="py-4">-</td>
                          <td className="py-4">-</td>
                          <td className="py-4">{course.price > 0 ? `₩${formatPrice(course.price)}` : "₩0"}</td>
                          <td className="py-4">
                            <Badge className="bg-green-600">
                              {course.status === "ACTIVE" ? "공개" : course.status === "PREPARING" ? "임시저장" : "마감"}
                            </Badge>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-1">
                              {course.discountRate > 0 ? (
                                <Badge className="bg-blue-600 cursor-pointer">할인중</Badge>
                              ) : (
                                <Link href={`/instructor/courses/discount/${course.id}`}>
                                  <Badge className="bg-gray-700 hover:bg-gray-600 cursor-pointer">할인설정</Badge>
                                </Link>
                              )}
                              <Link href={`/instructor/courses/edit/${course.id}`}>
  <Badge className="bg-gray-700 hover:bg-gray-600 cursor-pointer">강의 수정</Badge>
</Link>
                              <Badge className="bg-gray-700 hover:bg-gray-600 cursor-pointer">통계보기</Badge>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (() => {
  const currentGroup = Math.floor(page / 10)
  const prevGroupStart = Math.max(0, (currentGroup - 1) * 10)
  const nextGroupStart = (currentGroup + 1) * 10

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {/* ⬅ 이전 그룹 */}
      <button
        onClick={() => {
          setPage(prevGroupStart)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        disabled={page < 10}
        className={`px-3 py-1 rounded ${
          page < 10 ? "bg-gray-800 text-gray-600 cursor-not-allowed" : "bg-gray-700 text-gray-300"
        }`}
      >
        &lt;
      </button>

      {/* 페이지 번호 */}
      {Array.from(
        { length: Math.min(10, totalPages - currentGroup * 10) },
        (_, i) => {
          const pageNum = currentGroup * 10 + i
          return (
            <button
              key={pageNum}
              onClick={() => {
                setPage(pageNum)
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
              className={`px-3 py-1 rounded ${
                pageNum === page ? "bg-red-600 text-white" : "bg-gray-700 text-gray-300"
              }`}
            >
              {pageNum + 1}
            </button>
          )
        }
      )}

      {/* ➡ 다음 그룹 */}
      <button
        onClick={() => {
          setPage(nextGroupStart)
          window.scrollTo({ top: 0, behavior: "smooth" })
        }}
        disabled={nextGroupStart >= totalPages}
        className={`px-3 py-1 rounded ${
          nextGroupStart >= totalPages
            ? "bg-gray-800 text-gray-600 cursor-not-allowed"
            : "bg-gray-700 text-gray-300"
        }`}
      >
        &gt;
      </button>
    </div>
  )
})()}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}