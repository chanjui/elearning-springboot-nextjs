"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/user/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/user/ui/card"
import { Button } from "@/components/user/ui/button"
import { MessageSquare, FileText, Code, Users, ExternalLink, ThumbsUp, MessageCircle, Calendar } from "lucide-react"
import { Badge } from "@/components/user/ui/badge"

// 게시글 타입 정의
interface Post {
  id: number
  title: string
  content: string
  category: "question" | "project" | "free" | "other"
  createdAt: string
  commentCount: number
  likeCount: number
  viewCount: number
  thumbnailUrl?: string
  solved?: boolean
}

// Mock data for demonstration
const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: "React에서 상태 관리 라이브러리 추천해주세요",
    content:
      "현재 중규모 프로젝트를 진행 중인데, 상태 관리 라이브러리를 고민하고 있습니다. Redux, Recoil, Zustand 등 어떤 것이 좋을까요?",
    category: "question",
    createdAt: "2023-10-15T14:30:00",
    commentCount: 8,
    likeCount: 5,
    viewCount: 120,
    solved: true,
  },
  {
    id: 2,
    title: "Next.js 13 App Router 사용 경험 공유",
    content: "Next.js 13의 App Router를 실무에 적용해봤는데, 장단점과 경험을 공유합니다.",
    category: "free",
    createdAt: "2023-10-10T09:15:00",
    commentCount: 12,
    likeCount: 24,
    viewCount: 345,
  },
  {
    id: 3,
    title: "개인 포트폴리오 웹사이트 프로젝트",
    content: "React와 Three.js를 활용한 3D 인터랙티브 포트폴리오 웹사이트를 만들었습니다. 피드백 부탁드립니다!",
    category: "project",
    createdAt: "2023-10-05T18:45:00",
    commentCount: 6,
    likeCount: 18,
    viewCount: 210,
    thumbnailUrl: "/placeholder.svg?height=120&width=200",
  },
  {
    id: 4,
    title: "TypeScript 타입 추론 관련 질문",
    content: "제네릭을 사용할 때 타입 추론이 제대로 되지 않는 문제가 있습니다. 어떻게 해결할 수 있을까요?",
    category: "question",
    createdAt: "2023-09-28T11:20:00",
    commentCount: 4,
    likeCount: 3,
    viewCount: 98,
    solved: false,
  },
  {
    id: 5,
    title: "개발자 번아웃 극복 방법",
    content: "최근 번아웃을 경험하고 있는데, 다른 개발자분들은 어떻게 극복하시나요?",
    category: "free",
    createdAt: "2023-09-20T16:10:00",
    commentCount: 15,
    likeCount: 32,
    viewCount: 421,
  },
  {
    id: 6,
    title: "실시간 채팅 애플리케이션 개발 프로젝트",
    content: "Socket.io와 Express를 사용한 실시간 채팅 애플리케이션을 개발했습니다. 코드 리뷰 부탁드립니다.",
    category: "project",
    createdAt: "2023-09-15T13:25:00",
    commentCount: 9,
    likeCount: 14,
    viewCount: 187,
    thumbnailUrl: "/placeholder.svg?height=120&width=200",
  },
]

export default function Community() {
  const [activeTab, setActiveTab] = useState("all")

  // 실제 구현에서는 API 호출로 데이터를 가져올 것입니다
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)

  // 탭에 따라 게시글 필터링
  const filteredPosts = posts.filter((post) => {
    if (activeTab === "all") return true
    if (activeTab === "question") return post.category === "question"
    if (activeTab === "project") return post.category === "project"
    if (activeTab === "free") return post.category === "free"
    return false
  })

  // 게시글 삭제
  const handleDeletePost = async (postId: number) => {
    try {
      // API 호출 (실제 구현 시)
      // await fetch(`/api/posts/${postId}`, {
      //   method: "DELETE",
      //   credentials: "include",
      // });

      // 성공 시 UI 업데이트
      setPosts(posts.filter((post) => post.id !== postId))
    } catch (error) {
      console.error("게시글 삭제 실패:", error)
      alert("게시글 삭제 중 오류가 발생했습니다.")
    }
  }

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 카테고리에 따른 아이콘 반환
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "question":
        return <MessageSquare className="h-4 w-4" />
      case "project":
        return <Code className="h-4 w-4" />
      case "free":
        return <Users className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // 카테고리에 따른 한글 이름 반환
  const getCategoryName = (category: string) => {
    switch (category) {
      case "question":
        return "질문 및 답변"
      case "project":
        return "프로젝트"
      case "free":
        return "자유게시판"
      default:
        return "기타"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-800 text-white">
        <CardHeader>
          <CardTitle className="text-lg">내 커뮤니티 활동</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-800">
              <TabsTrigger
                value="all"
                className={`data-[state=active]:bg-gray-700 ${activeTab === "all" ? "text-red-500" : "text-gray-400"}`}
              >
                <FileText className="h-4 w-4 mr-2" />
                전체
              </TabsTrigger>
              <TabsTrigger
                value="question"
                className={`data-[state=active]:bg-gray-700 ${activeTab === "question" ? "text-red-500" : "text-gray-400"}`}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                질문 및 답변
              </TabsTrigger>
              <TabsTrigger
                value="project"
                className={`data-[state=active]:bg-gray-700 ${activeTab === "project" ? "text-red-500" : "text-gray-400"}`}
              >
                <Code className="h-4 w-4 mr-2" />
                프로젝트
              </TabsTrigger>
              <TabsTrigger
                value="free"
                className={`data-[state=active]:bg-gray-700 ${activeTab === "free" ? "text-red-500" : "text-gray-400"}`}
              >
                <Users className="h-4 w-4 mr-2" />
                자유게시판
              </TabsTrigger>
            </TabsList>

            {/* 모든 탭에 대한 콘텐츠 */}
            <TabsContent value={activeTab} className="pt-6">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>작성한 게시글이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-start">
                        {post.thumbnailUrl && (
                          <div className="relative w-[100px] h-[70px] rounded-md overflow-hidden bg-gray-700 mr-4 flex-shrink-0">
                            <Image
                              src={post.thumbnailUrl || "/placeholder.svg"}
                              alt={post.title}
                              width={100}
                              height={70}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <Badge variant="outline" className="mr-2 text-xs bg-gray-700 text-gray-300 border-gray-600">
                              {getCategoryIcon(post.category)}
                              <span className="ml-1">{getCategoryName(post.category)}</span>
                            </Badge>
                            {post.category === "question" && (
                              <Badge className={`text-xs ${post.solved ? "bg-green-600" : "bg-yellow-600"}`}>
                                {post.solved ? "해결됨" : "미해결"}
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-medium text-lg mb-1">{post.title}</h3>
                          <p className="text-sm text-gray-400 line-clamp-2 mb-2">{post.content}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <div className="flex items-center mr-3">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(post.createdAt)}
                            </div>
                            <div className="flex items-center mr-3">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {post.likeCount}
                            </div>
                            <div className="flex items-center mr-3">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              {post.commentCount}
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              {post.viewCount}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:bg-gray-700"
                            onClick={() => window.open(`/community/posts/${post.id}`, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            보기
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-700 text-gray-300 hover:bg-gray-700"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            삭제
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
