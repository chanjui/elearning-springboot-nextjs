package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.common.config.JwtProvider;
import com.elearning.user.dto.Payment.*;
import com.elearning.user.entity.User;
import com.elearning.user.service.Payment.PaymentRefundService;
import com.elearning.user.service.Payment.PaymentService;
import com.elearning.user.service.Payment.PurchaseHistoryService;
import com.elearning.user.service.Coupon.CouponService;
import com.elearning.user.dto.Coupon.UserCouponDTO;
import com.elearning.user.service.login.RequestService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// // Spring Security를 통해 인증된 사용자 정보를 받아오기 위한 어노테이션 예시
// import org.springframework.security.core.annotation.AuthenticationPrincipal;
// import com.elearning.user.security.CustomUserDetails; // 사용자 정보를 담은 CustomUserDetails 클래스

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
  private final PaymentService paymentService;
  private final JwtProvider jwtProvider;
  private final PaymentRefundService refundService;
  private final PurchaseHistoryService purchaseHistoryService;
  private final CouponService couponService;
  private final RequestService requestService;

  /**
   * 프론트엔드에서 결제 완료 후 imp_uid와 merchant_uid, courseId를 전송하면
   * Iamport API를 호출하여 결제 정보를 검증하고, DB에 결제 내역을 저장한 후 결과를 반환합니다.

   // * @param paymentRequest 프론트엔드에서 전달받은 결제 검증 요청 DTO
   // * @param user           인증된 사용자 정보 (JWT 토큰으로부터)
   * @return PaymentResponseDto - 결제 검증 결과
   */
  @PostMapping("/verify")
  public ResponseEntity<PaymentResponseDTO> verifyPaymentV2(
    @RequestBody PaymentVerifyRequestDTO paymentRequest, HttpServletRequest request
  ) {
    // JwtProvider의 resolveToken() 메서드를 통해 Authorization 헤더에서 JWT 토큰을 추출합니다.
    String jwtToken = jwtProvider.resolveToken(request);
    if (jwtToken == null || jwtToken.isBlank()) {
      return ResponseEntity.badRequest().body(new PaymentResponseDTO(false, "인증 토큰이 없습니다.", null));
    }
    // PaymentService에 결제 검증 요청 및 JWT 토큰 전달
    PaymentResponseDTO result = paymentService.verifyPayment(paymentRequest, jwtToken);
    if (result.isSuccess()) {
      return ResponseEntity.ok(result);
    } else {
      return ResponseEntity.badRequest().body(result);
    }
  }

  /**
   * 환불 엔드포인트
   * PaymentRefundDTO를 통해 merchantUid와 cancelAmount를 전달받고, JWT 토큰을 이용하여 결제 취소(환불)를 처리합니다.
   */
  @PostMapping("/refund")
  public ResponseEntity<PaymentResponseDTO> refundPayment(
    @RequestBody PaymentRefundDTO paymentRefund, HttpServletRequest request
  ) {
    try {
      log.info("환불 요청 시작: impUid={}, cancelAmount={}",
        paymentRefund.getImpUid(), paymentRefund.getCancelAmount());

      String jwtToken = jwtProvider.resolveToken(request);
      if (jwtToken == null || jwtToken.isBlank()) {
        return ResponseEntity.badRequest().body(new PaymentResponseDTO(false, "인증 토큰이 없습니다.", null));
      }

      PaymentResponseDTO responseDTO = refundService.cancelPayment(
        paymentRefund.getImpUid(),
        paymentRefund.getCancelAmount(),
        jwtToken
      );

      log.info("환불 처리 결과: success={}, message={}",
        responseDTO.isSuccess(), responseDTO.getMessage());

      if (responseDTO.isSuccess()) {
        return ResponseEntity.ok(responseDTO);
      } else {
        return ResponseEntity.badRequest().body(responseDTO);
      }
    } catch (Exception e) {
      log.error("환불 처리 중 예외 발생: {}", e.getMessage(), e);
      return ResponseEntity.badRequest().body(
        new PaymentResponseDTO(false, "환불 처리 중 오류가 발생했습니다: " + e.getMessage(), null)
      );
    }
  }

  // 결제 시 사용 가능한 쿠폰 목록 조회
  @GetMapping("/available-coupons")
  public ResponseEntity<?> getAvailableCoupons(
    @RequestParam Long courseId,
    HttpServletRequest request
  ) {
    System.out.println("=== getAvailableCoupons 시작 ===");
    String jwtToken = jwtProvider.resolveToken(request);
    System.out.println("JWT 토큰 추출 결과: " + (jwtToken != null ? "성공" : "실패"));
    
    if (jwtToken == null || jwtToken.isBlank()) {
      return ResponseEntity.badRequest().body(new PaymentResponseDTO(false, "인증 토큰이 없습니다.", null));
    }
    
    try {
      Long userId = jwtProvider.getUserId(jwtToken);
      System.out.println("userId 추출: " + userId);
      System.out.println("courseId: " + courseId);
      
      List<UserCouponDTO> availableCoupons = couponService.getAvailableCouponsForCourse(userId, courseId);
      System.out.println("조회된 쿠폰 수: " + (availableCoupons != null ? availableCoupons.size() : 0));
      
      return ResponseEntity.ok(availableCoupons);
    } catch (Exception e) {
      System.out.println("에러 발생: " + e.getMessage());
      e.printStackTrace();
      return ResponseEntity.badRequest().body(new PaymentResponseDTO(false, "쿠폰 조회 중 오류가 발생했습니다: " + e.getMessage(), null));
    }
  }

  // 무료 강의 수강 등록
  @PostMapping("/free-enroll")
  public ResultData<PaymentResponseDTO> freeEnroll(@RequestBody FreeEnrollDTO dto) {
    // 1) DTO 바인딩 확인 로그
    System.out.println("▶▶▶ freeEnroll 호출! DTO 내용: " + dto);

    User user = requestService.getUser();
    if (user == null) {
      System.out.println("▶▶▶ freeEnroll: 로그인 사용자 없음");
      return ResultData.of(0, "로그인이 필요합니다.");
    }

    System.out.println("▶▶▶ freeEnroll: userId=" + user.getId() + ", courseId=" + dto.getCourseId());

    // 서비스 호출
    PaymentResponseDTO result = paymentService.processFreeEnroll(dto, user.getId());

    System.out.println("▶▶▶ processFreeEnroll 반환: success=" + result.isSuccess() + ", message=" + result.getMessage());

    return result.isSuccess()
            ? ResultData.of(1, result.getMessage())
            : ResultData.of(0, result.getMessage());
  }
}