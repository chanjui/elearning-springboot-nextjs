package com.elearning.admin.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecentSaleDTO {
  private String courseTitle;      // 강의 제목
  private Long purchaserId;        // 결제한 사람 아이디
  private String purchaserName;    // 결제한 사람 이름
  private String profileImg;       // 결제한 사람 프로필 이미지
  private int price;               // 결제 금액
  private String purchasedAt;      // 결제 시간 (예: "2시간 전")
}
