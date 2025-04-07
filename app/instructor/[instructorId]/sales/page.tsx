"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { ChevronDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"

interface SalesData {
  date: string
  time: string
  courseTitle: string
  studentName: string
  originalPrice: number
  actualPrice: number
  instructorRevenue: number
}

interface CourseOption {
  id: number
  title: string
}

export default function InstructorSalesPage() {
  const params = useParams()
  const instructorId = params?.instructorId

  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [courseList, setCourseList] = useState<CourseOption[]>([])

  const [searchQuery, setSearchQuery] = useState("")

  const [filterYear, setFilterYear] = useState("2025")
  const [filterMonth, setFilterMonth] = useState("4")
  const [filterCourse, setFilterCourse] = useState<"전체" | CourseOption>("전체")

  const [pendingCourse, setPendingCourse] = useState<"전체" | CourseOption>("전체")
  const [pendingQuery, setPendingQuery] = useState({
    year: filterYear,
    month: filterMonth,
    searchQuery: ""
  })

  // ✅ 페이징 상태
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(salesData.length / itemsPerPage)
  const paginatedSales = salesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    if (!instructorId) return
    const fetchCourses = async () => {
      try {
        const res = await fetch(`/api/instructor/sales/${instructorId}/courses`)
        const json = await res.json()
        setCourseList(json.data || [])
      } catch (err) {
        console.error("강의 목록 로딩 실패:", err)
      }
    }
    fetchCourses()
  }, [instructorId])

  useEffect(() => {
    if (!instructorId) return

    const fetchSales = async () => {
      try {
        let url = `/api/instructor/sales/${instructorId}?year=${pendingQuery.year}&month=${pendingQuery.month}`
        if (filterCourse !== "전체") {
          url += `&courseId=${filterCourse.id}`
        }
        if (pendingQuery.searchQuery) {
          url += `&searchQuery=${encodeURIComponent(pendingQuery.searchQuery)}`
        }
        const res = await fetch(url)
        const json = await res.json()
        setSalesData(json.data || [])
      } catch (err) {
        console.error("수익 데이터 로딩 실패:", err)
      }
    }

    fetchSales()
  }, [instructorId, pendingQuery, filterCourse])

  const handleSearchClick = () => {
    setPendingQuery({
      year: filterYear,
      month: filterMonth,
      searchQuery: searchQuery
    })
    setFilterCourse(pendingCourse)
    setCurrentPage(1) // 검색 시 페이지 초기화
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  const totalRevenue = salesData.reduce(
    (sum, item) => sum + item.instructorRevenue,
    0
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />
      <div className="flex">
        <InstructorSidebar />
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">수익 확인</h1>
            <Button className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-1" />
              엑셀 다운로드
            </Button>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-32">
                  <Select defaultValue={filterYear} onValueChange={setFilterYear}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="연도 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="2025">2025년</SelectItem>
                      <SelectItem value="2024">2024년</SelectItem>
                      <SelectItem value="2023">2023년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32">
                  <Select defaultValue={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="월 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i + 1} value={`${i + 1}`}>{`${i + 1}월`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      강의: {pendingCourse === "전체" ? "전체" : pendingCourse.title}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setPendingCourse("전체")}>전체</DropdownMenuItem>
                    {courseList.map((course) => (
                      <DropdownMenuItem key={course.id} onClick={() => setPendingCourse(course)}>
                        {course.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <input
                  type="text"
                  placeholder="수강생명 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 text-white px-3 py-2 rounded-md border border-gray-700"
                />

                <Button onClick={handleSearchClick} className="bg-blue-600 hover:bg-blue-700">
                  검색
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-400">총 수익:</div>
                <div className="font-bold text-lg">₩{formatPrice(totalRevenue)}</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="pb-3 pl-4">날짜</th>
                    <th className="pb-3">시간</th>
                    <th className="pb-3">강의명</th>
                    <th className="pb-3">수강생명</th>
                    <th className="pb-3 text-right">정상가격</th>
                    <th className="pb-3 text-right">실제가격</th>
                    <th className="pb-3 text-right">실수익</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSales.map((sale, index) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-4 pl-4">{sale.date}</td>
                      <td className="py-4">{sale.time}</td>
                      <td className="py-4">{sale.courseTitle}</td>
                      <td className="py-4">{sale.studentName}</td>
                      <td className="py-4 text-right">₩{formatPrice(sale.originalPrice)}</td>
                      <td className="py-4 text-right">₩{formatPrice(sale.actualPrice)}</td>
                      <td className="py-4 text-right">₩{formatPrice(sale.instructorRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                총 {salesData.length}건의 판매 내역이 있습니다.
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant="outline"
                    className={`border-gray-700 ${currentPage === i + 1 ? "bg-gray-700 text-white" : "text-gray-300 hover:bg-gray-800"}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
