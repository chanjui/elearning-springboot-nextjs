"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import Pagination from "@/components/user/coding-test/pagination"

// 타입 정의
interface CodingTest {
  id: string;
  title: string;
  difficulty: string;
  participants: number;
  duration: number;
  questions: number;
  tags: string[];
}

interface ProblemData {
  id: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  inputExample: string;
  outputExample: string;
}

export default function CodingTestPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [codingTests, setCodingTests] = useState<CodingTest[]>([])
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("/api/coding/problems")
        const data = await response.json() as ProblemData[]
        // 백엔드 데이터 구조에 맞게 매핑
        const mappedData: CodingTest[] = data.map((problem) => ({
          id: problem.id,
          title: problem.title,
          difficulty: problem.difficulty === "EASY" ? "초급" : problem.difficulty === "MEDIUM" ? "중급" : "고급",
          participants: 0,
          duration: 120,
          questions: 1,
          tags: [],
        }))
        setCodingTests(mappedData)
      } catch (error) {
        console.error("문제 목록을 불러오는데 실패했습니다:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  // 난이도별 배지 색상
  const difficultyColor = (difficulty: string): string => {
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

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  // Change page
  const handlePageChange = (pageNumber: number): void => {
    setCurrentPage(pageNumber)
  }

  // 필터링된 문제 목록 계산
  const getFilteredProblems = () => {
    return codingTests.filter(problem => {
      // 검색어 필터링
      const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          problem.description?.toLowerCase().includes(searchQuery.toLowerCase())

      // 난이도 필터링
      const matchesDifficulty = selectedDifficulties.length === 0 || 
                               selectedDifficulties.includes(problem.difficulty)

      // 태그 필터링
      const matchesTags = selectedTags.length === 0 ||
                         problem.tags.some(tag => selectedTags.includes(tag))

      return matchesSearch && matchesDifficulty && matchesTags
    })
  }

  // 필터 초기화 함수
  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedDifficulties([])
    setSelectedTags([])
  }

  // 난이도 체크박스 핸들러
  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulties(prev => {
      if (difficulty === "전체") {
        return []
      }
      if (prev.includes(difficulty)) {
        return prev.filter(d => d !== difficulty)
      }
      return [...prev, difficulty]
    })
  }

  // 태그 체크박스 핸들러
  const handleTagChange = (tag: string) => {
    setSelectedTags(prev => {
      if (tag === "전체") {
        return []
      }
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      }
      return [...prev, tag]
    })
  }

  // 필터링된 문제 목록 가져오기
  const filteredProblems = getFilteredProblems()

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
                        <Checkbox 
                          id="difficulty-all" 
                          className="border-gray-600"
                          checked={selectedDifficulties.length === 0}
                          onCheckedChange={() => handleDifficultyChange("전체")}
                        />
                        <Label htmlFor="difficulty-all" className="ml-2 text-sm text-gray-300">
                          전체
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="difficulty-beginner" 
                          className="border-gray-600"
                          checked={selectedDifficulties.includes("초급")}
                          onCheckedChange={() => handleDifficultyChange("초급")}
                        />
                        <Label htmlFor="difficulty-beginner" className="ml-2 text-sm text-gray-300">
                          초급
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="difficulty-intermediate" 
                          className="border-gray-600"
                          checked={selectedDifficulties.includes("중급")}
                          onCheckedChange={() => handleDifficultyChange("중급")}
                        />
                        <Label htmlFor="difficulty-intermediate" className="ml-2 text-sm text-gray-300">
                          중급
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <Checkbox 
                          id="difficulty-advanced" 
                          className="border-gray-600"
                          checked={selectedDifficulties.includes("고급")}
                          onCheckedChange={() => handleDifficultyChange("고급")}
                        />
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
                  <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">문제</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">난이도</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">소요 시간</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">문제 수</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">참여자</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProblems.slice(indexOfFirstItem, indexOfLastItem).map((test) => (
                          <tr key={test.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="py-4 px-4">
                              <Link href={`/user/coding-test/${test.id}`} className="font-medium hover:text-red-500">
                                {test.title}
                              </Link>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={difficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center text-gray-400">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{test.duration}분</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center text-gray-400">
                                <BarChart className="h-4 w-4 mr-1" />
                                <span>{test.questions}문제</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center text-gray-400">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{test.participants.toLocaleString()}명</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    totalItems={filteredProblems.length}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </TabsContent>

                <TabsContent value="popular" className="mt-0">
                  <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">문제</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">난이도</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">소요 시간</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">문제 수</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">참여자</th>
                        </tr>
                      </thead>
                      <tbody>
                        {codingTests
                          .sort((a, b) => b.participants - a.participants)
                          .slice(0, itemsPerPage)
                          .map((test) => (
                            <tr key={test.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                              <td className="py-4 px-4">
                                <Link href={`/user/coding-test/${test.id}`} className="font-medium hover:text-red-500">
                                  {test.title}
                                </Link>
                              </td>
                              <td className="py-4 px-4">
                                <Badge className={difficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center text-gray-400">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{test.duration}분</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center text-gray-400">
                                  <BarChart className="h-4 w-4 mr-1" />
                                  <span>{test.questions}문제</span>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center text-yellow-500">
                                  <Trophy className="h-4 w-4 mr-1" />
                                  <span>{test.participants.toLocaleString()}명</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="new" className="mt-0">
                  <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">문제</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">난이도</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">소요 시간</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">문제 수</th>
                          <th className="py-3 px-4 text-left text-gray-400 font-medium">참여자</th>
                        </tr>
                      </thead>
                      <tbody>
                        {codingTests.slice(0, itemsPerPage).map((test) => (
                          <tr key={test.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <Badge className="mr-2 bg-blue-600">NEW</Badge>
                                <Link href={`/user/coding-test/${test.id}`} className="font-medium hover:text-red-500">
                                  {test.title}
                                </Link>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={difficultyColor(test.difficulty)}>{test.difficulty}</Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center text-gray-400">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{test.duration}분</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center text-gray-400">
                                <BarChart className="h-4 w-4 mr-1" />
                                <span>{test.questions}문제</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center text-gray-400">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{test.participants.toLocaleString()}명</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

// 코드 템플릿 타입 정의
type CodeLanguage = "JAVASCRIPT" | "PYTHON" | "JAVA" | "C"

interface CodeTemplates {
  [key: string]: string
}

export const codeTemplates: CodeTemplates = {
  JAVASCRIPT: `function solution(nums, target) {
  // 여기에 코드를 작성하세요
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,

  PYTHON: `def solution(nums, target):
    # 여기에 코드를 작성하세요
    num_dict = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in num_dict:
            return [num_dict[complement], i]
            
        num_dict[num] = i
    
    return []`,

  JAVA: `public class Main {
    public static int[] solution(int[] nums, int target) {
        // 여기에 코드를 작성하세요
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            
            map.put(nums[i], i);
        }
        
        return new int[] {};
    }

    public static void main(String[] args) {
        // 메인 메서드는 제출 시 자동으로 생성됩니다.
    }
}`,

  C: `#include <stdio.h>
#include <stdlib.h>

int* solution(int* nums, int numsSize, int target, int* returnSize) {
    // 여기에 코드를 작성하세요
    int* result = (int*)malloc(2 * sizeof(int));
    *returnSize = 2;
    
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    
    result[0] = -1;
    result[1] = -1;
    return result;
}`
}

