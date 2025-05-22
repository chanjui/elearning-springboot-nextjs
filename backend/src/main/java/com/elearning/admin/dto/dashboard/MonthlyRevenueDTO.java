package com.elearning.admin.dto.dashboard;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class MonthlyRevenueDTO {
  private String month; // "2025.04" 형식
  private BigDecimal revenue;
}
