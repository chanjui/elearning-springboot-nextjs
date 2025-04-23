package com.elearning.user.repository;

import com.elearning.user.dto.Home.UserHomePostDTO;
import com.elearning.user.dto.Home.UserHomeProfileDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserHomeRepository {
  // 사용자 프로필 조회
  UserHomeProfileDTO findUserProfile(Long userId);

  // 질문 및 답변 게시글만 조회
  List<UserHomePostDTO> findUserPosts(Long userId);

  // 팔로워 수 조회 (type = 2, targetUser 기준)
  int countFollowers(Long userId);

  // 팔로우 상태 조회 (type = 2, fromUser → targetUser)
  boolean isFollowing(Long loginUserId, Long targetUserId);
}
