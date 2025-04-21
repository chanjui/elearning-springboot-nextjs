package com.elearning.admin.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecentCourseDTO {
  private String courseTitle;
  private String instructorName;
  private String registeredAgo; // "n시간 전"
}
