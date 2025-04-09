"use client"

import {useState} from "react"
import Link from "next/link"
import {ChevronDown, Clock, Eye, Filter, Flame, Hash, MessageSquare, Search, ThumbsUp, X} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {ScrollArea} from "@/components/ui/scroll-area"
import NetflixHeader from "@/components/netflix-header"

// 임시 데이터
const POSTS = [
  {
    id: 1,
    title: "PDF 파일 관련",
    content: "쓰신 10, 이론 문제 푸실하기? 정리되는 전현택 수식 pdf 내용과 수식 내용이 너무 다른데 어떤걸 위주로 하면 좋을까요...",
    tags: ["python", "java", "c", "정보처리기사"],
    author: {
      name: "janeeee",
      image: "/avatars/1.png",
      level: "시니어"
    },
    likes: 0,
    views: 1,
    comments: 0,
    createdAt: "2025년 일주일전에 작성",
    category: "질문 & 답변"
  },
  {
    id: 2,
    title: "4분 완전수",
    content: "4/00초 완전수 구하는 문제 완전수가 60이랑 28이 있는데 완전수를 어떻게 구하나요? 아니면 일일히 for 문을 돌려서...",
    tags: ["python", "java", "c", "정보처리기사"],
    author: {
      name: "삼려계발",
      image: "/avatars/2.png",
      level: "주니어"
    },
    likes: 0,
    views: 1,
    comments: 1,
    createdAt: "2025년 9분전",
    category: "질문 & 답변"
  }
]

const CATEGORIES = [
  {id: "all", name: "전체", icon: Filter},
  {id: "qna", name: "질문 & 답변", icon: MessageSquare},
  {id: "projects", name: "프로젝트", icon: Clock},
  {id: "free", name: "자유게시판", icon: Flame}
]

export default function CommunityPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [tagQuery, setTagQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("latest")

  // 정렬 옵션에 따른 게시글 정렬
  const sortedPosts = [...POSTS].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.likes - a.likes
      case "views":
        return b.views - a.views
      case "comments":
        return b.comments - a.comments
      default:
        return 0 // 최신순은 이미 정렬되어 있다고 가정
    }
  })

  // 필터링된 게시글
  const selectedCategoryName = CATEGORIES.find(c => c.id === selectedCategory)?.name || ""

  const filteredPosts = sortedPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategoryName
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.every((tag) => post.tags.includes(tag))
    return matchesCategory && matchesSearch && matchesTags
  })


  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag)
      }
      return [...prev, tag]
    })
  }

  const resetFilters = () => {
    setSearchQuery("")
    setTagQuery("")
    setSelectedTags([])
    setSelectedCategory("all")
    setSortBy("latest")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader/>

      <main className="container mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">개발자 커뮤니티</h1>
          <Button className="bg-red-600 hover:bg-red-700">
            글쓰기
          </Button>
        </div>

        {/* 검색 영역 */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
              <input
                type="text"
                placeholder="궁금한 내용을 검색해보세요!"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
              <input
                type="text"
                placeholder="태그를 검색해보세요!"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={resetFilters}
            >
              <X className="h-4 w-4 mr-2"/>
              초기화
            </Button>
          </div>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  onClick={() => handleTagSelect(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 ml-1"/>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 좌측: 카테고리 필터 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-medium">카테고리</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-400px)]">
                <div className="p-2">
                  {CATEGORIES.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? "bg-red-500/10 text-red-500"
                            : "text-gray-400 hover:bg-gray-800/50"
                        }`}
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon className="h-5 w-5"/>
                        {category.name}
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* 중앙: 게시글 목록 */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-gray-400">
                총 {filteredPosts.length}개의 게시글
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    {sortBy === "latest" && "최신순"}
                    {sortBy === "popular" && "인기순"}
                    {sortBy === "views" && "조회순"}
                    {sortBy === "comments" && "댓글순"}
                    <ChevronDown className="h-4 w-4 ml-2"/>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32 bg-gray-900 border-gray-800">
                  <DropdownMenuItem onClick={() => setSortBy("latest")}
                                    className="text-gray-300 focus:bg-gray-800 focus:text-white">
                    최신순
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("popular")}
                                    className="text-gray-300 focus:bg-gray-800 focus:text-white">
                    인기순
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("views")}
                                    className="text-gray-300 focus:bg-gray-800 focus:text-white">
                    조회순
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("comments")}
                                    className="text-gray-300 focus:bg-gray-800 focus:text-white">
                    댓글순
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="group bg-gray-900 rounded-lg border border-gray-800 hover:border-red-500/50 transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className="bg-red-500/10 text-red-500"
                          >
                            {post.category}
                          </Badge>
                          {post.author.level === "시니어" && (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                              시니어
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-medium mb-2 group-hover:text-red-500 transition-colors">
                          <Link href={`/user/community/post/${post.id}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{post.content}</p>
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => handleTagSelect(tag)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                                selectedTags.includes(tag)
                                  ? "bg-red-500/10 text-red-500"
                                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                              }`}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.image}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full ring-2 ring-gray-800"
                        />
                        <span className="font-medium text-gray-300">{post.author.name}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4"/>
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4"/>
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4"/>
                          {post.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우측: 인기 게시글 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg border border-gray-800 sticky top-24 mb-6">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-medium">주간 인기 게시글</h2>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">

                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 sticky top-24">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-lg font-medium">월간 인기 게시글</h2>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">

                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

