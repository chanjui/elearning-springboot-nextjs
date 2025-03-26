"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ChevronDown, MessageSquare, ThumbsUp, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import NetflixHeader from "@/components/netflix-header"

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // 예시 데이터
  const posts = [
    {
      id: "1",
      title: "Docker 네트워크 설정 시 컨테이너 간 통신이 안 되는 문제",
      author: "개발자길동",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023.10.27",
      category: "질문",
      views: 245,
      likes: 12,
      comments: 8,
      tags: ["Docker", "네트워크", "컨테이너"],
    },
    {
      id: "2",
      title: "React와 TypeScript로 Todo 앱 만들기 - 초보자를 위한 가이드",
      author: "프론트엔드개발자",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023.10.26",
      category: "정보",
      views: 1245,
      likes: 89,
      comments: 23,
      tags: ["React", "TypeScript", "웹개발"],
    },
    {
      id: "3",
      title: "인프런 '비전공자를 위한 Python' 강의 수강 후기",
      author: "코딩초보자",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023.10.25",
      category: "후기",
      views: 876,
      likes: 45,
      comments: 12,
      tags: ["Python", "강의후기", "비전공자"],
    },
    {
      id: "4",
      title: "Spring Boot 3.0 마이그레이션 경험 공유",
      author: "백엔드개발자",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023.10.24",
      category: "정보",
      views: 932,
      likes: 67,
      comments: 15,
      tags: ["Spring Boot", "Java", "마이그레이션"],
    },
    {
      id: "5",
      title: "개발자 취업 준비, 어떻게 하고 계신가요?",
      author: "취준생",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023.10.23",
      category: "질문",
      views: 1532,
      likes: 34,
      comments: 42,
      tags: ["취업", "개발자", "포트폴리오"],
    },
    {
      id: "6",
      title: "인프런 '쿠버네티스 완벽 가이드' 강의 후기",
      author: "DevOps엔지니어",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023.10.22",
      category: "후기",
      views: 654,
      likes: 28,
      comments: 7,
      tags: ["쿠버네티스", "DevOps", "강의후기"],
    },
    {
      id: "7",
      title: "프론트엔드 개발자를 위한 디자인 시스템 구축 방법",
      author: "UI개발자",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023.10.21",
      category: "정보",
      views: 789,
      likes: 56,
      comments: 18,
      tags: ["디자인시스템", "프론트엔드", "UI/UX"],
    },
    {
      id: "8",
      title: "개발자 번아웃, 어떻게 극복하셨나요?",
      author: "지친개발자",
      authorImage: "/placeholder.svg?height=40&width=40",
      date: "2023.10.20",
      category: "질문",
      views: 2145,
      likes: 132,
      comments: 87,
      tags: ["번아웃", "개발자", "멘탈관리"],
    },
  ]

  // 카테고리별 배지 색상
  const categoryColor = (category: string) => {
    switch (category) {
      case "질문":
        return "bg-red-600"
      case "정보":
        return "bg-blue-600"
      case "후기":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="커뮤니티 검색"
              className="pl-10 bg-gray-800 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/user/community/write">
            <Button className="bg-red-600 hover:bg-red-700">글쓰기</Button>
          </Link>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-6 bg-gray-800">
            <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
              전체
            </TabsTrigger>
            <TabsTrigger value="question" className="data-[state=active]:bg-gray-700">
              질문
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-gray-700">
              정보
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:bg-gray-700">
              후기
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-400">총 {posts.length}개 게시글</div>

            <div className="flex items-center">
              <Button variant="ghost" size="sm" className="text-sm flex items-center text-gray-300 hover:text-white">
                최신순
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700" />
              <Button variant="ghost" size="sm" className="text-sm text-gray-300 hover:text-white">
                인기순
              </Button>
              <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700" />
              <Button variant="ghost" size="sm" className="text-sm text-gray-300 hover:text-white">
                댓글순
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="space-y-4">
              {posts.map((post) => (
                <Link key={post.id} href={`/user/community/post/${post.id}`}>
                  <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={categoryColor(post.category)}>{post.category}</Badge>
                      <div className="text-sm text-gray-400">{post.date}</div>
                    </div>
                    <h3 className="font-medium text-lg mb-2">{post.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={post.authorImage || "/placeholder.svg"}
                          alt={post.author}
                          width={24}
                          height={24}
                          className="rounded-full mr-2"
                        />
                        <span className="text-sm">{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                더 보기
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="question" className="mt-0">
            <div className="space-y-4">
              {posts
                .filter((post) => post.category === "질문")
                .map((post) => (
                  <Link key={post.id} href={`/user/community/post/${post.id}`}>
                    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={categoryColor(post.category)}>{post.category}</Badge>
                        <div className="text-sm text-gray-400">{post.date}</div>
                      </div>
                      <h3 className="font-medium text-lg mb-2">{post.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image
                            src={post.authorImage || "/placeholder.svg"}
                            alt={post.author}
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                          <span className="text-sm">{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="mt-0">
            <div className="space-y-4">
              {posts
                .filter((post) => post.category === "정보")
                .map((post) => (
                  <Link key={post.id} href={`/user/community/post/${post.id}`}>
                    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={categoryColor(post.category)}>{post.category}</Badge>
                        <div className="text-sm text-gray-400">{post.date}</div>
                      </div>
                      <h3 className="font-medium text-lg mb-2">{post.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image
                            src={post.authorImage || "/placeholder.svg"}
                            alt={post.author}
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                          <span className="text-sm">{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="review" className="mt-0">
            <div className="space-y-4">
              {posts
                .filter((post) => post.category === "후기")
                .map((post) => (
                  <Link key={post.id} href={`/user/community/post/${post.id}`}>
                    <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:border-gray-700 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={categoryColor(post.category)}>{post.category}</Badge>
                        <div className="text-sm text-gray-400">{post.date}</div>
                      </div>
                      <h3 className="font-medium text-lg mb-2">{post.title}</h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="border-gray-700 text-gray-300">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Image
                            src={post.authorImage || "/placeholder.svg"}
                            alt={post.author}
                            width={24}
                            height={24}
                            className="rounded-full mr-2"
                          />
                          <span className="text-sm">{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

