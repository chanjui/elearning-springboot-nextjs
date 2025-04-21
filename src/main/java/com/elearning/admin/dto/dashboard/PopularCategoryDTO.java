package com.elearning.admin.dto.dashboard;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PopularCategoryDTO {
  private String categoryName;
  private int usageRate; // %
}
