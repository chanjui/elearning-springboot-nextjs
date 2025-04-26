 "use client"

import { motion } from "framer-motion"

export default function HeroPuzzle() {
  return (
    <div
      className="
        relative
        w-[1200px] h-[738px]
        overflow-hidden isolate

        /* 기본 배경 + 둥근 모서리 */
        bg-black rounded-[48px]

        /* concave notch: top-right & bottom-left */
        [mask-image:
          radial-gradient(circle_48px_at_100%25_0,transparent_48px,black_48.5px),
          radial-gradient(circle_48px_at_0_100%25,transparent_48px,black_48.5px)
        ]
        [mask-mode:alpha]
        [mask-composite:exclude]
        [-webkit-mask-composite:destination-out]
      "
      aria-label="히어로 섹션"
    >
      {/* 배경 GIF */}
      <img
        src="https://images.squarespace-cdn.com/content/v1/59afca87c027d8e9bfaa762c/1526327198093-H0KCEJOIQ16H4T9U8CW6/Coding+Gif"
        alt="코딩 애니메이션"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* 텍스트 & CTA */}
      <div className="relative z-10 h-full flex flex-col justify-between p-16">
        <h2 className="text-[60px] leading-[1.1] font-normal text-white">
          여기서
          <br />내일이 시작됩니다
        </h2>

        <motion.button
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          aria-label="AI 서비스에 대해 자세히 알아보기"
        >
          <span className="text-white text-lg">자세히 알아보기</span>
          <motion.span
            className="w-[52px] h-[52px] rounded-full bg-white flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="black"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.span>
        </motion.button>
      </div>

      {/* 전구 + glow (notch 위에) */}
      <div className="absolute top-[16px] right-[16px] z-20 w-20 h-20 pointer-events-none select-none">
        <img
          src="https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/report/c925fb39018c00001.gif"
          alt="전구"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
    </div>
  )
}
