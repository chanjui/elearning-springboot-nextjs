package com.elearning.user.dto.MyPage;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProfileUpdateRequestDTO {
  private String nickname;
  private String githubLink;
  private String bio;
  private String profileUrl;
}