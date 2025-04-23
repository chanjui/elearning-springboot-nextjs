package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.common.config.JwtProvider;
import com.elearning.user.dto.FollowDTO;
import com.elearning.user.dto.Home.UserHomeProfileDTO;
import com.elearning.user.dto.Home.UserHomePostDTO;
import com.elearning.user.service.Home.UserHomeService;
import com.elearning.user.service.login.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user/home")
@RequiredArgsConstructor
public class UserHomeController {

  private final UserHomeService userHomeService;
  private final RequestService requestService;
  private final JwtProvider jwtProvider;


  // 로그인한 사용자 ID 조회 (공통 메서드)
  private Long getLoginUserId() {
    String accessToken = requestService.getCookie("accessToken");
    if (accessToken == null || accessToken.isBlank()) {
      throw new RuntimeException("로그인이 필요합니다.");
    }
    return jwtProvider.getUserId(accessToken);
  }

  // 사용자 프로필 조회
  @GetMapping("/profile/{userId}")
  public ResultData<UserHomeProfileDTO> getUserProfile(@PathVariable Long userId) {
    UserHomeProfileDTO userProfile = userHomeService.getUserProfile(userId);
    return ResultData.of(1, "성공", userProfile);
  }

  // 사용자 게시글(질문 및 답변) 조회
  @GetMapping("/posts/{userId}")
  public ResultData<List<UserHomePostDTO>> getUserPosts(@PathVariable Long userId) {
    List<UserHomePostDTO> posts = userHomeService.getUserPosts(userId);
    return ResultData.of(posts.size(), "성공", posts);
  }

  // 사용자 팔로워 수 조회
  @GetMapping("/followers/count/{userId}")
  public ResultData<Integer> getFollowerCount(@PathVariable Long userId) {
    int count = userHomeService.getFollowerCount(userId);
    return ResultData.of(1, "성공", count);
  }

  // 로그인 사용자가 해당 사용자를 팔로우하고 있는지 + 팔로워 수 함께 조회
  @GetMapping("/follow/status/{userId}")
  public ResultData<FollowDTO> getFollowStatus(@PathVariable Long userId) {
    Long loginUserId = getLoginUserId();
    FollowDTO followInfo = userHomeService.getFollowInfo(loginUserId, userId);
    return ResultData.of(1, "성공", followInfo);
  }

  // 팔로우/언팔로우 토글
  @PostMapping("/follow")
  public ResultData<String> toggleFollow(@RequestBody Map<String, Long> body) {
    Long loginUserId = getLoginUserId();
    Long targetUserId = body.get("targetUserId");

    if (loginUserId.equals(targetUserId)) {
      return ResultData.of(0, "본인은 본인을 팔로우할 수 없습니다.");
    }

    boolean isFollowing = userHomeService.isFollowing(loginUserId, targetUserId);

    if (isFollowing) {
      userHomeService.cancelFollow(loginUserId, targetUserId);
      return ResultData.of(1, "팔로우 취소 성공");
    } else {
      userHomeService.addFollow(loginUserId, targetUserId);
      return ResultData.of(1, "팔로우 성공");
    }
  }

  // 소개글 수정
  @PostMapping("/bio")
  public ResultData<String> updateBio(@RequestBody Map<String, String> body) {
    Long loginUserId = getLoginUserId();
    String bio = body.get("bio");

    userHomeService.updateBio(loginUserId, bio);
    return ResultData.of(1, "소개글 수정 성공");
  }

  // 사용자 ID를 통해 해당 사용자가 강사인지 여부를 확인하는 API
  @GetMapping("/is-instructor/{userId}")
  public ResultData<Boolean> isInstructor(@PathVariable Long userId) {
    boolean isInstructor = userHomeService.checkInstructorStatus(userId);
    return ResultData.of(1, "강사 여부 확인 성공", isInstructor);
  }
}
