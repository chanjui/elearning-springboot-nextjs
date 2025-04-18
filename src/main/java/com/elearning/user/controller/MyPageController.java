package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.user.dto.FindIDPW.PasswordResetRequestDTO;
import com.elearning.user.dto.MyPage.ChangeEmailRequestDTO;
import com.elearning.user.dto.MyPage.ChangePhoneRequestDTO;
import com.elearning.user.dto.MyPage.ProfileUpdateRequestDTO;
import com.elearning.user.entity.User;
import com.elearning.user.service.FindIDPW.PasswordResetService;
import com.elearning.user.service.MyPage.MyPageService;
import com.elearning.user.service.login.RequestService;
import com.elearning.user.service.login.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

  private final MyPageService myPageService;
  private final UserService userService;
  private final RequestService requestService;
  private final PasswordResetService passwordResetService;

  // 로그인한 사용자 ID 조회 (공통 메서드)
  private Long getLoginUserId() {
    String accessToken = requestService.getCookie("accessToken");
    if (accessToken == null || accessToken.isBlank()) {
      throw new RuntimeException("로그인이 필요합니다.");
    }
    return userService.getUserIdFromToken(accessToken);
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
}
