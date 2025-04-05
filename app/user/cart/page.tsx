// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Separator } from "@/components/ui/separator"
// import NetflixHeader from "@/components/netflix-header"
// import useUserStore from "@/app/auth/userStore"
// import { useEffect, useState } from "react"
// import axios from "axios"

// interface CartItem {
//   courseId: number
//   title: string
//   instructor: string
//   price: number
//   image: string
// }

// interface CartDTO {
//   items: CartItem[]
//   subtotal: number
//   discount: number
//   total: number
// }

// export default function CartPage() {
//   const { user } = useUserStore()
//   const [cart, setCart] = useState<CartDTO | null>(null)

//   useEffect(() => {
//     if (!user) return

//     axios
//       .get(`/api/cart`, { withCredentials: true })
//       .then((res) => {
//         if (res.data.totalCount === 1) {
//           setCart(res.data.data);
//         } else {
//           console.warn("장바구니 데이터 없음 또는 실패:", res.data);
//         }
//       })
//       .catch((err) => {
//         console.error("장바구니 조회 오류", err)
//       })
//   }, [user])

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("ko-KR").format(price)
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
//         <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다.</h1>
//         <Link href="/auth/user/login">
//           <Button className="bg-red-600 hover:bg-red-700">로그인 하러가기</Button>
//         </Link>
//       </div>
//     )
//   }

//   if (!cart) {
//     return <div className="min-h-screen bg-black text-white">로딩 중...</div>
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <NetflixHeader />

//       <main className="container mx-auto px-4 py-20">
//         <div className="mb-6">
//           <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white">
//             <ArrowLeft className="h-4 w-4 mr-1" />
//             계속 쇼핑하기
//           </Link>
//         </div>

//         <h1 className="text-3xl font-bold mb-8 flex items-center">
//           <ShoppingCart className="h-6 w-6 mr-2" />
//           장바구니
//         </h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* 왼쪽: 장바구니 아이템 */}
//           <div className="lg:col-span-2">
//             <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center">
//                   <Checkbox id="select-all" className="border-gray-600" />
//                   <label htmlFor="select-all" className="ml-2 text-sm font-medium">
//                     전체 선택
//                   </label>
//                   <span className="ml-2 text-sm font-medium text-gray-400">({cart.items.length})</span>
//                 </div>
//                 <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-gray-800">
//                   <Trash2 className="h-4 w-4 mr-1" />
//                   선택 삭제
//                 </Button>
//               </div>

//               <Separator className="mb-4 bg-gray-800" />

//               <div className="space-y-4">
//                 {cart.items.map((item) => (
//                   <div key={item.courseId} className="flex items-center gap-4">
//                     <Checkbox id={`item-${item.courseId}`} className="border-gray-600" />
//                     <Image
//                       src={item.image || "/placeholder.svg"}
//                       alt={item.title}
//                       width={140}
//                       height={80}
//                       className="w-[140px] h-20 object-cover rounded"
//                     />
//                     <div className="flex-1">
//                       <h3 className="font-medium">{item.title}</h3>
//                       <p className="text-sm text-gray-400">{item.instructor}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold">₩{formatPrice(item.price)}</p>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="text-red-500 hover:text-red-400 hover:bg-gray-800 mt-1"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* 오른쪽: 결제 금액 */}
//           <div className="lg:col-span-1">
//             <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-24">
//               <h2 className="text-lg font-medium mb-4">결제 금액</h2>

//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">상품 금액</span>
//                   <span>₩{formatPrice(cart.subtotal)}</span>
//                 </div>
//                 <div className="flex justify-between text-green-500">
//                   <span>할인 금액</span>
//                   <span>-₩{formatPrice(cart.discount)}</span>
//                 </div>
//                 <Separator className="bg-gray-800" />
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>총 결제 금액</span>
//                   <span>₩{formatPrice(cart.total)}</span>
//                 </div>

