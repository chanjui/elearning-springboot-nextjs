package com.elearning.chat.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatUserDTO {

  private Long id;
  private String nickname;
  private String email;
  private String githubLink;
  private String profileUrl;
  private Boolean isInstructor;
}
