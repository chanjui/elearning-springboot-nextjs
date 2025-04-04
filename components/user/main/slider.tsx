import Image from "next/image"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Star } from "lucide-react"
import Link from "next/link"

const slides = [
  {
    id: 1,
    title: "Docker와 Kubernetes 완벽 마스터",
    description: "컨테이너화부터 오케스트레이션까지, 현업에서 바로 활용 가능한 실전 DevOps 기술을 배워보세요.",
    image: "/main-docker.png",
    category: "DevOps",
    instructor: "김데브옵스",
    rating: 4.9,
    students: 3240,
    level: "중급",
    tags: ["Docker", "Kubernetes", "DevOps", "클라우드"],
  },
  {
    id: 2,
    title: "React와 TypeScript로 배우는 현대적 웹 개발",
    description: "실무에서 인정받는 프론트엔드 개발자가 되기 위한 필수 기술 스택을 한 번에 마스터하세요.",
    image: "/main-react.jpg",
    category: "프론트엔드",
    instructor: "박프론트",
    rating: 4.8,
    students: 5120,
    level: "초급-중급",
    tags: ["React", "TypeScript", "웹개발", "프론트엔드"],
  },
  {
    id: 3,
    title: "Spring Boot와 JPA로 구현하는 실전 백엔드",
    description: "대규모 서비스에서 검증된 Java 백엔드 기술로 안정적이고 확장 가능한 서버를 구축해보세요.",
    image: "/main-spring.png",
    category: "백엔드",
    instructor: "이백엔드",
    rating: 4.9,
    students: 4150,
    level: "중급-고급",
    tags: ["Java", "Spring", "JPA", "백엔드"],
  },
]

export default function slider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative h-[85vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="container mx-auto px-4 h-full flex items-center relative z-20">
            <div className="max-w-2xl">
              <div className={`transition-all duration-500 ${index === currentSlide ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                <Badge className="mb-4 bg-red-600 hover:bg-red-700">{slide.category}</Badge>
                <h1 className="text-4xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg text-gray-300 mb-6">{slide.description}</p>
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{slide.rating}</span>
                    <span className="text-gray-400 ml-1">({slide.students}명)</span>
                  </div>
                  <div className="text-gray-400">|</div>
                  <div className="text-gray-300">{slide.instructor}</div>
                  <div className="text-gray-400">|</div>
                  <div className="text-gray-300">{slide.level}</div>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {slide.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gray-600">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Play className="h-4 w-4 mr-2" /> 무료 맛보기
                  </Button>
                  <Link href="/user/course/1">
                    <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                      자세히 보기
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-red-600 w-6" : "bg-gray-600"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}