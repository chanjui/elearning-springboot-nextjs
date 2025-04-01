"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface CoursePricingProps {
  formData: {
    price: number
    discountRate: number
    discountPrice: number
    [key: string]: any
  }
  updateFormData: (field: string, value: any) => void
  goToPrevStep: () => void
  goToNextStep: () => void
}

export default function CoursePricing({ formData, updateFormData, goToPrevStep, goToNextStep }: CoursePricingProps) {
  return (
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
                  <span className="text-sm text-gray-400 ml-2 line-through">{formData.price.toLocaleString()}원</span>
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

