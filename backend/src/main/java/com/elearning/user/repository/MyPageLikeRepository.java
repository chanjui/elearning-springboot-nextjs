package com.elearning.user.repository;

import com.elearning.common.entity.LikeTable;
import com.elearning.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// 마이페이지용 LikeTable 조회 리포지토리
@Repository
public interface MyPageLikeRepository extends JpaRepository<LikeTable, Long> {

  // 위시리스트에 추가한 강의 리스트 조회
  List<LikeTable> findByUserAndTypeAndCourseIsNotNull(User user, Integer type);

  // 팔로우한 일반 사용자 리스트 조회
  List<LikeTable> findByUserAndTypeAndTargetUserIsNotNull(User user, Integer type);

  void deleteByUserIdAndCourseId(Long userId, Long courseId); // 삭제용

  void deleteByUserIdAndTargetUserId(Long userId, Long targetUserId);

  boolean existsByUserIdAndCourseId(Long userId, Long courseId); //존재 여부 확인용

  boolean existsByUserIdAndTargetUserId(Long userId, Long targetUserId);
}
