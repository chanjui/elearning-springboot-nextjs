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
    try {
      passwordResetService.requestReset(dto);
      return ResultData.of(1, "비밀번호 재설정 링크를 이메일로 보냈습니다.");
    } catch (IllegalStateException e) {
      // 횟수 초과 예외
      return ResultData.of(0, "1시간 내 최대 인증 발송 횟수를 초과했습니다. 1시간 후 다시 시도해주세요.");
    } catch (IllegalArgumentException e) {
      // 이메일 없음 예외
      return ResultData.of(0, e.getMessage());
    } catch (Exception e) {
      return ResultData.of(0, "비밀번호 재설정 요청 중 오류가 발생했습니다.");
    }
  }

  // 비밀번호 재설정 확정 API
  @PostMapping("/confirm")
  public ResultData<String> confirmReset(@RequestBody PasswordResetConfirmDTO dto) {
    passwordResetService.confirmReset(dto);
    return ResultData.of(1, "비밀번호가 성공적으로 변경되었습니다.");
  }
}
