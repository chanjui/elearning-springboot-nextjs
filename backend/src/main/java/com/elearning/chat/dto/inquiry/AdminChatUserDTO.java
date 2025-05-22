package com.elearning.chat.dto.inquiry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 사용자 정보 공통 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminChatUserDTO {
  private Long id;
  private String name;
  private String email;
  private String avatarUrl;
}
