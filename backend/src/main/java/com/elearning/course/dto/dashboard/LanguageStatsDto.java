package com.elearning.course.dto.dashboard;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LanguageStatsDto {
    private String language;     // 프로그래밍 언어
    private int count;          // 해당 언어로 해결한 문제 수
    private double percentage;  // 전체 대비 비율
} 