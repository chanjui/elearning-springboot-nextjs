package com.elearning.admin.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AdminUserDTO {
  private Long id;
  private String nickname;
  private String email;
  private String profileUrl;
  private LocalDateTime regDate;
  private Boolean isInstructor;
  private Boolean isDel;
  private List<AdminUserCourseDTO> enrolledCourses;
}