//                 <Link href="/user/checkout">
//                   <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">결제하기</Button>
//                 </Link>

//                 <div className="text-xs text-gray-500 mt-2">
//                   결제하기 버튼을 클릭하면 구매 조건을 확인하고 결제에 동의하는 것으로 간주됩니다.
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }


"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2, ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import NetflixHeader from "@/components/netflix-header"
import useUserStore from "@/app/auth/userStore"
import { useEffect, useState } from "react"
import axios from "axios"

interface CartItem {
  courseId: number
  title: string
  instructor: string
  price: number
  image: string
}

interface CartDTO {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
}

export default function CartPage() {
  const { user, restoreFromStorage } = useUserStore()
  const [cart, setCart] = useState<CartDTO | null>(null)
  const [selectedItems, setSelectedItems] = useState<number[]>([])


  useEffect(() => {
    if (!user) restoreFromStorage()
  }, [])

  useEffect(() => {
    if (!user) return

    axios.get(`/api/cart`, { withCredentials: true })
      .then((res) => {
        if (res.data.totalCount === 1) {
          setCart(res.data.data)
        }
      })
      .catch((err) => {
        console.error("장바구니 조회 오류", err)
      })
  }, [user])

  const handleToggleAll = () => {
    if (!cart) return
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cart.items.map((item) => item.courseId))
    }
  }

  const handleToggleItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleRemoveSelected = async () => {
    try {
      for (const courseId of selectedItems) {
        await axios.delete(`/api/cart/remove`, {
          data: { courseId },
          withCredentials: true,
        })
      }
      setCart((prev) => prev ? {
        ...prev,
        items: prev.items.filter((item) => !selectedItems.includes(item.courseId))
      } : null)
      setSelectedItems([])
    } catch (error) {
      console.error("선택 삭제 오류:", error)
    }
  }

  const formatPrice = (price: number) => new Intl.NumberFormat("ko-KR").format(price)

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다.</h1>
        <Link href="/auth/user/login">
          <Button className="bg-red-600 hover:bg-red-700">로그인 하러가기</Button>
        </Link>
      </div>
    )
  }

  if (!cart) {
    return <div className="min-h-screen bg-black text-white">로딩 중...</div>
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white text-center py-32">
        <NetflixHeader />
        <h2 className="text-2xl font-bold mb-4">장바구니가 비어있습니다</h2>
        <p className="text-gray-400 mb-6">수강하고 싶은 강의를 담아보세요</p>
        <Link href="/">
          <Button className="bg-red-600 hover:bg-red-700">강의 보러가기</Button>
        </Link>
      </div>
    )
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
          <div className="lg:col-span-2">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Checkbox
                    checked={selectedItems.length === cart.items.length}
                    onCheckedChange={handleToggleAll}
                    className="border-gray-600"
                  />
                  <label className="ml-2 text-sm font-medium">전체 선택</label>
                  <span className="ml-2 text-sm font-medium text-gray-400">({cart.items.length})</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveSelected}
                  className="text-red-500 hover:text-red-400 hover:bg-gray-800"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  선택 삭제
                </Button>
              </div>

              <Separator className="mb-4 bg-gray-800" />

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.courseId} className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedItems.includes(item.courseId)}
                      onCheckedChange={() => handleToggleItem(item.courseId)}
                      className="border-gray-600"
                    />
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-24">
              <h2 className="text-lg font-medium mb-4">결제 금액</h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">상품 금액</span>
                  <span>₩{formatPrice(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-green-500">
                  <span>할인 금액</span>
                  <span>-₩{formatPrice(cart.discount)}</span>
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제 금액</span>
                  <span>₩{formatPrice(cart.total)}</span>
                </div>

                <Link href="/user/checkout">
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">결제하기</Button>
                </Link>

                <div className="text-xs text-gray-500 mt-2">
                  결제하기 버튼을 클릭하면 구매 조건을 확인하고 결제에 동의하는 것으로 간주됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}