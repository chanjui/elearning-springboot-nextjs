"use client"

import { useState } from "react"
import { ArrowUpDown, Download, MoreHorizontal, Plus } from "lucide-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/user/ui/button"  
import { Checkbox } from "@/components/user/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/user/ui/dropdown-menu"
import { Input } from "@/components/user/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/user/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/user/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/user/ui/avatar"
import { Badge } from "@/components/user/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/user/ui/dialog"
import { Textarea } from "@/components/user/ui/textarea"
import { Label } from "@/components/user/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/user/ui/card"
import { useToast } from "@/components/user/ui/use-toast"

type User = {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive" | "suspended"
  joinDate: string
  lastActive: string
}

type Course = {
  id: string
  title: string
  category: string
  progress: number
  enrollDate: string
  completionStatus: "completed" | "in-progress" | "not-started"
}

const data: User[] = [
  {
    id: "1",
    name: "김민수",
    email: "kim@example.com",
    role: "학생",
    status: "active",
    joinDate: "2023-01-15",
    lastActive: "2023-06-28",
  },
  {
    id: "2",
    name: "이지은",
    email: "lee@example.com",
    role: "강사",
    status: "active",
    joinDate: "2022-11-03",
    lastActive: "2023-06-29",
  },
  {
    id: "3",
    name: "박준호",
    email: "park@example.com",
    role: "학생",
    status: "inactive",
    joinDate: "2023-02-22",
    lastActive: "2023-05-10",
  },
  {
    id: "4",
    name: "최유진",
    email: "choi@example.com",
    role: "강사",
    status: "active",
    joinDate: "2022-08-14",
    lastActive: "2023-06-30",
  },
  {
    id: "5",
    name: "정승호",
    email: "jung@example.com",
    role: "학생",
    status: "active",
    joinDate: "2023-03-05",
    lastActive: "2023-06-25",
  },
  {
    id: "6",
    name: "한미영",
    email: "han@example.com",
    role: "학생",
    status: "suspended",
    joinDate: "2023-01-30",
    lastActive: "2023-04-18",
  },
  {
    id: "7",
    name: "송태준",
    email: "song@example.com",
    role: "강사",
    status: "active",
    joinDate: "2022-10-11",
    lastActive: "2023-06-29",
  },
  {
    id: "8",
    name: "윤서연",
    email: "yoon@example.com",
    role: "학생",
    status: "active",
    joinDate: "2023-04-02",
    lastActive: "2023-06-27",
  },
  {
    id: "9",
    name: "강동현",
    email: "kang@example.com",
    role: "학생",
    status: "active",
    joinDate: "2023-02-15",
    lastActive: "2023-06-28",
  },
  {
    id: "10",
    name: "조민지",
    email: "jo@example.com",
    role: "강사",
    status: "active",
    joinDate: "2022-09-20",
    lastActive: "2023-06-30",
  },
]

// 사용자별 수강 강의 데이터 (실제로는 API에서 가져올 것)
const userCourses: Record<string, Course[]> = {
  "1": [
    {
      id: "c1",
      title: "React 완벽 가이드",
      category: "프론트엔드",
      progress: 75,
      enrollDate: "2023-02-10",
      completionStatus: "in-progress",
    },
    {
      id: "c2",
      title: "Node.js 백엔드 마스터",
      category: "백엔드",
      progress: 30,
      enrollDate: "2023-03-15",
      completionStatus: "in-progress",
    },
  ],
  "3": [
    {
      id: "c3",
      title: "Python 데이터 분석",
      category: "데이터 사이언스",
      progress: 100,
      enrollDate: "2023-02-25",
      completionStatus: "completed",
    },
  ],
  "5": [
    {
      id: "c4",
      title: "Flutter 모바일 앱 개발",
      category: "모바일",
      progress: 60,
      enrollDate: "2023-04-10",
      completionStatus: "in-progress",
    },
    {
      id: "c5",
      title: "AWS 클라우드 아키텍처",
      category: "데브옵스",
      progress: 0,
      enrollDate: "2023-06-01",
      completionStatus: "not-started",
    },
  ],
}

