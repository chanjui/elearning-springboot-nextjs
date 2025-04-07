"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BookOpen,
  MessageSquare,
  FileText,
  Star,
  Calendar,
  ChevronRight,
  ThumbsUp,
  Home,
  Edit,
  UserPlus,
  Bookmark,
} from "lucide-react"
import InstructorHeader from "@/components/instructor/instructor-header"

const instructorData = {
  isOwnProfile: true,
  name: "김영한",
  title: "스프링 & JPA 강사",
  profileImage: "/placeholder.svg?height=200&width=200",
  totalStudents: 45678,
  totalReviews: 3254,
  averageRating: 4.9,
  courses: [
    {
      id: 1,
      subject: "스프링 부트 - 핵심 원리와 활용",
      thumbnailUrl: "/placeholder.svg?height=160&width=280",
      rating: 4.9,
      price: "₩55,000",
      tags: ["Spring", "Backend"],
      url: "/courses/spring-boot-core",
    },
  ],
  reviews: [
    {
      id: 1,
      courseName: "스프링 부트 - 핵심 원리와 활용",
      userName: "개발자123",
      rating: 5,
      content: "정말 좋은 강의입니다.",
      date: "2023-10-15",
      likes: 42,
    },
  ],
  posts: [
    {
      id: 1,
      title: "스프링 부트 3.0 업데이트 주요 변경사항",
      date: "2023-11-10",
      views: 5432,
      comments: 87,
    },
  ],
}

export default function InstructorProfile() {
  const [activeTab, setActiveTab] = useState("home")
  const [bio, setBio] = useState("")
  const [editBio, setEditBio] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetch("/api/instructor/profile")
      .then((res) => res.json())
      .then((data) => {
        setBio(data.bio)
        setEditBio(data.bio)
      })
  }, [])

  const handleSaveBio = async () => {
    try {
      const res = await fetch("/api/instructor/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: editBio }),
      })
      if (res.ok) {
        setBio(editBio)
        setIsDialogOpen(false)
      } else {
        alert("소개글 수정에 실패했습니다.")
      }
    } catch (err) {
      console.error("소개 수정 오류", err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <InstructorHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-8">
              <div className="flex flex-col items-center mb-6">
                <Image
                  src={instructorData.profileImage}
                  alt={instructorData.name}
                  width={200}
                  height={200}
                  className="w-40 h-40 rounded-full object-cover border mb-4"
                />
                <h2 className="font-bold text-xl text-foreground">{instructorData.name}</h2>
                <p className="text-sm text-muted-foreground">{instructorData.title}</p>

                <div className="flex flex-col items-center mt-4 space-y-2 w-full">
                  <div className="flex justify-between w-full text-sm">
                    <span className="text-muted-foreground">수강생</span>
                    <span className="font-medium text-foreground">{instructorData.totalStudents.toLocaleString()}명</span>
                  </div>
                  <div className="flex justify-between w-full text-sm">
                    <span className="text-muted-foreground">수강평</span>
                    <span className="font-medium text-foreground">{instructorData.totalReviews.toLocaleString()}개</span>
                  </div>
                  <div className="flex justify-between w-full text-sm">
                    <span className="text-muted-foreground">평점</span>
                    <div className="flex items-center">
                      <span className="font-medium text-foreground mr-1">{instructorData.averageRating}</span>
                      <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <nav>
                <ul className="space-y-2">
                  {[
                    { label: "홈", value: "home", icon: <Home className="h-4 w-4 mr-2" /> },
                    { label: "강의", value: "courses", icon: <BookOpen className="h-4 w-4 mr-2" /> },
                    { label: "수강평", value: "reviews", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
                    { label: "게시글", value: "posts", icon: <FileText className="h-4 w-4 mr-2" /> },
                  ].map((tab) => (
                    <li key={tab.value}>
                      <Button
                        variant={activeTab === tab.value ? "default" : "ghost"}
                        className="w-full justify-start hover:bg-red-700"
                        onClick={() => setActiveTab(tab.value)}
                      >
                        {tab.icon}
                        {tab.label}
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === "home" && (
              <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-foreground">소개</h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit className="h-4 w-4" /> 수정
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>소개 수정</DialogTitle>
                        <DialogDescription>자기소개를 입력하세요.</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Textarea
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          className="min-h-[200px]"
                          placeholder="자기소개를 입력해주세요"
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>취소</Button>
                        <Button onClick={handleSaveBio}>저장하기</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="text-foreground whitespace-pre-line">{bio}</p>
              </div>
            )}

            {(activeTab === "home" || activeTab === "courses") && (
              <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-foreground">강의</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {instructorData.courses.map((course) => (
                    <Card key={course.id} className="border shadow-sm">
                      <div className="relative">
                        <Image
                          src={course.thumbnailUrl}
                          alt={course.subject}
                          width={280}
                          height={160}
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3 opacity-0 hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="sm" className="w-full">
                            <Bookmark className="h-4 w-4 mr-2" /> 수강하기
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-sm font-medium line-clamp-2 h-10 text-foreground">{course.subject}</h3>
                        <div className="flex items-center mt-2 text-sm">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                          <span>{course.rating}</span>
                          {/* <span className="ml-1 text-muted-foreground">({course.reviewCount})</span> */}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {course.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 font-bold text-foreground">{course.price}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "home" || activeTab === "reviews") && (
              <div className="bg-card rounded-lg border shadow-sm p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-foreground">수강평</h2>
                <div className="space-y-4">
                  {instructorData.reviews.map((review) => (
                    <Card key={review.id} className="p-4 border shadow-sm">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">{review.courseName}</p>
                          <div className="flex mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                                fill={i < review.rating ? "currentColor" : "none"}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {review.date}
                        </div>
                      </div>
                      <p className="mt-2 text-foreground">{review.content}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-muted-foreground">{review.userName}</span>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4 mr-1" /> {review.likes}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {(activeTab === "home" || activeTab === "posts") && (
              <div className="bg-card rounded-lg border shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4 text-foreground">게시글</h2>
                <div className="space-y-2">
                  {instructorData.posts.map((post) => (
                    <Card key={post.id} className="p-4 border shadow-sm hover:bg-accent cursor-pointer">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-foreground">{post.title}</h3>
                        <span className="text-sm text-muted-foreground">{post.date}</span>
                      </div>
                      <div className="flex items-center mt-2 text-sm text-muted-foreground">
                        <span className="mr-3">조회 {post.views}</span>
                        <span>댓글 {post.comments}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
