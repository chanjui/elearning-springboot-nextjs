"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CourseFaqProps {
  goToPrevStep: () => void
  formData: any
}


export default function CourseFaq({ goToPrevStep, formData }: CourseFaqProps) {
  const saveCourse = async () => {
    const payload = {
      ...formData,
      instructorId: 1 // ✅ 하드코딩된 instructor ID
    }
  
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
  
      if (!res.ok) throw new Error("저장 실패")
  
      console.log("강의 저장 성공")
      // 필요하다면 다음 페이지로 이동
      // router.push("/instructor/courses")
    } catch (err) {
      console.error("저장 중 에러 발생:", err)
    }
  }
  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6 text-white">자주 묻는 질문 설정</h2>

        <div className="mb-6">
          <p className="text-gray-300 mb-4">
            수강생들의 질문이 예상, 자주묻는 질문을 미리 작성해 주세요.
            <br />
            질문들을 모아 강의를 관리하고 학습 만족도를 높여보세요!
          </p>

          <div className="border border-gray-700 rounded-lg p-4 mb-4 bg-gray-800">
            <h3 className="font-medium mb-2 text-white">노출 여부</h3>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-gray-700 bg-red-600 text-white hover:bg-red-700">
                노출
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                노출 안함
              </Button>
            </div>
          </div>

          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
            <div className="flex items-center justify-between mb-4">
              <Input placeholder="수업 노트를 작성해주세요." className="border-gray-700 bg-gray-700 text-white" />
              <Button className="bg-red-600 hover:bg-red-700 text-white ml-2">추가</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep} className="border-gray-700 text-gray-300 hover:bg-gray-800">
          이전
        </Button>
        <Button onClick={saveCourse} className="bg-red-600 hover:bg-red-700 text-white">
          저장 후 다음 이동
        </Button>
      </div>
    </div>
  )
}

