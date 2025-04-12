package com.elearning.common.repository;

import com.elearning.common.entity.LikeTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeTableRepository extends JpaRepository<LikeTable, Long> {
  // 특정 유저가 강사를 팔로우했는지 조회
  Optional<LikeTable> findByUserIdAndInstructorIdAndType(Long userId, Long instructorId, Integer type);
  Optional<LikeTable> findByCourseIdAndUserId(Long courseId, Long userId);

  // 팔로우 여부 boolean 반환
  boolean existsByUserIdAndInstructorIdAndType(Long userId, Long instructorId, Integer type);

  // 팔로워 수 조회
  Long countByInstructorIdAndType(Long instructorId, Integer type);
  boolean existsByCourseIdAndUserId(Long courseId, Long userId);
}
