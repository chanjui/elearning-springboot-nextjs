package com.elearning.course.service;

import com.elearning.course.dto.*;
import com.elearning.course.entity.*;
import com.elearning.course.repository.*;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Comparator;

@Service
@RequiredArgsConstructor
public class CourseService {
        private final CourseRepository courseRepository;
        private final CategoryRepository categoryRepository;
        private final InstructorRepository instructorRepository;
        private final CourseFaqRepository courseFaqRepository;
        private final CourseSectionRepository courseSectionRepository;
        private final LectureVideoRepository lectureVideoRepository;
        private final CourseTechMappingRepository courseTechMappingRepository;

        public Long createCourse(CourseRequest req) {
                Course course = new Course();
                course.setSubject(req.getTitle());
                course.setDescription(req.getDescription());
                course.setPrice(req.getPrice());
                course.setLearning(req.getLearning());
                course.setRecommendation(req.getRecommendation());
                course.setRequirement(req.getRequirement());
                course.setThumbnailUrl(req.getThumbnailUrl());
                course.setDiscountRate(BigDecimal.valueOf(req.getDiscountRate()));

                Instructor instructor = instructorRepository.findById(req.getInstructorId())
                                .orElseThrow(() -> new RuntimeException("Instructor not found"));
                course.setInstructor(instructor);

                Category category = categoryRepository.findById(req.getCategoryId())
                                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
                course.setCategory(category);

                courseRepository.save(course);

                if (req.getTechStackIds() != null && !req.getTechStackIds().isEmpty()) {
                        for (Long techStackId : req.getTechStackIds()) {
                                TechStack techStack = new TechStack();
                                techStack.setId(techStackId);

                                CourseTechMapping mapping = new CourseTechMapping();
                                mapping.setCourse(course);
                                mapping.setTechStack(techStack);
                                courseTechMappingRepository.save(mapping);
                        }
                }

                return course.getId();
        }

        public void updateCourseTitleAndDescription(Long courseId, String title, String description, Long categoryId,
                        String learning, String recommendation, String requirement, List<Long> techStackIds) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                Category category = categoryRepository.findById(categoryId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리를 찾을 수 없습니다."));

                course.setSubject(title);
                course.setDescription(description);
                course.setCategory(category);
                course.setLearning(learning);
                course.setRecommendation(recommendation);
                course.setRequirement(requirement);

                courseRepository.save(course);

                courseTechMappingRepository.deleteAllByCourseId(courseId);

                if (techStackIds != null && !techStackIds.isEmpty()) {
                        for (Long techStackId : techStackIds) {
                                TechStack stack = new TechStack();
                                stack.setId(techStackId);
                                CourseTechMapping mapping = new CourseTechMapping();
                                mapping.setCourse(course);
                                mapping.setTechStack(stack);
                                courseTechMappingRepository.save(mapping);
                        }
                }
        }

