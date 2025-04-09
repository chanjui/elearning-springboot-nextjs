"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react" 
interface CourseFaqProps {
  goToPrevStep: () => void
  formData: any
  updateFormData: (field: string, value: any) => void
}


export default function CourseFaq({ goToPrevStep, formData, updateFormData }: CourseFaqProps) {
  // const [faqVisible, setFaqVisible] = useState(false); // ← 요 줄 추가!
  


  const saveCourse = async () => {
    const courseId = formData.courseId;
  
    if (!courseId) {
      alert("강의 ID가 없습니다. 1단계에서 강의를 먼저 생성해주세요.");
      return;
    }
  
    try {
      if (formData.faqs && formData.faqs.length > 0) {
        console.log("📤 전송할 FAQ 리스트:", formData.faqs);
        const response = await fetch(`/api/courses/${courseId}/faq`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData.faqs), // ✅ 한 번에 리스트 전송
        });
  
        if (!response.ok) {
          throw new Error("FAQ 저장 실패: " + response.statusText);
        }
      }
  
      console.log("✅ FAQ 저장 성공");
  
      const confirmed = window.confirm("강의 제작을 완료하셨습니까?");
      if (confirmed) {
        window.location.href = "/instructor/courses/manage";
      }
  
    } catch (err) {
      console.error("FAQ 저장 중 에러 발생:", err);
    }
  };
  
  
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
            <Button
  variant="outline"
  className={`border-gray-700 ${formData.faqVisible === true ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
  onClick={() => updateFormData("faqVisible", true)} // ✅ true = 노출
>
  노출
</Button>

<Button
  variant="outline"
  className={`border-gray-700 ${formData.faqVisible === false ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-800"}`}
  onClick={() => updateFormData("faqVisible", false)} // ✅ false = 노출 안함
>
  노출 안함
</Button>
</div>
          </div>

          <div className="border border-gray-700 rounded-lg p-4 bg-gray-800">
  <div className="mb-4">
    <label className="block text-sm font-medium text-white mb-1">자주 묻는 질문</label>
    <Input
      placeholder="예: 수강 기간은 어떻게 되나요?"
      value={formData.faqQuestion || ""}
      onChange={(e) => updateFormData("faqQuestion", e.target.value)}
      className="border-gray-700 bg-gray-700 text-white"
    />
  </div>

  <div className="mb-4">
    <label className="block text-sm font-medium text-white mb-1">답변</label>
    <Input
      placeholder="예: 결제일로부터 30일입니다."
      value={formData.faqAnswer || ""}
      onChange={(e) => updateFormData("faqAnswer", e.target.value)}
      className="border-gray-700 bg-gray-700 text-white"
    />
  </div>

  <div className="flex justify-end">
  <Button
    className="bg-red-600 hover:bg-red-700 text-white"
    onClick={() => {
      if (!formData.faqQuestion?.trim() || !formData.faqAnswer?.trim()) return;
      console.log("📤 현재 노출 상태:", formData.faqVisible);
      const newFaq = {
        content: formData.faqQuestion,
        answer: formData.faqAnswer,
        isVisible: formData.faqVisible,
      };

      updateFormData("faqs", [...(formData.faqs || []), newFaq]);
      updateFormData("faqQuestion", "");
      updateFormData("faqAnswer", "");
    }}
  >
    추가
  </Button>
</div>
{formData.faqs?.length > 0 && (
  <div className="mt-6">
    <h3 className="text-white font-medium mb-2">등록된 질문</h3>
    <ul className="space-y-2">
      {formData.faqs.map((faq: any, index: number) => (
        <li key={index} className="bg-gray-700 text-white p-3 rounded">
          <div className="font-semibold">Q. {faq.content}</div>
          <div className="text-sm text-gray-300 mt-1">A. {faq.answer}</div>
        </li>
      ))}
    </ul>
  </div>
)}

</div>
        
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep} className="border-gray-700 text-gray-300 hover:bg-gray-800">
          이전
        </Button>
        <Button onClick={saveCourse} className="bg-red-600 hover:bg-red-700 text-white">
          저장 후 제출
        </Button>
      </div>
    </div>
  )
}

