"use client"

import { Button } from "@/components/ui/button"

interface CourseCoverImageProps {
  goToPrevStep: () => void
  goToNextStep: () => void
}

export default function CourseCoverImage({ goToPrevStep, goToNextStep }: CourseCoverImageProps) {
  return (
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
            <p className="text-sm text-gray-400">이미지 크기: 1200 x 760px (jpg, jpeg, png 형식만 가능합니다)</p>
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

