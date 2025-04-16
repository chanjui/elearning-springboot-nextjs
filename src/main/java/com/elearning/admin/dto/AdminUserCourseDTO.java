package com.elearning.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AdminUserCourseDTO {
  private Long courseId;
  private String subject;
  private String thumbnailUrl;
  private BigDecimal progress;
  private boolean completionStatus;
}
