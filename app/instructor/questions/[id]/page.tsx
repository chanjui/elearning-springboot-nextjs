"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Trash2, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorSidebar from "@/components/instructor/instructor-sidebar"

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  const [replyContent, setReplyContent] = useState("")
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null)
  const [editReplyContent, setEditReplyContent] = useState("")

  const question = {
    id: params.id,
    title: "동일한 쓰레드의 소유권 정책에 대해 궁금합니다.",
    content: `동일한 쓰레드가 write_lock을 들고 있을 때는
     read_lock을 들을 수 있지만 read_lock을 들고 있을 때에는 
     write_lock을 들을 수 없는 것 같아요.`,
    author: "SeungHun Yim",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "2023-03-21 06:38",
    views: 15,
    likes: 0,
    course: "[C++과 언리얼로 만드는 MMORPG 게임 개발 시리즈] Part5: 게임 서버",
    tags: ["mmmorpg", "windows-server"],
    replies: [
      {
        id: "r1",
        author: "Rookiss",
        authorImage: "/placeholder.svg?height=40&width=40",
        date: "2023-03-21 13:42",
        content: "안녕하세요! 궁금하신 부분은 이런 방식으로 처리합니다.",
        likes: 1,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <InstructorSidebar />

        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          <div className="mb-6">
            <Link href="/instructor/questions" className="inline-flex items-center text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              질문 목록으로 돌아가기
            </Link>
          </div>

          <div className="bg-gray-900 rounded-lg border border-gray-800 p-6 mb-8">
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">{question.title}</h1>
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center">
                  <span>{question.date}</span>
                  <span className="mx-2">•</span>
                  <span>조회수: {question.views}</span>
                </div>
                <Badge className="bg-blue-600">{question.course}</Badge>
              </div>
            </div>

            <Separator className="my-4 bg-gray-800" />

            <div className="flex items-start gap-4 mb-6">
              <Image
                src={question.authorImage}
                alt={question.author}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="font-medium mb-2">{question.author}</div>
                <p className="whitespace-pre-line">{question.content}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">답변 {question.replies.length}</h2>

              {question.replies.map((reply) => (
                <div key={reply.id} className="border border-gray-800 rounded-lg p-4 mb-4 bg-gray-800/50">
                  <div className="flex items-start gap-4">
                    <Image
                      src={reply.authorImage}
                      alt={reply.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="font-medium text-green-400">{reply.author}</span>
                          <span className="text-xs text-gray-400 ml-2">{reply.date}</span>
                        </div>
                        <Badge className="bg-green-600">강사</Badge>
                      </div>

                      {editingReplyId === reply.id ? (
                        <>
                          <Textarea
                            value={editReplyContent}
                            onChange={(e) => setEditReplyContent(e.target.value)}
                            className="bg-gray-700 border-gray-600 text-white mb-2"
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setEditingReplyId(null)}
                            >
                              취소
                            </Button>
                            <Button className="bg-green-600">
                              수정완료
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="whitespace-pre-line">{reply.content}</p>
                          <div className="flex justify-end gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingReplyId(reply.id)
                                setEditReplyContent(reply.content)
                              }}
                            >
                              <Pencil className="h-4 w-4 mr-1" /> 수정
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> 삭제
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-6">
                <h3 className="font-medium mb-2">답변 작성</h3>
                <Textarea
                  placeholder="답변을 작성해주세요..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[150px] bg-gray-800 border-gray-700 text-white mb-2"
                />
                <div className="flex justify-end">
                  <Button className="bg-red-600 hover:bg-red-700">답변 등록</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
