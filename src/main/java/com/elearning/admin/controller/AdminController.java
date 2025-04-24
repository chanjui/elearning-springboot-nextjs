package com.elearning.admin.controller;

import com.elearning.admin.dto.*;
import com.elearning.admin.dto.coupon.AdminCouponInfoDTO;
import com.elearning.admin.dto.coupon.CouponRequestDTO;
import com.elearning.admin.dto.coupon.DistributeCouponRequestDTO;
import com.elearning.admin.dto.dashboard.AdminDashboardDTO;
import com.elearning.admin.dto.sales.DashboardDTO;
import com.elearning.admin.service.AdminCouponService;
import com.elearning.admin.service.AdminDashboardService;
import com.elearning.admin.service.AdminUserService;
import com.elearning.common.ResultData;
import com.elearning.course.dto.CourseParticular.CourseInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
  private final String msg = "success";
  private final AdminUserService adminUserService;
  private final AdminDashboardService adminDashboardService;
  private final AdminCouponService adminCouponService;

  @GetMapping("/user")
  public ResultData<List<AdminUserDTO>> getCourseParticular() {
    return ResultData.of(1, msg, adminUserService.getAllUsersWithCourses());
  }

  @PostMapping("/delUser")
  public ResultData<Boolean> delUser(@RequestBody UserSuspendRequest request) {
    Long userId = request.getUserId();
    String reason = request.getReason();

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String adminId = authentication != null ? authentication.getName() : null;

    if (adminId == null) {
      return ResultData.of(-1, "관리자 인증 정보가 없습니다.", false);
    }

    System.out.println("🔐 관리자 ID: " + adminId + " 에 의해 계정 정지 요청");

    // 유저 정지 처리
    boolean success = adminUserService.deactivateUser(userId, reason, adminId);

    String msg = success ? "계정을 성공적으로 정지했습니다." : "계정 정지에 실패했습니다.";
    return ResultData.of(success ? 1 : -1, msg, success);
  }

  @PostMapping("/delCourse")
  public ResultData<Boolean> delCourse(@RequestBody CourseSuspendRequest request) {
    Long courseId = request.getCourseId();
    String reason = request.getReason();

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String adminId = authentication != null ? authentication.getName() : null;

    if (adminId == null) {
      return ResultData.of(-1, "관리자 인증 정보가 없습니다.", false);
    }

    System.out.println("🔐 관리자 ID: " + adminId + " 에 의해 계정 정지 요청");

    // 유저 정지 처리
    boolean success = adminDashboardService.deactivateCourse(courseId, reason, adminId);

    String msg = success ? "계정을 성공적으로 정지했습니다." : "계정 정지에 실패했습니다.";
    return ResultData.of(success ? 1 : -1, msg, success);
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

  @PostMapping("/review")
  public ResultData<Boolean> getReviewCourse(@RequestBody CourseReviewRequest request) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String adminId = authentication != null ? authentication.getName() : null;

    if (adminId == null) {
      return ResultData.of(-1, "관리자 인증 정보가 없습니다.", false);
    }

    System.out.println("🔐 관리자 ID: " + adminId + " 에 의해 강의 리뷰 요청");

    // 유저 정지 처리
    boolean success = adminDashboardService.reviewCourse(request, adminId);

    String msg = success ? "강의를 성공적으로 리뷰했습니다." : "강의 리뷰에 실패했습니다.";
    return ResultData.of(success ? 1 : -1, msg, success);
  }

  @GetMapping("/sales")
  public ResultData<DashboardDTO> getSales() {
    return ResultData.of(1, msg, adminDashboardService.getSalesDashboard());
  }

  @GetMapping("/coupon")
  public ResultData<AdminCouponInfoDTO> getCoupon() {
    return ResultData.of(1, msg, adminCouponService.getAdminCouponInfo());
  }

  @PostMapping("/addCoupon")
  public ResultData<Boolean> addCoupon(@RequestBody CouponRequestDTO dto) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String adminId = authentication != null ? authentication.getName() : null;

    if (adminId == null) {
      return ResultData.of(-1, "관리자 인증 정보가 없습니다.", false);
    }

    boolean success = adminCouponService.createCoupon(dto, adminId);
    return ResultData.of(1, msg, success);
  }

  @PostMapping("/Distribute")
  public ResultData<Boolean> distributeCoupon(@RequestBody DistributeCouponRequestDTO dto) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String adminId = authentication != null ? authentication.getName() : null;

    if (adminId == null) {
      return ResultData.of(-1, "관리자 인증 정보가 없습니다.", false);
    }

    boolean success = adminCouponService.distributeCouponToUsers(dto, adminId);
    return ResultData.of(1, "쿠폰이 성공적으로 배포되었습니다.", success);
  }

}
