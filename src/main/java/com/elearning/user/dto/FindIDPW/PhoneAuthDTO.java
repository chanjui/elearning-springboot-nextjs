package com.elearning.user.dto.FindIDPW;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PhoneAuthDTO {
  private String phone;       // 전화번호
  private String authCode;    // 인증번호 (검증 시 사용)
}
