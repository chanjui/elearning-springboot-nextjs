package com.elearning.admin.dto.coupon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminCouponInfoDTO {
  private List<AdminCouponDTO> coupons;        // AdminCouponDTO 리스트
  private List<AdminUserCouponDTO> userCoupons; // AdminUserCouponDTO 리스트
}
