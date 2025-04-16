package com.elearning.instructor.service;

import com.elearning.common.ResultData;
import com.elearning.common.entity.LikeTable;
import com.elearning.common.repository.LikeTableRepository;
import com.elearning.common.repository.query.LikeTableQueryRepository;
import com.elearning.course.dto.BoardInstructorDTO;
import com.elearning.course.dto.CourseRatingDTO;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.query.BoardQueryRepository;
import com.elearning.course.repository.query.CourseRatingQueryRepository;
import com.elearning.instructor.dto.InstructorDTO;
import com.elearning.instructor.dto.home.InstructorCourseDTO;
import com.elearning.instructor.entity.Expertise;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.ExpertiseRepository;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.instructor.repository.query.InstructorHomeQueryRepository;
import com.elearning.instructor.repository.query.InstructorHomeQueryRepositoryImpl;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InstructorHomeService {

  private final InstructorRepository instructorRepository;
  private final InstructorHomeQueryRepository instructorHomeQueryRepository;
  private final InstructorHomeQueryRepositoryImpl instructorHomeQueryRepositoryImpl;
  private final CourseRatingQueryRepository courseRatingQueryRepository;
  private final BoardQueryRepository boardQueryRepository;
  private final ExpertiseRepository expertiseRepository;
  private final LikeTableRepository likeTableRepository;
  private final LikeTableQueryRepository likeTableQueryRepository;
  private final UserRepository userRepository;


  // 소개글 수정
  @Transactional
  public void updateBio(Long userId, String newBio) {
    Instructor instructor = instructorRepository.findByUserId(userId)
      .orElseThrow(() -> new RuntimeException("강사 정보를 찾을 수 없습니다."));
    instructor.setBio(newBio); // 엔티티 상태 변경
    instructorRepository.save(instructor); // jpa에서 update문 실행
  }

  // 강사 정보 조회
  public InstructorDTO getInstructorProfile(Long instructorId) {
    Instructor instructor = instructorRepository.findById(instructorId)
      .orElseThrow(() -> new RuntimeException("강사를 찾을 수 없습니다."));

    // 전문 분야 조회
    String expertiseName = instructor.getExpertise().getName();
    System.out.println(expertiseName);

    // 총 수강생 수 (모든 강의의 수강 인원 합계)
    Long totalStudents = instructorHomeQueryRepository.countDistinctStudentsByInstructorId(instructorId);

    // 수강평 수, 평균 평점 (CourseRating 쿼리 기반)
    int totalReviews = courseRatingQueryRepository.countRatingsByInstructorId(instructorId);
    double totalRating = courseRatingQueryRepository.averageRatingByInstructorId(instructorId);

    return InstructorDTO.builder()
      .bio(instructor.getBio())
      .nickName(instructor.getUser().getNickname()) // 강사명
      .expertiseName(expertiseName)
      .totalStudents(totalStudents)
      .totalReviews(totalReviews)
      .totalRating(totalRating)
      .build();
  }

  // 강사의 ACTIVE 상태 강의 목록 조회
  public List<InstructorCourseDTO> getActiveCoursesByInstructor(Long instructorId) {
    List<Course> courses = instructorHomeQueryRepository.findActiveCoursesByInstructorId(instructorId);

    return courses.stream()
      .map(course -> {
        // 평균 평점 구하기
        Double averageRating = instructorHomeQueryRepositoryImpl.getAverageRatingForCourse(course.getId());

        // 기술 스택 이름 목록 구하기
        List<String> tags = instructorHomeQueryRepository.getTechStackNamesByCourseId(course.getId());

        return InstructorCourseDTO.builder()
          .courseId(course.getId())
          .subject(course.getSubject())
          .instructor(course.getInstructor().getUser().getNickname())
          .thumbnailUrl(course.getThumbnailUrl())
          .price(course.getPrice())
          .discountRate(course.getDiscountRate())
          .rating(averageRating != null ? averageRating : 0.0)
          .categoryName(course.getCategory().getName())
          .tags(tags)
          .build();
      })
      .collect(Collectors.toList());
  }

  // 수강평 조회
  public List<CourseRatingDTO> getCourseRatings(Long instructorId) {
    return courseRatingQueryRepository.findRatingsByInstructorId(instructorId);
  }

  // 강의 게시글 조회
  public List<BoardInstructorDTO> getInstructorPosts(Long instructorId) {
    return boardQueryRepository.findPostsByInstructorId(instructorId);
  }

  // 전문 분야 수정
  @Transactional
  public void updateExpertise(Long userId, Long expertiseId) {
    Instructor instructor = instructorRepository.findByUserId(userId)
      .orElseThrow(() -> new RuntimeException("강사 정보를 찾을 수 없습니다."));

    Expertise expertise = expertiseRepository.findById(expertiseId)
      .orElseThrow(() -> new RuntimeException("해당 전문 분야가 존재하지 않습니다."));
    instructor.setExpertise(expertise);
    instructorRepository.save(instructor);
  }

  // 강사 팔로우 또는 팔로우 취소 토글
  @Transactional
  public ResultData<String> toggleFollow(Long userId, Long instructorId) {
    // 본인 팔로우 방지
    if (instructorRepository.findById(instructorId).map(i -> i.getUser().getId()).orElse(-1L).equals(userId)) {
      return ResultData.of(0, "본인은 팔로우할 수 없습니다.", null);
    }

    Optional<LikeTable> likeOpt = likeTableRepository.findByUserIdAndInstructorIdAndType(userId, instructorId, 2);

    if (likeOpt.isPresent()) {
      likeTableRepository.delete(likeOpt.get());  // 언팔로우 처리
      return ResultData.of(1, "팔로우 취소 성공", "UNFOLLOWED");
    } else {
      LikeTable follow = new LikeTable();
      follow.setUser(userRepository.getReferenceById(userId));
      follow.setInstructor(instructorRepository.getReferenceById(instructorId));
      follow.setType(2); // type = 2 → 강사 팔로우
      likeTableRepository.save(follow);
      System.out.println("팔로우 저장 실행됨");
      return ResultData.of(1, "팔로우 성공", "FOLLOWED");
    }
  }

  // 강사 팔로우 여부 확인
  public ResultData<Boolean> checkFollowStatus(Long userId, Long instructorId) {
    boolean isFollowing = likeTableQueryRepository.isFollowing(userId, instructorId); // JPQL 기반 쿼리로 변경
    return ResultData.of(1, "조회 성공", isFollowing);
  }

  // 강사 팔로워 수 조회
  public ResultData<Long> getFollowerCount(Long instructorId) {
    Long count = likeTableRepository.countByInstructorIdAndType(instructorId, 2);
    return ResultData.of(1, "팔로워 수 조회 성공", count);
  }
}
