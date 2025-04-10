package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.common.config.JwtProvider;
import com.elearning.course.dto.BoardInstructorDTO;
import com.elearning.course.dto.CourseRatingDTO;
import com.elearning.instructor.dto.ExpertiseDTO;
import com.elearning.instructor.dto.InstructorDTO;
import com.elearning.instructor.dto.home.BioUpeateRequestDTO;
import com.elearning.instructor.dto.home.ExpertiseUpdateDTO;
import com.elearning.instructor.dto.home.InstructorCourseDTO;
import com.elearning.instructor.service.InstructorHomeService;
import com.elearning.user.dto.FollowDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/instructor/home")
@RequiredArgsConstructor
public class InstructorHomeController {

  private final InstructorHomeService instructorHomeService;
  private final JwtProvider jwtProvider;

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
  public ResultData<String> updateBio(@RequestBody BioUpeateRequestDTO bioUpeateRequestDTO, HttpServletRequest request) {
    // 인증된 사용자 정보에서 userId 꺼내기
    Long userId = Long.valueOf(String.valueOf(request.getAttribute("userId")));
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
  public ResultData<String> updateExpertise(@RequestBody ExpertiseUpdateDTO dto, HttpServletRequest request) {
    Long userId = Long.valueOf(String.valueOf(request.getAttribute("userId")));
    instructorHomeService.updateExpertise(userId, dto.getExpertiseId());
    return ResultData.of(1, "전문 분야가 성공적으로 수정되었습니다.");
  }

  // 강사 팔로우 추가 또는 취소
  @PostMapping("/follow")
  public ResultData<String> followOrUnfollowInstructor(@RequestBody FollowDTO followDTO, HttpServletRequest request) {
    Long userId = Long.valueOf(String.valueOf(request.getAttribute("userId")));
    return instructorHomeService.toggleFollow(userId, followDTO.getInstructorId());
  }

  // 강사 팔로우 여부 확인
  @GetMapping("/follow/status/{instructorId}")
  public ResultData<Boolean> checkFollowStatus(@PathVariable Long instructorId, HttpServletRequest request) {
    Long userId = Long.valueOf(String.valueOf(request.getAttribute("userId")));
    return instructorHomeService.checkFollowStatus(userId, instructorId);
  }

  // 강사의 팔로워 수 조회
  @GetMapping("/followers/count/{instructorId}")
  public ResultData<Long> getFollowerCount(@PathVariable Long instructorId) {
    return instructorHomeService.getFollowerCount(instructorId);
  }

}
