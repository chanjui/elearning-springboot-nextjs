package com.elearning.admin.service;

import com.elearning.admin.dto.coupon.*;
import com.elearning.admin.entity.Admin;
import com.elearning.admin.entity.AdminLog;
import com.elearning.admin.repository.AdminLogRepository;
import com.elearning.admin.repository.AdminRepository;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRepository;
import com.elearning.user.entity.Coupon;
import com.elearning.user.entity.CouponUserMapping;
import com.elearning.user.entity.User;
import com.elearning.user.repository.CouponRepository;
import com.elearning.user.repository.CouponUserMappingRepository;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminCouponService {
  private final CouponRepository couponRepository;
  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final AdminRepository adminRepository;
  private final AdminLogRepository adminLogRepository;
  private final CouponUserMappingRepository couponUserMappingRepository;

  public List<AdminCouponDTO> getAllCoupons() {
    List<Coupon> coupons = couponRepository.findAll();

    return coupons.stream()
      .map(coupon -> AdminCouponDTO.builder()
        .id(coupon.getId())
        .code(coupon.getCode())
        .name(coupon.getName())
        .value(coupon.getDiscount())
        .courseId(coupon.getCourse() != null ? coupon.getCourse().getId().toString() : null)
        .courseName(coupon.getCourse() != null ? coupon.getCourse().getSubject() : null)
        .expiryDate(coupon.getExpiryDate().toLocalDate())
        .status(coupon.getExpiryDate().isBefore(LocalDateTime.now()) ? "expired" : "active")
        .createdAt(coupon.getRegDate().toLocalDate())
        .build())
      .collect(Collectors.toList());
  }

  public List<AdminUserCouponDTO> getAllUsersForCoupon() {
    return userRepository.findAll().stream()
      .map(user -> new AdminUserCouponDTO(
        String.valueOf(user.getId()),
        user.getNickname(),
        user.getEmail(),
        user.getIsInstructor() ? "instructor" : "student",
        user.getIsDel() ? "inactive" : "active"
      ))
      .collect(Collectors.toList());
  }

  public AdminCouponInfoDTO getAdminCouponInfo() {
    List<AdminCouponDTO> couponList = getAllCoupons();
    List<AdminUserCouponDTO> userCouponList = getAllUsersForCoupon();

    AdminCouponInfoDTO adminCouponInfoDTO = new AdminCouponInfoDTO();

    adminCouponInfoDTO.setCoupons(couponList);
    adminCouponInfoDTO.setUserCoupons(userCouponList);

    return adminCouponInfoDTO;
  }

  public boolean createCoupon(CouponRequestDTO dto, String adminId) {
    Coupon coupon = new Coupon();
    coupon.setCode(dto.getCode());
    coupon.setName(dto.getName());
    coupon.setDiscount(dto.getValue());
    coupon.setExpiryDate(dto.getExpiryDate().atStartOfDay());

    if (dto.getCourseId() != null) {
      Course course = courseRepository.findById(dto.getCourseId())
        .orElseThrow(() -> new IllegalArgumentException("Course not found with ID: " + dto.getCourseId()));
      coupon.setCourse(course);
    }

    Admin admin = adminRepository.findById(Long.parseLong(adminId))
      .orElseThrow(() -> new IllegalArgumentException("해당 관리자가 존재하지 않습니다."));

    AdminLog log = new AdminLog();
    log.setAdmin(admin);
    log.setActivityType("COUPON_CREATE");
    log.setDescription(dto.getName() + "쿠폰 생성");
    log.setCreatedAt(LocalDateTime.now());

    adminLogRepository.save(log);
    couponRepository.save(coupon);
    return true;
  }

  public boolean distributeCouponToUsers(DistributeCouponRequestDTO dto, String adminId) {
    // 쿠폰 조회
    Coupon coupon = couponRepository.findById(dto.getCouponId())
      .orElseThrow(() -> new IllegalArgumentException("해당 쿠폰이 존재하지 않습니다."));

    // 관리자 조회
    Admin admin = adminRepository.findById(Long.parseLong(adminId))
      .orElseThrow(() -> new IllegalArgumentException("해당 관리자가 존재하지 않습니다."));

    List<User> targetUsers;

    // 전체 유저 대상 처리
    if (dto.getUserIds().size() == 1 && dto.getUserIds().get(0) == 0L) {
      targetUsers = userRepository.findAllByIsDelFalse(); // 삭제되지 않은 전체 유저 조회
    } else {
      targetUsers = new ArrayList<>();
      for (Long userId : dto.getUserIds()) {
        User user = userRepository.findById(userId)
          .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다. ID: " + userId));
        targetUsers.add(user);
      }
    }

    // 쿠폰 매핑 저장
    for (User user : targetUsers) {
      CouponUserMapping mapping = new CouponUserMapping();
      mapping.setUser(user);
      mapping.setCoupon(coupon);
      mapping.setUseDate(null); // 아직 사용 안했으니 null 처리
      mapping.setIsDel(false);

      couponUserMappingRepository.save(mapping);
    }

    // 관리자 로그 기록
    AdminLog log = new AdminLog();
    log.setAdmin(admin);
    log.setActivityType("COUPON_DISTRIBUTE");

    String desc = "[" + coupon.getName() + "] 쿠폰을 ";
    desc += (dto.getUserIds().size() == 1 && dto.getUserIds().get(0) == 0L)
      ? "전체 유저에게"
      : targetUsers.size() + "명에게";
    desc += " 배포.\r\n 메시지: " + dto.getMessage();

    log.setDescription(desc);
    log.setCreatedAt(LocalDateTime.now());
    adminLogRepository.save(log);

    return true;
  }

}
