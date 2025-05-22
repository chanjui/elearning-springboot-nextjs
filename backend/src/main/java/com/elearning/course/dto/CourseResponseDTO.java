package com.elearning.course.dto;

import com.elearning.course.entity.Course;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class CourseResponseDTO {

        // 기본 정보
        private Long id; // courseId로 사용됨
        private String title;
        private String description;
        private String detailedDescription;

        // 커버/썸네일 이미지
        private String thumbnailUrl; // coverImage로 매핑

        // 카테고리
        private Long categoryId;
        private String categoryName;

        // 강사 정보
        private String instructorName;

        // 가격 정보
        private int price;
        private double discountRate;
        private int discountPrice; // 프론트에서 계산도 하지만 백엔드 제공도 가능
        private String viewLimit;
        private String startDate;
        private String endDate;

        // 공개 설정
        private String status;

        // 학습 정보
        private String learningContent;
        private String recommendationContent;
        private String requirementContent;
        private String targetContent;

        // 기술 스택
        private List<Long> techStackIds;

        // 커리큘럼
        private List<SectionResponseDTO> curriculum;

        // FAQ
        private List<FaqResponseDTO> faqs;

        public CourseResponseDTO() {
        }

        public CourseResponseDTO(Course course) {
                this.id = course.getId();
                this.title = course.getSubject();
                this.description = course.getDescription();
                this.detailedDescription = course.getDetailedDescription();
                this.thumbnailUrl = course.getThumbnailUrl();

                this.categoryId = course.getCategory() != null ? course.getCategory().getId() : null;
                this.categoryName = course.getCategory() != null ? course.getCategory().getName() : null;

                this.instructorName = (course.getInstructor() != null && course.getInstructor().getUser() != null)
                                ? course.getInstructor().getUser().getNickname()
                                : null;

                this.price = course.getPrice() != null ? course.getPrice().intValue() : 0;
                this.discountRate = course.getDiscountRate() != null ? course.getDiscountRate().doubleValue() : 0.0;
                this.discountPrice = (int) Math.floor(this.price * (1 - this.discountRate / 100.0));

                this.viewLimit = course.getViewLimit();
                this.startDate = course.getStartDate() != null ? course.getStartDate().toString() : null;
                this.endDate = course.getEndDate() != null ? course.getEndDate().toString() : null;
                this.status = course.getStatus() != null ? course.getStatus().name() : "PREPARING";

                this.learningContent = course.getLearning();
                this.recommendationContent = course.getRecommendation();
                this.requirementContent = course.getRequirement();
                this.targetContent = course.getTarget();

                this.techStackIds = course.getCourseTechMappings() != null
                                ? course.getCourseTechMappings().stream()
                                                .map(mapping -> mapping.getTechStack().getId())
                                                .collect(Collectors.toList())
                                : List.of();

                this.faqs = course.getCourseFaqs() != null
                                ? course.getCourseFaqs().stream()
                                                .map(FaqResponseDTO::new)
                                                .collect(Collectors.toList())
                                : List.of();

                this.curriculum = course.getCourseSections() != null
                                ? course.getCourseSections().stream()
                                                .map(SectionResponseDTO::new)
                                                .collect(Collectors.toList())
                                : List.of();
        }
}
