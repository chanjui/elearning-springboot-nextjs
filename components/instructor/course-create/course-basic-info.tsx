"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"


interface CourseBasicInfoProps {
  formData: {
    title: string
    description: string
    [key: string]: any
  }
  updateFormData: (field: string, value: any) => void
  goToNextStep: () => void
  goToPrevStep: () => void
}

export default function CourseBasicInfo({ formData, updateFormData, goToNextStep }: CourseBasicInfoProps) {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  
  //카테고리 목록 불러오기
  useEffect(() => {
    fetch("/api/courses/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
  }, [])

 


  const saveCourse = async () => {
    if (formData.courseId) {
      return saveBasicInfo();
    }
  
    const payload = {
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      instructorId: 1,
    };
  
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) throw new Error("강의 생성 실패");
  
      const data = await res.json();
      console.log("✅ 강의 생성됨, courseId:", data.courseId);
  
      updateFormData("courseId", data.courseId); // ✅ 이게 세팅되면 useEffect가 goToNextStep 실행
      goToNextStep(); // 다음 단계로 이동
    } catch (err) {
      console.error("강의 생성 중 에러:", err);
    }
  };

  const saveBasicInfo = async () => {
    if (!formData.courseId) {
      console.error("❌ courseId가 없습니다. 먼저 강의를 생성해야 합니다.");
      return;
    }
  
    const payload = {
      title: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
    }
  
    try {
      const res = await fetch(`/api/courses/${formData.courseId}/basic-info`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
  
      if (!res.ok) throw new Error("기본 정보 저장 실패")
  
      console.log("✅ 기본 정보 저장 성공")
      goToNextStep()
    } catch (err) {
      console.error("기본 정보 저장 중 에러:", err)
    }
  }

  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6 text-white">강의 정보</h2>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">강의 제목</label>
          <Input
            placeholder="입력한 강의 제목"
            value={formData.title}
            onChange={(e) => updateFormData("title", e.target.value)}
            className="border-gray-700 bg-gray-800 text-white"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">강의 두줄 요약</label>
          <Textarea
            placeholder="강의에 대한 간략한 설명을 입력해주세요."
            value={formData.description}
            onChange={(e) => updateFormData("description", e.target.value)}
            className="min-h-[100px] border-gray-700 bg-gray-800 text-white"
          />
        </div>
        <div className="mb-6">
  <label className="block text-sm font-medium mb-2 text-gray-300">카테고리 선택</label>
  <Select
    value={formData.categoryId?.toString()}
    onValueChange={(val) => updateFormData("categoryId", parseInt(val))}
  >
    <SelectTrigger className="bg-gray-800 text-white border-gray-700">
      <SelectValue placeholder="카테고리를 선택하세요" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((cat) => (
        <SelectItem key={cat.id} value={cat.id.toString()}>
          {cat.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">이런 걸 배울 수 있어요</label>
          <Input
            placeholder="자바스크립트 기본기를 확실히 다지기"
            className="border-gray-700 bg-gray-800 text-white mb-2"
          />
          <Button variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
            추가
          </Button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">이런 분들에게 추천해요</label>
          <Input placeholder="OOO강의가 좋았던 분들" className="border-gray-700 bg-gray-800 text-white mb-2" />
          <Button variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
            추가
          </Button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">선수 지식이 필요한가요? (선택)</label>
          <Textarea placeholder="" className="min-h-[100px] border-gray-700 bg-gray-800 text-white" />
        </div>
      </div>

      <div className="flex justify-between">
        <div></div>
        <Button onClick={saveCourse} className="bg-red-600 hover:bg-red-700 text-white">
  저장 후 다음 이동
</Button>
      </div>
    </div>
  )
}

