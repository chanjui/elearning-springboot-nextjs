// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import Image from "next/image"
// import { CreditCard, ArrowLeft, CheckCircle2, AlertCircle, Smartphone } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Separator } from "@/components/ui/separator"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import NetflixHeader from "@/components/netflix-header"
// import { cartStore } from "../cart/cartStore";
// import { useSearchParams } from "next/navigation"
// import useUserStore from "@/app/auth/userStore"
// import axios from "axios"
// import Script from "next/script";

// export default function CheckoutPage() {
//   const { user, restoreFromStorage } = useUserStore();
//   useEffect(() => {
//     // 페이지 마운트 시 로그인 정보 복원
//     restoreFromStorage();
//   }, []);
  
//   // cartStore의 상태에서 cartItems와 선택된 강의(selectedItems)를 가져옴
//   const { cartItems, selectedItems } = cartStore();
//   // 선택된 강의 상세 정보를 필터링 (cartItems는 강의 객체 배열, selectedItems는 강의 ID 배열)
//   const selectedItemsDetails = cartItems.filter(item => selectedItems.includes(item.courseId));

//   // 가격 계산
//   const subtotal = selectedItemsDetails.reduce((sum, item) => sum + item.price, 0);
//   const discount = selectedItemsDetails.reduce((sum, item) => sum + item.discountAmount, 0);
//   const total = subtotal - discount; // discountedPrice가 이미 할인 반영된 가격이라고 가정

//   // 가격 포맷팅 함수
//   const formatPrice = (price: number) => new Intl.NumberFormat("ko-KR").format(price);

//   // 결제 수단 선택 상태 (현재는 카드 결제만 사용)
//   const [paymentMethod, setPaymentMethod] = useState("card");

//   // KG 카드 결제에 필요한 카드 정보 상태 추가
//   const [cardNumber, setCardNumber] = useState("");
//   const [cardExpiry, setCardExpiry] = useState("");
//   const [cardCVC, setCardCVC] = useState("");
//   const [cardPassword, setCardPassword] = useState("");

