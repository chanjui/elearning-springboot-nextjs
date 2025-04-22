package com.elearning.course.controller;

import com.elearning.course.dto.CourseBasicInfoRequest;
import com.elearning.course.dto.CourseCurriculumRequest;
import com.elearning.course.dto.CourseRequest;
import com.elearning.course.dto.CourseResponseDTO;
import com.elearning.course.entity.Category;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CategoryRepository;
import com.elearning.course.repository.CourseRepository;
import com.elearning.course.service.CourseService;
import com.elearning.instructor.service.InstructorService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import com.elearning.course.dto.CourseDetailedDescriptionRequest;
import com.elearning.course.dto.CourseFaqRequest;
import com.elearning.course.dto.CoursePricingRequest;
import com.elearning.course.repository.TechStackRepository;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseCreateController {

    private final CourseService courseService;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final TechStackRepository techStackRepository;
    private final InstructorService instructorService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody CourseRequest request) {
        Long courseId = courseService.createCourse(request);
        Map<String, Object> response = new HashMap<>();
        response.put("courseId", courseId);
        response.put("message", "강의가 성공적으로 생성되었습니다.");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // 강의 기본 정보 업데이트
    @PatchMapping("/{id}/basic-info")
    public ResponseEntity<String> updateBasicInfo(
            @PathVariable Long id,
            @RequestBody CourseBasicInfoRequest request) {
        courseService.updateCourseTitleAndDescription(
                id,
                request.getTitle(),
                request.getDescription(),
                request.getCategoryId(),
                request.getLearning(),
                request.getRecommendation(),
                request.getRequirement(),
                request.getTechStackIds());
        return ResponseEntity.ok("강의 기본 정보가 수정되었습니다.");
    }

    // 강의 상세 설명 업데이트
    @PatchMapping("/{id}/detailed-description")
    public ResponseEntity<String> updateDetailedDescription(
            @PathVariable Long id,
            @RequestBody CourseDetailedDescriptionRequest request) {
        courseService.updateDetailedDescription(id, request.getDetailedDescription());
        return ResponseEntity.ok("강의 상세 설명이 저장되었습니다.");
    }

    @PatchMapping("/{id}/pricing")
    public ResponseEntity<String> updatePricing(
            @PathVariable Long id,
            @RequestBody CoursePricingRequest request) {
        courseService.updatePricing(
                id,
                request.getPrice(),
                request.getDiscountRate(),
                request.getStatus(),
                request.getViewLimit(),
                request.getTarget(),
                request.getStartDate(),
                request.getEndDate());
        // request.getDurationType());
        return ResponseEntity.ok("강의 가격 및 설정 정보가 저장되었습니다.");
    }

    @PostMapping("/{id}/faq")
    public ResponseEntity<String> addFaqs(
            @PathVariable Long id,
            @RequestBody List<CourseFaqRequest> faqRequests) {

        courseService.addCourseFaq(id, faqRequests);
        return ResponseEntity.ok("자주 묻는 질문이 저장되었습니다.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourseAndDependencies(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/curriculum")
    public ResponseEntity<String> saveCurriculum(
            @PathVariable Long id,
            @RequestBody CourseCurriculumRequest request) {

        request.setCourseId(id); // URL 경로에서 받은 ID를 DTO에 주입
        courseService.saveCurriculum(request);
        return ResponseEntity.ok("커리큘럼 저장 완료");
    }

    @PatchMapping("/{id}/cover-image")
    public ResponseEntity<String> updateCoverImage(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {

        String imageUrl = request.get("thumbnailUrl"); // 🔁 변경

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

        course.setThumbnailUrl(imageUrl); // 🔁 변경
        courseRepository.save(course);

        return ResponseEntity.ok("커버 이미지가 저장되었습니다.");
    }

    @GetMapping("/tech-stacks")
    public List<Map<String, Object>> getAllTechStacks() {
        return techStackRepository.findAll().stream()
                .map(stack -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", stack.getId());
                    map.put("name", stack.getName());
                    return map;
                })
                .toList();
    }

    @GetMapping("/instructor/courses")
    public ResponseEntity<Page<CourseResponseDTO>> getInstructorCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            HttpServletRequest request) {
        Long userId = Long.valueOf((String) request.getAttribute("userId"));
        Long instructorId = instructorService.getInstructorIdByUserId(userId);
        Pageable pageable = PageRequest.of(page, size);
        Page<CourseResponseDTO> result = courseService.getCoursesByInstructor(instructorId, pageable);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> getCourseById(@PathVariable Long id) {
        CourseResponseDTO courseDTO = courseService.getCourseById(id);
        return ResponseEntity.ok(courseDTO);
    }

}