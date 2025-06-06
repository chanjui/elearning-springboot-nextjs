package com.elearning.admin.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RecentActivityDTO {
  private DailyUserRegistrationDTO userRegistrations;
  private RecentCourseDTO recentCourse;
}
