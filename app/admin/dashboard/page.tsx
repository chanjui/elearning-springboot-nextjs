
import Link from "next/link"
import { ArrowUpRight, BookOpen, DollarSign, Download, MessageSquare, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/user/ui/card"
import { Button } from "@/components/user/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/user/ui/tabs"
import { Overview } from "@/components/user/dashboard/overview"
import { RecentSales } from "@/components/user/dashboard/recent-sales"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
        <p className="text-muted-foreground">개발자 e러닝 플랫폼의 주요 지표와 현황을 확인하세요.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩1,000,000,000</div>
            <p className="text-xs text-muted-foreground">+20.1% 전월 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+180 지난 주 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 강의</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+25 지난 달 대비</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">미해결 문의</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">-3 지난 주 대비</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
          <TabsTrigger value="reports">보고서</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>매출 개요</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>최근 판매</CardTitle>
                <CardDescription>최근 10건의 판매 내역입니다.</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentSales />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>상세 분석</CardTitle>
              <CardDescription>플랫폼 사용 패턴과 사용자 행동에 대한 상세 분석입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">상세 분석 차트가 여기에 표시됩니다.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>보고서</CardTitle>
              <CardDescription>다운로드 가능한 보고서 목록입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">월간 매출 보고서</p>
                    <p className="text-sm text-muted-foreground">2023년 6월</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    다운로드
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">분기별 사용자 통계</p>
                    <p className="text-sm text-muted-foreground">2023년 Q2</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    다운로드
                  </Button>
                </div>
                <div className="flex items-center justify-between rounded-md border p-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">강의 인기도 분석</p>
                    <p className="text-sm text-muted-foreground">2023년 상반기</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    다운로드
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>심사 대기 강의</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-muted-foreground mt-2">8개의 강의가 심사 대기 중입니다.</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/reviews" className="w-full">
              <Button className="w-full" variant="outline">
                심사하기
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>인기 카테고리</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">프론트엔드</span>
              <span className="text-sm font-medium">42%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-2 w-[42%] rounded-full bg-primary"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">백엔드</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-2 w-[35%] rounded-full bg-primary"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">모바일</span>
              <span className="text-sm font-medium">15%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-2 w-[15%] rounded-full bg-primary"></div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">데브옵스</span>
              <span className="text-sm font-medium">8%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div className="h-2 w-[8%] rounded-full bg-primary"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-secondary p-2">
                  <Users className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">새 사용자 등록</p>
                  <p className="text-xs text-muted-foreground">오늘 15명의 새로운 사용자가 등록했습니다.</p>
                  <p className="text-xs text-muted-foreground">2시간 전</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-secondary p-2">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">새 강의 등록</p>
                  <p className="text-xs text-muted-foreground">"React 고급 패턴" 강의가 등록되었습니다.</p>
                  <p className="text-xs text-muted-foreground">5시간 전</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-secondary p-2">
                  <DollarSign className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">대규모 결제</p>
                  <p className="text-xs text-muted-foreground">기업 구매: 50명 사용자 라이센스</p>
                  <p className="text-xs text-muted-foreground">어제</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
