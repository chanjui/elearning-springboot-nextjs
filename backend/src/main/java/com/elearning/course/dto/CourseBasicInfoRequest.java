package com.elearning.course.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;

@Data
public class CourseBasicInfoRequest {
    private String title;
    private String description;
    private Long categoryId;

    private String learning;
    private String recommendation;
    private String requirement;
    private String backImageUrl;
    private List<Long> techStackIds = new ArrayList<>();
}