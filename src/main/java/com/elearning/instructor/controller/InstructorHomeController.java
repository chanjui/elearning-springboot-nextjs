package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.common.config.JwtProvider;
import com.elearning.course.dto.BoardInstructorDTO;
import com.elearning.course.dto.CourseRatingDTO;
import com.elearning.instructor.dto.InstructorDTO;
import com.elearning.instructor.dto.home.BioUpeateRequestDTO;
import com.elearning.instructor.dto.home.ExpertiseUpdateDTO;
import com.elearning.instructor.dto.home.InstructorCourseDTO;
import com.elearning.instructor.service.InstructorHomeService;
import com.elearning.user.dto.FollowDTO;
import com.elearning.user.service.login.RequestService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/instructor/home")
@RequiredArgsConstructor
public class InstructorHomeController {

  private final InstructorHomeService instructorHomeService;
  private final JwtProvider jwtProvider;
  private final RequestService requestService;

  // 로그인한 사용자 ID 조회 (accessToken -> userId 추출)
  private Long getLoginUserId() {
    String accessToken = requestService.getCookie("accessToken");
    if (accessToken == null || accessToken.isBlank()) {
      throw new RuntimeException("로그인이 필요합니다.");
    }
    return jwtProvider.getUserId(accessToken);
  }

  // 강사 정보 조회 API
  @GetMapping("/profile/{instructorId}")
  public InstructorDTO getInstructorProfile(@PathVariable Long instructorId) {
    return instructorHomeService.getInstructorProfile(instructorId);
  }

  // 강사의 ACTIVE 상태 강의 목록 조회 API
  @GetMapping("/courses/{instructorId}")
  public ResultData<List<InstructorCourseDTO>> getActiveCoursesByInstructor(@PathVariable Long instructorId) {
    List<InstructorCourseDTO> courses = instructorHomeService.getActiveCoursesByInstructor(instructorId);
    return ResultData.of(1, "성공", courses);
  }

  // 강사 소개글 수정
  @PostMapping("/bio")
  public ResultData<String> updateBio(@RequestBody BioUpeateRequestDTO bioUpeateRequestDTO) {
    Long userId = getLoginUserId();
    instructorHomeService.updateBio(userId, bioUpeateRequestDTO.getBio());
    return ResultData.of(1, "소개글이 성공적으로 수정되었습니다.");
  }

  // 강사 수강평 조회
  @GetMapping("/reviews/{instructorId}")
  public ResultData<List<CourseRatingDTO>> getInstructorReviews(@PathVariable Long instructorId) {
    List<CourseRatingDTO> reviews = instructorHomeService.getCourseRatings(instructorId);
    return ResultData.of(1, "성공", reviews);
  }

  // 강사 강의 게시물 조회
  @GetMapping("/posts/{instructorId}")
  public ResultData<List<BoardInstructorDTO>> getInstructorPosts(@PathVariable Long instructorId) {
    List<BoardInstructorDTO> posts = instructorHomeService.getInstructorPosts(instructorId);
    return ResultData.of(1, "성공", posts);
  }

  // 전문 분야 수정
  @PostMapping("/expertise")
  public ResultData<String> updateExpertise(@RequestBody ExpertiseUpdateDTO dto) {
    Long userId = getLoginUserId();
    instructorHomeService.updateExpertise(userId, dto.getExpertiseId());
    return ResultData.of(1, "전문 분야가 성공적으로 수정되었습니다.");
  }

  // 사용자 팔로우 추가 또는 취소
  @PostMapping("/follow")
  public ResultData<String> followOrUnfollow(@RequestBody FollowDTO followDTO) {
    Long userId = getLoginUserId();
    return instructorHomeService.toggleFollow(userId, followDTO.getTargetUserId());
  }

  // 로그인 사용자가 해당 사용자를 팔로우하고 있는지 확인
  @GetMapping("/follow/status/{targetUserId}")
  public ResultData<Boolean> checkFollowStatus(@PathVariable Long targetUserId) {
    Long userId = getLoginUserId();
    return instructorHomeService.checkFollowStatus(userId, targetUserId);
  }

  // 사용자의 팔로워 수 조회
  @GetMapping("/followers/count/{targetUserId}")
  public ResultData<Long> getFollowerCount(@PathVariable Long targetUserId) {
    return instructorHomeService.getFollowerCount(targetUserId);
  }

  // 사용자 ID로 instructor ID 반환
  @GetMapping("/id-by-user/{userId}")
  public ResultData<Long> getInstructorIdByUserId(@PathVariable Long userId) {
    Optional<Long> instructorIdOpt = instructorHomeService.findInstructorIdByUserId(userId);
    if (instructorIdOpt.isEmpty()) {
      return ResultData.of(0, "강사 정보 없음");
    }
    return ResultData.of(1, "강사 ID 조회 성공", instructorIdOpt.get());
  }

}
