package com.elearning.admin.dto.sales;

import com.elearning.admin.dto.dashboard.MonthlyRevenueDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {

  // 매출 관련
  private BigDecimal totalRevenue;
  private double totalRevenueGrowth;

  private BigDecimal currentMonthRevenue;
  private double currentMonthGrowth;

  // 정산 관련
  private BigDecimal expectedSettlementAmount;
  private int expectedSettlementCount;

  // 수수료 수익
  private BigDecimal commissionRevenue;
  private double commissionGrowth;

  // 통계 지표
  private BigDecimal averageCoursePrice;
  private BigDecimal averagePurchaseAmount;
  private double repurchaseRate; // %
  private double refundRate;     // %

  // 상세 데이터
  private List<MonthlyRevenueDTO> revenueData;
  private List<CategoryRevenueDTO> categoryRevenueData;
  private List<PaymentDTO> paymentData;
  private List<SettlementDTO> settlementData;
}