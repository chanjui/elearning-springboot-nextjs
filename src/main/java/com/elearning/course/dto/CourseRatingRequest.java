package com.elearning.course.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseRatingRequest {
    private Long userId;
    private Long courseId;
    private Integer rating;
    private String content;
} 