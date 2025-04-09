"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Bell } from "lucide-react"
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
import { BookOpen, MessageSquare, FileText, Star, Calendar, ThumbsUp, Home, Edit, Bookmark } from "lucide-react"
import InstructorHeader from "@/components/instructor/instructor-header"
import { useParams, useRouter } from "next/navigation"
import useUserStore from "@/app/auth/userStore" 


const API_URL = "/api/instructor"

type ExpertiseOption = {
  id: number;
  name: string;
};

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
  type: string;
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
  bio: String
  expertise: string
  profileUrl: string
  totalStudents: number
  totalReviews: number
  rating: number
  expertiseName: String
}

export default function InstructorProfile() {
  // URL에서 `instructorId`를 받기 위해 `useParams` 사용
  const { instructorId } = useParams();  // `instructorId`는 URL 파라미터로 받는다.
  const { user } = useUserStore();
  const isMyPage = user?.instructorId === Number(instructorId)
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("home");
  const [bio, setBio] = useState("");
  const [editBio, setEditBio] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [instructorData, setInstructorData] = useState<InstructorData | null>(null); // 강사 데이터 상태 추가
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 여부
  const [isEditingExpertise, setIsEditingExpertise] = useState(false);
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<number | null>(null);
  const [expertiseOptions, setExpertiseOptions] = useState<ExpertiseOption[]>([]);
  const [followerCount, setFollowerCount] = useState(0); // 팔로워 수
  const [showFullBio, setShowFullBio] = useState(false); // 소개글 더보기 관련 상태

  // 첫 번째 useEffect: instructorId가 변경되었을 때 실행 (instructorData 불러오기까지)
  useEffect(() => {
    if (!instructorId) return;

    const fetchAll = async () => {
      try {
        // 강사 정보 가져오기
        const res = await fetch(`${API_URL}/profile/${instructorId}`, {
          method: "GET",
          credentials: "include",
        });

        if (res.status === 401 || res.status === 403) {
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          router.push("/login");
          return;
        }

        const data = await res.json();
        setInstructorData(data);
        setBio(data.bio);
        setEditBio(data.bio);

        // 전문분야
        const expertiseRes = await fetch(`${API_URL}/meta/expertise`);
        const expertiseData = await expertiseRes.json();
        if (expertiseData.totalCount === 1) {
          setExpertiseOptions(expertiseData.data);
        } else {
          console.error("전문 분야 로드 실패:", expertiseData.message);
        }

        // 강의 목록
        const courseRes = await fetch(`${API_URL}/courses/${instructorId}`);
        const courseData = await courseRes.json();
        setCourses(courseData);

        // 수강평
        const reviewRes = await fetch(`${API_URL}/reviews/${instructorId}`);
        const reviewData = await reviewRes.json();
        setReviews(reviewData);

        // 게시글
        const postRes = await fetch(`${API_URL}/posts/${instructorId}`);
        const postData = await postRes.json();
        setPosts(postData.map((post: any) => ({
          id: post.id,
          type: post.bname,
          title: post.subject,
          content: post.content,
          date: formatDate(post.regDate),
          views: 0,     // 조회수
          comments: 0,  // 댓글
          likes: 0,     // 좋아요
          reply: post.reply // 강사 댓글
        })));

        // 팔로워 수
        const followerRes = await fetch(`${API_URL}/followers/count/${instructorId}`);
        const followerData = await followerRes.json();
        setFollowerCount(followerData.data);

      } catch (err) {
        console.error("강사 데이터 로딩 실패", err);
      }
    };

    fetchAll();
  }, [instructorId]);


  // 두 번째 useEffect: instructorData가 로딩된 후 실행 (팔로우 상태 및 본인 여부 확인)
  useEffect(() => {
    if (!instructorData) return;

    // 팔로우 상태 확인
    const checkFollowStatus = async () => {
      try {
        const res = await fetch(`${API_URL}/follow/status/${instructorId}`, {
          method: "GET",
          credentials: "include",
        });
        const result = await res.json();
        setIsFollowing(result.data);
      } catch (err) {
        console.error("팔로우 상태 확인 실패:", err);
      }
    };

    checkFollowStatus();
    
  }, [instructorData]);

  // 팔로우 기능
  const handleFollowToggle = async () => {
    try {
      const res = await fetch(`${API_URL}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ instructorId: Number(instructorId) }),
      });
  
      const result = await res.json();
      if (result.msg === "팔로우 성공") {
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
      } else if (result.msg === "팔로우 취소 성공") {
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
      } else if (result.msg === "본인은 팔로우할 수 없습니다.") {
        alert(result.msg);
      }
    } catch (err) {
      console.error("팔로우 처리 실패", err);
    }
  };

  // 강사 전문분야 수정
  const handleSaveExpertise = async () => {
    if (selectedExpertiseId !== null) {
      const res = await fetch(`${API_URL}/expertise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ expertiseId: selectedExpertiseId }),
      });
  
      if (res.ok) {
        const updated = expertiseOptions.find((e) => e.id === selectedExpertiseId);
        setInstructorData((prev) =>
          prev ? { ...prev, expertiseName: updated?.name ?? "" } : null
        );
        setIsEditingExpertise(false);
      } else {
        alert("전문 분야 수정 실패");
      }
    }
  };

  // 소개글 저장
  const handleSaveBio = async () => {
    try {
      const res = await fetch(`${API_URL}/bio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bio: editBio }),
      })
      if (res.ok) {
        setBio(editBio)
        setIsDialogOpen(false)
        alert("소개글이 성공적으로 수정되었습니다."); 
      } else {
        alert("소개글 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("소개 수정 오류", err)
    }
  }

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}. ${month}. ${day}.`;
  };

  // 가격 형식 변환
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  if (!instructorData) {
    return <div className="text-white p-8">로딩 중...</div>
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <InstructorHeader />

      <div className="flex">
        <div className="w-64 fixed top-0 left-0 h-full pt-16 bg-black border-r border-gray-800">
          <div className="p-5 pt-8">
            <div className="flex flex-col items-center mb-6">
              <Image
                src={instructorData.profileUrl || "/placeholder.svg"}
                alt="강사명"
                width={200}
                height={200}
                className="w-32 h-32 rounded-full object-cover border border-gray-800 mb-4"
              />
              <h2 className="font-bold text-xl text-white">{instructorData.nickName}</h2>

              {/* 전문분야 수정 영역 */}
              {isEditingExpertise ? (
                <div className="flex w-full mt-2">
                  <select
                    value={selectedExpertiseId ?? ""}
                    onChange={(e) => setSelectedExpertiseId(Number(e.target.value))}
                    className="text-white w-full p-1 rounded"
                  >
                    <option value="" disabled>전문 분야 선택</option>
                    {expertiseOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    className="ml-2 bg-red-600 text-white hover:bg-red-700" onClick={handleSaveExpertise}
                  >
                    저장
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-gray-400 flex items-center">
                  {instructorData.expertiseName || "전문분야 없음"}
                  <Edit className="h-4 w-4 ml-2 cursor-pointer" onClick={() => setIsEditingExpertise(true)} />
                </p>
              )}

              <div className="flex flex-col items-center mt-4 space-y-2 w-full">
                <div className="flex justify-between w-full text-sm">
                  <span className="text-gray-400">수강생</span>
                  <span className="font-medium text-white">0명</span>
                </div>
                <div className="flex justify-between w-full text-sm">
                  <span className="text-gray-400">수강평</span>
                  <span className="font-medium text-white">0개</span>
                </div>
                <div className="flex justify-between w-full text-sm">
                  <span className="text-gray-400">평점</span>
                  <div className="flex items-center">
                    <span className="font-medium text-white mr-1">{instructorData.rating ?? 0.0}</span>
                    <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
                  </div>
                </div>

                {/* 팔로우 버튼 또는 팔로워 수 */}
                {isMyPage ? (
                  <div className="mt-4 text-white text-sm">팔로워 수 : {followerCount ?? 0}명</div>
                ) : (
                  <Button
                    onClick={handleFollowToggle}
                    className={`mt-4 w-full flex items-center justify-center gap-2 rounded-full border text-sm font-semibold transition
                      ${isFollowing
                        ? 'bg-red-600 text-white hover:bg-red-700 border-red-600'
                        : 'bg-white text-red-600 border-red-600 hover:bg-red-100'}`}
                  >
                    <Bell className="h-4 w-4" />
                    {isFollowing ? '팔로우 취소' : '팔로우'}
                  </Button>
                )}
              </div>
            </div>

            <Separator className="my-4 bg-gray-800" />

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
                      className={`w-full justify-start ${
                        activeTab === tab.value
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "hover:bg-gray-800 text-white"
                      }`}
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

        {/* 메인 콘텐츠 */}
        <main className="ml-64 flex-1 px-6 py-8 pt-24">
          {activeTab === "home" && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">소개</h2>
                <Dialog open={isDialogOpen} 
                  onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (open) {
                      setEditBio(bio); // 모달 열릴 때 bio로 초기화
                    } else {
                      setEditBio(bio); // 모달 닫힐 때도 bio로 되돌림
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                    >
                      <Edit className="h-4 w-4" /> 수정
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border border-gray-800">
                    <DialogHeader>
                      <DialogTitle className="text-white">소개글 수정</DialogTitle>
                      <DialogDescription className="text-gray-400">자기소개를 입력하세요.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        className="min-h-[200px] bg-gray-800 border-gray-700 text-white focus-visible:ring-red-600 focus-visible:ring-offset-0"
                        placeholder="자기소개를 입력해주세요"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="border-gray-700 text-white hover:bg-gray-800 bg-transparent"
                      >
                        취소
                      </Button>
                      <Button onClick={handleSaveBio} className="bg-red-600 hover:bg-red-700 text-white">
                        저장하기
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <div>
              <p className={`text-white whitespace-pre-line transition-all duration-300 ${showFullBio ? '' : 'line-clamp-3'}`}>
                {bio}
              </p>
              {/* 더보기 버튼 */}
              {bio.length > 100 && (
                <button
                  onClick={() => setShowFullBio(!showFullBio)}
                  className="mt-2 text-red-500 text-sm hover:underline"
                >
                  {showFullBio ? '접기 ▲' : '더보기 ▼'}
                </button>
              )}
              </div>
            </div>
          )}

          {(activeTab === "home" || activeTab === "courses") && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-white">강의</h2>
              {courses.length === 0 ? (
                <p className="text-white">강의가 없습니다.</p>
              ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.slice(0, 6).map((course) => (
                  <Card
                    key={course.courseId}
                    className="border border-gray-800 bg-gray-900 shadow-md netflix-card-hover overflow-hidden"
                  >
                    <div className="relative">
                      <Image
                        src={course.thumbnailUrl || "/placeholder.svg"}
                        alt={course.subject}
                        width={280}
                        height={160}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 netflix-gradient flex items-end p-3 opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                          <Bookmark className="h-4 w-4 mr-2" /> 수강하기
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium line-clamp-2 h-10 text-white">{course.subject}</h3>
                      <div className="flex items-center mt-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" fill="currentColor" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {course.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs border-red-600 text-white bg-red-600/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 font-bold text-white">₩{formatPrice(course.price)}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
                {activeTab === "home" && courses.length > 6 && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:underline"
                      onClick={() => setActiveTab("courses")}
                    >
                      강의 전체 보기 →
                    </Button>
                  </div>
                )}
              </>
              )}
            </div>
          )}

          {(activeTab === "home" || activeTab === "reviews") && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-white">수강평</h2>

              {reviews.length === 0 ? (
                <p className="text-white">수강평이 없습니다.</p>
              ) : (
                <>
                  {/* 수강평 리스트 (홈에서는 최대 6개만 보여줌) */}
                  <div className="space-y-4">
                    {(activeTab === "home" ? reviews.slice(0, 6) : reviews).map((review) => (
                      <Card
                        key={review.id}
                        className="p-4 border border-gray-800 bg-gray-900 shadow-md hover:bg-gray-800 transition-colors flex items-start"
                      >
                        <Image
                          src={review.thumbnailUrl || "/placeholder.svg"}
                          alt="강의 썸네일"
                          width={60}
                          height={60}
                          className="rounded-md object-cover w-14 h-14 mr-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center text-sm text-white font-medium">
                            <div className="flex mr-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < review.rating ? "text-yellow-400" : "text-gray-600"}`}
                                  fill={i < review.rating ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-white mr-1">{review.nickname}</span>
                            <span className="text-gray-400">· {formatDate(review.regDate)}</span>
                          </div>
                          <div className="text-sm text-gray-300 mt-1 mb-2">
                            <span className="ml-1 px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full text-xs">
                              {review.subject}
                            </span>
                          </div>
                          <p className="text-white whitespace-pre-line text-sm">{review.content}</p>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* 홈일 때만 전체 보기 버튼 노출 */}
                  {activeTab === "home" && reviews.length > 6 && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:underline"
                        onClick={() => setActiveTab("reviews")}
                      >
                        수강평 전체 보기 →
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          
          {(activeTab === "home" || activeTab === "posts") && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 text-white">게시글</h2>
              <div className="space-y-4">
                {posts.slice(0, 6).map((post) => (
                  <Card
                    key={post.id}
                    className="p-4 border border-gray-800 bg-gray-900 shadow-md hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    {/* 상단: 게시글 타입 + 날짜 */}
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{post.type}</span> {/* 예: 질문&답변 */}
                      <span>{post.date}</span>
                    </div>
          
                    {/* 제목 */}
                    <h3 className="mt-1 text-white font-semibold text-sm">{post.title}</h3>
          
                    {/* 본문 */}
                    <p className="text-sm text-white mt-2 whitespace-pre-line">{post.content}</p>
          
                    {/* 강사 댓글이 있을 경우 */}
                    {post.reply && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-600 text-sm text-gray-300">
                        <span className="mr-1 text-red-500">↳</span>
                        {post.reply}
                      </div>
                    )}
          
                    {/* 하단: 조회수, 댓글수 */}
                    <div className="flex items-center mt-3 text-sm text-gray-500">
                      <span className="mr-4">👍 {post.likes ?? 0}</span>
                      <span className="mr-4">💬 {post.comments ?? 0}</span>
                      <span>👁 {post.views ?? 0}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

