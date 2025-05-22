package com.elearning.user.service.Payment;

import com.elearning.course.entity.Course;
import com.elearning.user.dto.Payment.PaymentDetailDTO;
import com.elearning.user.dto.Payment.PurchaseHistoryDTO;
import com.elearning.user.entity.User;
import com.elearning.user.repository.PaymentRepository;
import com.elearning.user.repository.UserRepository;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.exception.IamportResponseException;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseHistoryService {
  private final PaymentRepository paymentRepository;
  private final UserRepository userRepository;

  @Value("${iamport.apiKey}")
  private String apiKey;

  @Value("${iamport.apiSecret}")
  private String apiSecret;

  private IamportClient iamportClient;

  // IamportClient 초기화
  @PostConstruct
  public void init() {
    iamportClient = new IamportClient(apiKey, apiSecret);
  }

  // 사용자의 구매 내역을 조회하는 메서드
  public List<PurchaseHistoryDTO> getPurchaseHistory(Long userId) {
    // 사용자 정보 조회
    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    // 사용자가 구매한 결제 내역을 조회
    List<com.elearning.common.entity.Payment> payments = paymentRepository.findByUser(user);

    // Payment 객체를 PurchaseHistoryDTO로 변환하여 반환
    return payments.stream().map(payment -> {
      Course course = payment.getCourse(); // 결제된 강의 정보
      return PurchaseHistoryDTO.builder()
        .orderId(payment.getId().toString())
        .courseId(course.getId().toString())
        .courseTitle(course.getSubject())
        .instructorName(course.getInstructor().getUser().getNickname())
        .paymentMethod(payment.getPaymentMethod())
        .originalPrice(course.getPrice())
        .discountPrice(payment.getPrice())  // 할인된 가격
        .paymentStatus(payment.getStatus() == 0 ? "결제완료" : "환불완료")
        .paymentDate(payment.getRegDate().toString()) // 결제일자
        .imageUrl(course.getThumbnailUrl()) // 강의 이미지 URL
        .impUid(payment.getImpUid())
        .build();
    }).collect(Collectors.toList());
  }

  // 결제 상세 정보 가져오기
  // 여러 강의 결제 처리 (impUid 기준) – 공통 결제 정보는 첫 번째 Payment에서 가져옵니다.
  public List<PaymentDetailDTO> getPaymentDetailByImpUid(String impUid) throws IamportResponseException, IOException {
    // 1) DB에서 동일 impUid를 가진 모든 결제 조회
    List<com.elearning.common.entity.Payment> payments = paymentRepository.findAllByImpUid(impUid);
    if (payments.isEmpty()) {
      throw new RuntimeException("결제 내역을 찾을 수 없습니다. impUid=" + impUid);
    }
    // 2) 아임포트 API 호출 (impUid 당 한 번 호출)
    IamportResponse<Payment> response = iamportClient.paymentByImpUid(impUid);
    Payment paymentResponse = response.getResponse();
    // 3) 구매자 정보(공통)는 첫번째 Payment에서 가져오기
    User buyer = payments.get(0).getUser();
    // 4) 각 Payment 객체를 PaymentDetailDTO로 매핑
    return payments.stream().map(payment -> {
      Course course = payment.getCourse();
      return PaymentDetailDTO.builder()
        .orderId(String.valueOf(payment.getId()))
        .courseId(course.getId().toString())
        .impUid(payment.getImpUid())
        .courseTitle(course.getSubject())
        .instructor(course.getInstructor().getUser().getNickname())
        .originalPrice(course.getPrice())
        .discountPrice(payment.getPrice())
        .discountAmount(course.getPrice() - payment.getPrice())
        .payMethod(payment.getPaymentMethod())
        .cardName(paymentResponse.getCardName())        // 공통 카드 정보
        .cardNumber(paymentResponse.getCardNumber())      // 공통 카드 정보
        .paymentStatus(payment.getStatus() == 0 ? "결제완료" : "환불완료")
        .paymentDate(payment.getRegDate().toString())
        .imageUrl(course.getThumbnailUrl())
        .pgProvider(paymentResponse.getPgProvider())      // 공통 PG 정보
        .buyerName(buyer.getNickname())                   // 공통 구매자 정보
        .buyerEmail(buyer.getEmail())
        .buyerPhone(buyer.getPhone())
        .build();
    }).collect(Collectors.toList());
  }

  // 여러 강의 결제 처리 (impUid 기준)
  // public List<PaymentDetailDTO> getPaymentDetailByImpUid(String impUid) throws IamportResponseException, IOException {
  //   // 1) DB에서 동일 impUid를 가진 결제 모두 조회
  //   List<com.elearning.common.entity.Payment> payments = paymentRepository.findAllByImpUid(impUid);
  //
  //   if (payments.isEmpty()) {
  //     throw new RuntimeException("결제 내역을 찾을 수 없습니다. impUid=" + impUid);
  //   }
  //
  //   // 2) 아임포트 API는 impUid 한 번만 호출 → 카드/PG 정보 가져오기
  //   IamportResponse<Payment> response = iamportClient.paymentByImpUid(impUid);
  //   Payment iamportPayment = response.getResponse();
  //
  //   // 3) 첫 번째 Payment에서 구매자(User) 정보 추출 → 모든 강의 공통
  //   User buyer = payments.get(0).getUser();
  //
  //   // 4) 각각의 결제 레코드를 DTO로 변환
  //   return payments.stream().map(payment -> {
  //     Course course = payment.getCourse();
  //
  //     return PaymentDetailDTO.builder()
  //       .orderId(String.valueOf(payment.getId()))
  //       .impUid(payment.getImpUid())
  //       .courseTitle(course.getSubject())
  //       .instructor(course.getInstructor().getUser().getNickname())
  //       .originalPrice(course.getPrice())
  //       .discountPrice(payment.getPrice())
  //       .discountAmount(course.getPrice() - payment.getPrice())
  //       .payMethod(payment.getPaymentMethod())
  //       .cardName(iamportPayment.getCardName())        // 모든 강의 공통
  //       .cardNumber(iamportPayment.getCardNumber())    // 모든 강의 공통
  //       .paymentStatus(payment.getStatus() == 0 ? "결제완료" : "환불완료")
  //       .paymentDate(payment.getRegDate().toString())
  //       .imageUrl(course.getThumbnailUrl())
  //       .pgProvider(iamportPayment.getPgProvider())    // 모든 강의 공통
  //       .buyerName(buyer.getNickname())                // 모든 강의 공통
  //       .buyerEmail(buyer.getEmail())                  // 모든 강의 공통
  //       .buyerPhone(buyer.getPhone())                  // 모든 강의 공통
  //       .build();
  //   }).collect(Collectors.toList());
  // }
  //
  //
  // 단일
  // public PaymentDetailDTO getPaymentDetail(String impUid) throws IamportResponseException, IOException {
  //   // 1. DB에서 결제 기록 조회
  //   com.elearning.common.entity.Payment dbPayment = paymentRepository.findByImpUid(impUid)
  //     .orElseThrow(() -> new RuntimeException("결제 내역을 찾을 수 없습니다."));
  //
  //   Course course = dbPayment.getCourse();
  //   User buyer = dbPayment.getUser();
  //
  //   // 2. 아임포트 API 호출
  //   IamportResponse<Payment> response = iamportClient.paymentByImpUid(impUid);
  //   Payment Payment = response.getResponse();
  //
  //   return PaymentDetailDTO.builder()
  //     .orderId(dbPayment.getId().toString())
  //     .impUid(dbPayment.getImpUid())
  //     .courseTitle(course.getSubject())
  //     .instructor(course.getInstructor().getUser().getNickname())
  //     .originalPrice(course.getPrice())
  //     .discountPrice(dbPayment.getPrice())
  //     .discountAmount(course.getPrice() - dbPayment.getPrice())
  //     .payMethod(dbPayment.getPaymentMethod())
  //     .cardName(Payment.getCardName())
  //     .cardNumber(Payment.getCardNumber())
  //     .paymentStatus(dbPayment.getStatus() == 0 ? "결제완료" : "환불완료")
  //     .paymentDate(dbPayment.getRegDate().toString())
  //     .imageUrl(course.getThumbnailUrl())
  //     .pgProvider(Payment.getPgProvider())
  //     .buyerName(buyer.getNickname())
  //     .buyerEmail(buyer.getEmail())
  //     .buyerPhone(buyer.getPhone())
  //     .build();
  // }
}
