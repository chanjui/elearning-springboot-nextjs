package com.elearning.course.dto;

import com.elearning.course.entity.CourseSection;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class SectionResponseDTO {
    private String title;
    private int orderNum;
    private List<LectureResponseDTO> lectures;

    public SectionResponseDTO(CourseSection section) {
        this.title = section.getSubject();
        this.orderNum = section.getOrderNum();
        this.lectures = section.getLectures().stream()
                .map(LectureResponseDTO::new)
                .collect(Collectors.toList());
    }
}