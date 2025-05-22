package com.elearning.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingCourseDTO {
  private Long id;
  private String title;
  private String instructor;
  private String instructorEmail;
  private String category;
  private String description;
  private int price;
  private String createdAt;
  private String status;
  private int sections;
  private int videos;
  private int duration;
}
