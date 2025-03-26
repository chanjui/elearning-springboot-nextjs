"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Clock, Award, Tag, CheckCircle, Play, ChevronDown, ChevronUp, Save, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import NetflixHeader from "@/components/netflix-header"

export default function CodingTestDetailPage({ params }: { params: { id: string } }) {
  const [code, setCode] = useState(`function solution(nums, target) {
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
}`)

  // 예시 데이터
  const problem = {
    id: params.id,
    title: "두 수의 합 찾기",
    description:
      "정수 배열 nums와 정수 target이 주어졌을 때, nums에서 두 수를 더해 target이 되는 두 수의 인덱스를 반환하세요.",
    difficulty: "쉬움",
    category: "배열",
    timeLimit: "1초",
    memoryLimit: "256MB",
    submissionCount: 1245,
    passRate: 68,
    createdAt: "2024-03-15",
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] = 2 + 7 = 9이므로, [0, 1]을 반환합니다.",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] = 2 + 4 = 6이므로, [1, 2]를 반환합니다.",
      },
      {
        input: "nums = [3, 3], target = 6",
        output: "[0, 1]",
        explanation: "nums[0] + nums[1] = 3 + 3 = 6이므로, [0, 1]을 반환합니다.",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "정확히 하나의 유효한 답이 존재합니다.",
    ],
    hints: [
      "해시 맵을 사용하여 각 요소의 값과 인덱스를 저장하는 방법을 고려해보세요.",
      "배열을 한 번 순회하면서 각 요소에 대해 target - nums[i]가 이미 해시 맵에 있는지 확인하세요.",
    ],
    submissions: [
      {
        id: "s1",
        status: "성공",
        language: "JavaScript",
        runtime: "72ms",
        memory: "42.1MB",
        submittedAt: "2024-03-20 14:30:22",
      },
      {
        id: "s2",
        status: "실패",
        language: "JavaScript",
        runtime: "-",
        memory: "-",
        submittedAt: "2024-03-20 14:25:10",
        errorMessage: "테스트 케이스 2에서 실패: 예상 출력 [1, 2], 실제 출력 [0, 2]",
      },
    ],
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "쉬움":
        return "bg-green-600 text-white"
      case "보통":
        return "bg-yellow-600 text-white"
      case "어려움":
        return "bg-red-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const [showHints, setShowHints] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/coding-test" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            문제 목록으로 돌아가기
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 문제 설명 */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{problem.title}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                  <Badge variant="outline" className="border-gray-700 text-gray-300">
                    {problem.category}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>제한 시간: {problem.timeLimit}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  <span>메모리 제한: {problem.memoryLimit}</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-1" />
                  <span>제출 수: {problem.submissionCount}</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>통과율: {problem.passRate}%</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none mb-6">
                <h2 className="text-xl font-medium mb-2">문제 설명</h2>
                <p>{problem.description}</p>

                <h2 className="text-xl font-medium mt-6 mb-2">예제</h2>
                {problem.examples.map((example, index) => (
                  <div key={index} className="mb-4 bg-gray-800 p-4 rounded-lg">
                    <div className="mb-2">
                      <span className="font-medium">입력:</span> {example.input}
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">출력:</span> {example.output}
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-medium">설명:</span> {example.explanation}
                      </div>
                    )}
                  </div>
                ))}

                <h2 className="text-xl font-medium mt-6 mb-2">제한 사항</h2>
                <ul className="list-disc pl-5">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center text-red-500 hover:text-red-400"
                  >
                    {showHints ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        힌트 숨기기
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        힌트 보기
                      </>
                    )}
                  </button>

                  {showHints && (
                    <div className="mt-2 bg-gray-800 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">힌트</h3>
                      <ul className="list-disc pl-5">
                        {problem.hints.map((hint, index) => (
                          <li key={index}>{hint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-xl font-medium mb-4">제출 기록</h2>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">상태</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">언어</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">실행 시간</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">메모리</th>
                      <th className="py-3 px-4 text-left text-gray-400 font-medium">제출 시간</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problem.submissions.map((submission) => (
                      <tr key={submission.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-4 px-4">
                          <Badge className={submission.status === "성공" ? "bg-green-600" : "bg-red-600"}>
                            {submission.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">{submission.language}</td>
                        <td className="py-4 px-4">{submission.runtime}</td>
                        <td className="py-4 px-4">{submission.memory}</td>
                        <td className="py-4 px-4">{submission.submittedAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {problem.submissions.some((s) => s.status === "실패" && s.errorMessage) && (
                <div className="mt-4 bg-red-900/30 p-4 rounded-lg border border-red-800">
                  <h3 className="font-medium mb-2 text-red-400">오류 메시지</h3>
                  <p className="text-red-300">
                    {problem.submissions.find((s) => s.status === "실패" && s.errorMessage)?.errorMessage}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 코드 에디터 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">코드 작성</h2>
                <Select defaultValue="javascript" key="language-select">
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
                    <SelectValue placeholder="언어 선택" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <div className="bg-gray-950 rounded-t-md p-2 text-sm text-gray-400 border border-gray-800 border-b-0">
                  solution.js
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full h-[400px] bg-gray-950 text-white font-mono p-4 rounded-b-md border border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-700"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Save className="h-4 w-4 mr-1" />
                  저장
                </Button>
                <Button variant="outline" className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800">
                  <Play className="h-4 w-4 mr-1" />
                  실행
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700">
                  <Send className="h-4 w-4 mr-1" />
                  제출
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

