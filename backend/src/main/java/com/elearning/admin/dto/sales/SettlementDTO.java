package com.elearning.admin.dto.sales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SettlementDTO {
  private String id;
  private String instructor;
  private String email;
  private int courses; // 강의 수
  private BigDecimal totalSales;
  private BigDecimal commission;
  private BigDecimal amount;
  private String status;
  private LocalDate date;
}
