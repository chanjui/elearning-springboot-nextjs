package com.elearning.course.dto.dashboard;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class CodingTestStatsDto {
    private int totalProblems;           // 전체 문제 수
    private int solvedProblems;          // 해결한 문제 수
    private double completionRate;       // 완료율
    private List<LanguageStatsDto> languageStats;  // 언어별 통계
} 