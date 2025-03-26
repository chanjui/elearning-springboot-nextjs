import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// 수강생 진행률 데이터
const progressData = [
  { range: "0-10%", count: 450 },
  { range: "10-20%", count: 350 },
  { range: "20-30%", count: 300 },
  { range: "30-40%", count: 250 },
  { range: "40-50%", count: 200 },
  { range: "50-60%", count: 150 },
  { range: "60-70%", count: 120 },
  { range: "70-80%", count: 100 },
  { range: "80-90%", count: 90 },
  { range: "90-100%", count: 80 },
]

export default function StudentProgress() {
  return (
    <Card className="bg-gray-900 border-gray-800 text-white">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="text-lg font-medium">수강생 진행률 현황</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[300px] relative">
          {progressData.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              <div className="w-16 text-xs text-gray-400">{item.range}</div>
              <div className="flex-1 h-8 bg-gray-800 relative">
                <div
                  className="absolute inset-y-0 left-0 bg-red-500"
                  style={{ width: `${(item.count / 450) * 100}%` }}
                ></div>
                <div className="absolute inset-y-0 right-2 flex items-center text-xs">{item.count}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

