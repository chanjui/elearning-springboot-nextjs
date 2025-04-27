import { NextRequest, NextResponse } from 'next/server';

// 쿠폰 인터페이스 정의 (백엔드 DTO와 일치하도록)
interface Coupon {
  id: number;
  couponId: number;
  code: string;
  discount: number;
  courseId: number | null;
  courseName: string;
  regDate: string;
  isDel: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    // URL에서 courseId 파라미터 추출
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { message: '강의 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    console.log(`강의 ID ${courseId}에 대한 쿠폰 조회 요청`);
    console.log(`인증 헤더: ${authHeader.substring(0, 20)}...`);

    // 백엔드 API 호출 - 상대 경로 사용 (next.config.mjs의 rewrites 규칙 활용)
    const response = await fetch(`/api/payment/available-coupons?courseId=${courseId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader, // 원래 헤더 그대로 사용
        'Content-Type': 'application/json'
      }
    });

    console.log(`백엔드 응답 상태: ${response.status}`);

    // 백엔드 응답 처리
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '알 수 없는 오류가 발생했습니다.' }));
      console.error('백엔드 오류 응답:', errorData);
      return NextResponse.json(
        { message: errorData.message || '쿠폰 조회 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    // 백엔드에서 받은 쿠폰 데이터 반환
    const coupons = await response.json();
    console.log(`조회된 쿠폰 수: ${Array.isArray(coupons) ? coupons.length : '응답이 배열이 아님'}`);
    
    // CORS 헤더 제거 - Next.js API 라우트에서는 필요 없음
    return NextResponse.json(coupons);
  } catch (error) {
    console.error('쿠폰 조회 중 오류 발생:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 