"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, MoreHorizontal, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import NetflixHeader from "@/components/netflix-header"

export default function CommunityPostDetailPage({ params }: { params: { id: string } }) {
  const [commentContent, setCommentContent] = useState("")

  // 예시 게시글 데이터
  const post = {
    id: params.id,
    title: "Docker 컨테이너 간 통신 문제 해결 방법",
    content: `Docker 네트워크에서 컨테이너 간 통신이 되지 않는 문제가 있습니다. bridge 네트워크를 사용 중인데 컨테이너 A에서 컨테이너 B로 ping이 되지 않습니다.

컨테이너 실행 명령어:
\`\`\`
docker run -d --name container-a ubuntu sleep infinity
docker run -d --name container-b ubuntu sleep infinity
\`\`\`

네트워크 설정:
\`\`\`
docker network create my-bridge
docker network connect my-bridge container-a
docker network connect my-bridge container-b
\`\`\`

컨테이너 A에서 컨테이너 B로 ping을 시도하면 "Destination Host Unreachable" 에러가 발생합니다.

혹시 이런 문제를 해결해보신 분 계신가요? 도움 부탁드립니다.`,
    author: "개발자길동",
    authorImage: "/placeholder.svg?height=40&width=40",
    date: "2시간 전",
    views: 120,
    likes: 15,
    category: "질문",
    tags: ["Docker", "네트워크", "컨테이너"],
    comments: [
      {
        id: "c1",
        author: "클라우드마스터",
        authorImage: "/placeholder.svg?height=40&width=40",
        date: "1시간 전",
        content:
          "컨테이너 간 통신 문제는 대부분 네트워크 설정 문제입니다. 먼저 두 컨테이너가 같은 네트워크에 제대로 연결되어 있는지 확인해보세요.\n\n`docker network inspect my-bridge`를 실행해서 두 컨테이너가 모두 나오는지 확인해보세요.",
        likes: 3,
        replies: [],
      },
      {
        id: "c2",
        author: "DevOps엔지니어",
        authorImage: "/placeholder.svg?height=40&width=40",
        date: "30분 전",
        content:
          "Ubuntu 이미지에는 기본적으로 ping 명령어가 설치되어 있지 않을 수 있습니다. 각 컨테이너에 접속해서 다음 명령어로 ping을 설치해보세요:\n\n```\ndocker exec -it container-a apt-get update && apt-get install -y iputils-ping\ndocker exec -it container-b apt-get update && apt-get install -y iputils-ping\n```\n\n그리고 컨테이너 이름이 아닌 IP 주소로 ping을 시도해보세요. Docker의 내장 DNS는 사용자 정의 네트워크에서만 작동합니다.",
        likes: 5,
        replies: [
          {
            id: "r1",
            author: "개발자길동",
            authorImage: "/placeholder.svg?height=40&width=40",
            date: "15분 전",
            content:
              "감사합니다! ping을 설치하고 IP 주소로 시도해보니 통신이 됩니다. 그런데 컨테이너 이름으로는 여전히 안 되네요. 사용자 정의 네트워크를 만들었는데도 DNS가 작동하지 않는 이유가 있을까요?",
            likes: 0,
          },
          {
            id: "r2",
            author: "DevOps엔지니어",
            authorImage: "/placeholder.svg?height=40&width=40",
            date: "10분 전",
            content:
              "컨테이너를 네트워크에 연결할 때 `--network` 옵션을 사용해 처음부터 연결하는 것과 나중에 `docker network connect`로 연결하는 것은 약간 다르게 동작할 수 있습니다. 새 컨테이너를 생성할 때 처음부터 네트워크에 연결해보세요:\n\n```\ndocker run -d --name container-a --network my-bridge ubuntu sleep infinity\ndocker run -d --name container-b --network my-bridge ubuntu sleep infinity\n```\n\n그리고 `/etc/hosts` 파일을 확인해보세요. DNS 확인이 제대로 설정되어 있는지 볼 수 있습니다.",
            likes: 2,
          },
        ],
      },
    ],
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
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Badge
                className={
                  post.category === "질문"
                    ? "bg-red-600"
                    : post.category === "정보"
                      ? "bg-blue-600"
                      : post.category === "후기"
                        ? "bg-green-600"
                        : "bg-gray-600"
                }
              >
                {post.category}
              </Badge>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Share2 className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                    <DropdownMenuItem className="hover:bg-gray-700">
                      <Flag className="h-4 w-4 mr-2" />
                      신고하기
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center">
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <span>조회수: {post.views}</span>
              </div>
            </div>
          </div>

          <Separator className="my-4 bg-gray-800" />

          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <Image
                src={post.authorImage || "/placeholder.svg"}
                alt={post.author}
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-line">{post.content}</p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center text-gray-400 hover:text-white">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>좋아요 {post.likes}</span>
                </button>
                <button className="flex items-center text-gray-400 hover:text-white">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>댓글 {post.comments.length}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">댓글 {post.comments.length}</h2>

            {post.comments.map((comment) => (
              <div key={comment.id} className="border border-gray-800 rounded-lg p-4 mb-4 bg-gray-800/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={comment.authorImage || "/placeholder.svg"}
                      alt={comment.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-gray-400 ml-2">{comment.date}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                          <DropdownMenuItem className="hover:bg-gray-700">
                            <Flag className="h-4 w-4 mr-2" />
                            신고하기
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="prose prose-invert max-w-none">
                      <p className="whitespace-pre-line">{comment.content}</p>
                    </div>

                    <div className="flex items-center gap-4 mt-4">
                      <button className="flex items-center text-gray-400 hover:text-white">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>좋아요 {comment.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-400 hover:text-white">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>답글</span>
                      </button>
                    </div>

                    {/* 답글 목록 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-700 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                              <Image
                                src={reply.authorImage || "/placeholder.svg"}
                                alt={reply.author}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <span className="font-medium">{reply.author}</span>
                                  <span className="text-xs text-gray-400 ml-2">{reply.date}</span>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
                                    <DropdownMenuItem className="hover:bg-gray-700">
                                      <Flag className="h-4 w-4 mr-2" />
                                      신고하기
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="prose prose-invert max-w-none">
                                <p className="whitespace-pre-line">{reply.content}</p>
                              </div>

                              <div className="flex items-center gap-4 mt-4">
                                <button className="flex items-center text-gray-400 hover:text-white">
                                  <ThumbsUp className="h-4 w-4 mr-1" />
                                  <span>좋아요 {reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <h3 className="font-medium mb-2">댓글 작성</h3>
              <Textarea
                placeholder="댓글을 작성해주세요..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="min-h-[100px] bg-gray-800 border-gray-700 text-white mb-2"
              />
              <div className="flex justify-end">
                <Button className="bg-red-600 hover:bg-red-700">댓글 등록</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

