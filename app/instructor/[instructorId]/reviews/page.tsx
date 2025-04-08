"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"

// 예시 수강평 데이터
const reviews = [
  {
    id: "1",
    content: "언리얼을 처음 접해봤지만 정말이 쉽더라, 너무 도움이는 강의였습니다! 최고 강의 감사합니다!!",
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part1: 게임 서버",
    author: "김철수",
    date: "2023-03-15",
    rating: 5,
    likes: 0,
  },
  {
    id: "2",
    content: "매우 수준높은 강의",
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part3: 전투 시스템",
    author: "이영희",
    date: "2023-03-10",
    rating: 5,
    likes: 0,
  },
  {
    id: "3",
    content:
      "입문자 입장에서 자상하게설명해 정말을 좋습니다. 다만나 좀은 어렵고요, 코더로 성장을 위한 강의 기본강좌에서 다양한 경험을 가져갈수 있었습니다. 계속 열 부탁드립니다~^^",
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part1: 게임 서버",
    author: "박지민",
    date: "2023-03-05",
    rating: 5,
    likes: 0,
  },
  {
    id: "4",
    content: "MMORPG 시작해보려다 어디서 시작해야할지 몰랐는데, 감사합니다.",
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part2: 기초 네트워킹",
    author: "최준호",
    date: "2023-03-01",
    rating: 5,
    likes: 0,
  },
  {
    id: "5",
    content: "진짜에서 일하시는 사람이라서 알짜배기 수업 같아요. 감사합니다.",
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part4: 게임 로직 구현",
    author: "정민수",
    date: "2023-02-25",
    rating: 5,
    likes: 0,
  },
]

export default function InstructorReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterRating, setFilterRating] = useState("전체")
  const [filterCourse, setFilterCourse] = useState("전체")

  // 수강평 필터링
  const filteredReviews = reviews.filter((review) => {
    // 검색어 필터링
    const matchesSearch =
      review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.author.toLowerCase().includes(searchQuery.toLowerCase())

    // 평점 필터링
    const matchesRating = filterRating === "전체" || review.rating === Number.parseInt(filterRating)

    // 강의 필터링
    const matchesCourse = filterCourse === "전체" || review.course.includes(filterCourse)

    return matchesSearch && matchesRating && matchesCourse
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <InstructorSidebar />

        {/* 메인 콘텐츠 */}
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">수강평 리스트</h1>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="수강평 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      평점: {filterRating}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setFilterRating("전체")}>전체</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRating("5")}>5점</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRating("4")}>4점</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRating("3")}>3점</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRating("2")}>2점</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRating("1")}>1점</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      강의: {filterCourse === "전체" ? "전체" : "선택됨"}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setFilterCourse("전체")}>전체</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("Part1")}>Part1: 게임 서버</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("Part2")}>Part2: 기초 네트워킹</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("Part3")}>Part3: 전투 시스템</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("Part4")}>Part4: 게임 로직 구현</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border border-gray-800 rounded-lg p-4 bg-gray-800/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-400">
                          {review.author} • {review.date}
                        </span>
                      </div>
                      <p className="text-white mb-2">{review.content}</p>
                      <div className="text-sm text-gray-400">{review.course}</div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                        답글 달기
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