export default function UsersPage() {
  const { toast } = useToast()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // 모달 상태 관리
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false)
  const [isUserCoursesOpen, setIsUserCoursesOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [suspensionReason, setSuspensionReason] = useState("")

  // 사용자 정보 수정 상태
  const [editUserData, setEditUserData] = useState<{
    name: string
    email: string
    role: string
    status: string
  }>({
    name: "",
    email: "",
    role: "",
    status: "",
  })

  const handleEditUser = () => {
    // 실제 구현에서는 API 호출을 통해 사용자 정보 업데이트
    toast({
      title: "사용자 정보 업데이트",
      description: `${editUserData.name} 사용자의 정보가 업데이트되었습니다.`,
    })
    setIsEditUserOpen(false)
  }

  const handleSuspendUser = () => {
    // 실제 구현에서는 API 호출을 통해 사용자 계정 정지
    toast({
      title: "계정 정지 완료",
      description: `${selectedUser?.name} 사용자의 계정이 정지되었습니다.`,
    })
    setIsSuspendDialogOpen(false)
    setSuspensionReason("")
  }

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="모두 선택"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="행 선택"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "이름",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={`/abstract-geometric-shapes.png?height=32&width=32&query=${row.original.name}`}
              alt={row.original.name}
            />
            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            이메일
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: "역할",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return <Badge variant={role === "강사" ? "default" : "outline"}>{role}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({ row }) => {
        const status = row.getValue("status") as "active" | "inactive" | "suspended"
        return (
          <Badge variant={status === "active" ? "success" : status === "inactive" ? "secondary" : "destructive"}>
            {status === "active" ? "활성" : status === "inactive" ? "비활성" : "정지됨"}
          </Badge>
        )
      },
    },
    {
      accessorKey: "joinDate",
      header: "가입일",
      cell: ({ row }) => {
        const date = new Date(row.getValue("joinDate"))
        return <div>{date.toLocaleDateString("ko-KR")}</div>
      },
    },
    {
      accessorKey: "lastActive",
      header: "최근 활동",
      cell: ({ row }) => {
        const date = new Date(row.getValue("lastActive"))
        return <div>{date.toLocaleDateString("ko-KR")}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">메뉴 열기</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>작업</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>ID 복사</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setIsUserInfoOpen(true)
                }}
              >
                사용자 정보 보기
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setIsUserCoursesOpen(true)
                }}
              >
                수강 강의 보기
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setEditUserData({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                  })
                  setIsEditUserOpen(true)
                }}
              >
                계정 수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  setSelectedUser(user)
                  setIsSuspendDialogOpen(true)
                }}
              >
                계정 정지
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">사용자 관리</h2>
        <p className="text-muted-foreground">플랫폼의 모든 사용자를 관리하고 권한을 설정하세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="이름 또는 이메일로 검색..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <Select
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("role")?.setFilterValue(undefined)
                } else {
                  table.getColumn("role")?.setFilterValue(value)
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="역할 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 역할</SelectItem>
                <SelectItem value="학생">학생</SelectItem>
                <SelectItem value="강사">강사</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("status")?.setFilterValue(undefined)
                } else {
                  table.getColumn("status")?.setFilterValue(value)
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
                <SelectItem value="suspended">정지됨</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              내보내기
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              사용자 추가
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    결과가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length}개 선택됨 / 총 {table.getFilteredRowModel().rows.length}개
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              이전
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              다음
            </Button>
          </div>
        </div>
      </div>

      {/* 사용자 정보 모달 */}
      <Dialog open={isUserInfoOpen} onOpenChange={setIsUserInfoOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
            <DialogDescription>사용자의 상세 정보를 확인합니다.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/abstract-geometric-shapes.png?height=64&width=64&query=${selectedUser.name}`}
                    alt={selectedUser.name}
                  />
                  <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">역할</p>
                  <p>{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">상태</p>
                  <Badge
                    variant={
                      selectedUser.status === "active"
                        ? "success"
                        : selectedUser.status === "inactive"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {selectedUser.status === "active"
                      ? "활성"
                      : selectedUser.status === "inactive"
                        ? "비활성"
                        : "정지됨"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">가입일</p>
                  <p>{new Date(selectedUser.joinDate).toLocaleDateString("ko-KR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">최근 활동</p>
                  <p>{new Date(selectedUser.lastActive).toLocaleDateString("ko-KR")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">수강 강의 수</p>
                <p>{userCourses[selectedUser.id]?.length || 0}개</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserInfoOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수강 강의 모달 */}
      <Dialog open={isUserCoursesOpen} onOpenChange={setIsUserCoursesOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>수강 강의</DialogTitle>
            <DialogDescription>{selectedUser?.name}님의 수강 중인 강의 목록입니다.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              {userCourses[selectedUser.id] && userCourses[selectedUser.id].length > 0 ? (
                <div className="space-y-4">
                  {userCourses[selectedUser.id].map((course) => (
                    <Card key={course.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-base">{course.title}</CardTitle>
                            <CardDescription>{course.category}</CardDescription>
                          </div>
                          <Badge
                            variant={
                              course.completionStatus === "completed"
                                ? "success"
                                : course.completionStatus === "in-progress"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {course.completionStatus === "completed"
                              ? "수료"
                              : course.completionStatus === "in-progress"
                                ? "진행중"
                                : "시작 전"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>진행률</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-secondary">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${course.progress}%` }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            수강 시작일: {new Date(course.enrollDate).toLocaleDateString("ko-KR")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-center text-muted-foreground">수강 중인 강의가 없습니다.</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUserCoursesOpen(false)}>
              닫기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 계정 수정 모달 */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>계정 수정</DialogTitle>
            <DialogDescription>사용자 계정 정보를 수정합니다.</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  value={editUserData.name}
                  onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  이메일
                </Label>
                <Input
                  id="email"
                  value={editUserData.email}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  역할
                </Label>
                <Select
                  value={editUserData.role}
                  onValueChange={(value) => setEditUserData({ ...editUserData, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="학생">학생</SelectItem>
                    <SelectItem value="강사">강사</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  상태
                </Label>
                <Select
                  value={editUserData.status}
                  onValueChange={(value) => setEditUserData({ ...editUserData, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="상태 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="inactive">비활성</SelectItem>
                    <SelectItem value="suspended">정지됨</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
              취소
            </Button>
            <Button onClick={handleEditUser}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 계정 정지 다이얼로그 */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>계정 정지</DialogTitle>
            <DialogDescription>
              {selectedUser?.name} 사용자의 계정을 정지합니다. 정지 사유를 입력해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">정지 사유</Label>
              <Textarea
                id="reason"
                placeholder="계정 정지 사유를 입력하세요"
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleSuspendUser} disabled={!suspensionReason.trim()}>
              계정 정지
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
