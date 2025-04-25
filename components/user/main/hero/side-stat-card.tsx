"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

export default function SideStatCard() {
  const [count, setCount] = useState(0)
  const targetCount = 66609538
  const duration = 1800 // 1.8 seconds
  const frameRate = 30 // frames per second
  const totalFrames = Math.floor((duration / 1000) * frameRate)
  const countRef = useRef(null)

  useEffect(() => {
    let frame = 0
    const counter = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      // Easing function for smoother animation
      const easedProgress = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      setCount(Math.floor(easedProgress * targetCount))

      if (frame === totalFrames) {
        clearInterval(counter)
        setCount(targetCount)
      }
    }, 1000 / frameRate)

    return () => clearInterval(counter)
  }, [])

  const cardVariants = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <motion.div
    //   className="rounded-[24px] bg-[#FFD600] h-[270px] p-8 flex flex-col justify-between"
    className="rounded-[24px] bg-rose-500 h-[270px] w-[250px] p-8 flex flex-col justify-between"
      variants={cardVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <div>
        <h3 className="text-lg font-bold mb-2">AI 서비스 이용</h3>
        <p className="text-sm">오늘의 이용 건수</p>
      </div>

      <div>
        <p className="text-3xl font-extrabold" ref={countRef}>
          {formatNumber(count)}
          <span className="text-lg font-normal ml-1">건</span>
        </p>
        <p className="text-sm mt-2">2024년 4월 25일 기준</p>
      </div>
    </motion.div>
  )
}
