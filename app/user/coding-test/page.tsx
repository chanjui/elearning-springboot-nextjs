"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Filter, ChevronDown, Clock, BarChart, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import NetflixHeader from "@/components/netflix-header"

export default function CodingTestPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // 예시 데이터
  const codingTests = [
    {
      id: "1",
      title: "알고리즘 기초: 정렬과 탐색",
      difficulty: "초급",
      participants: 1245,
      duration: 120,
      questions: 10,
      tags: ["정렬", "탐색", "알고리즘"],
      image: "/placeholder.svg?height=160&width=280",
    },
    {
      id: "2",
      title: "자료구조 마스터하기",
      difficulty: "중급",
      participants: 876,
      duration: 180,
      questions: 15,
      tags: ["자료구조", "트리", "그래프"],
      image: "/placeholder.svg?height=160&width=280",
    },
    {
      id: "3",
      title: "동적 프로그래밍 문제 풀이",
      difficulty: "고급",
      participants: 543,
      duration: 240,
      questions: 8,
      tags: ["DP", "알고리즘", "최적화"],
      image: "/placeholder.svg?height=160&width=280",
    },
    {
      id: "4",
      title: "그리디 알고리즘 실전 문제",
      difficulty: "중급",
      participants: 921,
      duration: 150,
      questions: 12,
      tags: ["그리디", "알고리즘"],
      image: "/placeholder.svg?height=160&width=280",
    },
    {
      id: "5",
      title: "백트래킹과 DFS/BFS 응용",
      difficulty: "고급",
      participants: 432,
      duration: 210,
      questions: 7,
      tags: ["DFS", "BFS", "백트래킹", "그래프"],
      image: "/placeholder.svg?height=160&width=280",
    },
    {
      id: "6",
      title: "문자열 알고리즘 기초",
      difficulty: "초급",
      participants: 1532,
      duration: 90,
      questions: 15,
      tags: ["문자열", "알고리즘"],
      image: "/placeholder.svg?height=160&width=280",
    },
  ]

  // 난이도별 배지 색상
  const difficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "초급":
        return "bg-green-600"
      case "중급":
        return "bg-yellow-600"
      case "고급":
        return "bg-red-600"
      default:
        return "bg-blue-600"
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 왼쪽: 필터 */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium flex items-center text-white">
                  <Filter className="h-4 w-4 mr-1" />
                  필터
                </h2>
                <Button variant="ghost" size="sm" className="text-sm text-gray-400 hover:text-white">
                  초기화
                </Button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="문제 검색"
                    className="pl-8 bg-gray-800 border-gray-700 text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Accordion type="multiple" defaultValue={["difficulty", "tags", "duration"]} className="space-y-2">
                <AccordionItem value="difficulty" className="border-gray-800">
                  <AccordionTrigger className="py-2 text-gray-300 hover:text-white">난이도</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="difficulty-all" className="border-gray-600" />
                        <Label htmlFor="difficulty-all" className="ml-2 text-sm text-gray-300">
                          전체
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="difficulty-beginner" className="border-gray-600" />
                        <Label htmlFor="difficulty-beginner" className="ml-2 text-sm text-gray-300">
                          초급
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="difficulty-intermediate" className="border-gray-600" />
                        <Label htmlFor="difficulty-intermediate" className="ml-2 text-sm text-gray-300">
                          중급
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="difficulty-advanced" className="border-gray-600" />
                        <Label htmlFor="difficulty-advanced" className="ml-2 text-sm text-gray-300">
                          고급
                        </Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tags" className="border-gray-800">
                  <AccordionTrigger className="py-2 text-gray-300 hover:text-white">알고리즘 유형</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="tag-all" className="border-gray-600" />
                        <Label htmlFor="tag-all" className="ml-2 text-sm text-gray-300">
                          전체
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="tag-sort" className="border-gray-600" />
                        <Label htmlFor="tag-sort" className="ml-2 text-sm text-gray-300">
                          정렬
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="tag-search" className="border-gray-600" />
                        <Label htmlFor="tag-search" className="ml-2 text-sm text-gray-300">
                          탐색
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="tag-dp" className="border-gray-600" />
                        <Label htmlFor="tag-dp" className="ml-2 text-sm text-gray-300">
                          동적 프로그래밍
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="tag-greedy" className="border-gray-600" />
                        <Label htmlFor="tag-greedy" className="ml-2 text-sm text-gray-300">
                          그리디
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="tag-graph" className="border-gray-600" />
                        <Label htmlFor="tag-graph" className="ml-2 text-sm text-gray-300">
                          그래프
                        </Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="duration" className="border-gray-800">
                  <AccordionTrigger className="py-2 text-gray-300 hover:text-white">소요 시간</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Checkbox id="duration-all" className="border-gray-600" />
                        <Label htmlFor="duration-all" className="ml-2 text-sm text-gray-300">
                          전체
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="duration-short" className="border-gray-600" />
                        <Label htmlFor="duration-short" className="ml-2 text-sm text-gray-300">
                          1시간 이하
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="duration-medium" className="border-gray-600" />
                        <Label htmlFor="duration-medium" className="ml-2 text-sm text-gray-300">
                          1~2시간
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="duration-long" className="border-gray-600" />
                        <Label htmlFor="duration-long" className="ml-2 text-sm text-gray-300">
                          2~3시간
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox id="duration-very-long" className="border-gray-600" />
                        <Label htmlFor="duration-very-long" className="ml-2 text-sm text-gray-300">
                          3시간 이상
                        </Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* 오른쪽: 코딩 테스트 목록 */}
          <div className="flex-1">
            <div className="mb-6">
              <Tabs defaultValue="all">
                <TabsList className="mb-4 bg-gray-800">
                  <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
                    전체 문제
                  </TabsTrigger>
                  <TabsTrigger value="popular" className="data-[state=active]:bg-gray-700">
                    인기 문제
                  </TabsTrigger>
                  <TabsTrigger value="new" className="data-[state=active]:bg-gray-700">
                    신규 문제
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-400">총 {codingTests.length}개 문제</div>

                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm flex items-center text-gray-300 hover:text-white"
                    >
                      인기순
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                    <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700" />
                    <Button variant="ghost" size="sm" className="text-sm text-gray-300 hover:text-white">
                      최신순
                    </Button>
                    <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700" />
                    <Button variant="ghost" size="sm" className="text-sm text-gray-300 hover:text-white">
                      난이도순
                    </Button>
                  </div>
                </div>

                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {codingTests.map((test) => (
                      <Link key={test.id} href={`/user/coding-test/${test.id}`} className="block">
                        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                          <div className="relative">
                            <Image
                              src={test.image || "/placeholder.svg"}
                              alt={test.title}
                              width={280}
                              height={160}
                              className="w-full h-40 object-cover"
                            />
                            <Badge className={`absolute top-2 right-2 ${difficultyColor(test.difficulty)}`}>
                              {test.difficulty}
                            </Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-lg mb-2 line-clamp-2">{test.title}</h3>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {test.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{test.duration}분</span>
                              </div>
                              <div className="flex items-center">
                                <BarChart className="h-4 w-4 mr-1" />
                                <span>{test.questions}문제</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{test.participants.toLocaleString()}명</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="flex justify-center mt-8">
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      더 보기
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="popular" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {codingTests
                      .sort((a, b) => b.participants - a.participants)
                      .map((test) => (
                        <Link key={test.id} href={`/user/coding-test/${test.id}`} className="block">
                          <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                            <div className="relative">
                              <Image
                                src={test.image || "/placeholder.svg"}
                                alt={test.title}
                                width={280}
                                height={160}
                                className="w-full h-40 object-cover"
                              />
                              <Badge className={`absolute top-2 right-2 ${difficultyColor(test.difficulty)}`}>
                                {test.difficulty}
                              </Badge>
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium text-lg mb-2 line-clamp-2">{test.title}</h3>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {test.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex items-center justify-between text-sm text-gray-400">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{test.duration}분</span>
                                </div>
                                <div className="flex items-center">
                                  <BarChart className="h-4 w-4 mr-1" />
                                  <span>{test.questions}문제</span>
                                </div>
                                <div className="flex items-center">
                                  <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                                  <span>{test.participants.toLocaleString()}명</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </TabsContent>

                <TabsContent value="new" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {codingTests.slice(0, 3).map((test) => (
                      <Link key={test.id} href={`/user/coding-test/${test.id}`} className="block">
                        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                          <div className="relative">
                            <Image
                              src={test.image || "/placeholder.svg"}
                              alt={test.title}
                              width={280}
                              height={160}
                              className="w-full h-40 object-cover"
                            />
                            <Badge className={`absolute top-2 right-2 ${difficultyColor(test.difficulty)}`}>
                              {test.difficulty}
                            </Badge>
                            <Badge className="absolute top-2 left-2 bg-blue-600">NEW</Badge>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-lg mb-2 line-clamp-2">{test.title}</h3>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {test.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{test.duration}분</span>
                              </div>
                              <div className="flex items-center">
                                <BarChart className="h-4 w-4 mr-1" />
                                <span>{test.questions}문제</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{test.participants.toLocaleString()}명</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

