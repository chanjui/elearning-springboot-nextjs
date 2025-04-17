package com.elearning.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminDashboardDTO {
  private long totalRevenue;

  private int totalUsers;
  private int userIncreaseFromLastWeek;

  private int totalCourses;
  private int courseIncreaseFromLastWeek;

  private int unresolvedInquiries;
  private int inquiryIncreaseFromLastWeek;

  private List<MonthlyRevenueDTO> monthlyRevenueOverview;
  private List<RecentSaleDTO> recentSales;

  private int pendingCourse;
  private List<PopularCategoryDTO> popularCategories;

  private RecentActivityDTO recentActivity;

}



