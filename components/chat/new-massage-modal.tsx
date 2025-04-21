"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  id: string
  name: string
  profileUrl?: string
  isInstructor?: boolean
}

interface NewMessageModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectUsers: (users: User[]) => void
}

export default function NewMessageModal({ isOpen, onClose, onSelectUsers }: NewMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // 사용자 목록 (실제로는 API에서 가져올 것)
  const users: User[] = [
    { id: "1", name: "서민한", profileUrl: "/placeholder.svg?height=40&width=40&text=서" },
    { id: "2", name: "윤영준", profileUrl: "/placeholder.svg?height=40&width=40&text=윤", isInstructor: true },
    { id: "3", name: "인용", profileUrl: "/placeholder.svg?height=40&width=40&text=인" },
    { id: "4", name: "exexoxe__", profileUrl: "/placeholder.svg?height=40&width=40&text=e" },
    { id: "5", name: "박경문", profileUrl: "/placeholder.svg?height=40&width=40&text=박", isInstructor: true },
    { id: "6", name: "이광표", profileUrl: "/placeholder.svg?height=40&width=40&text=이" },
    { id: "7", name: "박형진", profileUrl: "/placeholder.svg?height=40&width=40&text=박" },
  ]

  // 검색어에 따른 필터링
  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleNext = () => {
    const selectedUserObjects = users.filter((user) => selectedUsers.includes(user.id))
    onSelectUsers(selectedUserObjects)
    onClose()
  }

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setSelectedUsers([])
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
      <div className="bg-black w-full max-w-md rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="font-bold text-white">새로운 메시지</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center">
            <span className="text-white mr-2">받는 사람:</span>
            <div className="relative flex-1">
              <Input
                placeholder="검색..."
                className="bg-transparent border-0 focus-visible:ring-0 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          <div className="p-2">
            <h3 className="text-sm text-gray-400 px-2 py-1">추천</h3>
          </div>

          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 hover:bg-gray-900 cursor-pointer"
              onClick={() => toggleUserSelection(user.id)}
            >
              <div className="flex items-center">
                <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                  <Image
                    src={user.profileUrl || `/placeholder.svg?height=40&width=40&text=${user.name.charAt(0)}`}
                    alt={user.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <span className="text-white">{user.name}</span>
                    {user.isInstructor && (
                      <span className="ml-2 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded">강사</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center">
                {selectedUsers.includes(user.id) && <div className="w-3 h-3 rounded-full bg-white"></div>}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-800">
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={selectedUsers.length === 0}
            onClick={handleNext}
          >
            다음
          </Button>
        </div>
      </div>
    </div>
  )
}
