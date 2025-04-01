"use client"

import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CourseCurriculumProps {
  formData: {
    curriculum: {
      title: string
      lectures: {
        title: string
        videoUrl: string
        duration: string
      }[]
    }[]
    [key: string]: any
  }
  updateFormData: (field: string, value: any) => void
  setOpenSectionModal: (open: boolean) => void
  setOpenLectureModal: (open: boolean) => void
  goToPrevStep: () => void
  goToNextStep: () => void
}

export default function CourseCurriculum({
  formData,
  updateFormData,
  setOpenSectionModal,
  setOpenLectureModal,
  goToPrevStep,
  goToNextStep,
}: CourseCurriculumProps) {
  return (
    <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-6 text-white">커리큘럼</h2>

        {formData.curriculum.map((section, sectionIndex) => (
          <div key={sectionIndex} className="border border-gray-700 rounded-lg mb-6 bg-gray-800">
            <div className="bg-gray-800 p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white">{section.title}</h3>
                <div className="flex items-center gap-2">
                  <button className="text-gray-400 hover:text-gray-200">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-400">
                <div className="w-8">순서</div>
                <div className="flex-1">수업을 만들어주세요.</div>
                <div className="w-20"></div>
              </div>

              {section.lectures.length > 0 ? (
                section.lectures.map((lecture, lectureIndex) => (
                  <div key={lectureIndex} className="flex items-center gap-2 py-2 border-b border-gray-700">
                    <div className="w-8 text-center text-gray-400">{lectureIndex + 1}</div>
                    <div className="flex-1 text-white">{lecture.title || "첫번째 수업을 만들어주세요."}</div>
                    <div className="w-20 flex justify-end gap-1">
                      <button className="text-gray-400 hover:text-gray-200">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          ></path>
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-200">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-400">아직 수업이 없습니다.</div>
              )}

              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-gray-700 hover:bg-gray-700"
                  onClick={() => setOpenLectureModal(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> 수업 추가
                </Button>
              </div>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
          onClick={() => setOpenSectionModal(true)}
        >
          <Plus className="h-4 w-4 mr-1" /> 섹션 추가
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep} className="border-gray-700 text-gray-300 hover:bg-gray-800">
          이전
        </Button>
        <Button onClick={goToNextStep} className="bg-red-600 hover:bg-red-700 text-white">
          저장 후 다음 이동
        </Button>
      </div>
    </div>
  )
}

