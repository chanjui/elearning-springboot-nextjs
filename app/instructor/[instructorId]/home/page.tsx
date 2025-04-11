"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import useUserStore from "@/app/auth/userStore"
import InstructorHeader from "@/components/instructor/instructor-header"
import InstructorHomeSidebar from "@/components/instructor/home/instructor-home-sidebar"
import InstructorIntro from "@/components/instructor/home/instructor-intro"
import InstructorCourses from "@/components/instructor/home/instructor-courses"
import InstructorReviews from "@/components/instructor/home/instructor-reviews"
import InstructorPosts from "@/components/instructor/home/instructor-posts"

const API_URL = "/api/instructor/home"

type ExpertiseOption = {
  id: number
  name: string
}

type Course = {
  courseId: number
  subject: string
  instructor: string
  thumbnailUrl: string
  price: number
  discountRate: number
  rating: number
  categoryName: string
  tags: string[]
}

type Review = {
  id: number
  subject: string
  thumbnailUrl: string
  nickname: string
  rating: number
  content: string
  regDate: string
  likes: number
}

type Post = {
  id: number
  type: string
  title: string
  date: string
  content: string
  views: number | null
  comments: number
  likes: number
  reply: string
}

type InstructorData = {
  nickName: string
  bio: string
  expertise: string
  profileUrl: string
  totalStudents: number
  totalReviews: number
  totalRating: number
  expertiseName: string
}

