package com.elearning.course.dto.CourseParticular;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CourseInfoDTO {
  private Long id;
  private String title;
  private String description;
  private String instructor;
  private double price;
  private double rating;
  private int students;
  private int totalLectures;
  private double totalHours;
  private String level;
  private LocalDateTime lastUpdated;
  private String image;
  private List<CourseSectionDTO> curriculum;
  private List<CourseRatingDTO> reviews;
  private List<BoardDTO> questions;
}
