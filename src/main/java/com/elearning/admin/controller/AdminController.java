package com.elearning.admin.controller;

import com.elearning.admin.dto.AdminUserDTO;
import com.elearning.admin.dto.CourseSummaryDTO;
import com.elearning.admin.dto.PendingCourseDTO;
import com.elearning.admin.dto.dashboard.AdminDashboardDTO;
import com.elearning.admin.dto.sales.DashboardDTO;
import com.elearning.admin.service.AdminDashboardService;
import com.elearning.admin.service.AdminUserService;
import com.elearning.common.ResultData;
import com.elearning.course.dto.CourseParticular.CourseInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
  private final String msg = "success";
  private final AdminUserService adminUserService;
  private final AdminDashboardService adminDashboardService;

  @GetMapping("/user")
  public ResultData<List<AdminUserDTO>> getCourseParticular() {
    return ResultData.of(1, msg, adminUserService.getAllUsersWithCourses());
  }

  @PostMapping("/delUser/{userId}")
  public ResultData<Boolean> delUser(@PathVariable Long userId) {
    return ResultData.of(1, msg, adminUserService.deactivateUser(userId));
  }

  @GetMapping("/dashboard")
  public ResultData<AdminDashboardDTO> getDashboard() {
    return ResultData.of(1, msg, adminDashboardService.getDashboardSummary());
  }

  @GetMapping("/course")
  public ResultData<List<CourseSummaryDTO>> getCourse() {
    return ResultData.of(1, msg, adminDashboardService.getAllCourses());
  }

  @GetMapping("/course/{courseId}")
  public ResultData<CourseInfoDTO> getCourse(@PathVariable Long courseId) {
    return ResultData.of(1, msg, adminDashboardService.getCourseParticular(courseId));
  }

  @GetMapping("/pending")
  public ResultData<List<PendingCourseDTO>> getPendingCourses() {
    return ResultData.of(1, msg, adminDashboardService.getPendingCourses());
  }

  @GetMapping("/sales")
  public ResultData<DashboardDTO> getSales() {
    return ResultData.of(1, msg, adminDashboardService.getSalesDashboard());
  }
}
