"use client"

import { useState } from "react"
import { Calendar, CreditCard, DollarSign, Download, LineChart, Wallet } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/user/ui/card"
import { Button } from "@/components/user/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/user/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/user/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/user/ui/select"
import { Badge } from "@/components/user/ui/badge"
import { AreaChart, Area, BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/user/ui/popover"
import { Calendar as CalendarComponent } from "@/components/user/ui/calendar"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

// 매출 데이터
const revenueData = [
  { name: "1월", total: 45000000 },
  { name: "2월", total: 52000000 },
  { name: "3월", total: 48000000 },
  { name: "4월", total: 61000000 },
  { name: "5월", total: 75000000 },
  { name: "6월", total: 85000000 },
]

// 카테고리별 매출 데이터
const categoryRevenueData = [
  { name: "프론트엔드", value: 42 },
  { name: "백엔드", value: 35 },
  { name: "모바일", value: 15 },
  { name: "데브옵스", value: 8 },
]

// 결제 내역 데이터
const paymentData = [
  {
    id: "INV-001",
    user: "김민수",
    email: "kim@example.com",
    course: "React 완벽 가이드",
    amount: 120000,
    status: "completed",
    date: "2023-06-28",
    method: "카드",
  },
  {
    id: "INV-002",
    user: "이지은",
    email: "lee@example.com",
    course: "Vue.js 3 완벽 가이드",
    amount: 110000,
    status: "completed",
    date: "2023-06-29",
    method: "카카오페이",
  },
  {
    id: "INV-003",
    user: "박준호",
    email: "park@example.com",
    course: "Spring Boot 실전 프로젝트",
    amount: 160000,
    status: "pending",
    date: "2023-06-30",
    method: "계좌이체",
  },
  {
    id: "INV-004",
    user: "최유진",
    email: "choi@example.com",
    course: "Python 데이터 분석",
    amount: 140000,
    status: "completed",
    date: "2023-06-30",
    method: "카드",
  },
  {
    id: "INV-005",
    user: "정승호",
    email: "jung@example.com",
    course: "Flutter 모바일 앱 개발",
    amount: 135000,
    status: "refunded",
    date: "2023-06-25",
    method: "네이버페이",
  },
]

// 정산 내역 데이터
const settlementData = [
  {
    id: "STL-001",
    instructor: "이지은",
    email: "lee@example.com",
    courses: 2,
    totalSales: 930000,
    commission: 279000,
    amount: 651000,
    status: "completed",
    date: "2023-06-15",
  },
  {
    id: "STL-002",
    instructor: "최유진",
    email: "choi@example.com",
    courses: 2,
    totalSales: 1240000,
    commission: 372000,
    amount: 868000,
    status: "pending",
    date: "2023-06-30",
  },
  {
    id: "STL-003",
    instructor: "송태준",
    email: "song@example.com",
    courses: 2,
    totalSales: 885000,
    commission: 265500,
    amount: 619500,
    status: "completed",
    date: "2023-06-15",
  },
  {
    id: "STL-004",
    instructor: "조민지",
    email: "jo@example.com",
    courses: 2,
    totalSales: 750000,
    commission: 225000,
    amount: 525000,
    status: "pending",
    date: "2023-06-30",
  },
  {
    id: "STL-005",
    instructor: "박준호",
    email: "park@example.com",
    courses: 1,
    totalSales: 160000,
    commission: 48000,
    amount: 112000,
    status: "pending",
    date: "2023-06-30",
  },
]

export default function SalesPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 5, 1),
    to: new Date(2023, 5, 30),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">매출 관리</h2>
        <p className="text-muted-foreground">플랫폼의 매출 현황과 결제 내역, 정산 내역을 확인하세요.</p>
      </div>

      <div className="flex items-center justify-between">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "yyyy년 MM월 dd일", { locale: ko })} -{" "}
                    {format(date.to, "yyyy년 MM월 dd일", { locale: ko })}
                  </>
                ) : (
                  format(date.from, "yyyy년 MM월 dd일", { locale: ko })
                )
              ) : (
                <span>날짜 선택</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={ko}
            />
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            보고서 다운로드
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩366,000,000</div>
            <p className="text-xs text-muted-foreground">+13.2% 전월 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 매출</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩85,000,000</div>
            <p className="text-xs text-muted-foreground">+13.3% 전월 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">정산 예정</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩2,125,000</div>
            <p className="text-xs text-muted-foreground">5명의 강사에게 정산 예정</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">수수료 수익</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩25,500,000</div>
            <p className="text-xs text-muted-foreground">+15.3% 전월 대비</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">매출 개요</TabsTrigger>
          <TabsTrigger value="payments">결제 내역</TabsTrigger>
          <TabsTrigger value="settlements">정산 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>월별 매출</CardTitle>
                <CardDescription>최근 6개월 간의 월별 매출 추이입니다.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₩${value / 1000000}M`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`₩${value.toLocaleString()}`, "매출"]}
                      cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>카테고리별 매출 비중</CardTitle>
                <CardDescription>카테고리별 매출 비중을 확인하세요.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={categoryRevenueData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      type="number"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "비중"]}
                      cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>매출 요약</CardTitle>
              <CardDescription>주요 매출 지표를 확인하세요.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">평균 강의 가격</p>
                  <p className="text-2xl font-bold">₩145,000</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">평균 구매 금액</p>
                  <p className="text-2xl font-bold">₩165,000</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">재구매율</p>
                  <p className="text-2xl font-bold">32.5%</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">환불률</p>
                  <p className="text-2xl font-bold">2.3%</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                상세 보고서 다운로드
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>결제 내역</CardTitle>
                <CardDescription>최근 결제 내역을 확인하세요.</CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="refunded">환불됨</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>결제 ID</TableHead>
                    <TableHead>사용자</TableHead>
                    <TableHead>강의</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>결제일</TableHead>
                    <TableHead>결제수단</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentData.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{payment.user}</span>
                          <span className="text-xs text-muted-foreground">{payment.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{payment.course}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("ko-KR", {
                          style: "currency",
                          currency: "KRW",
                        }).format(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payment.status === "completed" ? "완료" : payment.status === "pending" ? "대기중" : "환불됨"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString("ko-KR")}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">이전</Button>
              <Button variant="outline">다음</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>정산 내역</CardTitle>
                <CardDescription>강사별 정산 내역을 확인하세요.</CardDescription>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="상태 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 상태</SelectItem>
                  <SelectItem value="completed">완료</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>정산 ID</TableHead>
                    <TableHead>강사</TableHead>
                    <TableHead>강의 수</TableHead>
                    <TableHead>총 매출</TableHead>
                    <TableHead>수수료</TableHead>
                    <TableHead>정산액</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>정산일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlementData.map((settlement) => (
                    <TableRow key={settlement.id}>
                      <TableCell className="font-medium">{settlement.id}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{settlement.instructor}</span>
                          <span className="text-xs text-muted-foreground">{settlement.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{settlement.courses}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("ko-KR", {
                          style: "currency",
                          currency: "KRW",
                        }).format(settlement.totalSales)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("ko-KR", {
                          style: "currency",
                          currency: "KRW",
                        }).format(settlement.commission)}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("ko-KR", {
                          style: "currency",
                          currency: "KRW",
                        }).format(settlement.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={settlement.status === "completed" ? "default" : "secondary"}>
                          {settlement.status === "completed" ? "완료" : "대기중"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(settlement.date).toLocaleDateString("ko-KR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">이전</Button>
              <Button variant="outline">다음</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
