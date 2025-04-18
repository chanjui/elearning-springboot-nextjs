"use client"

import {useEffect, useState} from "react"
import {ArrowUpDown, MoreHorizontal} from "lucide-react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table"

import {Button} from "@/components/user/ui/button"
import {Checkbox} from "@/components/user/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/user/ui/dropdown-menu"
import {Input} from "@/components/user/ui/input"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/user/ui/table"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/user/ui/select"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/user/ui/avatar"
import {Badge} from "@/components/user/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/user/ui/dialog"
import {Textarea} from "@/components/user/ui/textarea"
import {Label} from "@/components/user/ui/label"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/user/ui/card"
import {useToast} from "@/components/user/ui/use-toast"
import axios from "axios"
import Image from "next/image";

const colors = [
  "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
  "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
  "bg-orange-500", "bg-gray-500",
]
const getColorById = (id: number) => colors[id % colors.length]

type Course = {
  courseId: string
  subject: string
  progress: number
  regDate: string
  completionStatus: boolean
}

type User = {
  id: string
  nickname: string
  email: string
  profileUrl: string
  regDate: string
  isInstructor: boolean
  isDel: boolean
  enrolledCourses: Course[]
}

const API_URL = "/api/user/admin"

export default function UsersPage() {
  const {toast} = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  // 모달 상태 관리
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserInfoOpen, setIsUserInfoOpen] = useState(false)
  const [isUserCoursesOpen, setIsUserCoursesOpen] = useState(false)
  /*const [isEditUserOpen, setIsEditUserOpen] = useState(false)*/
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [suspensionReason, setSuspensionReason] = useState("")

  const fetchAdminUsers = async (): Promise<User[]> => {
    const response = await axios.get(`${API_URL}/user`)
    console.log(response.data)
    return response.data.data.map((user: any) => ({
      ...user,
      id: user.id.toString(),
      regDate: new Date(user.regDate).toISOString(),
      enrolledCourses: user.enrolledCourses?.map((course: any) => ({
        ...course,
        courseId: course.courseId.toString(),
        regDate: new Date(course.regDate).toISOString(),
        progress: Number(course.progress),
      })) || [],
    }))
  }

  useEffect(() => {
    fetchAdminUsers().then(data => setUsers(data))
  }, [])

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({table}) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="모두 선택"
        />
      ),
      cell: ({row}) => (
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
      accessorKey: "nickname",
      header: "이름",
      cell: ({row}) => {
        const post = {
          userProfileImage: row.original.profileUrl,
          userNickname: row.original.nickname,
          userId: Number(row.original.id),
        };

        return (
          <div className="flex items-center gap-3">
            {post.userProfileImage ? (
              <div className="relative w-[30px] h-[30px] rounded-full overflow-hidden">
                <Image
                  src={post.userProfileImage}
                  alt={post.userNickname}
                  fill
                  className="object-cover"
                />
              </div>

            ) : (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorById(post.userId)}`}>
            <span className="text-white font-semibold">
              {post.userNickname.charAt(0).toUpperCase()}
            </span>
              </div>
            )}
            <div className="font-medium">{post.userNickname}</div>
          </div>
        );
      },
    },

    {
      accessorKey: "email",
      header: ({column}) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            이메일
            <ArrowUpDown className="ml-2 h-4 w-4"/>
          </Button>
        )
      },
      cell: ({row}) => <div>{row.getValue("email")}</div>,
    },
    {
      id: "role",
      header: "역할",
      cell: ({row}) => {
        const role = row.original.isInstructor ? "강사" : "학생";
        return <Badge variant={role === "강사" ? "default" : "secondary"}>{role}</Badge>;
      },
      filterFn: (row, _columnId, filterValue) => {
        return row.original.isInstructor === filterValue;
      },
    },

    {
      id: "status",
      header: "상태",
      cell: ({row}) => {
        const status = row.original.isDel ? "정지" : "활성";
        return (
          <Badge variant={status === "활성" ? "default" : "destructive"}>
            {status}
          </Badge>
        );
      },
      filterFn: (row, _columnId, filterValue) => {
        const isDel = row.original.isDel;
        if (filterValue === "active") return !isDel;
        if (filterValue === "suspended") return isDel;
        return true;
      },
    },

    {
      accessorKey: "regDate",
      header: "가입일",
      cell: ({row}) => {
        const date = new Date(row.getValue("regDate"))
        return <div>{date.toLocaleDateString("ko-KR")}</div>
      },
    },
    {
      id: "actions",
      cell: ({row}) => {
        const user = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">메뉴 열기</span>
                <MoreHorizontal className="h-4 w-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>작업</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>ID 복사</DropdownMenuItem>
              <DropdownMenuSeparator/>
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
              {/*<DropdownMenuItem
                onClick={() => {
                  setSelectedUser(user)
                  setEditUserData({
                    nickname: user.nickname,
                    email: user.email,
                    role: user.isInstructor,
                    status: user.isDel,
                  })
                  setIsEditUserOpen(true)
                }}
              >
                계정 수정
              </DropdownMenuItem>*/}
              <DropdownMenuSeparator/>
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
    data: users,
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

  // 사용자 정보 수정 상태
  /*const [editUserData, setEditUserData] = useState<{
    nickname: string
    email: string
    role: boolean
    status: boolean
  }>({
    nickname: "",
    email: "",
    role: false,
    status: false,
  })*/

  /*const handleEditUser = async () => {
    try {
      await axios.put(`${API_URL}/user/${selectedUser?.id}`, {
        nickname: editUserData.nickname,
        email: editUserData.email,
        isInstructor: editUserData.role,
        isDel: editUserData.status,
      })
      toast({
        title: "사용자 정보 업데이트",
        description: `${editUserData.nickname} 사용자의 정보가 업데이트되었습니다.`,
      })
      setIsEditUserOpen(false)
      fetchAdminUsers().then(data => setUsers(data))
    } catch (error) {
      toast({
        title: "업데이트 실패",
        description: "사용자 정보 업데이트 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }*/

  const handleSuspendUser = async () => {
    try {
      await axios.patch(`${API_URL}/user/${selectedUser?.id}/suspend`, {
        reason: suspensionReason
      })
      toast({
        title: "계정 정지 완료",
        description: `${selectedUser?.nickname} 사용자의 계정이 정지되었습니다.`,
      })
      setIsSuspendDialogOpen(false)
      setSuspensionReason("")
      fetchAdminUsers().then(data => setUsers(data))
    } catch (error) {
      toast({
        title: "정지 실패",
        description: "계정 정지 중 오류가 발생했습니다.",
        variant: "destructive"
      })
    }
  }

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
              placeholder="이름 검색..."
              value={(table.getColumn("nickname")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("nickname")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />

            <Select
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("role")?.setFilterValue(undefined);
                } else {
                  const isInstructorValue = value === "강사";
                  table.getColumn("role")?.setFilterValue(isInstructorValue);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="역할 필터"/>
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
                  table.getColumn("status")?.setFilterValue(undefined);
                } else {
                  table.getColumn("status")?.setFilterValue(value);
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="상태 필터"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="active">활성</SelectItem>
                <SelectItem value="suspended">정지</SelectItem>
              </SelectContent>
            </Select>

          </div>
          {/*<div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4"/>
              내보내기
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4"/>
              사용자 추가
            </Button>
          </div>*/}
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
                      <TableCell
                        key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
            <Button variant="outline" size="sm" onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}>
              다음
            </Button>
          </div>
        </div>
      </div>

      {/* 사용자 정보 모달 */}
      <Dialog open={isUserInfoOpen} onOpenChange={setIsUserInfoOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>{selectedUser?.nickname} 유저 정보</DialogTitle>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.profileUrl} alt={selectedUser.nickname}/>
                  <AvatarFallback>{selectedUser.nickname.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedUser.nickname}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">역할</p>
                  <p>{selectedUser.isInstructor ? "강사" : "학생"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">상태</p>
                  <Badge variant={selectedUser.isDel ? "destructive" : "default"}>
                    {selectedUser.isDel ? "비활성" : "활성"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">가입일</p>
                  <p>{new Date(selectedUser.regDate).toLocaleDateString("ko-KR")}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">수강 강의 수</p>
                <p>{selectedUser.enrolledCourses?.length || 0}개</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 수강 강의 모달 */}
      <Dialog open={isUserCoursesOpen} onOpenChange={setIsUserCoursesOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogTitle>{selectedUser?.nickname} 유저 수강 정보</DialogTitle>
          {/* ... (기존 모달 내용 수정) ... */}
          {selectedUser && (
            <div className="space-y-4">
              {selectedUser.enrolledCourses?.length > 0 ? (
                selectedUser.enrolledCourses.map((course) => {
                  const status = course.completionStatus
                    ? "completed"
                    : course.progress > 0
                      ? "in-progress"
                      : "not-started"
                  return (
                    <Card key={course.courseId}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div>
                            <CardTitle className="text-base">{course.subject}</CardTitle>
                          </div>
                          <Badge variant={
                            status === "completed"
                              ? "secondary"
                              : status === "in-progress"
                                ? "default"
                                : "outline"
                          }>
                            {status === "completed"
                              ? "수료"
                              : status === "in-progress"
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
                            <div
                              className="h-2 rounded-full bg-primary"
                              style={{width: `${course.progress}%`}}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            수강 시작일: {new Date(course.regDate).toLocaleDateString("ko-KR")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                  <p className="text-center text-muted-foreground">수강 중인 강의가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 계정 수정 모달
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogTitle>사용자 정보 수정</DialogTitle>
           ... (기존 모달 내용 수정) ...
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nickname" className="text-right">
                이름
              </Label>
              <Input
                id="nickname"
                value={editUserData.nickname}
                onChange={(e) => setEditUserData({...editUserData, nickname: e.target.value})}
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
                onChange={(e) => setEditUserData({...editUserData, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                역할
              </Label>
              <Select
                value={editUserData.role ? "강사" : "학생"}
                onValueChange={(value) => setEditUserData({...editUserData, role: value === "강사"})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="역할 선택"/>
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
                value={editUserData.status ? "inactive" : "active"}
                onValueChange={(value) => setEditUserData({...editUserData, status: value === "inactive"})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="상태 선택"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">활성</SelectItem>
                  <SelectItem value="inactive">비활성</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>*/}

      {/* 계정 정지 다이얼로그 */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>계정 정지</DialogTitle>
            <DialogDescription>
              {selectedUser?.nickname} 사용자의 계정을 정지합니다. 정지 사유를 입력해주세요.
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
