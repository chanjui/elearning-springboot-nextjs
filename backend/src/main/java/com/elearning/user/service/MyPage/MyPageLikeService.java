package com.elearning.user.service.MyPage;

import com.elearning.common.ResultData;
import com.elearning.common.entity.LikeTable;
import com.elearning.common.repository.LikeTableRepository;
import com.elearning.course.repository.CourseRepository;
import com.elearning.course.repository.query.CourseRatingQueryRepository;
import com.elearning.instructor.entity.Instructor;
import com.elearning.course.entity.Course;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.user.dto.MyPage.DeleteLikeRequestDTO;
import com.elearning.user.dto.MyPage.MyPageLikesDTO;
import com.elearning.user.entity.User;
import com.elearning.user.repository.MyPageLikeRepository;
import com.elearning.user.repository.UserRepository;
import com.elearning.user.service.login.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyPageLikeService {

  private final MyPageLikeRepository myPageLikeRepository;
  private final UserRepository userRepository;
  private final CourseRatingQueryRepository courseRatingQueryRepository;
  private final LikeTableRepository likeTableRepository;
  private final InstructorRepository instructorRepository;

  // 팔로우한 사용자(강사 포함) 조회
  public List<MyPageLikesDTO> getFollowedUsers(Long userId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    List<LikeTable> likes = myPageLikeRepository.findByUserAndTypeAndTargetUserIsNotNull(user, 2);

    return likes.stream().map(like -> {
      User targetUser = like.getTargetUser();
      Long followerCount = likeTableRepository.countByTargetUserIdAndType(targetUser.getId(), like.getType());

      // 강사 여부 확인
      boolean isInstructor = Boolean.TRUE.equals(targetUser.getIsInstructor());

      // 강사라면 instructorId 조회
      Long instructorId = null;
      Double rating = null;
      if (isInstructor) {
        instructorId = instructorRepository.findInstructorIdByUserId(targetUser.getId()).orElse(null);
        if (instructorId != null) {
          rating = courseRatingQueryRepository.averageRatingByInstructorId(instructorId);
        }
      }

      return MyPageLikesDTO.builder()
        .id(targetUser.getId())              // 유저 ID
        .instructorId(instructorId)           // 강사 ID (강사만)
        .name(targetUser.getNickname())
        .expertiseName(null)
        .courseCount(null)
        .profileUrl(targetUser.getProfileUrl())
        .rating(rating)                       // 강사 평점 (강사만)
        .price(null)
        .discountedPrice(null)
        .level(null)
        .authorName(null)
        .followerCount(followerCount)
        .isInstructor(isInstructor)           // 강사 여부
        .build();
    }).collect(Collectors.toList());
  }

  // 위시리스트 강의 조회
  public List<MyPageLikesDTO> getWishlistedCourses(Long userId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    List<LikeTable> likes = myPageLikeRepository.findByUserAndTypeAndCourseIsNotNull(user, 1);

    return likes.stream()
      .map(LikeTable::getCourse)
      .filter(course -> course.getStatus() == Course.CourseStatus.ACTIVE) // ACTIVE 상태 강의만 필터링
      .map(course -> {
        double discountRate = course.getDiscountRate() != null ? course.getDiscountRate().doubleValue() : 0.0;
        discountRate = discountRate / 100.0; // 퍼센트 → 소수로 변환
        double discountMultiplier = 1 - discountRate;
        int discountedPrice = (int) (course.getPrice() * discountMultiplier);


        return MyPageLikesDTO.builder()
          .id(course.getId())
          .name(course.getSubject()) // 강의 제목
          .authorName(course.getInstructor().getUser().getNickname()) // 강사 이름
          .expertiseName(null) // 강의에서는 사용 안 함
          .courseCount(null) // 강의에서는 사용 안 함
          .profileUrl(course.getThumbnailUrl()) // 강의 썸네일
          .rating(courseRatingQueryRepository.averageRatingByCourseId(course.getId())) // 평균 평점
          .price(course.getPrice()) // 원래 가격
          .discountedPrice(discountedPrice) // 할인 적용 가격
          .level(course.getTarget()) // 강의 난이도 (초급/중급/고급)
          .build();
      }).collect(Collectors.toList());
  }

  // 좋아요 삭제
  @Transactional
  public boolean deleteLike(Long userId, DeleteLikeRequestDTO dto) {
    if (dto.getType() == 1) { // 강의 위시리스트 삭제
      if (!myPageLikeRepository.existsByUserIdAndCourseId(userId, dto.getTargetId())) {
        return false;
      }
      myPageLikeRepository.deleteByUserIdAndCourseId(userId, dto.getTargetId());
      return true;
    } else if (dto.getType() == 2) { // 팔로우한 사용자 삭제 (type=2 고정)
      if (!myPageLikeRepository.existsByUserIdAndTargetUserId(userId, dto.getTargetId())) {
        return false;
      }
      myPageLikeRepository.deleteByUserIdAndTargetUserId(userId, dto.getTargetId());
      return true;
    }
    return false; // 잘못된 type
  }
}
