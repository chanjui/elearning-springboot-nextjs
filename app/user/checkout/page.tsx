"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import NetflixHeader from "@/components/netflix-header";
import { cartStore } from "../cart/cartStore";
import useUserStore from "@/app/auth/userStore";
import axios from "axios";

interface CartItem {
  courseId: number;
  title: string;
  instructor: string;
  price: number;
  discountedPrice: number;
  discountAmount: number;
  discountRate: number;
  image: string;
}

interface TermsAgreed {
  all: boolean;
  terms1: boolean;
  terms2: boolean;
  terms3: boolean;
}

interface PaymentData {
  impUid: string;
  merchantUid: string;
  expectedAmount: number;
  courseIds: number[];
}

export default function CheckoutPage(){
  const { user, restoreFromStorage } = useUserStore();

  useEffect(() => {
    restoreFromStorage();
  }, [restoreFromStorage]);

  // 장바구니 상태에서 cartItems와 선택된 강의(courseId 배열)를 가져옵니다.
  const { cartItems, selectedItems, removeFromCart, clearSelectedItems } = cartStore();
  const selectedItemsDetails: CartItem[] = cartItems.filter((item: CartItem) =>
    selectedItems.includes(item.courseId)
  );

  // 가격 계산
  const subtotal: number = selectedItemsDetails.reduce(
    (sum: number, item: CartItem) => sum + item.price,
    0
  );
  const discount: number = selectedItemsDetails.reduce(
    (sum: number, item: CartItem) => sum + item.discountAmount,
    0
  );
  const total: number = subtotal - discount;

  // 가격 포맷팅 함수
  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("ko-KR").format(price);

  // 결제 수단 상태 (현재는 카드 결제만 사용)
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

  // 약관 동의 상태 관리
  const [termsAgreed, setTermsAgreed] = useState<TermsAgreed>({
    all: false,
    terms1: false,
    terms2: false,
    terms3: false,
  });

  const handleAllTermsChange = (checked: boolean): void => {
    setTermsAgreed({
      all: checked,
      terms1: checked,
      terms2: checked,
      terms3: checked,
    });
  };

  const handleTermChange = (term: keyof TermsAgreed, checked: boolean): void => {
    const newTerms = { ...termsAgreed, [term]: checked };
    setTermsAgreed({
      ...newTerms,
      all: newTerms.terms1 && newTerms.terms2 && newTerms.terms3,
    });
  };

  // 카드 결제 요청 함수 (I'mport 연동)
  const handleCardPayment = (): void => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    // window 객체에서 iamport 객체를 가져옵니다.
    const IMP: any = (window as any).IMP;
    if (!IMP) {
      alert("I'mport 스크립트가 로드되지 않았습니다.");
      return;
    }
    // 제공받은 가맹점 식별코드 사용 (여기서 imp61741237 사용)
    IMP.init("imp61741237");

    // 주문번호(merchant_uid) 생성 (타임스탬프 사용)
    const merchantUid: string = `merchant_${new Date().getTime()}`;

    IMP.request_pay(
      {
        pg: "html5_inicis.INIpayTest",
        pay_method: "card",
        merchant_uid: merchantUid,
        name: "강의 주문 결제",
        amount: total, // 프론트에서 계산한 총 결제 금액
        buyer_name: user.nickname,      // ← 이름
        buyer_tel: user.phone,          // ← 전화번호
        buyer_email: user.email,        // ← 이메일
        buyer_addr: "서울특별시 강남구 역삼동", // ← 주소
      },
      (rsp: any) => {
        if (rsp.success) {
          // 결제 성공 시, 백엔드에 결제 검증 요청
          const paymentData: PaymentData = {
            impUid: rsp.imp_uid,
            merchantUid: rsp.merchant_uid,
            expectedAmount: total,
            courseIds: selectedItems, // 여러 강의에 대한 ID 배열
          };

          const token: string | null = localStorage.getItem("accessToken");
          console.log("전송되는 결제 데이터:", paymentData);
          axios
            .post("/api/payment/verify", paymentData, {
              withCredentials: true,
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
              if (response.data && response.data.success) {
                // 서버에서 장바구니 항목을 삭제하는 API 요청
                axios.delete("/api/cart/remove", {
                  data: { courseIds: selectedItems },
                  withCredentials: true,
                  // headers: { Authorization: `Bearer ${token}` },
                })
                // 강의 ID 목록에 대해 장바구니 제거
                selectedItems.forEach((courseId: number) => {
                  removeFromCart(courseId);
                });
                // 필요에 따라 선택된 아이템 상태도 초기화
                clearSelectedItems();

                alert("결제가 성공적으로 처리되었습니다.");
                window.location.href = "/user";
              } else {
                alert("결제 검증 실패: " + response.data.message);
              }
            })
            .catch((error) => {
              console.error("결제 요청 실패:", error);
              alert("결제 요청 중 오류가 발생했습니다.");
            });
        } else {
          alert("결제 실패: " + rsp.error_msg);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Next.js Script 컴포넌트를 사용하여 I'mport 결제 스크립트를 불러옵니다 */}
      <Script
        src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js"
        strategy="beforeInteractive"
      />
      <NetflixHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href="/user/cart"
            className="inline-flex items-center text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            장바구니로 돌아가기
          </Link>
        </div>

        <h1 className="text-2xl font-bold mb-8">결제하기</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 주문 상품, 쿠폰, 결제 수단, 개인정보 동의 등 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 주문 상품 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">주문 상품</h2>
              <div className="space-y-4">
                {selectedItemsDetails.map((item: CartItem) => (
                  <div key={item.courseId} className="flex gap-4">
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
                      {item.discountRate > 0 ? (
                        <>
                          <p className="font-bold">₩{formatPrice(item.discountedPrice)}</p>
                          <p className="text-sm text-gray-400 line-through">
                            ₩{formatPrice(item.price)}
                          </p>
                          <p className="text-sm text-green-500">
                            {item.discountRate}% ₩{formatPrice(item.discountAmount)}
                          </p>
                        </>
                      ) : (
                        <p className="font-bold">₩{formatPrice(item.price)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 쿠폰 및 포인트 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">쿠폰 및 포인트</h2>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="coupon" className="border-gray-800">
                  <AccordionTrigger className="py-2 text-gray-200 hover:text-white">쿠폰 사용</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="쿠폰 코드 입력" className="flex-1 bg-gray-800 border-gray-700" />
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-200 hover:text-white hover:bg-gray-800"
                        >
                          적용
                        </Button>
                      </div>
                      <div className="text-sm text-gray-400">사용 가능한 쿠폰이 없습니다.</div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* 결제 수단 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">결제 수단</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: string) => setPaymentMethod(value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" className="border-gray-600" />
                  <Label htmlFor="card" className="flex items-center text-gray-200">
                    <CreditCard className="h-5 w-5 mr-2" />
                    신용/체크카드
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* 개인정보 제공 동의 */}
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h2 className="text-lg font-medium mb-4">개인정보 제공 동의</h2>
              <div className="space-y-2">
                <div className="flex items-start">
                  <Checkbox
                    id="terms-all"
                    className="mt-1 border-gray-600"
                    checked={termsAgreed.all}
                    onCheckedChange={(checked) => handleAllTermsChange(checked as boolean)}
                  />
                  <Label htmlFor="terms-all" className="ml-2 font-medium text-gray-200">
                    전체 동의
                  </Label>
                </div>
                <Separator className="bg-gray-800" />
                <div className="flex items-start">
                  <Checkbox
                    id="terms-1"
                    className="mt-1 border-gray-600"
                    checked={termsAgreed.terms1}
                    onCheckedChange={(checked) => handleTermChange("terms1", checked as boolean)}
                  />
                  <Label htmlFor="terms-1" className="ml-2 text-sm text-gray-300">
                    (필수) 구매조건 및 결제 진행에 동의
                  </Label>
                </div>
                <div className="flex items-start">
                  <Checkbox
                    id="terms-2"
                    className="mt-1 border-gray-600"
                    checked={termsAgreed.terms2}
                    onCheckedChange={(checked) => handleTermChange("terms2", checked as boolean)}
                  />
                  <Label htmlFor="terms-2" className="ml-2 text-sm text-gray-300">
                    (필수) 개인정보 제3자 제공 동의
                  </Label>
                </div>
                <div className="flex items-start">
                  <Checkbox
                    id="terms-3"
                    className="mt-1 border-gray-600"
                    checked={termsAgreed.terms3}
                    onCheckedChange={(checked) => handleTermChange("terms3", checked as boolean)}
                  />
                  <Label htmlFor="terms-3" className="ml-2 text-sm text-gray-300">
                    (필수) 개인정보 수집 및 이용 동의
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 결제 금액 및 결제 버튼 */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-4">
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
                {paymentMethod === "card" ? (
                  <Button
                    className="w-full mt-4 bg-red-600 hover:bg-red-700"
                    disabled={selectedItems.length === 0 || !termsAgreed.all}
                    onClick={handleCardPayment}
                  >
                    결제하기
                  </Button>
                ) : (
                  <Link href="/user/checkout">
                    <Button
                      className="w-full mt-4 bg-red-600 hover:bg-red-700"
                      disabled={selectedItems.length === 0 || !termsAgreed.all}
                    >
                      결제하기
                    </Button>
                  </Link>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  위 주문 내용을 확인하였으며, 결제에 동의합니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}