"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Check,
  X,
  Plus,
  Upload,
  Info,
  FileText,
  Settings,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Code,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// Image 컴포넌트 import 추가
import Image from "next/image"

// 강의 생성 단계
const STEPS = [
  { id: "basic-info", label: "강의 정보", icon: Info },
  { id: "detailed-description", label: "강의 상세 설명", icon: FileText },
  { id: "curriculum", label: "커리큘럼", icon: FileText },
  { id: "intro", label: "상세소개", icon: FileText, subLabel: "200자 이상 작성" },
  { id: "cover-image", label: "커버 이미지", icon: Upload },
  { id: "pricing", label: "강의 설정", icon: Settings },
  { id: "faq", label: "자주 묻는 질문", icon: FileText },
]

export default function CreateCoursePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState("basic-info")
  const [openSectionModal, setOpenSectionModal] = useState(false)
  const [openLectureModal, setOpenLectureModal] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [showImageUploadModal, setShowImageUploadModal] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    detailedDescription: "",
    tags: [""],
    level: "beginner",
    category: "",
    subCategory: "",
    coverImage: null,
    introVideo: null,
    curriculum: [{ title: "섹션 1", lectures: [{ title: "", videoUrl: "", duration: "" }] }],
    price: 0,
    discountPrice: 0,
    discountRate: 0, // Add discount rate field
    isPublic: true,
  })

  // 섹션 제목을 추적하기 위한 상태 변수를 추가합니다.
  const [newSectionTitle, setNewSectionTitle] = useState("섹션 2")

  // 이미지 업로드 관련 상태 추가
  // const [uploadedImages, setUploadedImages = useState<string[]>([])
  // const [showImageUploadModal, setShowImageUploadModal] = useState(false)

  // 이미지 업로드 관련 상태 추가
  // const [uploadedImages, setUploadedImages] = useState<string[]>([])
  // const [showImageUploadModal, setShowImageUploadModal] = useState(false)

  // 현재 단계 인덱스
  const currentStepIndex = STEPS.findIndex((step) => step.id === currentStep)

  // 다음 단계로 이동
  const goToNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1].id)
    }
  }

  // 이전 단계로 이동
  const goToPrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1].id)
    }
  }

  // 특정 단계로 이동
  const goToStep = (stepId: string) => {
    setCurrentStep(stepId)
  }

  // 폼 데이터 업데이트
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // 태그 추가
  const addTag = () => {
    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, ""],
    }))
  }

  // 태그 업데이트
  const updateTag = (index: number, value: string) => {
    const newTags = [...formData.tags]
    newTags[index] = value
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
  }

  // 태그 삭제
  const removeTag = (index: number) => {
    const newTags = [...formData.tags]
    newTags.splice(index, 1)
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }))
  }

  // 강의 저장
  const saveCourse = () => {
    console.log("강의 저장:", formData)
    // API 호출 로직 추가
    router.push("/instructor/courses")
  }

  // 이미지 업로드 핸들러 함수 추가
  const handleImageUpload = () => {
    // 실제 구현에서는 파일 선택 및 업로드 로직이 들어갑니다
    // 여기서는 예시로 더미 이미지 URL을 추가합니다
    const newImageUrl = `/placeholder.svg?height=300&width=500&text=Uploaded+Image+${uploadedImages.length + 1}`
    setUploadedImages([...uploadedImages, newImageUrl])
    setShowImageUploadModal(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 상단 헤더 */}
      <div className="bg-gray-900 text-white py-3 px-6 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-xl font-bold">입력한 강의 제목</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white text-black hover:bg-gray-100">
            강의 보기
          </Button>
          <Button variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
            저장
          </Button>
          <Button variant="outline" className="bg-gray-500 text-white hover:bg-gray-600">
            제출
          </Button>
          <Button variant="outline" className="bg-transparent text-white hover:bg-gray-800">
            X
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* 왼쪽 사이드바: 강의 제작 순서 */}
        <div className="w-64 bg-gray-900 min-h-screen p-6 border-r border-gray-800">
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 text-white">강의 제작</h2>
            <ul className="space-y-6">
              {STEPS.map((step, index) => {
                const isActive = step.id === currentStep
                const isCompleted = STEPS.findIndex((s) => s.id === currentStep) > index

                return (
                  <li key={step.id} className="relative">
                    {index > 0 && (
                      <div
                        className={`absolute left-3 -top-6 w-0.5 h-6 ${
                          isCompleted || isActive ? "bg-red-500" : "bg-gray-700"
                        }`}
                      />
                    )}
                    <button className="flex items-center w-full text-left" onClick={() => goToStep(step.id)}>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          isActive
                            ? "bg-red-600 text-white"
                            : isCompleted
                              ? "bg-red-600 text-white"
                              : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {isCompleted ? <Check className="h-3 w-3" /> : <span className="text-xs">{index + 1}</span>}
                      </div>
                      <div>
                        <div className={`font-medium ${isActive ? "text-white" : "text-gray-300"}`}>{step.label}</div>
                        {step.subLabel && <div className="text-xs text-gray-400">{step.subLabel}</div>}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* 오른쪽: 현재 단계 폼 */}
        <div className="flex-1 p-8 bg-black">
          {/* 강의 정보 단계 */}
          {currentStep === "basic-info" && (
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
                <Button onClick={goToNextStep} className="bg-red-600 hover:bg-red-700 text-white">
                  저장 후 다음 이동
                </Button>
              </div>
            </div>
          )}

          {/* 강의 상세 설명 단계 */}
          {currentStep === "detailed-description" && (
            <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-6 text-white">강의 상세 설명</h2>
                <p className="text-sm text-gray-400 mb-4">강의에 대한 상세한 설명과 이미지를 추가해보세요.</p>

                <div className="mb-6">
                  <div className="flex items-center gap-1 p-2 border border-gray-700 rounded-t-lg bg-gray-800">
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <Bold className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <Italic className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <Link className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <List className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <ListOrdered className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <Code className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-700 rounded text-gray-300"
                      onClick={() => setShowImageUploadModal(true)}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <Textarea
                    placeholder="강의에 대한 상세한 설명을 작성해주세요. 마크다운 형식을 지원합니다."
                    value={formData.detailedDescription}
                    onChange={(e) => updateFormData("detailedDescription", e.target.value)}
                    className="min-h-[300px] rounded-t-none border-t-0 border-gray-700 bg-gray-800 text-white"
                  />
                </div>

                {uploadedImages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2 text-white">업로드된 이미지</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {uploadedImages.map((imageUrl, index) => (
                        <div key={index} className="border border-gray-700 rounded-lg p-2 bg-gray-800">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={`Uploaded image ${index + 1}`}
                            width={500}
                            height={300}
                            className="w-full h-auto rounded"
                          />
                          <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-400">이미지 {index + 1}</span>
                            <button
                              className="text-red-500 hover:text-red-400"
                              onClick={() => {
                                const newImages = [...uploadedImages]
                                newImages.splice(index, 1)
                                setUploadedImages(newImages)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  onClick={() => setShowImageUploadModal(true)}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  이미지 추가하기
                </Button>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  이전
                </Button>
                <Button onClick={goToNextStep} className="bg-red-600 hover:bg-red-700 text-white">
                  저장 후 다음 이동
                </Button>
              </div>
            </div>
          )}

          {/* 커리큘럼 단계 */}
          {currentStep === "curriculum" && (
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
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  이전
                </Button>
                <Button onClick={goToNextStep} className="bg-red-600 hover:bg-red-700 text-white">
                  저장 후 다음 이동
                </Button>
              </div>
            </div>
          )}

          {/* 상세소개 단계 */}
          {currentStep === "intro" && (
            <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-6 text-white">상세소개</h2>
                <p className="text-sm text-gray-400 mb-4">200자 이상 작성</p>

                <div className="border border-gray-700 rounded-lg mb-6 bg-gray-800">
                  <div className="flex items-center gap-1 p-2 border-b border-gray-700 bg-gray-800">
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <Bold className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <Italic className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <Link className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <List className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <ListOrdered className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <Code className="h-4 w-4" />
                    </button>
                    <button className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="p-4 min-h-[300px]">
                    <p className="text-gray-400">본문을 작성할 수 있어요</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  이전
                </Button>
                <Button onClick={goToNextStep} className="bg-red-600 hover:bg-red-700 text-white">
                  저장 후 다음 이동
                </Button>
              </div>
            </div>
          )}

          {/* 커버 이미지 단계 */}
          {currentStep === "cover-image" && (
            <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-6 text-white">커버 이미지</h2>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2 text-white">강의 커버 이미지 (대표용) 업로드</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    일반 커버 이미지(카드형태)를 제작하실 경우, 인프런 권장사항을 참고해 주세요.
                    <br />
                    이미지가 규격에 맞지 않을 경우, 중앙을 중심으로 잘리게 됩니다.
                  </p>

                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center bg-gray-800">
                    <div className="mb-4">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">파일 선택</button>
                    </div>
                    <p className="text-sm text-gray-400">
                      이미지 크기: 1200 x 760px (jpg, jpeg, png 형식만 가능합니다)
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2 text-white">홍보영상 업로드 (선택)</h3>
                  <p className="text-sm text-gray-400 mb-4">홍보영상은 강의를 수강하지 않은 분들에게도 공개됩니다.</p>

                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center bg-gray-800">
                    <div className="mb-4">
                      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">파일 선택</button>
                    </div>
                    <p className="text-sm text-gray-400">최대 용량: 5GB (mp4, mov 형식만 가능합니다)</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  이전
                </Button>
                <Button onClick={goToNextStep} className="bg-red-600 hover:bg-red-700 text-white">
                  저장 후 다음 이동
                </Button>
              </div>
            </div>
          )}

          {/* 강의 설정 단계 */}
          {currentStep === "pricing" && (
            <div className="bg-gray-900 p-8 rounded-lg shadow-sm border border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-6 text-white">강의 설정</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 text-white">강의 설정 - 가격 및 수강 기간</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    설정에 따라 강의 가격과 수강 기간이 달라집니다.
                    <br />
                    수강 기간은 결제 후 수강 신청시 기간이 설정됩니다.
                  </p>

                  <div className="border border-gray-700 rounded-lg p-4 mb-4 bg-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-medium text-white">가격 설정</label>
                      <div className="text-sm text-gray-400">(가격 설정에 따라 수강 기간이 달라집니다)</div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Input
                        type="number"
                        placeholder="0"
                        value={formData.price || ""}
                        onChange={(e) => updateFormData("price", Number.parseInt(e.target.value) || 0)}
                        className="w-32 border-gray-700 bg-gray-700 text-white"
                      />
                      <span className="text-white">원</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <label className="text-white mr-2">할인율</label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={formData.discountRate || ""}
                        onChange={(e) => {
                          const rate = Math.min(100, Math.max(0, Number.parseInt(e.target.value) || 0))
                          updateFormData("discountRate", rate)
                          if (formData.price > 0) {
                            const discountedPrice = formData.price * (1 - rate / 100)
                            updateFormData("discountPrice", Math.floor(discountedPrice))
                          }
                        }}
                        className="w-20 border-gray-700 bg-gray-700 text-white"
                      />
                      <span className="text-white">%</span>
                    </div>

                    {formData.discountRate > 0 && formData.price > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-400">할인 적용 가격:</div>
                        <div className="text-lg text-red-500 font-bold">
                          {Math.floor(formData.price * (1 - formData.discountRate / 100)).toLocaleString()}원
                          <span className="text-sm text-gray-400 ml-2 line-through">
                            {formData.price.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-gray-400">
                      수강생에게 제공되는 가격:{" "}
                      {formData.discountRate > 0
                        ? Math.floor(formData.price * (1 - formData.discountRate / 100)).toLocaleString()
                        : formData.price.toLocaleString()}
                      원
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 text-white">강의 영상보기 제한</h3>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="border-gray-700 bg-red-600 text-white hover:bg-red-700">
                      무제한
                    </Button>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      기간 설정
                    </Button>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      URL 접근 방지
                    </Button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 text-white">수강 기한</h3>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" className="border-gray-700 bg-red-600 text-white hover:bg-red-700">
                      무제한
                    </Button>
                    <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                      단일 기간
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  이전
                </Button>
                <Button onClick={goToNextStep} className="bg-red-600 hover:bg-red-700 text-white">
                  저장 후 다음 이동
                </Button>
              </div>
            </div>
          )}

          {/* 자주 묻는 질문 단계 */}
          {currentStep === "faq" && (
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
                      <Input
                        placeholder="수업 노트를 작성해주세요."
                        className="border-gray-700 bg-gray-700 text-white"
                      />
                      <Button className="bg-red-600 hover:bg-red-700 text-white ml-2">추가</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPrevStep}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  이전
                </Button>
                <Button onClick={saveCourse} className="bg-red-600 hover:bg-red-700 text-white">
                  저장 후 다음 이동
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 섹션 추가 모달 */}
      <Dialog open={openSectionModal} onOpenChange={setOpenSectionModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>섹션 추가</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">제목</label>
            <Input
              placeholder="섹션을 입력해주세요."
              className="border-gray-700 bg-gray-800 text-white"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenSectionModal(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              취소
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                // 새 섹션 추가
                const updatedCurriculum = [
                  ...formData.curriculum,
                  {
                    title: newSectionTitle,
                    lectures: [],
                  },
                ]
                updateFormData("curriculum", updatedCurriculum)
                setOpenSectionModal(false)
                // 다음 섹션 번호 준비
                const nextSectionNumber = updatedCurriculum.length + 1
                setNewSectionTitle(`섹션 ${nextSectionNumber}`)
              }}
            >
              추가
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 수업 추가 모달 */}
      <Dialog open={openLectureModal} onOpenChange={setOpenLectureModal}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>수업 추가</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">수업 제목</label>
            <Input placeholder="첫번째 수업을 만들어주세요." className="border-gray-700 bg-gray-800 text-white mb-4" />

            <label className="block text-sm font-medium mb-2">영상 업로드</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">최대 5GB (.mp4, .mkv, .m4v, .mov 만 가능), 최소 720p 이상</p>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                파일 선택
              </Button>
            </div>
            <label className="block text-sm font-medium mb-4 mt-4">수업 관련 파일</label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">PDF, ZIP, DOC 등 수업 자료를 업로드하세요 (최대 100MB)</p>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                파일 선택
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenLectureModal(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              취소
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setOpenLectureModal(false)}>
              추가
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 이미지 업로드 모달 */}
      <Dialog open={showImageUploadModal} onOpenChange={setShowImageUploadModal}>
        <DialogContent className="bg-gray-900 border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>이미지 업로드</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-400 mb-4">이미지를 여기에 드래그하거나 파일을 선택하세요</p>
              <p className="text-xs text-gray-500 mb-4">지원 형식: JPG, PNG, GIF (최대 5MB)</p>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                파일 선택
              </Button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowImageUploadModal(false)}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              취소
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleImageUpload}>
              업로드
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

