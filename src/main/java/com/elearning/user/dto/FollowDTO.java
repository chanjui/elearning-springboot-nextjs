package com.elearning.user.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowDTO { // 팔로우 요청 시 사용하는 DTO
  // private boolean isFollowing;
  // private long followerCount;
  // private boolean isMyPage; // 내가 내 프로필을 보는지 여부

  private Long instructorId; // 팔로우 대상 강사 ID
  private boolean isfollowing; // 팔로우 여부 (true: 팔로우한 상태, false: 팔로우하지 않은 상태)
  private int followerCount; // 해당 강사의 팔로워 수
}
