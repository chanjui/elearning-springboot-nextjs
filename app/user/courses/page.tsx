"use client"

import Link from "next/link"
import {ChevronDown, Filter} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Checkbox} from "@/components/ui/checkbox"
import {Label} from "@/components/ui/label"
import {Separator} from "@/components/ui/separator"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import CourseCard from "@/components/course-card"
import NetflixHeader from "@/components/netflix-header"

export default function CoursesPage() {
    // 예시 데이터
    const courses = [
        {
            id: "1",
            slug: "docker-intro",
            title: "비전공자도 이해할 수 있는 Docker 입문/실전",
            instructor: "JSCODE 박재성",
            price: 77000,
            rating: 5.0,
            students: 1000,
            image: "/placeholder.svg?height=160&width=280",
        },
        {
            id: "2",
            slug: "app-development",
            title: "350개의 개인 앱을 만들어 칼코의 7배 수익을 달성한 방법",
            instructor: "프로그래밍허브",
            price: 429000,
            rating: 5.0,
            students: 1200,
            isUpdated: true,
            image: "/placeholder.svg?height=160&width=280",
        },
        {
            id: "3",
            slug: "python-data",
            title: "데이터 분석 입문자를 위한 기초 파이썬 with ChatGPT",
            instructor: "김현다",
            originalPrice: 47300,
            price: 33110,
            discount: 30,
            rating: 5.0,
            students: 6,
            isNew: true,
            image: "/placeholder.svg?height=160&width=280",
        },
        {
            id: "4",
            slug: "resume-portfolio",
            title: "비전공자도 합격하는 개발자 이력서/포트폴리오 작성법",
            instructor: "JSCODE 박재성",
            originalPrice: 88000,
            price: 61600,
            discount: 30,
            rating: 5.0,
            students: 100,
            isNew: true,
            image: "/placeholder.svg?height=160&width=280",
        },
        {
            id: "5",
            slug: "anxiety-prayer",
            title: "불안과 불확실 속 나의 이름으로 기도하기",
            instructor: "송강영",
            originalPrice: 9900,
            price: 6930,
            discount: 30,
            rating: 5.0,
            students: 200,
            isNew: true,
            image: "/placeholder.svg?height=160&width=280",
        },
        {
            id: "6",
            slug: "figma-intro",
            title: "[2024 업데이트] UX/UI 시작하기 : Figma 입문 (Inflearn Original)",
            instructor: "인프런",
            originalPrice: 33000,
            price: 0,
            discount: 100,
            rating: 4.7,
            students: 57000,
            image: "/placeholder.svg?height=160&width=280",
        },
        {
            id: "7",
            slug: "freelancer-tax",
            title: "프리랜서, 종합소득세 셀프로 신고하고 환급받기!",
            instructor: "미니특세사무소",
            originalPrice: 33000,
            price: 23100,
            discount: 30,
            rating: 0,
            students: 0,
            isNew: true,
            image: "/placeholder.svg?height=160&width=280",
        },
        {
            id: "8",
            slug: "kubernetes-guide",
            title: "Kubernetes 완벽 가이드: 기초부터 실전까지",
            instructor: "JSCODE 박재성",
            price: 88000,
            rating: 4.9,
            students: 750,
            image: "/placeholder.svg?height=160&width=280",
        },
    ]

    return (
        <main className="min-h-screen bg-black text-white">
            <NetflixHeader/>

            <div className="container mx-auto px-4 pt-24 pb-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* 왼쪽: 필터 */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 sticky top-4">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-medium flex items-center text-white">
                                    <Filter className="h-4 w-4 mr-1"/>
                                    필터
                                </h2>
                                <Button variant="ghost" size="sm" className="text-sm text-gray-400 hover:text-white">
                                    초기화
                                </Button>
                            </div>

                            <Accordion type="multiple" defaultValue={["price", "level", "skills"]}
                                       className="space-y-2">
                                <AccordionItem value="price" className="border-gray-800">
                                    <AccordionTrigger
                                        className="py-2 text-gray-300 hover:text-white">가격</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Checkbox id="price-all" className="border-gray-600"/>
                                                <Label htmlFor="price-all" className="ml-2 text-sm text-gray-300">
                                                    전체
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="price-free" className="border-gray-600"/>
                                                <Label htmlFor="price-free" className="ml-2 text-sm text-gray-300">
                                                    무료
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="price-paid" className="border-gray-600"/>
                                                <Label htmlFor="price-paid" className="ml-2 text-sm text-gray-300">
                                                    유료
                                                </Label>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="level" className="border-gray-800">
                                    <AccordionTrigger
                                        className="py-2 text-gray-300 hover:text-white">난이도</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Checkbox id="level-all" className="border-gray-600"/>
                                                <Label htmlFor="level-all" className="ml-2 text-sm text-gray-300">
                                                    전체
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="level-beginner" className="border-gray-600"/>
                                                <Label htmlFor="level-beginner" className="ml-2 text-sm text-gray-300">
                                                    입문
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="level-intermediate" className="border-gray-600"/>
                                                <Label htmlFor="level-intermediate"
                                                       className="ml-2 text-sm text-gray-300">
                                                    초급
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="level-advanced" className="border-gray-600"/>
                                                <Label htmlFor="level-advanced" className="ml-2 text-sm text-gray-300">
                                                    중급
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="level-expert" className="border-gray-600"/>
                                                <Label htmlFor="level-expert" className="ml-2 text-sm text-gray-300">
                                                    고급
                                                </Label>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="skills" className="border-gray-800">
                                    <AccordionTrigger className="py-2 text-gray-300 hover:text-white">기술
                                        스택</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center">
                                                <Checkbox id="skill-all" className="border-gray-600"/>
                                                <Label htmlFor="skill-all" className="ml-2 text-sm text-gray-300">
                                                    전체
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="skill-javascript" className="border-gray-600"/>
                                                <Label htmlFor="skill-javascript"
                                                       className="ml-2 text-sm text-gray-300">
                                                    JavaScript
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="skill-python" className="border-gray-600"/>
                                                <Label htmlFor="skill-python" className="ml-2 text-sm text-gray-300">
                                                    Python
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="skill-java" className="border-gray-600"/>
                                                <Label htmlFor="skill-java" className="ml-2 text-sm text-gray-300">
                                                    Java
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="skill-react" className="border-gray-600"/>
                                                <Label htmlFor="skill-react" className="ml-2 text-sm text-gray-300">
                                                    React
                                                </Label>
                                            </div>
                                            <div className="flex items-center">
                                                <Checkbox id="skill-spring" className="border-gray-600"/>
                                                <Label htmlFor="skill-spring" className="ml-2 text-sm text-gray-300">
                                                    Spring
                                                </Label>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>

                    {/* 오른쪽: 강의 목록 */}
                    <div className="flex-1">
                        <div className="mb-6">
                            <Tabs defaultValue="all">
                                <TabsList className="mb-4 bg-gray-800">
                                    <TabsTrigger value="all" className="data-[state=active]:bg-gray-700">
                                        전체 강의
                                    </TabsTrigger>
                                    <TabsTrigger value="new" className="data-[state=active]:bg-gray-700">
                                        신규 강의
                                    </TabsTrigger>
                                    <TabsTrigger value="popular" className="data-[state=active]:bg-gray-700">
                                        인기 강의
                                    </TabsTrigger>
                                    <TabsTrigger value="free" className="data-[state=active]:bg-gray-700">
                                        무료 강의
                                    </TabsTrigger>
                                </TabsList>

                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-sm text-gray-400">총 {courses.length}개 강의</div>

                                    <div className="flex items-center">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-sm flex items-center text-gray-300 hover:text-white"
                                        >
                                            추천순
                                            <ChevronDown className="h-4 w-4 ml-1"/>
                                        </Button>
                                        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700"/>
                                        <Button variant="ghost" size="sm"
                                                className="text-sm text-gray-300 hover:text-white">
                                            최신순
                                        </Button>
                                        <Separator orientation="vertical" className="h-6 mx-2 bg-gray-700"/>
                                        <Button variant="ghost" size="sm"
                                                className="text-sm text-gray-300 hover:text-white">
                                            평점순
                                        </Button>
                                    </div>
                                </div>

                                <TabsContent value="all" className="mt-0">
                                    <div
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {courses.map((course) => (
                                            <Link key={course.id} href={`/course/${course.slug}`}>
                                                <CourseCard
                                                    image={course.image}
                                                    title={course.title}
                                                    instructor={course.instructor}
                                                    price={course.price}
                                                    originalPrice={course.originalPrice}
                                                    discount={course.discount}
                                                    rating={course.rating}
                                                    students={course.students}
                                                    isNew={course.isNew}
                                                    isUpdated={course.isUpdated}
                                                />
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="flex justify-center mt-8">
                                        <Button variant="outline"
                                                className="border-gray-700 text-gray-300 hover:bg-gray-800">
                                            더 보기
                                        </Button>
                                    </div>
                                </TabsContent>

                                <TabsContent value="new" className="mt-0">
                                    <div
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {courses
                                            .filter((course) => course.isNew)
                                            .map((course) => (
                                                <Link key={course.id} href={`/course/${course.slug}`}>
                                                    <CourseCard
                                                        image={course.image}
                                                        title={course.title}
                                                        instructor={course.instructor}
                                                        price={course.price}
                                                        originalPrice={course.originalPrice}
                                                        discount={course.discount}
                                                        rating={course.rating}
                                                        students={course.students}
                                                        isNew={course.isNew}
                                                        isUpdated={course.isUpdated}
                                                    />
                                                </Link>
                                            ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="popular" className="mt-0">
                                    <div
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {courses
                                            .sort((a, b) => b.students - a.students)
                                            .map((course) => (
                                                <Link key={course.id} href={`/course/${course.slug}`}>
                                                    <CourseCard
                                                        image={course.image}
                                                        title={course.title}
                                                        instructor={course.instructor}
                                                        price={course.price}
                                                        originalPrice={course.originalPrice}
                                                        discount={course.discount}
                                                        rating={course.rating}
                                                        students={course.students}
                                                        isNew={course.isNew}
                                                        isUpdated={course.isUpdated}
                                                    />
                                                </Link>
                                            ))}
                                    </div>
                                </TabsContent>

                                <TabsContent value="free" className="mt-0">
                                    <div
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {courses
                                            .filter((course) => course.price === 0)
                                            .map((course) => (
                                                <Link key={course.id} href={`/course/${course.slug}`}>
                                                    <CourseCard
                                                        image={course.image}
                                                        title={course.title}
                                                        instructor={course.instructor}
                                                        price={course.price}
                                                        originalPrice={course.originalPrice}
                                                        discount={course.discount}
                                                        rating={course.rating}
                                                        students={course.students}
                                                        isNew={course.isNew}
                                                        isUpdated={course.isUpdated}
                                                    />
                                                </Link>
                                            ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

