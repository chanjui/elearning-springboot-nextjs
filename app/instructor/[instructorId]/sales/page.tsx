"use client"

import { useState } from "react"
import { ChevronDown, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"


// 예시 수익 데이터
const salesData = [
  {
    id: "1",
    date: "2023-03-31",
    time: "오후 23:14",
    course: "웹 개발에서 볼 만에 배워 배우는 프론트엔드",
    student: "김철수",
    originalPrice: 25000,
    salePrice: 25000,
    revenue: 16052,
  },
  {
    id: "2",
    date: "2023-03-31",
    time: "오후 21:17",
    course: "국내 입문하는 C++ 입문",
    student: "이영희",
    originalPrice: 25000,
    salePrice: 25000,
    revenue: 16840,
  },
  {
    id: "3",
    date: "2023-03-31",
    time: "오후 21:17",
    course: "누구나 배우는 C# 테스트의 A to Z",
    student: "박지민",
    originalPrice: 15000,
    salePrice: 15000,
    revenue: 9637,
  },
  {
    id: "4",
    date: "2023-03-31",
    time: "오후 20:45",
    course: "실전강화! AB 테스트의 모든 것 (for PM, PO)",
    student: "최준호",
    originalPrice: 25000,
    salePrice: 25000,
    revenue: 16050,
  },
  {
    id: "5",
    date: "2023-03-31",
    time: "오후 20:45",
    course: "파이썬 실으로 배워 만드는 나만의 타이머그",
    student: "정민수",
    originalPrice: 15000,
    salePrice: 15000,
    revenue: 9630,
  },
  {
    id: "6",
    date: "2023-03-31",
    time: "오후 20:44",
    course: "국내 입문하는 C++ 입문",
    student: "한지훈",
    originalPrice: 25000,
    salePrice: 25000,
    revenue: 12425,
  },
  {
    id: "7",
    date: "2023-03-31",
    time: "오후 20:07",
    course: "웹 개발에서 볼 만에 배워 배우는 프론트엔드",
    student: "송미라",
    originalPrice: 25000,
    salePrice: 25000,
    revenue: 12425,
  },
]

export default function InstructorSalesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterYear, setFilterYear] = useState("2023")
  const [filterMonth, setFilterMonth] = useState("3")
  const [filterCourse, setFilterCourse] = useState("전체")

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  // 총 수익 계산
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0)

  // 수익 필터링
  const filteredSales = salesData.filter((sale) => {
    // 검색어 필터링
    const matchesSearch =
      sale.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.student.toLowerCase().includes(searchQuery.toLowerCase())

    // 강의 필터링
    const matchesCourse = filterCourse === "전체" || sale.course.includes(filterCourse)

    return matchesSearch && matchesCourse
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <InstructorSidebar />

        {/* 메인 콘텐츠 */}
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
                  <Select defaultValue={filterYear}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="연도 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="2023">2023년</SelectItem>
                      <SelectItem value="2022">2022년</SelectItem>
                      <SelectItem value="2021">2021년</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-32">
                  <Select defaultValue={filterMonth}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="월 선택" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700 text-white">
                      <SelectItem value="1">1월</SelectItem>
                      <SelectItem value="2">2월</SelectItem>
                      <SelectItem value="3">3월</SelectItem>
                      <SelectItem value="4">4월</SelectItem>
                      <SelectItem value="5">5월</SelectItem>
                      <SelectItem value="6">6월</SelectItem>
                      <SelectItem value="7">7월</SelectItem>
                      <SelectItem value="8">8월</SelectItem>
                      <SelectItem value="9">9월</SelectItem>
                      <SelectItem value="10">10월</SelectItem>
                      <SelectItem value="11">11월</SelectItem>
                      <SelectItem value="12">12월</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      강의: {filterCourse === "전체" ? "전체" : "선택됨"}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setFilterCourse("전체")}>전체</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("C++")}>C++ 강의</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("웹 개발")}>웹 개발 강의</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("테스트")}>테스트 강의</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button className="bg-blue-600 hover:bg-blue-700">검색</Button>
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
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-4 pl-4">{sale.date}</td>
                      <td className="py-4">{sale.time}</td>
                      <td className="py-4">{sale.course}</td>
                      <td className="py-4">{sale.student}</td>
                      <td className="py-4 text-right">₩{formatPrice(sale.originalPrice)}</td>
                      <td className="py-4 text-right">₩{formatPrice(sale.salePrice)}</td>
                      <td className="py-4 text-right">₩{formatPrice(sale.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-400">총 {filteredSales.length}건의 판매 내역이 있습니다.</div>
              <div className="flex gap-2">
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  이전
                </Button>
                <Button variant="outline" className="border-gray-700 bg-gray-700 text-white">
                  1
                </Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
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

