package com.elearning.admin.dto.coupon;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DistributeCouponRequestDTO {
  private Long couponId;
  private List<Long> userIds;
  private String message;

}
