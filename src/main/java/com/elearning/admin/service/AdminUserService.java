package com.elearning.admin.service;

import com.elearning.admin.dto.AdminUserCourseDTO;
import com.elearning.admin.dto.AdminUserDTO;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRepository;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.entity.User;
import com.elearning.user.repository.CourseEnrollmentRepository;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

  private final UserRepository userRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CourseRepository courseRepository;

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
        .filter(dto -> dto != null)
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
  public boolean deactivateUser(Long userId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

    user.setIsDel(true); // 탈퇴 처리
    user.setRefreshToken(null); // 리프레시 토큰 제거 (선택사항)

    userRepository.save(user);

    return true; // 성공적으로 처리됨
  }
}
