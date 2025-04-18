package com.elearning.admin.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSummaryDTO {

  private Long id; // Course ID
  private String title; // Course subject
  private String instructor; // Instructor name
  private String category; // Category name
  private Integer price;
  private String status; // CourseStatus (e.g., ACTIVE)
  private int students; // 총 수강생 수
  private double rating; // 평균 별점
  private LocalDateTime createdAt;
}