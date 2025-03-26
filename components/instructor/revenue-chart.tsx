import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 수익 분포 데이터
const revenueDistribution = [
  { course: "누구나 할 수 있는 코딩 - C언어", amount: 350000, percentage: 50 },
  { course: "전공처럼 개발자가 알려주는 웹 개발", amount: 150000, percentage: 22 },
  { course: "마케팅 정복하는 법", amount: 100000, percentage: 15 },
  { course: "구글 시트로 일 잘하는 법", amount: 50000, percentage: 8 },
  { course: "한수위 자바스크립트 - 기본", amount: 34278, percentage: 5 },
]

// 가격 포맷팅 함수
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("ko-KR").format(price)
}

export default function RevenueChart() {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white mb-8">
      <CardHeader className="border-b border-gray-800 flex justify-between items-center">
        <CardTitle className="text-lg font-medium">강의 수익</CardTitle>
        <div className="flex items-center text-sm text-gray-400">
          <span>이번 달 현황</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-sm text-gray-400">이번 달 수익</div>
            <div className="text-xl font-bold">684,278원</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 도넛 차트 */}
          <div>
            <div className="flex justify-center mb-6">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* 원형 차트 세그먼트 */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#374151" strokeWidth="20" />

                  {/* 첫 번째 세그먼트 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#a855f7"
                    strokeWidth="20"
                    strokeDasharray={`${50 * 2.51} ${100 * 2.51}`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />

                  {/* 두 번째 세그먼트 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#ec4899"
                    strokeWidth="20"
                    strokeDasharray={`${22 * 2.51} ${100 * 2.51}`}
                    strokeDashoffset={`${-50 * 2.51}`}
                    transform="rotate(-90 50 50)"
                  />

                  {/* 세 번째 세그먼트 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray={`${15 * 2.51} ${100 * 2.51}`}
                    strokeDashoffset={`${-(50 + 22) * 2.51}`}
                    transform="rotate(-90 50 50)"
                  />

                  {/* 네 번째 세그먼트 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${8 * 2.51} ${100 * 2.51}`}
                    strokeDashoffset={`${-(50 + 22 + 15) * 2.51}`}
                    transform="rotate(-90 50 50)"
                  />

                  {/* 다섯 번째 세그먼트 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeDasharray={`${5 * 2.51} ${100 * 2.51}`}
                    strokeDashoffset={`${-(50 + 22 + 15 + 8) * 2.51}`}
                    transform="rotate(-90 50 50)"
                  />

                  {/* 중앙 원 */}
                  <circle cx="50" cy="50" r="30" fill="#111827" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold">684,278원</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {revenueDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        index === 0
                          ? "bg-purple-500"
                          : index === 1
                            ? "bg-pink-500"
                            : index === 2
                              ? "bg-blue-500"
                              : index === 3
                                ? "bg-green-500"
                                : "bg-yellow-500"
                      }`}
                    ></div>
                    <span className="text-sm truncate max-w-[200px]">{item.course}</span>
                  </div>
                  <div className="text-sm">
                    {formatPrice(item.amount)}원 ({item.percentage}%)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 수익 분포 막대 그래프 */}
          <div>
            <div className="text-sm text-gray-400 mb-4">강의 수익 분포</div>
            <div className="h-[300px] relative">
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 py-2">
                <div>100%</div>
                <div>75%</div>
                <div>50%</div>
                <div>25%</div>
                <div>0%</div>
              </div>

              <div className="absolute left-10 right-0 top-0 bottom-0 flex items-end">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div key={index} className="flex-1 mx-1 relative">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-purple-500"
                      style={{ height: `${Math.random() * 30 + 20}%` }}
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-pink-500"
                      style={{ height: `${Math.random() * 20 + 10}%` }}
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-blue-500"
                      style={{ height: `${Math.random() * 15 + 5}%` }}
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-green-500"
                      style={{ height: `${Math.random() * 10 + 5}%` }}
                    ></div>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-yellow-500"
                      style={{ height: `${Math.random() * 5 + 2}%` }}
                    ></div>
                    <div className="absolute bottom-[-20px] left-0 right-0 text-center text-xs text-gray-400">
                      2025/03/{17 + index}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