//   <Script src="https://cdn.iamport.kr/js/iamport.payment-1.2.0.js" strategy="beforeInteractive"/>
//   // 카드 결제 요청 함수
//   const handleCardPayment = async () => {
//     // localStorage나 useUserStore에서 JWT 토큰을 가져옵니다.
//     const token = localStorage.getItem("accessToken")
//     // 결제 요청에 필요한 데이터 구성
//     // (실제 서비스에서는 카드 정보 입력 없이 KG PG의 Hosted Payment Page로 바로 이동하도록 구현)
//     const paymentData = {
//       // 결제 금액 및 주문 관련 데이터
//       amount: total,
//       // 추가 정보: 주문번호, 사용자 정보 등
//       // 예: orderId, userId 등
//     };
//     try {
//       // 백엔드의 KG 카드 결제 API 호출 (Spring Boot에서 구현)
//       // const response = await axios.post("/api/payment/verify", paymentData, { withCredentials: true, headers: { Authorization: `Bearer ${token}`});
//       const response = await axios.post("/api/payment/verify", paymentData, {
//         withCredentials: true,
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data && response.data.redirectUrl) {
//         // 결제 요청이 성공하면 KG 결제 인증 페이지로 리다이렉트
//         window.location.href = response.data.redirectUrl;
//       } else {
//         alert("결제 처리 중 문제가 발생했습니다.");
//       }
//     } catch (error) {
//       console.error("KG 카드 결제 오류:", error);
//       alert("결제 요청에 실패했습니다.");
//     }
//   };

//   // 약관 동의 상태 관리
//   const [termsAgreed, setTermsAgreed] = useState({
//     all: false,
//     terms1: false,
//     terms2: false,
//     terms3: false,
//   });
//   const handleAllTermsChange = (checked: boolean) => {
//     setTermsAgreed({
//       all: checked,
//       terms1: checked,
//       terms2: checked,
//       terms3: checked,
//     });
//   };
//   const handleTermChange = (term: string, checked: boolean) => {
//     const newTerms = { ...termsAgreed, [term]: checked };
//     setTermsAgreed({
//       ...newTerms,
//       all: newTerms.terms1 && newTerms.terms2 && newTerms.terms3,
//     });
//   };



//   // 휴대폰 인증 관련 상태
//   // const [phoneVerificationStep, setPhoneVerificationStep] = useState(0);
//   // const [phoneNumber, setPhoneNumber] = useState("");
//   // const [verificationCode, setVerificationCode] = useState("");
//   // const [countdown, setCountdown] = useState(180); // 3분 타이머

//   // const startPhoneVerification = () => {
//   //   if (phoneNumber.length < 10) return;
//   //   setPhoneVerificationStep(1);
//   //   const timer = setInterval(() => {
//   //     setCountdown((prev) => {
//   //       if (prev <= 1) {
//   //         clearInterval(timer);
//   //         return 0;
//   //       }
//   //       return prev - 1;
//   //     });
//   //   }, 1000);
//   // };

//   // const verifyCode = () => {
//   //   if (verificationCode.length === 6) {
//   //     setPhoneVerificationStep(2);
//   //   }
//   // };

//   // const formatTime = (seconds: number) => {
//   //   const mins = Math.floor(seconds / 60);
//   //   const secs = seconds % 60;
//   //   return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
//   // };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <NetflixHeader />

//       <main className="container mx-auto px-4 py-8">
//         <div className="mb-6">
//           <Link href="/user/cart" className="inline-flex items-center text-gray-400 hover:text-white">
//             <ArrowLeft className="h-4 w-4 mr-1" />
//             장바구니로 돌아가기
//           </Link>
//         </div>

//         <h1 className="text-2xl font-bold mb-8">결제하기</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* 왼쪽: 결제 정보 */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* 주문 상품 */}
//             <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
//               <h2 className="text-lg font-medium mb-4">주문 상품</h2>
//               <div className="space-y-4">
//                 {selectedItemsDetails.map((item) => (
//                   <div key={item.courseId} className="flex gap-4">
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
//                       {item.discountRate > 0 ? (
//                         <>
//                           {/* 할인율이 있는 경우: 할인 가격, 원가, 할인율 모두 표시 */}
//                           <p className="font-bold">₩{formatPrice(item.discountedPrice)}</p>
//                           <p className="text-sm text-gray-400 line-through">₩{formatPrice(item.price)}</p>
//                           <p className="text-sm text-green-500">{item.discountRate}% ₩{formatPrice(item.discountAmount)}</p>
//                         </>
//                       ) : (
//                         <>
//                           {/* 할인율이 0인 경우: 원가만 표시 */}
//                           <p className="font-bold">₩{formatPrice(item.price)}</p>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

            // {/* 쿠폰 및 포인트 */}
            // <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            //   <h2 className="text-lg font-medium mb-4">쿠폰 및 포인트</h2>

            //   <Accordion type="single" collapsible className="w-full">
            //     <AccordionItem value="coupon" className="border-gray-800">
            //       <AccordionTrigger className="py-2 text-gray-200 hover:text-white">쿠폰 사용</AccordionTrigger>
            //       <AccordionContent>
            //         <div className="space-y-2">
            //           <div className="flex gap-2">
            //             <Input placeholder="쿠폰 코드 입력" className="flex-1 bg-gray-800 border-gray-700" />
            //             <Button
            //               variant="outline"
            //               className="border-gray-700 text-gray-200 hover:text-white hover:bg-gray-800"
            //             >
            //               적용
            //             </Button>
            //           </div>
            //           <div className="text-sm text-gray-400">사용 가능한 쿠폰이 없습니다.</div>
            //         </div>
            //       </AccordionContent>
            //     </AccordionItem>

            //     <AccordionItem value="point" className="border-gray-800">
            //       <AccordionTrigger className="py-2 text-gray-200 hover:text-white">포인트 사용</AccordionTrigger>
            //       <AccordionContent>
            //         <div className="space-y-2">
            //           <div className="flex gap-2">
            //             <Input
            //               type="number"
            //               placeholder="사용할 포인트 입력"
            //               className="flex-1 bg-gray-800 border-gray-700"
            //             />
            //             <Button
            //               variant="outline"
            //               className="border-gray-700 text-gray-200 hover:text-white hover:bg-gray-800"
            //             >
            //               적용
            //             </Button>
            //           </div>
            //           <div className="text-sm text-gray-400">보유 포인트: 0P</div>
            //         </div>
            //       </AccordionContent>
            //     </AccordionItem>
            //   </Accordion>
            // </div>

//             {/* 결제 수단 */}
//             <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
//               <h2 className="text-lg font-medium mb-4">결제 수단</h2>

//               <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="card" id="card" className="border-gray-600 text-red-600" />
//                   <Label htmlFor="card" className="flex items-center text-gray-200">
//                     <CreditCard className="h-5 w-5 mr-2" />
//                     신용/체크카드
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="bank" id="bank" className="border-gray-600 text-red-600" />
//                   <Label htmlFor="bank" className="text-gray-200">
//                     무통장 입금
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="phone" id="phone" className="border-gray-600 text-red-600" />
//                   <Label htmlFor="phone" className="text-gray-200">
//                     휴대폰 결제
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="kakao" id="kakao" className="border-gray-600 text-red-600" />
//                   <Label htmlFor="kakao" className="text-gray-200">
//                     카카오페이
//                   </Label>
//                 </div>
//               </RadioGroup>
//             </div>

//             {/* 개인정보 제공 동의 */}
//             <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
//               <h2 className="text-lg font-medium mb-4">개인정보 제공 동의</h2>

//               <div className="space-y-2">
//                 <div className="flex items-start">
//                   <Checkbox
//                     id="terms-all"
//                     className="mt-1 border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
//                     checked={termsAgreed.all}
//                     onCheckedChange={(checked) => handleAllTermsChange(checked as boolean)}
//                   />
//                   <Label htmlFor="terms-all" className="ml-2 font-medium text-gray-200">
//                     전체 동의
//                   </Label>
//                 </div>
//                 <Separator className="bg-gray-800" />
//                 <div className="flex items-start">
//                   <Checkbox
//                     id="terms-1"
//                     className="mt-1 border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
//                     checked={termsAgreed.terms1}
//                     onCheckedChange={(checked) => handleTermChange("terms1", checked as boolean)}
//                   />
//                   <Label htmlFor="terms-1" className="ml-2 text-sm text-gray-300">
//                     (필수) 구매조건 확인 및 결제진행에 동의
//                   </Label>
//                 </div>
//                 <div className="flex items-start">
//                   <Checkbox
//                     id="terms-2"
//                     className="mt-1 border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
//                     checked={termsAgreed.terms2}
//                     onCheckedChange={(checked) => handleTermChange("terms2", checked as boolean)}
//                   />
//                   <Label htmlFor="terms-2" className="ml-2 text-sm text-gray-300">
//                     (필수) 개인정보 제3자 제공 동의
//                   </Label>
//                 </div>
//                 <div className="flex items-start">
//                   <Checkbox
//                     id="terms-3"
//                     className="mt-1 border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
//                     checked={termsAgreed.terms3}
//                     onCheckedChange={(checked) => handleTermChange("terms3", checked as boolean)}
//                   />
//                   <Label htmlFor="terms-3" className="ml-2 text-sm text-gray-300">
//                     (필수) 개인정보 수집 및 이용 동의
//                   </Label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* 오른쪽: 결제 금액 및 휴대폰 인증 */}
//           <div className="lg:col-span-1 space-y-6">
//             {/* 결제 금액 */}
//             <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 sticky top-4">
//               <h2 className="text-lg font-medium mb-4">결제 금액</h2>

//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-400">상품 금액</span>
//                   <span>₩{formatPrice(subtotal)}</span>
//                 </div>
//                 <div className="flex justify-between text-green-500">
//                   <span>할인 금액</span>
//                   <span>-₩{formatPrice(discount)}</span>
//                 </div>
//                 <Separator className="bg-gray-800" />
//                 <div className="flex justify-between font-bold text-lg">
//                   <span>총 결제 금액</span>
//                   <span>₩{formatPrice(total)}</span>
//                 </div>

//                 {paymentMethod === "card" ? (
//                   // 카드 결제일 경우: KG 카드 결제 API를 호출합니다.
//                   <Button 
//                     className="w-full mt-4 bg-red-600 hover:bg-red-700"
//                     disabled={selectedItems.length === 0 || !termsAgreed.all}
//                     onClick={handleCardPayment}
//                   >
//                     결제하기
//                   </Button>
//                 ) : (
//                   // 카드 결제가 아닌 다른 결제 수단의 경우, 결제 페이지로 이동합니다.
//                   <Link href="/user/checkout">
//                     <Button 
//                       className="w-full mt-4 bg-red-600 hover:bg-red-700"
//                       disabled={selectedItems.length === 0 || !termsAgreed.all}
//                     >
//                       결제하기
//                     </Button>
//                   </Link>
//                 )}

//                 {/* {phoneVerificationStep !== 2 && (
//                   <Alert className="mt-2 bg-yellow-900/30 border-yellow-800 text-yellow-200">
//                     <AlertCircle className="h-4 w-4" />
//                     <AlertDescription>결제를 진행하기 위해 휴대폰 인증이 필요합니다.</AlertDescription>
//                   </Alert>
//                 )}

//                 {phoneVerificationStep === 2 && (
//                   <Alert className="mt-2 bg-green-900/30 border-green-800 text-green-200">
//                     <CheckCircle2 className="h-4 w-4" />
//                     <AlertDescription>휴대폰 인증이 완료되었습니다.</AlertDescription>
//                   </Alert>
//                 )} */}

//                 <div className="text-xs text-gray-500 mt-2">위 주문 내용을 확인하였으며, 결제에 동의합니다.</div>
//               </div>
//             </div>

//             {/* 휴대폰 인증 */}
//             {/* <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
//               <div className="flex items-center mb-4">
//                 <Smartphone className="h-5 w-5 mr-2 text-red-500" />
//                 <h2 className="text-lg font-medium">휴대폰 본인인증</h2>
//               </div>

//               {phoneVerificationStep === 0 && (
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="phone-number" className="text-sm text-gray-300">
//                       휴대폰 번호
//                     </Label>
//                     <div className="flex gap-2 mt-1">
//                       <Input
//                         id="phone-number"
//                         placeholder="01012345678"
//                         className="flex-1 bg-gray-800 border-gray-700"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                       />
//                       <Button
//                         onClick={startPhoneVerification}
//                         disabled={phoneNumber.length < 10}
//                         className="bg-red-600 hover:bg-red-700"
//                       >
//                         인증번호 받기
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-400">
//                     • 휴대폰 번호는 '-' 없이 입력해주세요.
//                     <br />• 본인 명의의 휴대폰만 인증 가능합니다.
//                   </div>
//                 </div>
//               )}

//               {phoneVerificationStep === 1 && (
//                 <div className="space-y-4">
//                   <div>
//                     <Label htmlFor="verification-code" className="text-sm text-gray-300">
//                       인증번호
//                     </Label>
//                     <div className="flex gap-2 mt-1">
//                       <div className="relative flex-1">
//                         <Input
//                           id="verification-code"
//                           placeholder="인증번호 6자리"
//                           className="flex-1 bg-gray-800 border-gray-700 pr-16"
//                           value={verificationCode}
//                           onChange={(e) => setVerificationCode(e.target.value)}
//                           maxLength={6}
//                         />
//                         <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
//                           {formatTime(countdown)}
//                         </div>
//                       </div>
//                       <Button
//                         onClick={verifyCode}
//                         disabled={verificationCode.length !== 6}
//                         className="bg-red-600 hover:bg-red-700"
//                       >
//                         확인
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-400">
//                     • 인증번호가 전송되었습니다.
//                     <br />• 인증번호가 오지 않으면 '인증번호 받기'를 다시 눌러주세요.
//                   </div>
//                 </div>
//               )}

//               {phoneVerificationStep === 2 && (
//                 <div className="flex items-center justify-center p-4 text-green-400">
//                   <CheckCircle2 className="h-5 w-5 mr-2" />
//                   <span>휴대폰 인증이 완료되었습니다.</span>
//                 </div>
//               )}
//             </div> */}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
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
        pg: "html5_inicis.INIpayTest", // PG사 설정: KG 결제 연동에 맞게 수정 필요합니다.
        pay_method: "card",
        merchant_uid: merchantUid,
        name: "주문 결제",
        amount: total, // 프론트에서 계산한 총 결제 금액
        buyer_email: user?.email,
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