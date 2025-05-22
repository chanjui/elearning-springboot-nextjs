package com.elearning.user.dto.FindIDPW;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PasswordResetConfirmDTO {
  //재설정 링크 클릭 후 새 비밀번호를 설정할 때 사용하는 DTO
  private String token;
  private String newPassword;
}
