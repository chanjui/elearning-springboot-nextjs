import Link from "next/link"
import Image from "next/image"
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import NetflixHeader from "@/components/netflix-header"

export default function CartPage() {
  // 예시 데이터
  const cartItems = [
    {
      id: "1",
      title: "비전공자도 이해할 수 있는 Docker 입문/실전",
      instructor: "JSCODE 박재성",
      price: 77000,
      image: "/placeholder.svg?height=80&width=140",
    },
    {
      id: "2",
      title: "Kubernetes 완벽 가이드: 기초부터 실전까지",
      instructor: "JSCODE 박재성",
      price: 88000,
      image: "/placeholder.svg?height=80&width=140",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const discount = 16500
  const total = subtotal - discount

  // 가격 포맷팅 함수
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader />

      <main className="container mx-auto px-4 py-20">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-1" />
            계속 쇼핑하기
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingCart className="h-6 w-6 mr-2" />
          장바구니
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 장바구니 아이템 */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Checkbox id="select-all" className="border-gray-600" />
                  <label htmlFor="select-all" className="ml-2 text-sm font-medium">
                    전체 선택
                  </label>
                  <span className="ml-2 text-sm font-medium text-gray-400">({cartItems.length})</span>
                </div>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-gray-800">
                  <Trash2 className="h-4 w-4 mr-1" />
                  선택 삭제
                </Button>
              </div>

              <Separator className="mb-4 bg-gray-800" />

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Checkbox id={`item-${item.id}`} className="border-gray-600" />
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={140}
                      height={80}
                      className="w-[140px] h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-400">{item.instructor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₩{formatPrice(item.price)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-400 hover:bg-gray-800 mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">쿠폰 적용</h2>
              <div className="flex gap-2">
                <Input placeholder="쿠폰 코드 입력" className="flex-1 bg-gray-800 border-gray-700 text-white" />
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  적용
                </Button>
              </div>
            </div>
          </div>

          {/* 오른쪽: 결제 금액 */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-24">
              <h2 className="text-lg font-medium mb-4">결제 금액</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">상품 금액</span>
                  <span>₩{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>할인 금액</span>
                  <span>-₩{formatPrice(discount)}</span>
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span>₩{formatPrice(total)}</span>
                </div>

                <Link href="/user/checkout">
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">결제하기</Button>
                </Link>

                <div className="text-xs text-gray-500 mt-2">
                  결제하기 버튼을 클릭하면 인프런의 구매조건을 확인하고 결제에 동의하는 것으로 간주됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