        public void updateDetailedDescription(Long courseId, String detailedDescription) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                course.setDetailedDescription(detailedDescription);
                courseRepository.save(course);
        }

        public void updatePricing(Long courseId, int price, int discountRate, String status, String viewLimit,
                        String target, String startDate, String endDate) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                course.setPrice(price);
                course.setDiscountRate(BigDecimal.valueOf(discountRate));
                course.setStatus(Course.CourseStatus.valueOf(status));
                course.setViewLimit(viewLimit);
                course.setTarget(target);

                try {
                        if ("무제한".equals(viewLimit)) {
                                course.setStartDate(null);
                                course.setEndDate(null);
                        } else {
                                course.setStartDate(startDate != null && !startDate.isEmpty()
                                                ? LocalDateTime.parse(startDate)
                                                : null);
                                course.setEndDate(endDate != null && !endDate.isEmpty() ? LocalDateTime.parse(endDate)
                                                : null);
                        }
                } catch (DateTimeParseException e) {
                        throw new IllegalArgumentException("날짜 형식이 잘못되었습니다.");
                }

                courseRepository.save(course);
        }

        public void addCourseFaq(Long courseId, List<CourseFaqRequest> faqRequests) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                List<CourseFaq> faqList = faqRequests.stream()
                                .map(req -> {
                                        CourseFaq faq = new CourseFaq();
                                        faq.setCourse(course);
                                        faq.setContent(req.getContent());
                                        faq.setAnswer(req.getAnswer());
                                        faq.setVisible(req.getVisible());
                                        return faq;
                                })
                                .toList();

                courseFaqRepository.saveAll(faqList);
        }

        public void saveCurriculum(CourseCurriculumRequest request) {
                Course course = courseRepository.findById(request.getCourseId())
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                for (CourseSectionRequest sectionRequest : request.getSections()) {
                        CourseSection section = new CourseSection();
                        section.setCourse(course);
                        section.setSubject(sectionRequest.getSubject());
                        section.setOrderNum(sectionRequest.getOrderNum());

                        for (LectureVideoRequest lectureRequest : sectionRequest.getLectures()) {
                                LectureVideo lecture = new LectureVideo();
                                lecture.setSection(section);
                                lecture.setTitle(lectureRequest.getTitle());
                                lecture.setVideoUrl(lectureRequest.getVideoUrl());
                                lecture.setDuration(lectureRequest.getDuration());
                                lecture.setPreviewUrl(lectureRequest.getPreviewUrl());
                                lecture.setSeq(lectureRequest.getSeq());
                                lecture.setFree(lectureRequest.isFree());
                                section.getLectures().add(lecture);
                        }
                        courseSectionRepository.save(section);
                }
        }

        @Transactional
        public void deleteCourseAndDependencies(Long courseId) {
                List<CourseSection> sections = courseSectionRepository.findByCourseId(courseId);
                for (CourseSection section : sections) {
                        lectureVideoRepository.deleteAll(lectureVideoRepository.findBySectionId(section.getId()));
                }
                courseSectionRepository.deleteAll(sections);
                courseFaqRepository.deleteByCourseId(courseId);
                courseRepository.deleteById(courseId);
        }

        public Page<CourseResponseDTO> getCoursesByInstructor(Long instructorId, Pageable pageable, String status,
                        String keyword) {
                List<Course> allCourses = courseRepository.findByInstructorIdAndIsDel(instructorId, false);

                // ✅ status 필터링
                if (status != null && !status.equalsIgnoreCase("all")) {
                        Course.CourseStatus courseStatus = Course.CourseStatus.valueOf(status);
                        allCourses = allCourses.stream()
                                        .filter(course -> course.getStatus() == courseStatus)
                                        .collect(Collectors.toList());
                }

                // ✅ keyword 필터링
                if (keyword != null && !keyword.trim().isEmpty()) {
                        String lowerKeyword = keyword.toLowerCase();
                        allCourses = allCourses.stream()
                                        .filter(course -> course.getSubject() != null
                                                        && course.getSubject().toLowerCase().contains(lowerKeyword))
                                        .collect(Collectors.toList());
                }

                // ✅ [추가] status 순서대로 정렬하기
                allCourses.sort(Comparator.comparingInt(course -> {
                        if (course.getStatus() == Course.CourseStatus.PREPARING)
                                return 0;
                        else if (course.getStatus() == Course.CourseStatus.ACTIVE)
                                return 1;
                        else
                                return 2; // CLOSED
                }));

                // 페이지네이션
                int start = (int) pageable.getOffset();
                int end = Math.min(start + pageable.getPageSize(), allCourses.size());
                List<CourseResponseDTO> pagedCourses = allCourses.subList(start, end).stream()
                                .map(this::convertToDTO)
                                .toList();

                return new PageImpl<>(pagedCourses, pageable, allCourses.size());
        }

        public CourseResponseDTO getCourseById(Long id) {
                Course course = courseRepository.findBasicById(id)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의가 존재하지 않습니다."));
                course.setCourseSections(courseRepository.findSectionsByCourseId(id));
                course.setCourseTechMappings(courseRepository.findTechsByCourseId(id));
                return convertToDTO(course);
        }

        private CourseResponseDTO convertToDTO(Course course) {
                CourseResponseDTO dto = new CourseResponseDTO();
                dto.setId(course.getId());
                dto.setTitle(course.getSubject());
                dto.setDescription(course.getDescription());
                dto.setDetailedDescription(course.getDetailedDescription());
                dto.setThumbnailUrl(course.getThumbnailUrl());
                dto.setCategoryId(course.getCategory() != null ? course.getCategory().getId() : null);
                dto.setCategoryName(course.getCategory() != null ? course.getCategory().getName() : null);
                dto.setInstructorName(course.getInstructor() != null && course.getInstructor().getUser() != null
                                ? course.getInstructor().getUser().getNickname()
                                : null);
                dto.setPrice(course.getPrice() != null ? course.getPrice() : 0);
                dto.setDiscountRate(course.getDiscountRate() != null ? course.getDiscountRate().doubleValue() : 0.0);
                dto.setDiscountPrice((int) Math.floor(dto.getPrice() * (1 - dto.getDiscountRate() / 100.0)));
                dto.setViewLimit(course.getViewLimit());
                dto.setStartDate(course.getStartDate() != null ? course.getStartDate().toString() : null);
                dto.setEndDate(course.getEndDate() != null ? course.getEndDate().toString() : null);
                dto.setStatus(course.getStatus() != null ? course.getStatus().name() : "PREPARING");
                dto.setLearningContent(course.getLearning());
                dto.setRecommendationContent(course.getRecommendation());
                dto.setRequirementContent(course.getRequirement());
                dto.setTargetContent(course.getTarget());
                dto.setTechStackIds(course.getCourseTechMappings() != null ? course.getCourseTechMappings().stream()
                                .map(mapping -> mapping.getTechStack().getId()).collect(Collectors.toList())
                                : List.of());
                dto.setFaqs(course.getCourseFaqs() != null
                                ? course.getCourseFaqs().stream().map(FaqResponseDTO::new).collect(Collectors.toList())
                                : List.of());
                dto.setCurriculum(
                                course.getCourseSections() != null
                                                ? course.getCourseSections().stream().map(SectionResponseDTO::new)
                                                                .collect(Collectors.toList())
                                                : List.of());
                return dto;
        }

        @Transactional
        public void closeCourse(Long courseId) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));
                course.setStatus(Course.CourseStatus.CLOSED);
                courseRepository.save(course);
        }
}