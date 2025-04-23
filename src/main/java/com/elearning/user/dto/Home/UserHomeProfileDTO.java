package com.elearning.user.dto.Home;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserHomeProfileDTO {
  private Long userId;
  private String nickname;
  private String bio;
  private String githubLink;
  private String profileUrl;
}
