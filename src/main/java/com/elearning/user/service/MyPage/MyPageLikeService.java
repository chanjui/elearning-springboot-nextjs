package com.elearning.user.service.MyPage;

import com.elearning.common.ResultData;
import com.elearning.common.entity.LikeTable;
import com.elearning.common.repository.LikeTableRepository;
import com.elearning.course.repository.CourseRepository;
import com.elearning.course.repository.query.CourseRatingQueryRepository;
import com.elearning.instructor.entity.Instructor;
import com.elearning.course.entity.Course;
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

  // 팔로우한 강사 조회
  public List<MyPageLikesDTO> getFollowedInstructors(Long userId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    List<LikeTable> likes = myPageLikeRepository.findByUserAndTypeAndInstructorIsNotNull(user, 2);

    return likes.stream().map(like -> {
      Instructor instructor = like.getInstructor();
      Long followerCount = likeTableRepository.countByInstructorIdAndType(instructor.getId(), 2);

      return MyPageLikesDTO.builder()
        .id(instructor.getId())
        .name(instructor.getUser().getNickname())
        .expertiseName(instructor.getExpertise() != null ? instructor.getExpertise().getName() : null)
        .courseCount(instructor.getDesiredFields() != null ? instructor.getDesiredFields().size() : 0)
        .profileUrl(instructor.getUser().getProfileUrl())
        .rating(null)
        .price(null)
        .discountedPrice(null)
        .level(null)
        .authorName(null)
        .followerCount(followerCount)
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

  // 팔로우한 일반 사용자 조회
  public List<MyPageLikesDTO> getFollowedUsers(Long userId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    List<LikeTable> likes = myPageLikeRepository.findByUserAndTypeAndTargetUserIsNotNull(user, 3);

    return likes.stream().map(like -> {
      User targetUser = like.getTargetUser();
      Long followerCount = likeTableRepository.countByTargetUserIdAndType(targetUser.getId(), 3);

      return MyPageLikesDTO.builder()
        .id(targetUser.getId())
        .name(targetUser.getNickname()) // 유저 닉네임
        .authorName(null) // 강의 아님
        .expertiseName(null) // 강의 아님
        .courseCount(null) // 강의 아님
        .profileUrl(targetUser.getProfileUrl()) // 유저 프로필
        .rating(null) // 평점 없음
        .price(null)
        .discountedPrice(null)
        .level(null)
        .followerCount(followerCount)
        .build();
    }).collect(Collectors.toList());
  }

  // 성공하면 true, 실패하면 false
  @Transactional
  public boolean deleteLike(Long userId, DeleteLikeRequestDTO dto) {
    if (dto.getType() == 1) { // 강의 위시리스트 삭제
      if (!myPageLikeRepository.existsByUserIdAndCourseId(userId, dto.getTargetId())) {
        return false;
      }
      myPageLikeRepository.deleteByUserIdAndCourseId(userId, dto.getTargetId());
      return true;
    } else if (dto.getType() == 2) { // 팔로우 강사 삭제
      if (!myPageLikeRepository.existsByUserIdAndInstructorId(userId, dto.getTargetId())) {
        return false;
      }
      myPageLikeRepository.deleteByUserIdAndInstructorId(userId, dto.getTargetId());
      return true;
    } else if (dto.getType() == 3) { // 팔로우한 사용자 삭제
      if (!myPageLikeRepository.existsByUserIdAndTargetUserId(userId, dto.getTargetId())) {
        return false;
      }
      myPageLikeRepository.deleteByUserIdAndTargetUserId(userId, dto.getTargetId());
      return true;
    }
    return false; // 잘못된 type
  }
}
