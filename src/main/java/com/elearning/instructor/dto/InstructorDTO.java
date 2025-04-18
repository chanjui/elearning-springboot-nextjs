package com.elearning.instructor.dto;

import com.elearning.instructor.dto.home.InstructorCourseDTO;
import com.elearning.instructor.entity.Instructor;
import com.elearning.user.entity.User;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class InstructorDTO {
  private Long userId;
  private String githubLink;
  private String bio;
  private String referralSource;
  private Long expertiseId;
  private String nickName; // 강사 이름
  private List<Long> fieldIds; // 희망 분야 ID 목록 (다중 선택)
  private List<InstructorCourseDTO> courses; // 강의 목록
  private String expertiseName; // 전문 분야 이름
  private Long totalStudents;   // 수강생 수
  private int totalReviews;    // 수강평 수
  private double totalRating;  // 전체 강의 평균 평점
  private String profileUrl;

  // DTO → Entity 변환
  public Instructor toEntity(User user) {
    return Instructor.builder()
      .user(user)
      .referralSource(this.referralSource)
      .build();
  }

  // Entity → DTO 변환
  public static InstructorDTO fromEntity(Instructor instructor) {
    User user = instructor.getUser();

    return InstructorDTO.builder()
      .userId(instructor.getUser().getId())
      .nickName(user.getNickname())
      .bio(user.getBio())
      .githubLink(user.getGithubLink())
      .profileUrl(user.getProfileUrl())
      .referralSource(instructor.getReferralSource())
      .expertiseId(instructor.getExpertise() != null ? instructor.getExpertise().getId() : null)
      .expertiseName(instructor.getExpertise() != null ? instructor.getExpertise().getName() : null)
      .fieldIds(instructor.getDesiredFields().stream()
        .map(mapping -> mapping.getCategory().getId())
        .collect(Collectors.toList()))
      .build();
    }
}
