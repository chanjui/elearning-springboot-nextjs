"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  Play,
  Star,
  Award,
  Users,
  BookOpen,
  TrendingUp,
  ChevronLeft,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NetflixHeader from "@/components/netflix-header"
import CourseCard from "@/components/course-card"
import { Main } from "next/document"
import MainSlider from "@/components/user/main/slider"
import CourseSection from "@/components/user/main/course-section"
import Footer from "@/components/footer"
import axios from "axios"
import userStore from "@/app/auth/userStore"

export default function UserHomePage() {

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [newCourses, setNewCourses] = useState([]);
  const [freeCourses, setFreeCourses] = useState([]);
  const { restoreFromStorage } = userStore()
  
  const API_URL = "/api/courses";

  useEffect(() => {
    restoreFromStorage()
  }, [])

  useEffect(() => {
    // 신규 강의
    axios.get(`${API_URL}/latest?limit=5`)
      .then(res => setNewCourses(res.data.slice(0, 5)))
      .catch(err => console.error("신규 강의 로드 실패", err));

    // 무료 강의
    axios.get(`${API_URL}/free?limit=5`)
      .then(res => setFreeCourses(res.data.slice(0, 5)))
      .catch(err => console.error("무료 강의 로드 실패", err));
  }, [])

  // 애니메이션을 위한 상태 설정
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // 인기 강의 데이터
  const popularCourses = [
    {
      id: "1",
      title: "완전 초보를 위한 JavaScript 기초부터 실전까지",
      instructor: "코딩 마스터",
      price: 49000,
      originalPrice: 99000,
      discount: 51,
      rating: 4.8,
      students: 12500,
      image: "/placeholder.svg?height=160&width=280&text=JavaScript+Basics",
      isNew: true,
    },
    {
      id: "2",
      title: "Python으로 배우는 데이터 분석과 머신러닝",
      instructor: "데이터 사이언티스트",
      price: 69000,
      originalPrice: 129000,
      discount: 47,
      rating: 4.9,
      students: 8700,
      image: "/placeholder.svg?height=160&width=280&text=Python+Data+Science",
    },
    {
      id: "3",
      title: "AWS 클라우드 아키텍처 설계 마스터 클래스",
      instructor: "클라우드 전문가",
      price: 89000,
      originalPrice: 149000,
      discount: 40,
      rating: 4.7,
      students: 5300,
      image: "/placeholder.svg?height=160&width=280&text=AWS+Architecture",
    },
    {
      id: "4",
      title: "Flutter로 구현하는 크로스 플랫폼 앱 개발",
      instructor: "모바일 개발자",
      price: 59000,
      originalPrice: 119000,
      discount: 50,
      rating: 4.6,
      students: 7200,
      image: "/placeholder.svg?height=160&width=280&text=Flutter+App+Dev",
      isUpdated: true,
    },
    {
      id: "5",
      title: "실전 프로젝트로 배우는 Node.js 백엔드 개발",
      instructor: "백엔드 개발자",
      price: 79000,
      originalPrice: 139000,
      discount: 43,
      rating: 4.8,
      students: 6100,
      image: "/placeholder.svg?height=160&width=280&text=Node.js+Backend",
    },
  ]

  // 통계 데이터
  const stats = [
    { icon: BookOpen, value: "1,200+", label: "강의 수" },
    { icon: Users, value: "50만+", label: "수강생" },
    { icon: Award, value: "300+", label: "전문 강사진" },
    { icon: TrendingUp, value: "98%", label: "수강 만족도" },
  ]

  // 추천 강사 데이터
  const recommendedInstructors = [
    {
      name: "김코딩",
      title: "프론트엔드 개발 전문가",
      description:
        "10년 이상의 웹 개발 경력을 가진 프론트엔드 전문가. React, Vue, Angular에 정통하며 300개 이상의 프로젝트를 진행했습니다.",
      courses: 15,
      students: 25000,
      rating: 4.9,
      image: "/placeholder.svg?height=160&width=160&text=김코딩",
      expertise: ["React", "TypeScript", "웹 성능 최적화"],
    },
    {
      name: "박데이터",
      title: "데이터 사이언스 전문가",
      description: "Google 출신 데이터 사이언티스트. 머신러닝과 딥러닝 알고리즘 개발 및 최적화 경험이 풍부합니다.",
      courses: 12,
      students: 18000,
      rating: 4.8,
      image: "/placeholder.svg?height=160&width=160&text=박데이터",
      expertise: ["Python", "머신러닝", "데이터 분석"],
    },
    {
      name: "이서버",
      title: "백엔드 아키텍트",
      description:
        "대규모 서비스 아키텍처 설계 전문가. MSA, 클라우드 인프라, 서버 최적화에 대한 실무 경험이 풍부합니다.",
      courses: 10,
      students: 15000,
      rating: 4.9,
      image: "/placeholder.svg?height=160&width=160&text=이서버",
      expertise: ["Java", "Spring", "클라우드 아키텍처"],
    },
  ]

  // 후기 데이터
  const testimonials = [
    {
      id: 1,
      name: "김철수",
      role: "주니어 개발자",
      company: "테크 스타트업",
      content:
        "인프런 클론의 강의를 통해 실무에서 바로 적용 가능한 기술들을 배울 수 있었습니다. 특히 React와 TypeScript 강의는 제 커리어에 큰 도움이 되었습니다.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      id: 2,
      name: "이영희",
      role: "프리랜서 개발자",
      company: "독립 개발자",
      content:
        "퀄리티 높은 강의와 실습 위주의 커리큘럼이 정말 좋았습니다. 무료 강의로 시작해서 유료 강의까지 들었는데, 투자한 시간과 비용이 전혀 아깝지 않았습니다.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      id: 3,
      name: "박민수",
      role: "시니어 개발자",
      company: "대기업 IT 부서",
      content:
        "최신 기술 트렌드를 따라가기 위해 이용하고 있습니다. 강사진의 전문성이 돋보이고, 실무 경험을 바탕으로 한 팁들이 매우 유용했습니다.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
    },
  ]

  // 슬라이드 변경 함수
  const changeSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // 캐러셀 스크롤 함수
  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = direction === "left" ? -current.offsetWidth * 0.75 : current.offsetWidth * 0.75
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      {/* 메인 슬라이더 */}
      <MainSlider />

      {/* 통계 섹션 */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`flex flex-col items-center text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
                  <stat.icon className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 강의 섹션 */}
      <CourseSection
        title="인기 강의"
        link="/user/courses"
        courses={popularCourses}
        scrollable
        carouselRef={carouselRef}
        onScrollLeft={() => scroll("left")}
        onScrollRight={() => scroll("right")}
      />

      {/* 추천 강사 섹션 */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">추천 강사</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendedInstructors.map((instructor, index) => (
              <div
                key={index}
                className={`bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 100 + 300}ms` }}
              >
                <div className="p-6 flex flex-col items-center">
                  <Image
                    src={instructor.image || "/placeholder.svg"}
                    alt={instructor.name}
                    width={120}
                    height={120}
                    className="rounded-full mb-4 border-4 border-red-600"
                  />
                  <h3 className="text-xl font-bold mb-1 text-center">{instructor.name}</h3>
                  <p className="text-red-500 mb-4 text-center">{instructor.title}</p>
                  <p className="text-gray-300 mb-4 text-center line-clamp-3">{instructor.description}</p>

                  <div className="flex justify-center gap-6 mb-4 w-full">
                    <div className="flex flex-col items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-300">{instructor.courses}개 강의</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="h-5 w-5 text-gray-400 mb-1" />
                      <p className="text-sm text-gray-300">{instructor.students.toLocaleString()}명</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Star className="h-5 w-5 text-yellow-400 mb-1" />
                      <p className="text-sm text-gray-300">{instructor.rating}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mb-6">
                    {instructor.expertise.map((skill, i) => (
                      <Badge key={i} variant="outline" className="border-gray-600">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-red-600 hover:bg-red-700 transition-all hover:shadow-lg">
                    강사 프로필 보기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 신규 & 무료 강의 섹션 */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="new" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <TabsList className="bg-gray-800">
                <TabsTrigger value="new" className="data-[state=active]:bg-red-600 transition-all">
                  신규 강의
                </TabsTrigger>
                <TabsTrigger value="free" className="data-[state=active]:bg-red-600 transition-all">
                  무료 강의
                </TabsTrigger>
              </TabsList>
              <Link href="/user/courses" className="text-red-500 hover:text-red-400 flex items-center group">
                더 보기
                <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* 신규 강의 */}
            <TabsContent value="new" className="mt-0">
              <CourseSection
                showHeader={false}
                link="/user/courses"
                courses={newCourses}
              />
            </TabsContent>

            {/* 무료 강의 */}
            <TabsContent value="free" className="mt-0">
              <CourseSection
                showHeader={false}
                link="/user/courses"
                courses={freeCourses}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 수강생 후기 섹션 */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">수강생 후기</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 transition-all duration-500 hover:shadow-lg hover:border-gray-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${index * 100 + 300}ms` }}
              >
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-gray-400">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-300">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 to-black opacity-50 bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">지금 시작하세요</h2>
            <p className="text-xl text-gray-300 mb-8">
              1,200개 이상의 강의와 함께 당신의 커리어를 한 단계 업그레이드할 준비가 되었나요?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-red-600 hover:bg-red-700 text-lg py-6 px-8 transition-transform hover:scale-105">
                무료 강의 둘러보기
              </Button>
              <Button
                variant="outline"
                className="border-gray-600 hover:bg-gray-800 text-lg py-6 px-8 transition-transform hover:scale-105"
              >
                멤버십 가입하기
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

