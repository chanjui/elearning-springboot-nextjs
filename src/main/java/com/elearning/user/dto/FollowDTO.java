package com.elearning.user.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FollowDTO { // 팔로우 요청 시 사용하는 DTO
  private Long targetUserId;    // 팔로우 대상 사용자 ID
  private boolean isFollowing; // 팔로우 여부
  private int followerCount;    // 팔로워 수
}
