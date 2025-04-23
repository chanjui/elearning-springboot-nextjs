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
import java.util.Map;
import java.util.stream.Collectors;

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

        @Transactional
        public void updateCourseFaqs(Long courseId, List<CourseFaqRequest> faqRequests) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                // 요청에 포함된 FAQ ID 목록 추출
                List<Long> incomingIds = faqRequests.stream()
                                .map(CourseFaqRequest::getId)
                                .filter(id -> id != null)
                                .toList();

                // 기존 FAQ 불러오기
                List<CourseFaq> existingFaqs = courseFaqRepository.findByCourseId(courseId);

                // 삭제 대상 처리
                for (CourseFaq faq : existingFaqs) {
                        if (!incomingIds.contains(faq.getId())) {
                                courseFaqRepository.delete(faq);
                        }
                }

                // 수정 또는 추가
                for (CourseFaqRequest req : faqRequests) {
                        CourseFaq faq;
                        if (req.getId() != null) {
                                // 수정
                                faq = courseFaqRepository.findById(req.getId())
                                                .orElseThrow(() -> new IllegalArgumentException("FAQ ID가 유효하지 않습니다."));
                        } else {
                                // 신규 추가
                                faq = new CourseFaq();
                                faq.setCourse(course);
                        }

                        faq.setContent(req.getContent());
                        faq.setAnswer(req.getAnswer());
                        faq.setVisible(req.getVisible());
                        courseFaqRepository.save(faq);
                }
        }

        @Transactional
        public void updateCurriculum(CourseCurriculumRequest request) {
                Course course = courseRepository.findById(request.getCourseId())
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                List<Long> incomingSectionIds = request.getSections().stream()
                                .map(CourseSectionRequest::getId)
                                .filter(id -> id != null)
                                .toList();

                // 기존 섹션 삭제 (없는 ID 기준)
                List<CourseSection> existingSections = courseSectionRepository.findByCourseId(course.getId());
                for (CourseSection section : existingSections) {
                        if (!incomingSectionIds.contains(section.getId())) {
                                lectureVideoRepository
                                                .deleteAll(lectureVideoRepository.findBySectionId(section.getId()));
                                courseSectionRepository.delete(section);
                        }
                }

                for (CourseSectionRequest sectionReq : request.getSections()) {
                        CourseSection section;
                        if (sectionReq.getId() != null) {
                                section = courseSectionRepository.findById(sectionReq.getId())
                                                .orElseThrow(() -> new IllegalArgumentException("섹션 ID가 유효하지 않습니다."));
                                section.setSubject(sectionReq.getSubject());
                                section.setOrderNum(sectionReq.getOrderNum());
                                lectureVideoRepository
                                                .deleteAll(lectureVideoRepository.findBySectionId(section.getId()));
                        } else {
                                section = new CourseSection();
                                section.setCourse(course);
                                section.setSubject(sectionReq.getSubject());
                                section.setOrderNum(sectionReq.getOrderNum());
                        }
                        courseSectionRepository.save(section);

                        for (LectureVideoRequest lectureReq : sectionReq.getLectures()) {
                                LectureVideo lecture = new LectureVideo();
                                lecture.setSection(section);
                                lecture.setTitle(lectureReq.getTitle());
                                lecture.setVideoUrl(lectureReq.getVideoUrl());
                                lecture.setDuration(lectureReq.getDuration());
                                lecture.setPreviewUrl(lectureReq.getPreviewUrl());
                                lecture.setSeq(lectureReq.getSeq());
                                lecture.setFree(lectureReq.isFree());
                                lectureVideoRepository.save(lecture);
                        }
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

        public Page<CourseResponseDTO> getCoursesByInstructor(Long instructorId, Pageable pageable) {
                List<Course> allCourses = courseRepository.findByInstructorIdAndIsDel(instructorId, false);
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
}