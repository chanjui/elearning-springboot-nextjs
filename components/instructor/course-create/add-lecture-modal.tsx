"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface AddLectureModalProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AddLectureModal({ open, setOpen }: AddLectureModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            onClick={() => setOpen(false)}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            취소
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setOpen(false)}>
            추가
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

