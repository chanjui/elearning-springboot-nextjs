"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function SideMiniCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const items = [
    { icon: "world", label: "카카오 그룹" },
    { icon: "chat", label: "카카오톡" },
    { icon: "map", label: "카카오맵" },
  ]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % items.length)
  }

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
      className="rounded-[24px] bg-[#FFD600] h-[160px] w-[250px] px-8 flex items-center justify-between"
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <motion.button
        className="hover:scale-110 transition duration-200"
        whileHover={{ scale: 1.1 }}
        onClick={handlePrev}
        aria-label="이전 항목"
      >
        <ChevronLeft size={24} />
      </motion.button>

      <div className="text-center">
        <div className="mx-auto mb-2 w-10 h-10 flex items-center justify-center">
          {activeIndex === 0 && (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20C35 11.7157 28.2843 5 20 5ZM8 20C8 13.3726 13.3726 8 20 8C26.6274 8 32 13.3726 32 20C32 26.6274 26.6274 32 20 32C13.3726 32 8 26.6274 8 20Z"
                fill="black"
              />
              <path
                d="M20 12C15.5817 12 12 15.5817 12 20C12 24.4183 15.5817 28 20 28C24.4183 28 28 24.4183 28 20C28 15.5817 24.4183 12 20 12ZM15 20C15 17.2386 17.2386 15 20 15C22.7614 15 25 17.2386 25 20C25 22.7614 22.7614 25 20 25C17.2386 25 15 22.7614 15 20Z"
                fill="black"
              />
            </svg>
          )}
          {activeIndex === 1 && (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M30 15C30 10.0294 25.5228 6 20 6C14.4772 6 10 10.0294 10 15C10 19.9706 14.4772 24 20 24C21.3734 24 22.6934 23.7658 23.9055 23.3316L30 26V15Z"
                fill="black"
              />
            </svg>
          )}
          {activeIndex === 2 && (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M20 6C14.4772 6 10 10.4772 10 16C10 23 20 34 20 34C20 34 30 23 30 16C30 10.4772 25.5228 6 20 6ZM20 19C18.3431 19 17 17.6569 17 16C17 14.3431 18.3431 13 20 13C21.6569 13 23 14.3431 23 16C23 17.6569 21.6569 19 20 19Z"
                fill="black"
              />
            </svg>
          )}
        </div>
        <p className="font-semibold">{items[activeIndex].label}</p>
      </div>

      <motion.button
        className="hover:scale-110 transition duration-200"
        whileHover={{ scale: 1.1 }}
        onClick={handleNext}
        aria-label="다음 항목"
      >
        <ChevronRight size={24} />
      </motion.button>
    </motion.div>
  )
}
