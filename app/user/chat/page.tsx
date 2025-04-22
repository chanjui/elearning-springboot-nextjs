 "use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Send, Home, Edit, Settings, Smile, Paperclip, Check, ChevronDown, Phone, Video, Info } from "lucide-react"
import { Button } from "@/components/user/ui/button"
import { Input } from "@/components/user/ui/input"
import { useChatSettings } from "@/hooks/use-chat-settings"
import ChatSettings from "@/components/chat/chat-setting"
import NewMessageModal from "@/components/chat/new-massage-modal"
import { connectSocket, disconnectSocket, sendChatMessage } from "@/lib/socket"
import useUserStore from "@/app/auth/userStore"

interface User {
  id: number
  name: string
  profileUrl?: string
  isInstructor?: boolean
}

interface Chat {
  roomId: number
  name: string
  lastMessage: string
  time: string
  unread: boolean
  unreadCount: number
  online: boolean
  isInstructor?: boolean
}

interface Message {
  id: string
  roomId: number
  userId: number
  nickname: string
  profileUrl?: string
  isInstructor?: boolean
  content: string
  time: string
  isImage: boolean
  imageUrl?: string
  isRead: boolean
}

interface ChatPageProps {
  isInDrawer?: boolean
}

export default function ChatPage({ isInDrawer = false }: ChatPageProps) {
  const { user } = useUserStore()
  const { fontSize, fontFamily } = useChatSettings()

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // 소켓 메시지 수신 처리
  useEffect(() => {
    connectSocket((msg: Message) => {
      setMessages((prev) => [...prev, msg])
      if (msg.roomId !== selectedRoomId) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.roomId === msg.roomId
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
  }, [selectedRoomId])

  // 선택한 채팅방 메시지 읽음 처리
  // 기존 selectedRoomId useEffect 수정 → 아래 코드로 교체
  useEffect(() => {
    if (!selectedRoomId || !user) return

    // 메시지 목록 불러오기
    fetch(`${API_URL}/api/user/chat/rooms/${selectedRoomId}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(err => console.error("메시지 목록 오류", err))

    // 읽음 처리 요청
    fetch(`${API_URL}/api/user/chat/rooms/${selectedRoomId}/read?userId=${user.id}`, {
      method: "PUT",
    }).catch(err => console.error("읽음 처리 실패", err))

    // 클라이언트 상태에서도 읽음 처리 반영
    setMessages((prev) =>
      prev.map((msg) =>
        msg.roomId === selectedRoomId && !msg.isRead ? { ...msg, isRead: true } : msg
      )
    )
    setChats((prev) =>
      prev.map((chat) =>
        chat.roomId === selectedRoomId ? { ...chat, unread: false, unreadCount: 0 } : chat
      )
    )
  }, [selectedRoomId, user])

  // useEffect 하나 추가
  useEffect(() => {
    if (!user) return
    fetch(`${API_URL}/api/user/chat/rooms?userId=${user.id}`)
      .then(res => res.json())
      .then(data => setChats(data))
      .catch(err => console.error("채팅방 목록 오류", err))
  }, [user])

  useEffect(() => {
    const fetchChatRooms = async () => {
      if (!user) return
      try {
        const res = await fetch(`${API_URL}/api/user/chat/rooms?userId=${user.id}`)
        const rooms = await res.json()
        setChats(rooms)
      } catch (err) {
        console.error("채팅방 목록 불러오기 실패", err)
      }
    }
  
    fetchChatRooms()
  }, [user])
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedRoomId || !user) return
  
    const payload: Message = {
      id: `${Date.now()}-${Math.random()}`,
      roomId: selectedRoomId,
      userId: user.id,
      nickname: user.nickname,
      profileUrl: user.profileUrl,
      isInstructor: user.isInstructor === 1,
      content: message,
      time: new Date().toLocaleTimeString(),
      isImage: false,
      isRead: true,
    }
  
    sendChatMessage("/app/chat/message", payload)
    setMessage("")
  
    setChats((prev) =>
      prev.map((chat) =>
        chat.roomId === selectedRoomId
          ? { ...chat, lastMessage: payload.content, time: payload.time }
          : chat
      )
    )
  }  
  
  const handleSelectUsers = async (users: User[]) => {
    if (!users.length || !user) return
  
    const participantIds = [user.id, ...users.map((u) => u.id)]
  
    try {
      const res = await fetch(`${API_URL}/api/user/chat/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantIds }),
      })
  
      const room = await res.json()
      const roomId = room.roomId
  
      const exists = chats.find((chat) => chat.roomId === roomId)
      if (!exists) {
        const newChat: Chat = {
          roomId,
          name: users.length > 1
            ? `그룹 (${users.map((u) => u.name).join(",")})`
            : users[0].name,
          lastMessage: "",
          time: "방금",
          unread: false,
          unreadCount: 0,
          online: false,
          isInstructor: users.length === 1 ? users[0].isInstructor : false,
        }
        setChats((prev) => [...prev, newChat])
      }
  
      setSelectedRoomId(roomId)
    } catch (err) {
      console.error("채팅방 생성 실패", err)
    }
  }  

  const totalUnreadCount = chats.reduce((sum, c) => sum + c.unreadCount, 0)
  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case "noto-sans-kr": return '"Noto Sans KR", sans-serif'
      case "nanum-gothic": return '"Nanum Gothic", sans-serif'
      case "serif": return "ui-serif, Georgia, serif"
      case "mono": return "ui-monospace, SFMono-Regular, monospace"
      default: return "ui-sans-serif, system-ui, sans-serif"
    }
  }

  const selectedChat = chats.find((c) => c.roomId === selectedRoomId)
  const visibleMessages = messages.filter((msg) => msg.roomId === selectedRoomId)

  return (
    <div className={`flex h-full bg-black text-white ${isInDrawer ? "" : "h-screen"} overflow-x-auto`}>
      {/* 좌측 채팅 목록 */}
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
            <h2 className="font-bold">2.ruu_</h2>
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowNewMessageModal(true)} className="relative">
              <Edit className="h-5 w-5" />
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalUnreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.roomId}
              className={`p-3 flex items-start space-x-3 hover:bg-gray-900 cursor-pointer ${selectedRoomId === chat.roomId ? "bg-gray-900" : ""}`}
              onClick={() => setSelectedRoomId(chat.roomId)}
            >
              <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src={`/placeholder.svg?text=${chat.name.charAt(0)}`}
                  alt={chat.name}
                  width={48}
                  height={48}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <span className={`font-medium truncate ${chat.unread ? "text-white" : "text-gray-400"}`}>
                      {chat.name}
                    </span>
                    {chat.isInstructor && <span className="ml-2 text-xs bg-red-600 px-1 py-0.5 rounded">강사</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    {chat.unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">{chat.time}</span>
                  </div>
                </div>
                <p className={`text-sm truncate ${chat.unread ? "text-white" : "text-gray-400"}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 우측 채팅창 */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* 채팅 헤더 */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                <Image
                  src={`/placeholder.svg?text=${selectedChat.name.charAt(0)}`}
                  alt={selectedChat.name}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <h3 className="font-medium">{selectedChat.name}</h3>
                <p className="text-xs text-gray-400">{selectedChat.time} 활동</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon"><Phone className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Video className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon"><Info className="h-5 w-5" /></Button>
            </div>
          </div>

          {/* 메시지 목록 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {visibleMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.userId === user?.id ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] px-4 py-2 rounded-3xl ${
                  msg.userId === user?.id
                    ? "bg-red-600 rounded-br-sm"
                    : "bg-gray-800 rounded-bl-sm"
                }`}>
                  <p style={{ fontSize: `${fontSize}px`, fontFamily: getFontFamilyStyle() }}>{msg.content}</p>
                  <div className="flex justify-end gap-1 mt-1">
                    {msg.userId === user?.id && (
                      <Check className={`h-3 w-3 ${msg.isRead ? "text-blue-400" : "text-gray-500"}`} />
                    )}
                    <p className="text-xs text-gray-400">{msg.time}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 입력창 */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 flex items-center space-x-2">
            <Button type="button" variant="ghost" size="icon"><Smile className="h-5 w-5" /></Button>
            <Input
              placeholder="메시지 입력..."
              className="bg-gray-800 border-gray-700 text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ fontSize: `${fontSize}px`, fontFamily: getFontFamilyStyle() }}
            />
            <Button type="button" variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button>
            <Button type="submit" size="icon" className="bg-red-600 hover:bg-red-700"><Send className="h-5 w-5" /></Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">채팅을 선택하세요</div>
      )}

      <ChatSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <NewMessageModal isOpen={showNewMessageModal} onClose={() => setShowNewMessageModal(false)} onSelectUsers={handleSelectUsers} />
    </div>
  )
}
