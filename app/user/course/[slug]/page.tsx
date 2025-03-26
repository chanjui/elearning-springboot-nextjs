import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Award, Users, MessageSquare, Heart, ShoppingCart, Play, Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import NetflixHeader from "@/components/netflix-header"

export default function CoursePage({ params }: { params: { slug: string } }) {
  // 실제 구현에서는 params.slug를 사용하여 API에서 강의 데이터를 가져옵니다
  // 여기서는 예시 데이터를 사용합니다
  const course = {
    id: "1",
    slug: params.slug,
    title: "비전공자도 이해할 수 있는 Docker 입문/실전",
    description: "Docker의 기본 개념부터 실전 활용까지, 비전공자도 쉽게 이해할 수 있는 강의입니다.",
    instructor: "JSCODE 박재성",
    price: 77000,
    rating: 5.0,
    students: 1000,
    totalLectures: 65,
    totalHours: 12.5,
    level: "입문",
    lastUpdated: "2023년 12월",
    image: "/placeholder.svg?height=400&width=800",
    skills: ["Docker", "컨테이너", "DevOps", "CI/CD", "클라우드"],
    curriculum: [
      {
        title: "섹션 1: Docker 소개",
        lectures: [
          { title: "Docker란 무엇인가?", duration: "10:15", isFree: true },
          { title: "Docker의 역사와 중요성", duration: "08:30", isFree: false },
          { title: "Docker vs 가상머신", duration: "12:45", isFree: false },
        ],
      },
      {
        title: "섹션 2: Docker 설치 및 기본 명령어",
        lectures: [
          { title: "Windows에 Docker 설치하기", duration: "15:20", isFree: false },
          { title: "Mac에 Docker 설치하기", duration: "14:10", isFree: false },
          { title: "Linux에 Docker 설치하기", duration: "16:30", isFree: false },
          { title: "기본 Docker 명령어 익히기", duration: "20:15", isFree: false },
        ],
      },
      {
        title: "섹션 3: Docker 이미지와 컨테이너",
        lectures: [
          { title: "Docker 이미지 개념 이해하기", duration: "11:45", isFree: false },
          { title: "Docker Hub 활용하기", duration: "09:30", isFree: false },
          { title: "컨테이너 생성 및 관리", duration: "18:20", isFree: false },
        ],
      },
    ],
    reviews: [
      {
        id: "1",
        user: "김철수",
        rating: 5,
        date: "2023년 11월 15일",
        content: "비전공자인 저도 쉽게 이해할 수 있었습니다. 실무에서 바로 활용할 수 있는 내용이라 매우 만족합니다.",
      },
      {
        id: "2",
        user: "이영희",
        rating: 5,
        date: "2023년 10월 22일",
        content:
          "Docker에 대해 전혀 모르는 상태에서 시작했는데, 강의를 들은 후 실제 프로젝트에 적용할 수 있게 되었습니다. 강사님의 설명이 정말 명확하고 이해하기 쉬웠습니다.",
      },
      {
        id: "3",
        user: "박지민",
        rating: 4,
        date: "2023년 9월 5일",
        content: "전반적으로 좋은 강의입니다. 다만 일부 고급 기능에 대한 설명이 조금 더 자세했으면 좋겠습니다.",
      },
    ],
    relatedCourses: [
      {
        image: "/placeholder.svg?height=160&width=280",
        title: "Kubernetes 완벽 가이드: 기초부터 실전까지",
        instructor: "JSCODE 박재성",
        price: 88000,
        rating: 4.9,
        students: 750,
      },
      {
        image: "/placeholder.svg?height=160&width=280",
        title: "CI/CD 파이프라인 구축: Jenkins, GitHub Actions",
        instructor: "DevOps 전문가",
        price: 66000,
        rating: 4.7,
        students: 500,
      },
      {
        image: "/placeholder.svg?height=160&width=280",
        title: "AWS 클라우드 서비스 마스터하기",
        instructor: "클라우드 엔지니어",
        price: 99000,
        rating: 4.8,
        students: 1200,
      },
      {
        image: "/placeholder.svg?height=160&width=280",
        title: "Docker Compose와 Swarm으로 멀티 컨테이너 애플리케이션 관리",
        instructor: "JSCODE 박재성",
        price: 55000,
        rating: 4.6,
        students: 300,
      },
    ],
  }

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <NetflixHeader />

      {/* 강의 헤더 */}
      <div className="relative pt-24">
        <div className="relative h-[60vh] w-full">
          <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
        </div>
      </div>

      {/* 강의 정보 */}
      <section className="container mx-auto px-4 py-8 -mt-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽 컬럼: 강의 정보 */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 font-medium">{course.rating.toFixed(1)}</span>
              </div>
              <span className="mx-2 text-gray-500">|</span>
              <span className="text-gray-300">{course.students}+ 수강생</span>
              <span className="mx-2 text-gray-500">|</span>
              <Link href="#reviews" className="text-blue-400 hover:underline">
                수강평 보기
              </Link>
            </div>

            <div className="flex items-center mb-6">
              <span className="font-medium text-gray-300">지식공유자:</span>
              <Link href="#" className="text-blue-400 hover:underline ml-2">
                {course.instructor}
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center bg-gray-800 rounded-md p-3">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-400">총 강의 수</div>
                  <div className="font-medium">{course.totalLectures}개 강의</div>
                </div>
              </div>

              <div className="flex items-center bg-gray-800 rounded-md p-3">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-400">총 강의 시간</div>
                  <div className="font-medium">{course.totalHours}시간</div>
                </div>
              </div>

              <div className="flex items-center bg-gray-800 rounded-md p-3">
                <Award className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-400">난이도</div>
                  <div className="font-medium">{course.level}</div>
                </div>
              </div>

              <div className="flex items-center bg-gray-800 rounded-md p-3">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <div className="text-sm text-gray-400">최근 업데이트</div>
                  <div className="font-medium">{course.lastUpdated}</div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">이 강의는 어떤 강의인가요?</h2>
              <p className="text-gray-300 leading-relaxed mb-4">{course.description}</p>
              <p className="text-gray-300 leading-relaxed">
                Docker는 현대 개발 환경에서 필수적인 기술이 되었습니다. 이 강의에서는 Docker의 기본 개념부터 실전
                활용까지 단계별로 학습합니다. 컨테이너 기술의 원리를 이해하고, Docker를 사용하여 개발 환경을 구성하는
                방법, 그리고 실제 서비스 배포까지 전 과정을 다룹니다.
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">이런 걸 배워요!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.skills.map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <Tabs defaultValue="introduction" className="mb-8">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger value="introduction" className="data-[state=active]:bg-gray-700">
                  강의소개
                </TabsTrigger>
                <TabsTrigger value="curriculum" className="data-[state=active]:bg-gray-700">
                  커리큘럼
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-gray-700">
                  수강평
                </TabsTrigger>
                <TabsTrigger value="inquiry" className="data-[state=active]:bg-gray-700">
                  수강전문의
                </TabsTrigger>
              </TabsList>

              <TabsContent value="introduction" className="mt-4">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">강의 소개</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="mb-4">{course.description}</p>
                    <p className="mb-4">
                      Docker는 현대 개발 환경에서 필수적인 기술이 되었습니다. 이 강의에서는 Docker의 기본 개념부터 실전
                      활용까지 단계별로 학습합니다. 컨테이너 기술의 원리를 이해하고, Docker를 사용하여 개발 환경을
                      구성하는 방법, 그리고 실제 서비스 배포까지 전 과정을 다룹니다.
                    </p>
                    <h4 className="text-lg font-bold mt-6 mb-3">이런 분들에게 추천해요</h4>
                    <ul className="list-disc pl-5 space-y-2 mb-6">
                      <li>Docker를 처음 접하는 개발자 및 비개발자</li>
                      <li>컨테이너 기술을 실무에 적용하고 싶은 분</li>
                      <li>개발 환경 구성에 어려움을 겪고 있는 분</li>
                      <li>DevOps 및 클라우드 기술에 관심이 있는 분</li>
                    </ul>
                    <h4 className="text-lg font-bold mt-6 mb-3">강의 특징</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>비전공자도 이해할 수 있는 쉬운 설명</li>
                      <li>실무에서 바로 활용 가능한 예제 중심 강의</li>
                      <li>단계별 실습으로 확실한 개념 이해</li>
                      <li>현업 개발자의 노하우와 팁 제공</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-4">
                <div className="border border-gray-700 rounded-lg overflow-hidden">
                  {course.curriculum.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center justify-between p-4 bg-gray-800 cursor-pointer">
                        <h3 className="font-medium">{section.title}</h3>
                        <ChevronDown className="h-5 w-5" />
                      </div>
                      <div className="p-4 bg-gray-900">
                        {section.lectures.map((lecture, lectureIndex) => (
                          <div
                            key={lectureIndex}
                            className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0"
                          >
                            <div className="flex items-center">
                              <Play className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="mr-2">{lecture.title}</span>
                              {lecture.isFree && (
                                <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">무료 공개</span>
                              )}
                            </div>
                            <span className="text-sm text-gray-400">{lecture.duration}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" id="reviews" className="mt-4">
                <div className="mb-6 bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-4xl font-bold">{course.rating.toFixed(1)}</div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="ml-2">5점</span>
                        <Progress value={90} className="h-2 ml-2 w-40 bg-gray-700" />
                        <span className="ml-2">90%</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="ml-2">4점</span>
                        <Progress value={10} className="h-2 ml-2 w-40 bg-gray-700" />
                        <span className="ml-2">10%</span>
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="flex">
                          {[1, 2, 3].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          {[1, 2].map((star) => (
                            <Star key={star} className="h-4 w-4 text-gray-600" />
                          ))}
                        </div>
                        <span className="ml-2">3점</span>
                        <Progress value={0} className="h-2 ml-2 w-40 bg-gray-700" />
                        <span className="ml-2">0%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {course.reviews.map((review) => (
                    <div key={review.id} className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                            {review.user.charAt(0)}
                          </div>
                          <span className="font-medium">{review.user}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="flex mr-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-gray-300">{review.content}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                    수강평 더보기
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="inquiry" className="mt-4">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h3 className="text-xl font-bold mb-4">수강 전 문의하기</h3>
                  <p className="text-gray-300 mb-6">
                    강의에 대해 궁금한 점이 있으신가요? 수강 전 문의를 통해 강사님께 직접 질문해보세요.
                  </p>

                  <div className="mb-6">
                    <h4 className="font-medium mb-2">자주 묻는 질문</h4>
                    <div className="space-y-3">
                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-800 cursor-pointer">
                          <h5 className="font-medium">이 강의는 초보자도 들을 수 있나요?</h5>
                          <ChevronDown className="h-5 w-5" />
                        </div>
                        <div className="p-4 bg-gray-900">
                          <p className="text-gray-300">
                            네, 이 강의는 Docker를 처음 접하는 분들을 위해 설계되었습니다. 기본 개념부터 차근차근
                            설명하므로 초보자도 충분히 따라올 수 있습니다.
                          </p>
                        </div>
                      </div>

                      <div className="border border-gray-700 rounded-lg overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-800 cursor-pointer">
                          <h5 className="font-medium">강의 수강 기간에 제한이 있나요?</h5>
                          <ChevronDown className="h-5 w-5" />
                        </div>
                        <div className="p-4 bg-gray-900">
                          <p className="text-gray-300">
                            아니요, 한 번 구매하시면 평생 무제한으로 수강하실 수 있습니다. 업데이트되는 내용도 추가 비용
                            없이 계속 제공됩니다.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">문의하기</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="inquiry-title" className="block text-sm font-medium mb-1">
                          제목
                        </label>
                        <input
                          id="inquiry-title"
                          type="text"
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                          placeholder="문의 제목을 입력해주세요"
                        />
                      </div>
                      <div>
                        <label htmlFor="inquiry-content" className="block text-sm font-medium mb-1">
                          내용
                        </label>
                        <textarea
                          id="inquiry-content"
                          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white min-h-[150px]"
                          placeholder="문의 내용을 입력해주세요"
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <Button className="bg-red-600 hover:bg-red-700">문의하기</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">함께 들으면 좋은 강의</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.relatedCourses.slice(0, 2).map((relatedCourse, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 netflix-card-hover"
                  >
                    <Image
                      src={relatedCourse.image || "/placeholder.svg"}
                      alt={relatedCourse.title}
                      width={280}
                      height={160}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-2 mb-1">{relatedCourse.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{relatedCourse.instructor}</p>
                      <div className="flex items-center justify-between">
                        <div className="font-bold">₩{formatPrice(relatedCourse.price)}</div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span>{relatedCourse.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽 컬럼: 강의 구매 정보 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 mb-4">
                <div className="relative aspect-video">
                  <Image src={course.image || "/placeholder.svg"} alt={course.title} fill className="object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button className="bg-white text-black hover:bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold">₩{formatPrice(course.price)}</div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Link href="/user/cart">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        수강신청 하기
                      </Button>
                    </Link>

                    <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                      <Heart className="h-4 w-4 mr-2" />
                      위시리스트에 추가
                    </Button>
                  </div>

                  <div className="text-sm text-gray-400 space-y-2">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{course.students}명 이상 수강중</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>총 {course.totalHours}시간 수업</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>수강생 전용 Q&A 제공</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>평생 무제한 수강</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-700 rounded-lg p-4 bg-gray-900">
                <h3 className="font-medium mb-2">이 강의도 함께 둘러보세요</h3>
                <div className="space-y-4">
                  {course.relatedCourses.slice(2, 4).map((relatedCourse, index) => (
                    <div key={index} className="flex gap-2">
                      <Image
                        src={relatedCourse.image || "/placeholder.svg"}
                        alt={relatedCourse.title}
                        width={80}
                        height={45}
                        className="w-20 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium line-clamp-2">{relatedCourse.title}</h4>
                        <div className="text-sm text-gray-400">₩{formatPrice(relatedCourse.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

