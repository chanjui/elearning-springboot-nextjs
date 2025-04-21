"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Send, Phone, Video, Info, Smile, Paperclip, ChevronDown, Edit, Home, Settings, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatSettings } from "@/hooks/use-chat-settings"
import ChatSettings from "@/components/chat/chat-setting"
import NewMessageModal from "@/components/chat/new-massage-modal"
import { connectSocket, disconnectSocket, sendChatMessage } from "@/lib/socket"
import useUserStore from "@/app/auth/userStore"

interface User {
  id: string
  name: string
  profileUrl?: string
  isInstructor?: boolean
}

interface Chat {
  id: string
  name: string
  lastMessage: string
  time: string
  unread: boolean
  unreadCount: number // 안읽은 메시지 수 추가
  online: boolean
  selected?: boolean
  isInstructor?: boolean
}

interface Message {
  id: string
  userId: number
  nickname: string
  profileUrl?: string
  isInstructor?: boolean
  content: string
  time: string
  isImage: boolean
  imageUrl?: string
  isRead: boolean // 읽음 상태 추가
}

interface ChatPageProps {
  isInDrawer?: boolean
}

export default function ChatPage({ isInDrawer = false }: ChatPageProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { fontSize, fontFamily } = useChatSettings()

  const { user } = useUserStore()

  // 초기 채팅 데이터 분리
  const initialChats: Chat[] = [
    {
      id: "1",
      name: "김종현",
      lastMessage: "11분 전에 활동",
      time: "14분",
      unread: true,
      unreadCount: 3, // 안읽은 메시지 수 추가
      online: true,
      selected: true,
    },
    {
      id: "2",
      name: "_hamxxi__",
      lastMessage: "나: 화자면접지 · 11주",
      time: "11주",
      unread: false,
      unreadCount: 0,
      online: false,
    },
    {
      id: "3",
      name: "exexoxe__",
      lastMessage: "나: 👍 · 21주",
      time: "21주",
      unread: false,
      unreadCount: 0,
      online: false,
    },
    {
      id: "4",
      name: "용영운",
      lastMessage: "용영운님이 회부 파일을 보냈습니다. · 22주",
      time: "22주",
      unread: true,
      unreadCount: 1,
      online: false,
      isInstructor: true,
    },
    {
      id: "5",
      name: "태민 / 데일리룸(daily.room_)",
      lastMessage: "안정하세요. 데일리룸입니다 😊 오늘하신 채팅... · 31주",
      time: "31주",
      unread: false,
      unreadCount: 0,
      online: false,
    },
    {
      id: "6",
      name: "이광표",
      lastMessage: "3시간 전에 활동",
      time: "3시간",
      unread: true,
      unreadCount: 2,
      online: false,
      isInstructor: true,
    },
    {
      id: "7",
      name: "박형진",
      lastMessage: "박형진님이 회부 파일을 보냈습니다. · 35주",
      time: "35주",
      unread: false,
      unreadCount: 0,
      online: false,
    },
    {
      id: "8",
      name: "인용",
      lastMessage: "14시간 전에 활동",
      time: "14시간",
      unread: false,
      unreadCount: 0,
      online: false,
    },
    {
      id: "9",
      name: "김대희",
      lastMessage: "나: 🔥 · 50주",
      time: "50주",
      unread: false,
      unreadCount: 0,
      online: false,
    },
  ]

  // 상태로 변경
  const [chats, setChats] = useState<Chat[]>(initialChats)

  // 초기 메시지 데이터
  const initialMessages: Message[] = [
    {
      id: "1",
      userId: 1,
      nickname: "김종현",
      content: "ani_meme_guy",
      time: "오늘 7:07",
      isImage: true,
      imageUrl: "/placeholder.svg?height=300&width=200",
      isInstructor: false,
      profileUrl: "/placeholder.svg",
      isRead: true,
    },
    {
      id: "2",
      userId: 2,
      nickname: "me",
      content: "와 이건 진짜 ㅋㅋㅋ놀이다",
      time: "오늘 7:08",
      isImage: false,
      isInstructor: false,
      isRead: true,
    },
    {
      id: "3",
      userId: 2,
      nickname: "me",
      content: "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋEEEEEㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ",
      time: "오늘 7:08",
      isImage: false,
      isInstructor: false,
      isRead: true,
    },
    {
      id: "4",
      userId: 2,
      nickname: "me",
      content: "개웃긴다",
      time: "오늘 7:09",
      isImage: false,
      isInstructor: false,
      isRead: true,
    },
    {
      id: "5",
      userId: 1,
      nickname: "김종현",
      content: "ㅋㅋㅋㅋ!?",
      time: "오늘 9:14",
      isImage: false,
      isInstructor: false,
      isRead: true,
    },
    {
      id: "6",
      userId: 2,
      nickname: "me",
      content: "헐",
      time: "오늘 9:15",
      isImage: false,
      isInstructor: false,
      isRead: true,
    },
    {
      id: "7",
      userId: 2,
      nickname: "me",
      content: "그런가용",
      time: "오늘 9:15",
      isImage: false,
      isInstructor: false,
      isRead: true,
    },
    {
      id: "8",
      userId: 2,
      nickname: "me",
      content: "ㅋㅋㅋEEEEEㅋㅋㅋEEEEㅋㅋ",
      time: "오늘 9:16",
      isImage: false,
      isInstructor: false,
      isRead: true,
    },
    {
      id: "9",
      userId: 1,
      nickname: "김종현",
      content: "AI 왔구나..",
      time: "오늘 9:17",
      isImage: false,
      isInstructor: false,
      isRead: false,
    },
    {
      id: "10",
      userId: 1,
      nickname: "김종현",
      content: "이거 진짜 신기하다",
      time: "오늘 9:18",
      isImage: false,
      isInstructor: false,
      isRead: false,
    },
    {
      id: "11",
      userId: 1,
      nickname: "김종현",
      content: "어떻게 생각해?",
      time: "오늘 9:19",
      isImage: false,
      isInstructor: false,
      isRead: false,
    },
  ]

  // 메시지 상태로 변경
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  // 스크롤을 항상 최신 메시지로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 채팅방 선택 시 메시지 읽음 처리
  useEffect(() => {
    connectSocket((msg) => {
      console.log("받은 메시지:", msg)
  
      // 1. 메시지 목록에 추가
      setMessages((prev) => [...prev, msg])
  
      // 2. 현재 선택된 채팅방이 아닌 경우 → unreadCount 증가
      if (msg.nickname !== selectedChat) {
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.name === msg.nickname
              ? {
                  ...chat,
                  unread: true,
                  unreadCount: chat.unreadCount + 1,
                  lastMessage: msg.content,
                  time: msg.time,
                }
              : chat
          )
        )
      }
    })
  
    return () => {
      disconnectSocket()
    }
  }, [selectedChat])

  // 채팅방 들어가면 해당 채팅의 메시지 읽음 처리
  useEffect(() => {
    if (!selectedChat) return

    setMessages((prev) =>
      prev.map((msg) =>
        msg.nickname === selectedChat && !msg.isRead
          ? { ...msg, isRead: true }
          : msg,
      ),
    )

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.name === selectedChat
          ? { ...chat, unread: false, unreadCount: 0 }
          : chat,
      ),
    )
  }, [selectedChat])

  // 총 안읽은 메시지 수 계산
  const totalUnreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() === "") return
  
    const payload = {
      id: `${Date.now()}-${Math.random()}`, // 고유 id 부여
      userId: user?.id,
      nickname: user?.nickname,
      profileUrl: user?.profileUrl,
      isInstructor: user?.isInstructor === 1,
      content: message,
      time: new Date().toLocaleTimeString(),
      isImage: false,
      isRead: true, // 읽음 상태로 바로 처리
    }
  
    sendChatMessage("/app/chat/message", payload)
    setMessages((prev) => [...prev, payload]) // 즉시 반영 (옵션)
    setMessage("")
  
    // 선택된 채팅방도 lastMessage, time 갱신
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.name === selectedChat
          ? {
              ...chat,
              lastMessage: payload.content,
              time: payload.time,
            }
          : chat
      )
    )
  }

  const handleNewMessageClick = () => {
    setShowNewMessageModal(true)
  }

  const handleSelectUsers = (users: User[]) => {
    if (users.length === 0) return

    const selectedUser = users[0]
    const exists = chats.find((chat) => chat.name === selectedUser.name)

    if (!exists) {
      const newChat: Chat = {
        id: `${Date.now()}`, // 임시 ID
        name: selectedUser.name,
        lastMessage: "",
        time: "방금",
        unread: false,
        unreadCount: 0,
        online: false,
        isInstructor: selectedUser.isInstructor,
      }

      setChats((prev) => [...prev, newChat])
    }

    setSelectedChat(selectedUser.name)
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
            <Button variant="ghost" size="icon" onClick={handleNewMessageClick} className="relative">
              <Edit className="h-5 w-5" />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalUnreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="px-4 py-2 flex justify-between items-center">
          <h3 className="font-medium">목록</h3>
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
                  <div className="flex items-center">
                    <p className={`font-medium truncate ${chat.unread ? "text-white" : "text-gray-400"}`}>
                      {chat.name}
                    </p>
                    {chat.isInstructor && (
                      <span className="ml-1 text-xs bg-red-600 text-white px-1 py-0.5 rounded">강사</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {chat.unreadCount > 0 && (
                      <span className="mr-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                </div>
                <p className={`text-sm truncate ${chat.unread ? "text-white font-medium" : "text-gray-400"}`}>
                  {chat.lastMessage}
                </p>
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
                <div className="flex items-center">
                  <h3 className="font-medium">{selectedChat}</h3>
                  {chats.find((chat) => chat.name === selectedChat)?.isInstructor && (
                    <span className="ml-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded">강사</span>
                  )}
                </div>
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
            {messages.filter((msg) => 
                  (msg.userId === user?.id) || 
                  (msg.nickname === selectedChat && msg.userId !== user?.id)
                )

              .map((msg) => (
                <div key={msg.id} className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] ${
                      msg.userId === user?.id
                        ? "bg-red-600 rounded-3xl rounded-br-sm"
                        : "bg-gray-800 rounded-3xl rounded-bl-sm"
                    } px-4 py-2`}
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
                    <div className="flex items-center justify-end mt-1 space-x-1">
                      {msg.userId === user?.id && (
                        <span className="text-xs text-gray-300">
                          {msg.isRead ? (
                            <Check className="h-3 w-3 text-blue-400" />
                          ) : (
                            <span className="text-xs text-gray-400">1</span>
                          )}
                        </span>
                      )}
                      <p className="text-xs text-gray-400">{msg.time}</p>
                    </div>
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
          <Button className="mt-2 bg-red-600 hover:bg-red-700" onClick={handleNewMessageClick}>
            메시지 보내기
          </Button>
        </div>
      )}

      {/* 설정 모달 */}
      <ChatSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* 새 메시지 모달 */}
      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onSelectUsers={handleSelectUsers}
      />
    </div>
  )
}
