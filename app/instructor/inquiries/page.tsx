"use client"

import { useState } from "react"
import { Search, ChevronDown, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"

// 예시 문의 데이터
const inquiries = [
  {
    id: "1",
    title: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part1: C++ 프로그래밍 입문",
    content:
      "안녕하세요!\n저는 현재만 다녀가지 이번에 게임 개발에 입문하려고 합니다.\n게임소개에서 나온 MMORPG를 꼭 만들어 보고 싶습니다. 수강 전에 시간이 얼마나 걸릴까요?",
    author: "홍길동",
    date: "2023-05-07",
    status: "미답변",
    replies: [],
  },
  {
    id: "2",
    title: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part4: 게임 서버",
    content:
      "무기스킬 강의를 다뤄 질문드립니다. 혹시 all in one 솔루션이신데 내용을 보니 게임엔 part1,3,4 에서이만 winapi 소개들을 주시서 솔루션이 꼬이는데 어떻게 해결하면 좋을까요?",
    author: "나개발",
    date: "2023-05-02",
    status: "답변완료",
    replies: [
      {
        id: "r1",
        author: "Rookiss",
        date: "2023-05-02",
        content:
          "기존 강의가 너 난이도 상향인데,\n기존 강의가 모호하시면 강의 난이도 하향 버전을 확인해 보세요. 사용법을 위주로 작성했습니다.",
      },
    ],
  },
  {
    id: "3",
    title: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part4: 게임 서버",
    content:
      "part 5 하고 있는 학생입니다. 어제서 서시나요... 강의가 unreal 5로 넘어갔는데 여러 편 일정을 못잡고 있다. 강의 소개에서 알려진 것들을 제대로 처리하지 못하는데...",
    author: "배개발",
    date: "2023-05-02",
    status: "답변완료",
    replies: [
      {
        id: "r2",
        author: "Rookiss",
        date: "2023-05-02",
        content:
          "Part는 UE5 시리즈로 대체하였습니다.\n이미 제품은 VR 엔진 C++, 언리 시리즈 순서대로 제작해 왔었고\n더 발전시켜서 최종적으로 UE5 <-> IOCP 서버 연동에 성공했습니다...",
      },
    ],
  },
]

export default function InstructorInquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("전체")
  const [filterCourse, setFilterCourse] = useState("전체")

  // 문의 필터링
  const filteredInquiries = inquiries.filter((inquiry) => {
    // 검색어 필터링
    const matchesSearch =
      inquiry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.author.toLowerCase().includes(searchQuery.toLowerCase())

    // 상태 필터링
    const matchesStatus = filterStatus === "전체" || inquiry.status === filterStatus

    // 강의 필터링
    const matchesCourse = filterCourse === "전체" || inquiry.title.includes(filterCourse)

    return matchesSearch && matchesStatus && matchesCourse
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <InstructorSidebar />

        {/* 메인 콘텐츠 */}
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">수강전 문의관리</h1>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="문의 검색"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      상태: {filterStatus}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem onClick={() => setFilterStatus("전체")}>전체</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("미답변")}>미답변</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("답변완료")}>답변완료</DropdownMenuItem>
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
                    <DropdownMenuItem onClick={() => setFilterCourse("Part1")}>
                      Part1: C++ 프로그래밍 입문
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterCourse("Part4")}>Part4: 게임 서버</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button className="bg-blue-600 hover:bg-blue-700">검색</Button>
              </div>
            </div>

            <div className="space-y-6">
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="border border-gray-800 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">{inquiry.title}</h3>
                      <Badge className={inquiry.status === "미답변" ? "bg-red-600" : "bg-green-600"}>
                        {inquiry.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-400 mt-1">
                      <span>{inquiry.author}</span>
                      <span className="mx-2">•</span>
                      <span>{inquiry.date}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-900">
                    <p className="text-gray-300 whitespace-pre-line mb-4">{inquiry.content}</p>

                    {inquiry.replies.length > 0 ? (
                      <div className="mt-4 border-t border-gray-800 pt-4">
                        {inquiry.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-800 p-3 rounded-lg mb-2">
                            <div className="flex items-center text-sm mb-1">
                              <span className="font-medium text-green-400">{reply.author}</span>
                              <span className="mx-2 text-gray-500">•</span>
                              <span className="text-gray-400">{reply.date}</span>
                            </div>
                            <p className="text-gray-300 whitespace-pre-line">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <Button className="bg-green-600 hover:bg-green-700">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          답변하기
                        </Button>
                      </div>
                    )}
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

