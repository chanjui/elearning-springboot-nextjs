package com.elearning.admin.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DailyUserRegistrationDTO {
  private int todayCount;
  private String lastUserRegisteredAgo; // "n시간 전"
}
