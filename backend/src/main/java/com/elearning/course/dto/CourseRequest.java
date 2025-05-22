package com.elearning.course.dto;

import java.util.List;

import lombok.Data;

@Data
public class CourseRequest {
    private String title;
    private String description;
    private String detailedDescription;
    private List<String> tags;
    private String level;
    private String category;
    private String subCategory;
    private String coverImage;
    private String introVideo;
    private Long categoryId; // ✅ 추가
    private Long instructorId; // 강사 ID
    private List<CurriculumSection> curriculum;
    private List<Long> techStackIds; // 선택된 기술 스택 ID 목록
    private int price;
    private int discountPrice;
    private int discountRate;
    private boolean isPublic;
    private String learning;
    private String recommendation;
    private String requirement;
    private List<FAQ> faq;
    private String thumbnailUrl;

    @Data
    public static class CurriculumSection {
        private String title;
        private List<Lecture> lectures;
    }

    @Data
    public static class Lecture {
        private String title;
        private String videoUrl;
        private String duration;
    }

    @Data
    public static class FAQ {
        private String question;
        private String answer;
        private boolean visible;
    }
}