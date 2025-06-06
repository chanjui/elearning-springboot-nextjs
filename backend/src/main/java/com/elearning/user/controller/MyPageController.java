package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.common.config.JwtProvider;
import com.elearning.user.dto.FindIDPW.PasswordResetRequestDTO;
import com.elearning.user.dto.MyPage.*;
import com.elearning.user.entity.User;
import com.elearning.user.service.FindIDPW.PasswordResetService;
import com.elearning.user.service.MyPage.MyPageLikeService;
import com.elearning.user.service.MyPage.MyCommunityService;
import com.elearning.user.service.MyPage.MyPageService;
import com.elearning.user.service.login.RequestService;
import com.elearning.user.service.login.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

  private final MyPageService myPageService;
  private final MyPageLikeService myPageLikeService;
  private final RequestService requestService;
  private final PasswordResetService passwordResetService;
  private final JwtProvider jwtProvider;
  private final MyCommunityService myCommunityService;

  // 로그인한 사용자 ID 조회 (공통 메서드)
  private Long getLoginUserId() {
    String accessToken = requestService.getCookie("accessToken");
    if (accessToken == null || accessToken.isBlank()) {
      throw new RuntimeException("로그인이 필요합니다.");
    }
    return jwtProvider.getUserId(accessToken);
  }

  // 프로필 수정 (닉네임, 깃허브, 자기소개, 프로필 이미지)
  @PostMapping("/update-profile")
  public ResultData<String> updateProfile(@RequestBody ProfileUpdateRequestDTO updateDTO) {
    Long userId = getLoginUserId(); // 쿠키에서 userId 추출
    return myPageService.updateProfile(userId, updateDTO); // 서비스에서 수정
  }

  // 이메일 변경
  @PostMapping("/update-email")
  public ResultData<String> updateEmail(@RequestBody ChangeEmailRequestDTO dto) {
    Long userId = getLoginUserId();
    return myPageService.updateEmail(userId, dto.getEmail());
  }

  // 연락처 변경
  @PostMapping("/update-phone")
  public ResultData<String> updatePhone(@RequestBody ChangePhoneRequestDTO dto) {
    Long userId = getLoginUserId();
    return myPageService.updatePhone(userId, dto.getPhone());
  }

  // 비밀번호 재설정 링크 발송
  @PostMapping("/send-reset-password-email")
  public ResultData<String> sendResetPasswordEmail() {
    Long userId = getLoginUserId();
    User user = myPageService.findById(userId);

    if (user.getEmail() == null || user.getEmail().isBlank()) {
      return ResultData.of(0, "등록된 이메일이 없습니다.");
    }

    PasswordResetRequestDTO dto = new PasswordResetRequestDTO(user.getEmail());
    passwordResetService.requestReset(dto);

    return ResultData.of(1, "비밀번호 재설정 링크를 이메일로 보냈습니다.");
  }

  // 마이페이지 - 팔로우/위시리스트

  // 팔로우한 사용자 (강사 + 일반 사용자) 리스트 조회
  @GetMapping("/followed-users")
  public ResultData<List<MyPageLikesDTO>> getFollowedUsers() {
    Long userId = getLoginUserId();
    List<MyPageLikesDTO> followedUsers = myPageLikeService.getFollowedUsers(userId);
    return ResultData.of(followedUsers.size(), "팔로우한 사용자 목록 조회 성공", followedUsers);
  }

  // 위시리스트 강의 리스트 조회
  @GetMapping("/wishlisted-courses")
  public ResultData<List<MyPageLikesDTO>> getWishlistedCourses() {
    Long userId = getLoginUserId();
    List<MyPageLikesDTO> wishlistedCourses = myPageLikeService.getWishlistedCourses(userId);
    return ResultData.of(wishlistedCourses.size(), "위시리스트 강의 목록 조회 성공", wishlistedCourses);
  }

  // 좋아요(팔로우/강의) 삭제
  @PostMapping("/delete-like")
  public ResultData<String> deleteLike(@RequestBody DeleteLikeRequestDTO dto) {
    Long userId = getLoginUserId();
    boolean isDeleted = myPageLikeService.deleteLike(userId, dto);

    if (isDeleted) {
      return ResultData.of(1, "삭제했습니다.", null);
    } else {
      return ResultData.of(0, "삭제할 대상을 찾을 수 없습니다.", null);
    }
  }

  // 내가 쓴 게시글
  @GetMapping("/mycommunity/posts")
  public ResultData<?> getMyPosts() {
    Long userId = getLoginUserId();
    return ResultData.of(1, "내가 쓴 게시글 목록", myCommunityService.getMyPosts(userId));
  }

  // 내가 좋아요 누른 글
  @GetMapping("/mycommunity/liked")
  public ResultData<?> getMyLikedPosts() {
    Long userId = getLoginUserId();
    return ResultData.of(1, "좋아요한 게시글 목록", myCommunityService.getMyLikedPosts(userId));
  }

  // 내가 댓글 단 글
  @GetMapping("/mycommunity/commented")
  public ResultData<?> getMyCommentedPosts() {
    Long userId = getLoginUserId();
    return ResultData.of(1, "댓글 작성한 게시글 목록", myCommunityService.getMyCommentedPosts(userId));
  }

  // 내가 쓴 게시글 삭제
  @PostMapping("/mycommunity/posts/{postId}/delete")
  public ResultData<?> deleteMyPost(@PathVariable Long postId) {
    Long userId = getLoginUserId();
    return ResultData.of(1, "게시글 삭제 완료", myCommunityService.deleteMyPost(postId, userId));
  }

  // 내가 댓글 단 게시글의 댓글 삭제
  @PostMapping("/mycommunity/comments/{commentId}/delete")
  public ResultData<?> deleteMyComment(@PathVariable Long commentId) {
    try {
      Long userId = getLoginUserId();
      System.out.println("댓글 삭제 요청 - commentId: " + commentId + ", userId: " + userId);
      boolean result = myCommunityService.deleteMyComment(commentId, userId);
      System.out.println("댓글 삭제 결과: " + result);
      
      if (result) {
        return ResultData.of(1, "댓글 삭제 완료", true);
      } else {
        return ResultData.of(0, "댓글 삭제 실패", false);
      }
    } catch (EntityNotFoundException e) {
      System.out.println("댓글을 찾을 수 없음: " + e.getMessage());
      return ResultData.of(0, "댓글을 찾을 수 없습니다.", false);
    } catch (SecurityException e) {
      System.out.println("권한 없음: " + e.getMessage());
      return ResultData.of(0, e.getMessage(), false);
    } catch (Exception e) {
      System.out.println("댓글 삭제 중 오류 발생: " + e.getMessage());
      e.printStackTrace();
      return ResultData.of(0, "댓글 삭제 중 오류가 발생했습니다.", false);
    }
  }
}
