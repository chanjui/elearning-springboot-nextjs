package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.user.dto.FindIDPW.PasswordResetConfirmDTO;
import com.elearning.user.dto.FindIDPW.PasswordResetRequestDTO;
import com.elearning.user.service.FindIDPW.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/password")
public class PasswordResetController {

  private final PasswordResetService passwordResetService;

  // 비밀번호 재설정 이메일 요청 API
  @PostMapping("/request")
  public ResultData<String> requestReset(@RequestBody PasswordResetRequestDTO dto) {
    passwordResetService.requestReset(dto);
    return ResultData.of(1, "비밀번호 재설정 링크를 이메일로 보냈습니다.");
  }

  // 비밀번호 재설정 확정 API
  @PostMapping("/confirm")
  public ResultData<String> confirmReset(@RequestBody PasswordResetConfirmDTO dto) {
    passwordResetService.confirmReset(dto);
    return ResultData.of(1, "비밀번호가 성공적으로 변경되었습니다.");
  }
}
