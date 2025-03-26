"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bold, Italic, List, ListOrdered, Code, ImageIcon, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import NetflixHeader from "@/components/netflix-header"

export default function CommunityWritePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("질문")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [showImageUploadModal, setShowImageUploadModal] = useState(false)

  // 태그 추가
  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  // 태그 삭제
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  // 게시글 작성 완료
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 여기에 게시글 저장 로직 추가
    console.log({
      title,
      content,
      category,
      tags,
    })

    // 작성 완료 후 커뮤니티 메인 페이지로 이동
    router.push("/user/community")
  }

  // 이미지 업로드 핸들러
  const handleImageUpload = () => {
    // 실제 구현에서는 이미지 업로드 로직 추가
    setShowImageUploadModal(false)

    // 이미지 URL을 본문에 추가하는 예시
    setContent((prev) => `${prev}\n![이미지 설명](/placeholder.svg?height=300&width=500)\n`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/user/community" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            커뮤니티로 돌아가기
          </Link>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">게시글 작성</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                카테고리
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="질문">질문</SelectItem>
                  <SelectItem value="정보">정보</SelectItem>
                  <SelectItem value="후기">후기</SelectItem>
                  <SelectItem value="커리어">커리어</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                제목
              </label>
              <Input
                id="title"
                placeholder="제목을 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium mb-2">
                내용
              </label>
              <div className="flex items-center gap-1 p-2 border border-gray-700 rounded-t-lg bg-gray-800">
                <button type="button" className="p-1 hover:bg-gray-700 rounded text-gray-300">
                  <Bold className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 hover:bg-gray-700 rounded text-gray-300">
                  <Italic className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 hover:bg-gray-700 rounded text-gray-300">
                  <LinkIcon className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 hover:bg-gray-700 rounded text-gray-300">
                  <List className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 hover:bg-gray-700 rounded text-gray-300">
                  <ListOrdered className="h-4 w-4" />
                </button>
                <button type="button" className="p-1 hover:bg-gray-700 rounded text-gray-300">
                  <Code className="h-4 w-4" />
                </button>
                <Dialog open={showImageUploadModal} onOpenChange={setShowImageUploadModal}>
                  <DialogTrigger asChild>
                    <button type="button" className="p-1 hover:bg-gray-700 rounded text-gray-300">
                      <ImageIcon className="h-4 w-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 text-white">
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
                      <Button className="bg-red-600 hover:bg-red-700" onClick={handleImageUpload}>
                        업로드
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <Textarea
                id="content"
                placeholder="내용을 입력해주세요. 마크다운 형식을 지원합니다."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] rounded-t-none border-t-0 border-gray-700 bg-gray-800 text-white"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-medium mb-2">
                태그
              </label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="태그를 입력하고 엔터를 누르세요"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  추가
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-800 text-white px-2 py-1 rounded-md">
                      <span>{tag}</span>
                      <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-white">
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/user/community")}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                취소
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                등록하기
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

