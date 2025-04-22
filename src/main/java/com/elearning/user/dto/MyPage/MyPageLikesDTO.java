package com.elearning.user.dto.MyPage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyPageLikesDTO {
  // 팔로우한 강사/위시리스트 강의 정보를 담는 DTO
  private Long id; // 강사 ID 또는 강의 ID
  private String name; // 강사명 또는 강의명
  private String authorName; // 강사 이름 (강의용)
  private String expertiseName; // 강사의 전문 분야 (강의에서는 null)
  private Integer courseCount; // 강사의 강의 수 (강의에서는 null)
  private String profileUrl; // 썸네일(강사 프로필 또는 강의 썸네일)
  private Double rating; // 평점 (강사 평점 또는 강의 평점)
  private Integer price; // 원래 가격
  private Integer discountedPrice; // 할인 적용된 가격
  private String level; // 난이도 (초급/중급/고급)
  private Long followerCount; // 팔로워 수 (강사/사용자 공통 추가)
  private Boolean isInstructor; // 강사 여부 (true: 강사, false: 일반 사용자)
  private Long instructorId;
}