export default function InstructorProfile() {
  const { user, restoreFromStorage } = useUserStore()
  const instructorId = user?.instructorId;
  const userId = user?.id;
  const isMyPage = user?.instructorId === Number(instructorId)
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("home")
  const [bio, setBio] = useState("")
  const [instructorData, setInstructorData] = useState<InstructorData | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const [isEditingExpertise, setIsEditingExpertise] = useState(false)
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<number | null>(null)
  const [expertiseOptions, setExpertiseOptions] = useState<ExpertiseOption[]>([])
  const [followerCount, setFollowerCount] = useState(0)

  useEffect(() => {
    if (!instructorId) return

    const fetchAll = async () => {
      try {
        // 프로필
        const res = await fetch(`${API_URL}/profile/${instructorId}`, { credentials: "include" })
        if (res.status === 401 || res.status === 403) {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.")
          router.push("/auth/user/login")
          return
        }
        const data = await res.json()
        setInstructorData(data)
        setBio(data.bio)

        // 전문분야 목록
        const expertiseRes = await fetch(`${API_URL}/meta/expertise`)
        const expertiseData = await expertiseRes.json()
        setExpertiseOptions(expertiseData?.data ?? [])

        // 강의 목록
        const courseRes = await fetch(`${API_URL}/courses/${instructorId}`)
        const courseResult = await courseRes.json()
        setCourses(courseResult?.data ?? [])

        // 수강평
        const reviewRes = await fetch(`${API_URL}/reviews/${instructorId}`)
        const reviewResult = await reviewRes.json()
        setReviews(reviewResult?.data ?? [])

        // 게시글
        const postRes = await fetch(`${API_URL}/posts/${instructorId}`)
        const postResult = await postRes.json()
        const postsRaw = postResult?.data
        if (Array.isArray(postsRaw)) {
          setPosts(
            postsRaw.map((post: any) => ({
              id: post.id,
              type: post.bname,
              title: post.subject,
              content: post.content,
              date: formatDate(post.regDate),
              views: post.viewCount,
              comments: post.commentCount,
              likes: post.likeCount,
              reply: post.reply,
            })),
          )
        } else {
          console.error("게시글 응답 오류:", postResult)
          setPosts([])
        }

        // 팔로워 수
        const followerRes = await fetch(`${API_URL}/followers/count/${instructorId}`)
        const followerData = await followerRes.json()
        setFollowerCount(followerData?.data ?? 0)
      } catch (err) {
        console.error("강사 데이터 로딩 실패", err)
      }
    }

    fetchAll()
  }, [instructorId, router])

  useEffect(() => {
    if (!instructorData) return
    const checkFollowStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/follow/status/${instructorId}`, { credentials: "include" })
        const result = await res.json()
        setIsFollowing(result?.data ?? false)
      } catch (err) {
        console.error("팔로우 상태 확인 실패:", err)
      }
    }

    checkFollowStatus()
  }, [instructorData, instructorId])

  // 컴포넌트 마운트 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    if (!user) {
      restoreFromStorage();
    }
  }, [user, restoreFromStorage]);

  const handleFollowToggle = async () => {
    try {
      const res = await fetch(`${API_URL}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ instructorId: Number(instructorId) }),
      })

      const result = await res.json()
      if (result.msg === "팔로우 성공") {
        setIsFollowing(true)
        setFollowerCount((prev) => prev + 1)
      } else if (result.msg === "팔로우 취소 성공") {
        setIsFollowing(false)
        setFollowerCount((prev) => prev - 1)
      } else if (result.msg === "본인은 팔로우할 수 없습니다.") {
        alert(result.msg)
      }
    } catch (err) {
      console.error("팔로우 처리 실패", err)
    }
  }

  const handleSaveExpertise = async () => {
    if (selectedExpertiseId !== null) {
      const res = await fetch(`${API_URL}/expertise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ expertiseId: selectedExpertiseId }),
      })

      if (res.ok) {
        const updated = expertiseOptions.find((e) => e.id === selectedExpertiseId)
        setInstructorData((prev) => (prev ? { ...prev, expertiseName: updated?.name ?? "" } : null))
        setIsEditingExpertise(false)
      } else {
        alert("전문 분야 수정 실패")
      }
    }
  }

  const handleSaveBio = async () => {
    try {
      const res = await fetch(`${API_URL}/bio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bio }),
      })
      if (res.ok) {
        alert("소개글이 성공적으로 수정되었습니다.")
      } else {
        alert("소개글 수정에 실패했습니다.")
      }
    } catch (err) {
      console.error("소개 수정 오류", err)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = `0${date.getMonth() + 1}`.slice(-2)
    const day = `0${date.getDate()}`.slice(-2)
    return `${year}. ${month}. ${day}.`
  }

  if (!instructorData) {
    return <div className="text-white p-8">로딩 중...</div>
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <InstructorHeader />
      
      <div className="max-w-7xl mx-auto px-6 pt-24 flex">
        <InstructorHomeSidebar
          instructorData={instructorData}
          isMyPage={isMyPage}
          isFollowing={isFollowing}
          followerCount={followerCount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          expertiseOptions={expertiseOptions}
          isEditingExpertise={isEditingExpertise}
          setIsEditingExpertise={setIsEditingExpertise}
          selectedExpertiseId={selectedExpertiseId}
          setSelectedExpertiseId={setSelectedExpertiseId}
          handleSaveExpertise={handleSaveExpertise}
          handleFollowToggle={handleFollowToggle}
        />  
        <main className="flex-1 ml-6 space-y-6 pb-16">
          {activeTab === "home" && (
            <InstructorIntro
              instructorData={instructorData}
              bio={bio}
              setBio={setBio}
              isMyPage={isMyPage}
              isFollowing={isFollowing}
              followerCount={followerCount}
              expertiseOptions={expertiseOptions}
              isEditingExpertise={isEditingExpertise}
              setIsEditingExpertise={setIsEditingExpertise}
              selectedExpertiseId={selectedExpertiseId}
              setSelectedExpertiseId={setSelectedExpertiseId}
              handleSaveExpertise={handleSaveExpertise}
              handleFollowToggle={handleFollowToggle}
              handleSaveBio={handleSaveBio}
            />
          )}

          {(activeTab === "home" || activeTab === "courses") && (
            <InstructorCourses courses={courses} activeTab={activeTab} setActiveTab={setActiveTab} />
          )}

          {(activeTab === "home" || activeTab === "reviews") && (
            <InstructorReviews reviews={reviews} activeTab={activeTab} setActiveTab={setActiveTab} />
          )}

          {(activeTab === "home" || activeTab === "posts") && (
            <InstructorPosts posts={posts} activeTab={activeTab} setActiveTab={setActiveTab} />
          )}
        </main>
      </div>
    </div>
  )
}
