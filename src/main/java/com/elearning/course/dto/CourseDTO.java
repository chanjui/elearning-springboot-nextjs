package com.elearning.course.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourseDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String instructorName;
    private String categoryName;
    private Long studentCount;
    private Double rating;
    private Long ratingCount;
    private String thumbnailUrl;
    private String target;
} 