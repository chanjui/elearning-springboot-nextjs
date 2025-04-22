package com.elearning.admin.dto.coupon;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminCouponDTO {
  private Long id;
  private String code;
  private String name;
  private int value;
  private String courseId;         // null 이면 전체 강의 적용
  private String courseName;       // null 이면 전체 강의
  private LocalDate expiryDate;
  private String status;           // "active" 또는 "expired"
  private LocalDate createdAt;
}
