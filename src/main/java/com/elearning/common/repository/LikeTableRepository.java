package com.elearning.common.repository;

import com.elearning.common.entity.LikeTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeTableRepository extends JpaRepository<LikeTable, Long> {
  // 특정 사용자가 특정 사용자를 팔로우했는지 조회
  Optional<LikeTable> findByUserIdAndTargetUserIdAndType(Long userId, Long targetUserId, Integer type);

  // 강의 좋아요 여부 확인
  Optional<LikeTable> findByCourseIdAndUserId(Long courseId, Long userId);

  // 팔로우 여부 boolean 반환
  boolean existsByUserIdAndTargetUserIdAndType(Long userId, Long targetUserId, Integer type);

  // 팔로워 수 조회 (사용자)
  Long countByTargetUserIdAndType(Long targetUserId, Integer type);

  // 언팔로우용 (삭제)
  void deleteByUserIdAndTargetUserIdAndType(Long userId, Long targetUserId, Integer type);

  boolean existsByCourseIdAndUserId(Long courseId, Long userId);
}
