package com.elearning.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminUserCourseDTO {
  private Long courseId;
  private String subject;
  private BigDecimal progress;
  private LocalDateTime regDate;
  private boolean completionStatus;
}
