package com.elearning.admin.dto.sales;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
  private String id;
  private String user;
  private String email;
  private String course;
  private BigDecimal amount;
  private String status;
  private LocalDateTime date;
  private String method;
}
