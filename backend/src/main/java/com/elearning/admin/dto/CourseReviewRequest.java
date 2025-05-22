package com.elearning.admin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseReviewRequest {
  private Long courseId;
  private String action; // "approve" 또는 "reject"
  private String feedback;
}

