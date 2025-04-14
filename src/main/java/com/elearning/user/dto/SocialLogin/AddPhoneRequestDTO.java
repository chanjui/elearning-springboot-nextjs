package com.elearning.user.dto.SocialLogin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class AddPhoneRequestDTO {
  private String phone;
}
