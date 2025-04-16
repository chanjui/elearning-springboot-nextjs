"use client"

import { useState } from "react"
import { ArrowUpDown, BookOpen, Download, Eye, FileEdit, MoreHorizontal, Plus, Trash } from "lucide-react"
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
import { Badge } from "@/components/user/ui/badge"

type Course = {
  id: string
  title: string
  instructor: string
  category: string
  price: number
  status: "PREPARING" | "ACTIVE" | "CLOSED"
  students: number
  rating: number
  createdAt: string
}

const data: Course[] = [
  {
    id: "1",
    title: "React 완벽 가이드",
    instructor: "이지은",
    category: "프론트엔드",
    price: 120000,
    status: "ACTIVE",
    students: 1250,
    rating: 4.8,
    createdAt: "2022-11-15",
  },
  {
    id: "2",
    title: "Node.js 백엔드 마스터",
    instructor: "최유진",
    category: "백엔드",
    price: 150000,
    status: "ACTIVE",
    students: 980,
    rating: 4.7,
    createdAt: "2022-12-03",
  },
  {
    id: "3",
    title: "Flutter 모바일 앱 개발",
    instructor: "송태준",
    category: "모바일",
    price: 135000,
    status: "ACTIVE",
    students: 750,
    rating: 4.5,
    createdAt: "2023-01-22",
  },
  {
    id: "4",
    title: "AWS 클라우드 아키텍처",
    instructor: "조민지",
    category: "데브옵스",
    price: 180000,
    status: "ACTIVE",
    students: 620,
    rating: 4.9,
    createdAt: "2023-02-14",
  },
  {
    id: "5",
    title: "Spring Boot 실전 프로젝트",
    instructor: "박준호",
    category: "백엔드",
    price: 160000,
    status: "PREPARING",
    students: 0,
    rating: 0,
    createdAt: "2023-06-10",
  },
  {
    id: "6",
    title: "Vue.js 3 완벽 가이드",
    instructor: "이지은",
    category: "프론트엔드",
    price: 110000,
    status: "ACTIVE",
    students: 850,
    rating: 4.6,
    createdAt: "2023-03-05",
  },
  {
    id: "7",
    title: "Python 데이터 분석",
    instructor: "최유진",
    category: "데이터 사이언스",
    price: 140000,
    status: "ACTIVE",
    students: 1100,
    rating: 4.7,
    createdAt: "2023-01-30",
  },
  {
    id: "8",
    title: "Docker & Kubernetes 실전",
    instructor: "조민지",
    category: "데브옵스",
    price: 170000,
    status: "ACTIVE",
    students: 580,
    rating: 4.8,
    createdAt: "2022-12-15",
  },
  {
    id: "9",
    title: "TypeScript 고급 패턴",
    instructor: "송태준",
    category: "프론트엔드",
    price: 130000,
    status: "CLOSED",
    students: 920,
    rating: 4.4,
    createdAt: "2022-10-20",
  },
  {
    id: "10",
    title: "GraphQL API 개발",
    instructor: "박준호",
    category: "백엔드",
    price: 145000,
    status: "PREPARING",
    students: 0,
    rating: 0,
    createdAt: "2023-06-20",
  },
]

export default function CoursesPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Course>[] = [
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
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            강의명
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.getValue("title")}</span>
        </div>
      ),
    },
    {
      accessorKey: "instructor",
      header: "강사",
      cell: ({ row }) => <div>{row.getValue("instructor")}</div>,
    },
    {
      accessorKey: "category",
      header: "카테고리",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            가격
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
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
      cell: ({ row }) => {
        const status = row.getValue("status") as "PREPARING" | "ACTIVE" | "CLOSED"

        let badgeVariant: "default" | "outline" | "secondary" | "destructive"
        let statusText: string

        switch (status) {
          case "ACTIVE":
            badgeVariant = "default"
            statusText = "활성"
            break
          case "PREPARING":
            badgeVariant = "secondary"
            statusText = "준비중"
            break
          case "CLOSED":
            badgeVariant = "destructive"
            statusText = "종료"
            break
          default:
            badgeVariant = "outline"
            statusText = status
        }

        return <Badge variant={badgeVariant}>{statusText}</Badge>
      },
    },
    {
      accessorKey: "students",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            수강생
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="text-center">{row.getValue("students")}</div>,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            평점
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const rating = Number.parseFloat(row.getValue("rating"))
        return <div className="text-center">{rating > 0 ? rating.toFixed(1) : "-"}</div>
      },
    },
    {
      accessorKey: "createdAt",
      header: "등록일",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"))
        return <div>{date.toLocaleDateString("ko-KR")}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(course.id)}>ID 복사</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                강의 상세 보기
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileEdit className="mr-2 h-4 w-4" />
                강의 수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
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
                <SelectValue placeholder="카테고리 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                <SelectItem value="프론트엔드">프론트엔드</SelectItem>
                <SelectItem value="백엔드">백엔드</SelectItem>
                <SelectItem value="모바일">모바일</SelectItem>
                <SelectItem value="데브옵스">데브옵스</SelectItem>
                <SelectItem value="데이터 사이언스">데이터 사이언스</SelectItem>
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
                <SelectItem value="ACTIVE">활성</SelectItem>
                <SelectItem value="PREPARING">준비중</SelectItem>
                <SelectItem value="CLOSED">종료</SelectItem>
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
              강의 추가
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
    </div>
  )
}
