package com.elearning.user.dto.FindIDPW;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetRequestDTO {
  // 비밀번호 재설정 요청 시, 사용자가 입력한 이메일 정보를 담는 DTO
  private String email;
}
