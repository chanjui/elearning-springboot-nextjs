import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 최근 알림 데이터
const notifications = [
  { id: 1, date: "2023/10/27", content: "대용량 파일 처리와 이미지 압축 처리 강의 등록" },
  { id: 2, date: "2023/10/25", content: "[React] Container 컴포넌트 1-3 등록 완료" },
  { id: 3, date: "2023/10/20", content: "새로운 강의 '코딩테스트 완전정복' 등록 및 판매 시작했습니다." },
]

export default function Notifications() {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white mb-8">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-lg font-medium">최근 알림</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
              <th className="p-4">날짜</th>
              <th className="p-4">알림 내용</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="p-4 text-sm">{notification.date}</td>
                <td className="p-4">{notification.content}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 flex justify-center">
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            더보기 <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

