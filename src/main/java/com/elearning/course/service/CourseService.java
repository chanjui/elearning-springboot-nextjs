package com.elearning.course.service;

import com.elearning.course.dto.CourseCurriculumRequest;
import com.elearning.course.dto.CourseFaqRequest;
import com.elearning.course.dto.CourseRequest;
import com.elearning.course.dto.CourseSectionRequest;
import com.elearning.course.dto.LectureVideoRequest;
import com.elearning.course.entity.Course;
import com.elearning.course.entity.CourseFaq;
import com.elearning.course.entity.CourseSection;
import com.elearning.course.entity.CourseTechMapping;
import com.elearning.course.entity.LectureVideo;
import com.elearning.course.entity.TechStack;
import com.elearning.course.repository.CourseRepository;
import com.elearning.course.repository.CourseSectionRepository;
import com.elearning.course.repository.CourseTechMappingRepository;
import com.elearning.course.repository.LectureVideoRepository;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.elearning.course.entity.Category;
import com.elearning.course.repository.CategoryRepository;
import com.elearning.course.repository.CourseFaqRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;

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
        private final CourseListService courseListService;

        public Long createCourse(CourseRequest req) {
                Course course = new Course();

                // ✅ 저장 가능한 필드만 처리
                course.setSubject(req.getTitle()); // title -> subject
                course.setDescription(req.getDescription());
                course.setPrice(req.getPrice());
                course.setLearning(req.getLearning());
                course.setRecommendation(req.getRecommendation());
                course.setRequirement(req.getRequirement());
                course.setBackImageUrl(req.getBackImageUrl());
                BigDecimal discountRate = BigDecimal.valueOf(req.getDiscountRate());
                course.setDiscountRate(discountRate);
                // courseservice에서 실제 instructor를 찾아서 course에 세팅
                Instructor instructor = instructorRepository.findById(req.getInstructorId())
                                .orElseThrow(() -> new RuntimeException("Instructor not found"));

                course.setInstructor(instructor);
                // 드로박스에서 받은 categoryId를 통해 카테고리 조회 후 연결
                Category category = categoryRepository.findById(req.getCategoryId())
                                .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));

                course.setCategory(category);

                // TODO: 미지원 필드들
                // req.getTags()
                // req.getIntroVideo()
                // req.getDetailedDescription()
                // req.getSubCategory()
                // req.getDiscountPrice()
                // req.isPublic()
                // req.getCoverImage()
                // req.getDurationType()

                courseRepository.save(course);
                if (req.getTechStackIds() != null && !req.getTechStackIds().isEmpty()) {
                        for (Long techStackId : req.getTechStackIds()) {
                                TechStack techStack = new TechStack();
                                techStack.setId(techStackId); // 직접 ID만 세팅 (성능 위해 조회 생략)

                                CourseTechMapping mapping = new CourseTechMapping();
                                mapping.setCourse(course);
                                mapping.setTechStack(techStack);
                                courseTechMappingRepository.save(mapping);
                        }
                }
                
                // 강의 생성 후 캐시 갱신
                courseListService.evictAllCourseCaches();
                
                return course.getId(); // 생성된 강의 ID 반환
        }

        public void updateCourseTitleAndDescription(Long courseId, String title, String description,
                        Long categoryId, String learning, String recommendation, String requirement,
                        List<Long> techStackIds) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                course.setSubject(title);
                course.setDescription(description);
                course.setLearning(learning);
                course.setRecommendation(recommendation);
                course.setRequirement(requirement);

                // 카테고리 업데이트
                if (categoryId != null) {
                        Category category = categoryRepository.findById(categoryId)
                                        .orElseThrow(() -> new IllegalArgumentException("카테고리를 찾을 수 없습니다."));
                        course.setCategory(category);
                }

                courseRepository.save(course);

                if (techStackIds != null) {
                        if (!techStackIds.isEmpty()) {
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
                
                // 강의 업데이트 후 캐시 갱신
                courseListService.evictAllCourseCaches();
        }

        public void updateDetailedDescription(Long courseId, String detailedDescription) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                course.setDetailedDescription(detailedDescription);
                courseRepository.save(course);
                
                // 강의 업데이트 후 캐시 갱신
                courseListService.evictAllCourseCaches();
        }

        public void updatePricing(Long courseId, int price, int discountRate, String status, String viewLimit,
                        String target, String startDate, String endDate) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                course.setPrice(price);
                course.setDiscountRate(BigDecimal.valueOf(discountRate));
                System.out.println("🧪 받은 status 값: " + status);
                course.setStatus(Course.CourseStatus.valueOf(status));
                course.setViewLimit(viewLimit);
                course.setTarget(target);

                // course.setDurationType(durationType);

                // 날짜 형식 변환 또는 무제한 처리
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
                
                // 강의 업데이트 후 캐시 갱신
                courseListService.evictAllCourseCaches();
        }

        public void addCourseFaq(Long courseId, List<CourseFaqRequest> faqRequests) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                for (CourseFaqRequest faqRequest : faqRequests) {
                        CourseFaq faq = new CourseFaq();
                        faq.setCourse(course);
                        faq.setContent(faqRequest.getContent());
                        faq.setAnswer(faqRequest.getAnswer());
                        faq.setVisible(faqRequest.getVisible());
                        courseFaqRepository.save(faq);
                }
                
                // FAQ 추가 후 캐시 갱신
                courseListService.evictAllCourseCaches();
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
                                lecture.setSection(section); // 🔗 연관관계 설정
                                lecture.setTitle(lectureRequest.getTitle());
                                lecture.setVideoUrl(lectureRequest.getVideoUrl());
                                lecture.setDuration(lectureRequest.getDuration());
                                lecture.setPreviewUrl(lectureRequest.getPreviewUrl());
                                lecture.setSeq(lectureRequest.getSeq());
                                lecture.setFree(lectureRequest.isFree());

                                section.getLectures().add(lecture);
                        }

                        // ✅ section 저장 → cascade 로 lecture 도 같이 저장됨
                        courseSectionRepository.save(section);
                }
                
                // 커리큘럼 저장 후 캐시 갱신
                courseListService.evictAllCourseCaches();
        }

        @Transactional
        public void deleteCourseAndDependencies(Long courseId) {
                // 섹션 먼저 조회
                List<CourseSection> sections = courseSectionRepository.findByCourseId(courseId);

                for (CourseSection section : sections) {
                        // cascade 옵션 없이 직접 삭제해야 한다면 강의 먼저 삭제
                        lectureVideoRepository.deleteAll(lectureVideoRepository.findBySectionId(section.getId())); // or
                                                                                                                   // lectureVideoRepository.deleteBySectionId()
                                                                                                                   // 등
                }

                // 섹션 삭제
                courseSectionRepository.deleteAll(sections);

                // FAQ 삭제 (있다면)
                courseFaqRepository.deleteByCourseId(courseId);

                // 마지막으로 강의 삭제
                courseRepository.deleteById(courseId);
                
                // 강의 삭제 후 캐시 갱신
                courseListService.evictAllCourseCaches();
        }

        public void updateCoverImage(Long courseId, String imageUrl) {
                Course course = courseRepository.findById(courseId)
                                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

                course.setBackImageUrl(imageUrl);
                courseRepository.save(course);
                
                // 커버 이미지 업데이트 후 캐시 갱신
                courseListService.evictAllCourseCaches();
        }
}