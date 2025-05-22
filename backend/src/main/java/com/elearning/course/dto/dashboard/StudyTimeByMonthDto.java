package com.elearning.course.dto.dashboard;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StudyTimeByMonthDto {
    private String month;
    private Integer hours;
} 