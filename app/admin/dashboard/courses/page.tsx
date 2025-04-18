"use client"

import {useEffect, useState} from "react"
import {ArrowUpDown, BookOpen, Eye, MoreHorizontal, Trash} from "lucide-react"
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
import {Badge} from "@/components/user/ui/badge"
import axios from "axios";
import {Dialog, DialogContent, DialogTitle} from "@/components/user/ui/dialog";
import CourseDetailModal from "@/components/admin/CourseDetailModal";

interface Course {
  id: number
  title: string
  instructor: string
  category: string
  price: number
  status: "PREPARING" | "ACTIVE" | "CLOSED"
  students: number
  rating: number
  createdAt: string
}

export default function CoursesPage() {
  const [data, setData] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const API_URL = "/api/user/admin/course";

  const [isCourseDetailOpen, setIsCourseDetailOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number>(0);


  const columns: ColumnDef<Course>[] = [
    {
      id: "select",
      header: ({table}) => (
        <div className="w-8">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="모두 선택"
          />
        </div>
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
      accessorKey: "title",
      header: ({column}) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            강의명
            <ArrowUpDown className="ml-2 h-4 w-4"/>
          </Button>
        )
      },
      cell: ({row}) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground"/>
          <span className="font-medium">{row.getValue("title")}</span>
        </div>
      ),
    },
    {
      accessorKey: "instructor",
      header: "강사",
      cell: ({row}) => <div className="w-16">{row.getValue("instructor")}</div>,
    },
    {
      accessorKey: "category",
      header: "카테고리",
      cell: ({row}) => <div className="w-28">{row.getValue("category")}</div>,
    },
    {
      accessorKey: "price",
      header: ({column}) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            가격
            <ArrowUpDown className="ml-2 h-4 w-4"/>
          </Button>
        )
      },
      cell: ({row}) => {
        const amount = Number.parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
        }).format(amount)

        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "status",
      header: "상태",
      cell: ({row}) => {
        const status = row.getValue("status") as "PREPARING" | "ACTIVE" | "CLOSED"

        let badgeVariant: "default" | "outline" | "secondary" | "destructive"
        let statusText: string
        let cName: string

        switch (status) {
          case "ACTIVE":
            badgeVariant = "default"
            statusText = "활성"
            cName = "w-12"
            break
          case "PREPARING":
            badgeVariant = "secondary"
            statusText = "준비중"
            cName = "w-14"
            break
          case "CLOSED":
            badgeVariant = "destructive"
            statusText = "종료"
            cName = "w-12"
            break
          default:
            badgeVariant = "outline"
            statusText = status
            cName = ""
        }

        return <Badge variant={badgeVariant} className={`${cName} justify-center`}>{statusText}</Badge>
      },
    },
    {
      accessorKey: "students",
      header: ({column}) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            수강생
            <ArrowUpDown className="ml-2 h-4 w-4"/>
          </Button>
        )
      },
      cell: ({row}) => <div className="text-center">{row.getValue("students")}</div>,
    },
    {
      accessorKey: "rating",
      header: ({column}) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            평점
            <ArrowUpDown className="ml-2 h-4 w-4"/>
          </Button>
        )
      },
      cell: ({row}) => {
        const rating = Number.parseFloat(row.getValue("rating"))
        return <div className="text-center">{rating > 0 ? rating.toFixed(1) : "-"}</div>
      },
    },
    {
      accessorKey: "createdAt",
      header: "등록일",
      cell: ({row}) => {
        const date = new Date(row.getValue("createdAt"))
        return <div className="w-24">{date.toLocaleDateString("ko-KR")}</div>
      },
    },
    {
      id: "actions",
      cell: ({row}) => {
        const course = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(course.id))}>ID
                복사</DropdownMenuItem>
              <DropdownMenuSeparator/>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCourse(course.id);
                  setIsCourseDetailOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4"/>
                강의 상세 보기
              </DropdownMenuItem>

              {/*<DropdownMenuItem>
                <FileEdit className="mr-2 h-4 w-4"/>
                강의 수정
              </DropdownMenuItem>*/}
              <DropdownMenuSeparator/>
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4"/>
                강의 삭제
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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(API_URL)
        console.log(response)
        setData(response.data.data)
      } catch (err) {
        setError("강의 목록을 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses().then(() => {
    })
  }, [])
  if (loading) return <div>불러오는 중...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">강의 관리</h2>
        <p className="text-muted-foreground">플랫폼의 모든 강의를 관리하고 상태를 변경하세요.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input
              placeholder="강의명 검색..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("title")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <Select
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("category")?.setFilterValue(undefined)
                } else {
                  table.getColumn("category")?.setFilterValue(value)
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="카테고리 필터"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>{/*
                <SelectItem value="프론트엔드">프론트엔드</SelectItem>
                <SelectItem value="백엔드">백엔드</SelectItem>*/}
                <SelectItem value="프론트앤드">프론트엔드</SelectItem>
                <SelectItem value="백앤드">백엔드</SelectItem>
                <SelectItem value="AI, 머신러닝">AI, 머신러닝</SelectItem>
                <SelectItem value="데이터베이스">데이터베이스</SelectItem>
                <SelectItem value="프로그래밍 언어">프로그래밍 언어</SelectItem>
                <SelectItem value="풀스택">풀스택</SelectItem>
                <SelectItem value="알고리즘, 자료구조">알고리즘, 자료구조</SelectItem>
                <SelectItem value="프로그래밍 자격증">프로그래밍 자격증</SelectItem>
                <SelectItem value="모바일 앱 개발">모바일 앱 개발</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
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
                <SelectValue placeholder="상태 필터"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="ACTIVE">활성</SelectItem>
                <SelectItem value="PREPARING">준비중</SelectItem>
                <SelectItem value="CLOSED">종료</SelectItem>
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
              강의 추가
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

      <Dialog open={isCourseDetailOpen} onOpenChange={setIsCourseDetailOpen}>
        <DialogTitle>강의 상세 정보</DialogTitle>
        <DialogContent className="sm:max-w-[800px]">
          <CourseDetailModal courseId={selectedCourse}/>
        </DialogContent>
      </Dialog>
    </div>
  )
}
