package com.elearning.admin.service;

import com.elearning.admin.dto.AdminUserCourseDTO;
import com.elearning.admin.dto.AdminUserDTO;
import com.elearning.admin.entity.Admin;
import com.elearning.admin.entity.AdminLog;
import com.elearning.admin.repository.AdminLogRepository;
import com.elearning.admin.repository.AdminRepository;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRepository;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.entity.User;
import com.elearning.user.repository.CourseEnrollmentRepository;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

  private final UserRepository userRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CourseRepository courseRepository;
  private final AdminLogRepository adminLogRepository;
  private final AdminRepository adminRepository;

  // 유저 조회
  public List<AdminUserDTO> getAllUsersWithCourses() {
    List<User> users = userRepository.findAll();

    return users.stream().map(user -> {
      List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByUserIdAndIsDelFalse(user.getId());

      List<AdminUserCourseDTO> enrolledCourses = enrollments.stream()
        .map(enrollment -> {
          Course course = courseRepository.findById(enrollment.getCourse().getId())
            .orElse(null);
          if (course == null) return null;

          return AdminUserCourseDTO.builder()
            .courseId(course.getId())
            .subject(course.getSubject())
            .progress(enrollment.getProgress())
            .regDate(enrollment.getEnrolledAt())
            .completionStatus(enrollment.isCompletionStatus())
            .build();
        })
        .filter(Objects::nonNull)
        .collect(Collectors.toList());

      return AdminUserDTO.builder()
        .id(user.getId())
        .nickname(user.getNickname())
        .email(user.getEmail())
        .profileUrl(user.getProfileUrl())
        .regDate(user.getRegDate())
        .isInstructor(user.getIsInstructor())
        .isDel(user.getIsDel())
        .enrolledCourses(enrolledCourses)
        .build();
    }).collect(Collectors.toList());
  }

  // 유저 강제 탈퇴
  public boolean deactivateUser(Long userId, String reason, String adminId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

    // 1. 사용자 정지 처리
    user.setIsDel(true); // 탈퇴 처리
    user.setRefreshToken(null); // 리프레시 토큰 제거

    // 2. 관리자 정보 조회
    Admin admin = adminRepository.findById(Long.parseLong(adminId))
      .orElseThrow(() -> new IllegalArgumentException("해당 관리자가 존재하지 않습니다."));

    /*이메일로 탈퇴 통보*/

    // 3. AdminLog 생성 및 저장
    AdminLog log = new AdminLog();
    log.setAdmin(admin);
    log.setUser(user);
    log.setActivityType("USER_DEACTIVATE");
    log.setDescription("사유: " + reason);
    log.setCreatedAt(LocalDateTime.now());

    userRepository.save(user);
    adminLogRepository.save(log);

    return true;
  }

}
