"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Send, Phone, Video, Info, Smile, Paperclip, ChevronDown, Search, Edit, Home, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatSettings } from "@/hooks/use-chat-settings"
import ChatSettings from "@/components/chat/chat-setting"

interface ChatPageProps {
  isInDrawer?: boolean
}

export default function ChatPage({ isInDrawer = false }: ChatPageProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { fontSize, fontFamily } = useChatSettings()

  // 채팅 목록 데이터
  const chats = [
    {
      id: "1",
      name: "김종현",
      lastMessage: "11분 전에 활동",
      time: "14분",
      unread: false,
      online: true,
      selected: true,
    },
    { id: "2", name: "_hamxxi__", lastMessage: "나: 화자면접지 · 11주", time: "11주", unread: false, online: false },
    { id: "3", name: "exexoxe__", lastMessage: "나: 👍 · 21주", time: "21주", unread: false, online: false },
    {
      id: "4",
      name: "용영운",
      lastMessage: "용영운님이 회부 파일을 보냈습니다. · 22주",
      time: "22주",
      unread: false,
      online: false,
    },
    {
      id: "5",
      name: "태민 / 데일리룸(daily.room_)",
      lastMessage: "안정하세요. 데일리룸입니다 😊 오늘하신 채팅... · 31주",
      time: "31주",
      unread: false,
      online: false,
    },
    { id: "6", name: "이광표", lastMessage: "3시간 전에 활동", time: "3시간", unread: false, online: false },
    {
      id: "7",
      name: "박형진",
      lastMessage: "박형진님이 회부 파일을 보냈습니다. · 35주",
      time: "35주",
      unread: false,
      online: false,
    },
    { id: "8", name: "인용", lastMessage: "14시간 전에 활동", time: "14시간", unread: false, online: false },
    { id: "9", name: "김대희", lastMessage: "나: 🔥 · 50주", time: "50주", unread: false, online: false },
  ]

  // 메시지 데이터
  const messages = [
    {
      id: "1",
      sender: "김종현",
      content: "ani_meme_guy",
      time: "오늘 7:07",
      isImage: true,
      imageUrl: "/placeholder.svg?height=300&width=200",
    },
    { id: "2", sender: "me", content: "와 이건 진짜 ㅋㅋㅋ놀이다", time: "오늘 7:08", isImage: false },
    {
      id: "3",
      sender: "me",
      content: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋEEEEEㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
      time: "오늘 7:08",
      isImage: false,
    },
    { id: "4", sender: "me", content: "개웃긴다", time: "오늘 7:09", isImage: false },
    { id: "5", sender: "김종현", content: "ㅋㅋㅋㅋ!?", time: "오늘 9:14", isImage: false },
    { id: "6", sender: "me", content: "헐", time: "오늘 9:15", isImage: false },
    { id: "7", sender: "me", content: "그런가용", time: "오늘 9:15", isImage: false },
    { id: "8", sender: "me", content: "ㅋㅋㅋEEEEEㅋㅋㅋEEEEㅋㅋ", time: "오늘 9:16", isImage: false },
    { id: "9", sender: "me", content: "AI 왔구나..", time: "오늘 9:17", isImage: false },
  ]

  // 스크롤을 항상 최신 메시지로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() === "") return

    // 여기서 메시지 전송 로직 구현
    console.log("메시지 전송:", message)
    setMessage("")
  }

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // 글씨체 스타일 가져오기
  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case "sans":
        return "ui-sans-serif, system-ui, sans-serif"
      case "serif":
        return "ui-serif, Georgia, serif"
      case "mono":
        return "ui-monospace, SFMono-Regular, monospace"
      case "noto-sans-kr":
        return '"Noto Sans KR", sans-serif'
      case "nanum-gothic":
        return '"Nanum Gothic", sans-serif'
      default:
        return "ui-sans-serif, system-ui, sans-serif"
    }
  }

  return (
    <div className={`flex h-full bg-black text-white ${isInDrawer ? "" : "h-screen"} overflow-x-auto`}>
      {/* 왼쪽 사이드바 - 채팅 목록 */}
      <div className="w-[320px] min-w-[320px] border-r border-gray-800 flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-4">
            {!isInDrawer && (
              <Link href="/">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Home className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <div className="flex items-center space-x-2">
              <h2 className="font-bold">2.ruu_</h2>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="p-4 flex items-center space-x-2">
          <div className="relative w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-xs">내 메모</span>
          </div>
          <div className="text-sm">내 메모</div>
        </div>

        <div className="px-4 py-2 flex justify-between items-center">
          <h3 className="font-medium">메시지</h3>
          <span className="text-xs text-gray-400">요청</span>
        </div>

        <div className="px-4 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="검색"
              className="pl-8 bg-gray-800 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 flex items-start space-x-3 hover:bg-gray-900 cursor-pointer ${selectedChat === chat.name ? "bg-gray-900" : ""}`}
              onClick={() => setSelectedChat(chat.name)}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=48&width=48&text=${chat.name.charAt(0)}`}
                    alt={chat.name}
                    width={48}
                    height={48}
                  />
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{chat.name}</p>
                  <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 오른쪽 - 채팅 내용 */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col min-w-[320px]">
          {/* 채팅 헤더 */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <Image
                  src={`/placeholder.svg?height=40&width=40&text=${selectedChat.charAt(0)}`}
                  alt={selectedChat}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedChat}</h3>
                <p className="text-xs text-gray-400">14분 전에 활동</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* 메시지 영역 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] ${msg.sender === "me" ? "bg-red-600 rounded-3xl rounded-br-sm" : "bg-gray-800 rounded-3xl rounded-bl-sm"} px-4 py-2`}
                >
                  {msg.isImage ? (
                    <div className="rounded-md overflow-hidden">
                      <Image
                        src={msg.imageUrl || "/placeholder.svg"}
                        alt="Shared image"
                        width={200}
                        height={300}
                        className="object-cover"
                      />
                      <div
                        className="p-2 bg-black/50 text-sm"
                        style={{
                          fontSize: `${fontSize}px`,
                          fontFamily: getFontFamilyStyle(),
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <p
                      style={{
                        fontSize: `${fontSize}px`,
                        fontFamily: getFontFamilyStyle(),
                      }}
                    >
                      {msg.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 영역 */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 flex items-center space-x-2">
            <Button type="button" variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Input
              placeholder="메시지 입력..."
              className="bg-gray-800 border-gray-700 text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: getFontFamilyStyle(),
              }}
            />
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button type="submit" size="icon" className="bg-red-600 hover:bg-red-700">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full border-2 border-gray-700 flex items-center justify-center mb-4">
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 31.5C25.4558 31.5 31.5 25.4558 31.5 18C31.5 10.5442 25.4558 4.5 18 4.5C10.5442 4.5 4.5 10.5442 4.5 18C4.5 20.8854 5.40652 23.5452 6.96781 25.7273C7.12857 25.9382 7.18749 26.2047 7.12417 26.4618L6.04167 30.0882C5.91926 30.5499 6.32009 30.9507 6.78176 30.8283L10.7646 29.6458C10.9917 29.5857 11.2331 29.6249 11.4336 29.7571C13.4134 31.0188 15.7663 31.5 18 31.5Z"
                fill="#CCCCCC"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">내 메시지</h2>
          <p className="text-gray-400 text-center max-w-md mb-4">친구나 그룹에 바로게 시작과 메시지를 보내보세요</p>
          <Button className="mt-2 bg-red-600 hover:bg-red-700">메시지 보내기</Button>
        </div>
      )}

      {/* 설정 모달 */}
      <ChatSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}
