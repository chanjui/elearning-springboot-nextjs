package com.elearning.user.service.Payment;

import com.elearning.common.config.JwtProvider;
import com.elearning.common.entity.PaymentHistory;
import com.elearning.user.dto.Payment.PaymentResponseDTO;
import com.elearning.user.entity.CouponUserMapping;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.repository.CouponUserMappingRepository;
import com.elearning.user.repository.CourseEnrollmentRepository;
import com.elearning.user.repository.PaymentHistoryRepository;
import com.elearning.user.repository.PaymentRepository;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment; // 아임포트의 Payment 클래스
import com.siot.IamportRestClient.request.CancelData;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentRefundService {
  private static final Logger logger = LoggerFactory.getLogger(PaymentRefundService.class);

  private final JwtProvider jwtProvider;
  private final PaymentRepository paymentRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CouponUserMappingRepository couponUserMappingRepository;
  private final PaymentHistoryRepository paymentHistoryRepository;

  @Value("${iamport.apiKey}")
  private String apiKey;

  @Value("${iamport.apiSecret}")
  private String apiSecret;

  private IamportClient iamportClient;

  @PostConstruct
  public void init() {
    iamportClient = new IamportClient(apiKey, apiSecret);
    logger.info("IamportClient (refund) initialized with apiKey: {} and apiSecret: [PROTECTED]", apiKey);
  }

  /**
   * 결제 취소(환불) 메서드
   *
   * @param impUid       결제 내역을 식별할 impUid (Payment 테이블의 고유 식별 값)
   * @param cancelAmount 환불 금액 (전체 환불이면 결제 금액과 동일)
   * @param jwtToken     사용자 JWT 토큰 (추가 인증 처리에 활용 가능)
   * @return 결제 취소 결과를 담은 PaymentResponseDTO
   */
  public PaymentResponseDTO cancelPayment(String impUid,
                                          BigDecimal cancelAmount,
                                          String jwtToken) {
    try {
      // 1. DB에서 결제 내역 조회
      List<com.elearning.common.entity.Payment> payments = paymentRepository.findAllByImpUid(impUid);

      if (payments.isEmpty()) {
        logger.error("결제 내역을 찾을 수 없습니다. impUid={}", impUid);
        return new PaymentResponseDTO(false, "결제 내역을 찾을 수 없습니다. impUid=" + impUid, null);
      }

      // 2. Iamport API 호출 시도
      try {
        CancelData cancelData = new CancelData(impUid, true, cancelAmount);
        IamportResponse<Payment> cancelResponse = iamportClient.cancelPaymentByImpUid(cancelData);
        Payment refundResult = cancelResponse.getResponse();
        logger.info("Iamport refund response: {}", refundResult);

        if (refundResult != null && "cancelled".equalsIgnoreCase(refundResult.getStatus())) {
          logger.info("Iamport API를 통한 환불 성공");
        } else {
          logger.warn("Iamport API 환불 실패 또는 이미 환불된 결제. DB 상태만 업데이트 진행");
        }
      } catch (IamportResponseException e) {
        // Iamport API 오류 발생 시에도 계속 진행
        logger.warn("Iamport API 오류 발생: {}. DB 상태만 업데이트 진행", e.getMessage());
      }

      // 3. DB 상태 업데이트
      boolean anyUpdated = false;
      for (com.elearning.common.entity.Payment paymentRecord : payments) {
        // 이미 취소된 결제는 건너뛰기
        if (paymentRecord.getStatus() == 1) {
          continue;
        }

        // 쿠폰 복원 처리
        restoreCoupon(paymentRecord);

        // 정산 이력 무효화
        List<PaymentHistory> histories = paymentHistoryRepository.findByPaymentId(paymentRecord.getId());
        for (PaymentHistory h : histories) {
          paymentHistoryRepository.delete(h);
        }

        paymentRecord.setStatus(1);  // 1: 결제 취소
        paymentRecord.setCancelDate(LocalDateTime.now());
        paymentRepository.save(paymentRecord);
        logger.info("Payment record updated for refund: {}", paymentRecord);
        anyUpdated = true;

        // 관련 수강 등록 업데이트
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findAllByPaymentId(paymentRecord.getId());
        for (CourseEnrollment enrollment : enrollments) {
          enrollment.setDel(true);  // 수강 취소 상태로 변경
          courseEnrollmentRepository.save(enrollment);
          logger.info("Course enrollment marked as deleted: {}", enrollment);
        }
      }

      if (anyUpdated) {
        return new PaymentResponseDTO(true, "환불이 성공적으로 처리되었습니다.", null);
      } else {
        return new PaymentResponseDTO(false, "이미 환불 처리된 결제입니다.", null);
      }

    } catch (Exception e) {
      logger.error("환불 처리 중 예외 발생: ", e);
      return new PaymentResponseDTO(false, "환불 처리 중 오류가 발생했습니다: " + e.getMessage(), null);
    }
  }

  private void restoreCoupon(com.elearning.common.entity.Payment paymentRecord) {
    CouponUserMapping mapping = paymentRecord.getCouponUserMapping();
    if (mapping != null) {
      mapping.setIsDel(false);
      mapping.setUseDate(null);
      couponUserMappingRepository.save(mapping);
      logger.info("쿠폰 복원 완료: couponMappingId={}", mapping.getId());
    }
  }
}