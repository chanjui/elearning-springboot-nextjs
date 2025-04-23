package com.elearning.admin.dto.coupon;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CouponRequestDTO {

  private String code;             // 쿠폰 코드
  private String name;             // 쿠폰 이름
  private Integer value;           // 할인 금액 또는 퍼센트
  private LocalDate expiryDate; // 만료일
  private Long courseId;           // 해당 쿠폰이 적용될 수업 ID (nullable)

}
