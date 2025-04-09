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
import { useEffect, useState } from "react"

interface Course {
    id: number
    slug: string
    title: string
    instructor: string
    price: number
    originalPrice: number
    discount: number
    rating: number
    students: number
    image: string
    new: boolean
    updated: boolean
}

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("all")

    useEffect(() => {
        fetchCourses()
    }, [activeTab])

    const fetchCourses = async () => {
        setLoading(true)
        try {
            let endpoint = "/api/user/courses"
            if (activeTab === "new") {
                endpoint = "/api/user/courses/new"
            } else if (activeTab === "popular") {
                endpoint = "/api/user/courses/popular"
            } else if (activeTab === "free") {
                endpoint = "/api/user/courses/free"
            }

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 필요한 경우 인증 헤더 추가
                    // 'Authorization': 'Bearer your-token-here'
                },
                credentials: 'include', // 쿠키 포함
            })
            
            if (!response.ok) {
                throw new Error(`Failed to fetch courses: ${response.status} ${response.statusText}`)
            }
            
            const data = await response.json()
            setCourses(data)
        } catch (error) {
            console.error("Error fetching courses:", error)
            // 사용자에게 오류 메시지 표시
            setCourses([])
        } finally {
            setLoading(false)
        }
    }

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
                            <Tabs defaultValue="all" onValueChange={setActiveTab}>
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

                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <>
                                        <TabsContent value="all" className="mt-0">
                                            <div
                                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                {courses.map((course) => (
                                                    <Link key={`all-${course.id}`} href={`/user/course/${course.id}`}>
                                                        <CourseCard
                                                            thumbnail={course.image}
                                                            subject={course.title}
                                                            instructor={course.instructor}
                                                            price={course.price}
                                                            originalPrice={course.originalPrice}
                                                            discountRate={course.discount}
                                                            rating={course.rating}
                                                            students={course.students}
                                                            isNew={course.new}
                                                            isUpdated={course.updated}
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
                                                {courses.map((course) => (
                                                    <Link key={`new-${course.id}`} href={`/user/course/${course.id}`}>
                                                        <CourseCard
                                                            thumbnail={course.image}
                                                            subject={course.title}
                                                            instructor={course.instructor}
                                                            price={course.price}
                                                            originalPrice={course.originalPrice}
                                                            discountRate={course.discount}
                                                            rating={course.rating}
                                                            students={course.students}
                                                            isNew={course.new}
                                                            isUpdated={course.updated}
                                                        />
                                                    </Link>
                                                ))}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="popular" className="mt-0">
                                            <div
                                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                {courses.map((course) => (
                                                    <Link key={`popular-${course.id}`} href={`/user/course/${course.id}`}>
                                                        <CourseCard
                                                            thumbnail={course.image}
                                                            subject={course.title}
                                                            instructor={course.instructor}
                                                            price={course.price}
                                                            originalPrice={course.originalPrice}
                                                            discountRate={course.discount}
                                                            rating={course.rating}
                                                            students={course.students}
                                                            isNew={course.new}
                                                            isUpdated={course.updated}
                                                        />
                                                    </Link>
                                                ))}
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="free" className="mt-0">
                                            <div
                                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                                {courses.map((course) => (
                                                    <Link key={`free-${course.id}`} href={`/user/course/${course.id}`}>
                                                        <CourseCard
                                                            thumbnail={course.image}
                                                            subject={course.title}
                                                            instructor={course.instructor}
                                                            price={course.price}
                                                            originalPrice={course.originalPrice}
                                                            discountRate={course.discount}
                                                            rating={course.rating}
                                                            students={course.students}
                                                            isNew={course.new}
                                                            isUpdated={course.updated}
                                                        />
                                                    </Link>
                                                ))}
                                            </div>
                                        </TabsContent>
                                    </>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

