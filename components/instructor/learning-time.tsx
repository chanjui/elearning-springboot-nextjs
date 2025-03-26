import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 수강생 학습 시간 데이터
const learningTimeData = [
  { course: "전공처럼 개발자가 알려주는 웹 개발", views: 13, completionRate: 10, totalTime: 15, avgTime: "1시간 미만" },
  { course: "마케팅 정복하는 법", views: 11, completionRate: 12, totalTime: 21, avgTime: "1시간 미만" },
  { course: "구글 시트로 일 잘하는 법", views: 20, completionRate: 23, totalTime: 45, avgTime: "1시간 미만" },
  { course: "한수위 자바스크립트 - 기본", views: 14, completionRate: 31, totalTime: 50, avgTime: "2시간" },
  { course: "누구나 할 수 있는 코딩 - C언어", views: 30, completionRate: 11, totalTime: 60, avgTime: "1시간 미만" },
]

export default function LearningTime() {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white mb-8">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-lg font-medium">수강생 학습 시간</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-sm text-gray-400 mb-4">강의 50%이상 수강한 학습자 중 SVoD 학습자 10명 기준</div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400">
              <th className="pb-2">강의</th>
              <th className="pb-2">영상 시간</th>
              <th className="pb-2">영상 개수</th>
              <th className="pb-2">학습 시간</th>
              <th className="pb-2">1일 학습 시간 평균</th>
            </tr>
          </thead>
          <tbody>
            {learningTimeData.map((item, index) => (
              <tr key={index} className="border-t border-gray-800">
                <td className="py-3">{item.course}</td>
                <td className="py-3">{item.views}분</td>
                <td className="py-3">{item.completionRate}개</td>
                <td className="py-3">{item.totalTime}분</td>
                <td className="py-3">{item.avgTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}

