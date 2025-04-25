"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function SideSlideCard() {
  const [activeSlide, setActiveSlide] = useState<number>(0)
//   const [activeSlide, setActiveSlide] = useState(0)
//   const intervalRef = useRef(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const totalSlides = 3

  const slides = [
    {
      title: "AI 번역",
      description: "자연스러운 번역으로 언어의 장벽을 허물어요",
    },
    {
      title: "AI 요약",
      description: "긴 문서도 핵심만 쏙 정리해드려요",
    },
    {
      title: "AI 작문",
      description: "다양한 글쓰기를 도와드려요",
    },
  ]

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides)
    }, 3500)

    // return () => clearInterval(intervalRef.current)
    return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      className="rounded-[24px] bg-[#1A1A1A] h-[260px] w-[250px] p-6 text-white relative"
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div className="h-full flex flex-col justify-between">
        <div>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`transition-opacity duration-500 absolute inset-x-6 top-6 ${activeSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <h3 className="text-lg font-bold mb-2">{slide.title}</h3>
              <p className="text-sm">{slide.description}</p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full bg-white bg-opacity-60`}
              animate={{
                scale: activeSlide === index ? 1.25 : 1,
                opacity: activeSlide === index ? 1 : 0.6,
              }}
              transition={{ duration: 0.2 }}
              onClick={() => {
                setActiveSlide(index)
                clearInterval(intervalRef.current!)
                intervalRef.current = setInterval(() => {
                  setActiveSlide((prev) => (prev + 1) % totalSlides)
                }, 3500)
              }}
              aria-label={`슬라이드 ${index + 1}로 이동`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
