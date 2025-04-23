"use client"

import React, { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Send,
  Home,
  Edit,
  Settings,
  Smile,
  Paperclip,
  ChevronDown,
  Phone,
  Video,
  Info,
} from "lucide-react"
import { Button } from "@/components/user/ui/button"
import { Input } from "@/components/user/ui/input"
import { useChatSettings } from "@/hooks/use-chat-settings"
import ChatSettings from "@/components/chat/chat-setting"
import NewMessageModal from "@/components/chat/new-massage-modal"
import useUserStore from "@/app/auth/userStore"
import useHeaderStore from "@/app/auth/useHeaderStore"
import { connectSocket, disconnectSocket, sendChatMessage } from "@/lib/socket"

interface Chat {
  roomId: number
  name: string
  lastMessage: string
  time: string
  online: boolean
  participantCount: number
}

interface Message {
  id: number
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
  readCount: number
  participantCount?: number
}

interface ReadEventPayload {
  type: "READ"
  roomId: number
  userId: number
  messageIds: number[]
}

interface SendMessagePayload {
  roomId: number
  userId: number
  nickname: string
  profileUrl?: string
  isInstructor?: boolean
  content: string
  time: string
  isImage: boolean
  imageUrl?: string
}

export default function ChatPage() {
  const { user } = useUserStore()
  const { fontSize, fontFamily } = useChatSettings()
  const API_URL = process.env.NEXT_PUBLIC_API_URL!

  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1) 초기 채팅방 목록 로드
  useEffect(() => {
    if (!user) return
    fetch(`${API_URL}/api/chat/rooms?userId=${user.id}`)
      .then((r) => r.json())
      .then((rooms: Chat[]) => setChats(rooms))
      .catch(console.error)
  }, [user, API_URL])

  // 2) 방 선택 시 소켓 연결 및 구독 (읽음 이벤트 필터링 포함)
  useEffect(() => {
    if (!selectedRoomId || !user) return

    // 이전 연결 해제
    disconnectSocket()

    // 새로 연결
    connectSocket(
      selectedRoomId,
      (msg: any) => {
        // 내가 보낸 READ 이벤트 무시
        if (msg.type === "READ" && msg.userId === user.id) {
          return
        }

        if (msg.type === "READ") {
          const { messageIds } = msg as ReadEventPayload
          setMessages((prev) =>
            prev.map((m) =>
              messageIds.includes(m.id)
                ? { ...m, readCount: m.readCount + 1 }
                : m
            )
          )
        } else {
          // 이미 존재하는 메시지인지 확인
          setMessages((prev) => {
            // 이미 존재하는 메시지인지 확인
            const isDuplicate = prev.some(m => m.id === msg.id);
            if (isDuplicate) {
              return prev;
            }
            
            // 새 메시지 추가
            return [...prev, { ...msg, isRead: false }];
          });
          
          setChats((prev) =>
            prev.map((c) =>
              c.roomId === msg.roomId
                ? { ...c, lastMessage: msg.content, time: msg.time }
                : c
            )
          )
        }
      },
      () => console.log("Subscribed to room " + selectedRoomId)
    )

    return () => {
      disconnectSocket()
    }
  }, [selectedRoomId, user])

  // 3) 방 선택 시 메시지 로드 + REST 읽음 처리 + WS 읽음 이벤트 발송
  useEffect(() => {
    if (!selectedRoomId || !user) return

    fetch(`${API_URL}/api/chat/rooms/${selectedRoomId}/messages`)
      .then((r) => r.json())
      .then(async (data: Message[]) => {
        // 1) 로컬 메시지 갱신…
        setMessages(prev => [
          ...prev.filter(m => m.roomId !== selectedRoomId),
          ...data.map(d => ({ ...d, isRead: true })),
        ])

        // 2) 서버 읽음 처리(REST PUT)…
        await fetch(
          `${API_URL}/api/chat/rooms/${selectedRoomId}/read?userId=${user.id}`,
          { method: "PUT" }
        )

        // 3) WS로 읽음 이벤트 발송 (destination 변경)
        sendChatMessage("/app/chat/read", {
          type: "READ",
          roomId: selectedRoomId,
          userId: user.id,
          messageIds: data.map(m => m.id),
        } as ReadEventPayload)
      })
      .catch(console.error)
  }, [selectedRoomId, user, API_URL])


  // 4) 메시지 전송
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedRoomId || !user) return
  
    const payload: SendMessagePayload = {
      roomId: selectedRoomId,
      userId: user.id,
      nickname: user.nickname,
      profileUrl: user.profileUrl,
      isInstructor: user.isInstructor === 1,
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isImage: false,
    }
  
    // 로컬 메시지 즉시 추가
    const chatInfo = chats.find((c) => c.roomId === selectedRoomId);
    const participantCount = chatInfo?.participantCount ?? 1;
    
    const newMessage = {
      ...payload,
      id: Date.now(),
      isRead: true,
      readCount: 1,
      participantCount,
    };
  
    // 로컬 메시지 추가 (임시 ID 사용)
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
  
    // WS 전송
    sendChatMessage("/app/chat/message", payload);
  
    // 방 목록 갱신
    setChats((prev) => {
      const updated = prev.map((c) =>
        c.roomId === selectedRoomId
          ? { ...c, lastMessage: payload.content, time: payload.time }
          : c
      )
      const current = updated.find((c) => c.roomId === selectedRoomId)!
      const rest = updated.filter((c) => c.roomId !== selectedRoomId)
      return [current, ...rest]
    })
  }
  

  // 5) 헤더 unreadCount 동기화
  useEffect(() => {
    const total = chats.reduce((sum, c) => {
      const cnt = messages.filter(
        (m) => m.roomId === c.roomId && !m.isRead && m.userId !== user?.id
      ).length
      return sum + cnt
    }, 0)
    useHeaderStore.getState().setUnreadCount(total)
  }, [chats, messages, user])

  // 6) 새 메시지 생길 때만 스크롤
  const prevLen = useRef(0)
  useEffect(() => {
    if (messages.length > prevLen.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    prevLen.current = messages.length
  }, [messages.length])

  // NewMessageModal → onSelectUsers 콜백
  const handleCreateRoom = async (selected: { id: number }[]) => {
    if (!user) return
    const participantIds = [...selected.map((u) => u.id), user.id]
    const res = await fetch(`${API_URL}/api/chat/rooms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantIds }),
    })
    const newRoom = (await res.json()) as Chat
    setChats((prev) => [...prev, newRoom])
    setSelectedRoomId(newRoom.roomId)
  }

  // 폰트 헬퍼
  const getFontFamilyStyle = () => {
    switch (fontFamily) {
      case "noto-sans-kr":
        return '"Noto Sans KR", sans-serif'
      case "nanum-gothic":
        return '"Nanum Gothic", sans-serif'
      case "serif":
        return "ui-serif, Georgia, serif"
      case "mono":
        return "ui-monospace, SFMono-Regular, monospace"
      default:
        return "ui-sans-serif, system-ui, sans-serif"
    }
  }

  return (
    <div className="flex h-full bg-black text-white overflow-x-auto">
      {/* 좌측 채팅방 리스트 */}
      <div className="w-[320px] min-w-[320px] border-r border-gray-800 flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <Home className="h-5 w-5 text-white" />
              </Button>
            </Link>
            <h2 className="font-bold">{user?.nickname}</h2>
            <ChevronDown className="h-4 w-4 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="h-5 w-5 text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowNewMessageModal(true)}>
              <Edit className="h-5 w-5 text-white" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const unread = messages.filter(
              (m) => m.roomId === chat.roomId && !m.isRead && m.userId !== user?.id
            ).length
            return (
              <div
                key={chat.roomId}
                className={`p-3 flex items-start space-x-3 hover:bg-gray-900 cursor-pointer ${
                  selectedRoomId === chat.roomId ? "bg-gray-900" : ""
                }`}
                onClick={() => setSelectedRoomId(chat.roomId)}
              >

                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <Image
                    src={`/placeholder.svg?text=${chat.name.charAt(0)}`}
                    alt={chat.name}
                    width={48}
                    height={48}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium truncate ${unread ? "text-white" : "text-gray-400"}`}>
                      {chat.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {unread > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {unread}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">{chat.time}</span>
                    </div>
                  </div>
                  <p className={`text-sm truncate ${unread ? "text-white" : "text-gray-400"}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 우측 메시지 영역 */}
      {selectedRoomId ? (
        <div className="flex-1 flex flex-col">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-800 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Image
                src={`/placeholder.svg?text=${chats.find((c) => c.roomId === selectedRoomId)?.name.charAt(0)}`}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full bg-gray-700"
              />
              <div>
                <h3 className="font-medium text-white">
                  {chats.find((c) => c.roomId === selectedRoomId)?.name}
                </h3>
                <p className="text-xs text-gray-400">
                  활동 {chats.find((c) => c.roomId === selectedRoomId)?.time}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-5 w-5 text-white" />
              </Button>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5 text-white" />
              </Button>
            </div>
          </div>
          {/* 메시지 리스트 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages
              .filter((m) => m.roomId === selectedRoomId)
              .map((msg) => {
                const isMe = msg.userId === user?.id
                const unreadCnt =
                  msg.participantCount !== undefined
                    ? msg.participantCount - msg.readCount - 1
                    : 0
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-4 py-2 rounded-3xl ${isMe ? "bg-red-600 rounded-br-sm" : "bg-gray-800 rounded-bl-sm"}`}>
                      <p style={{ fontSize: `${fontSize}px`, fontFamily: getFontFamilyStyle() }}>
                        {msg.content}
                      </p>
                      <div className="flex justify-end gap-1 mt-1">
                        {unreadCnt > 0 && <span className="text-xs text-gray-300">{unreadCnt}</span>}
                        <span className="text-xs text-gray-400">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            <div ref={messagesEndRef} />
          </div>
          {/* 입력창 */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-800 flex items-center space-x-2">
            <Button type="button" variant="ghost" size="icon">
              <Smile className="h-5 w-5 text-white" />
            </Button>
            <Input
              placeholder="메시지 입력..."
              className="bg-gray-800 border-gray-700 text-white flex-1"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ fontSize: `${fontSize}px`, fontFamily: getFontFamilyStyle() }}
            />
            <Button type="button" variant="ghost" size="icon">
              <Paperclip className="h-5 w-5 text-white" />
            </Button>
            <Button type="submit" size="icon" className="bg-red-600">
              <Send className="h-5 w-5 text-white" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">채팅을 선택하세요</div>
      )}

      <ChatSettings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <NewMessageModal
        isOpen={showNewMessageModal}
        onClose={() => setShowNewMessageModal(false)}
        onSelectUsers={handleCreateRoom}
      />
    </div>
  )
}
