package com.elearning.user.dto.FindIDPW;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SmsRequestDTO {
  private String to;      // 받는 사람 전화번호 (01012345678)
  private String content; // 보낼 내용
}
