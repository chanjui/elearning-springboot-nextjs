package com.elearning.admin.dto;

import lombok.Data;

@Data
public class UserSuspendRequest {
  private Long userId;
  private String reason;
}
