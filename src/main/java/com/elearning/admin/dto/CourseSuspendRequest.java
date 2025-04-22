package com.elearning.admin.dto;

import lombok.Data;

@Data
public class CourseSuspendRequest {
  private Long courseId;
  private String reason;
}
