import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 과목 수강 데이터
const courseData = [
  { name: "마케팅 정복하는 법", percentage: 85 },
  { name: "전공처럼 개발자가 알려주는 웹 개발", percentage: 70 },
  { name: "누구나 할 수 있는 코딩 - C언어", percentage: 55 },
  { name: "구글 시트로 일 잘하는 법", percentage: 60 },
  { name: "블록체인 NFT/코인 - 기본", percentage: 40 },
]

export default function CourseData() {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-lg font-medium">과목 수강 데이터</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {courseData.map((course, index) => (
            <div key={index}>
              <div className="text-sm mb-2">{course.name}</div>
              <div className="h-8 bg-gray-800 relative">
                <div className="absolute inset-y-0 left-0 bg-pink-500" style={{ width: `${course.percentage}%` }}></div>
                <div
                  className="absolute inset-y-0 left-0 bg-blue-500"
                  style={{ width: `${course.percentage * 0.6}%` }}
                ></div>
                <div className="absolute inset-y-0 flex items-center justify-end w-full pr-2 text-xs">
                  {course.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
            <span className="text-sm">학습 완료한 수강생</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm">학습 진행중인 수강생</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

