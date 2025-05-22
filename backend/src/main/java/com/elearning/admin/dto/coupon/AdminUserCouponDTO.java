package com.elearning.admin.dto.coupon;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AdminUserCouponDTO {
  private String id;
  private String name;
  private String email;
  private String role;
  private String status;
}
