package com.elearning.course.service;

import com.elearning.course.dto.CourseRequest;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRepository;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.InstructorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.elearning.course.entity.Category;
import com.elearning.course.repository.CategoryRepository;
import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final InstructorRepository instructorRepository;

    public Long createCourse(CourseRequest req) {
        Course course = new Course();

        // ✅ 저장 가능한 필드만 처리
        course.setSubject(req.getTitle()); // title -> subject
        course.setDescription(req.getDescription());
        course.setPrice(req.getPrice());

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

        courseRepository.save(course);
        return course.getId(); // 생성된 강의 ID 반환
    }

    public void updateCourseTitleAndDescription(Long courseId, String title, String description, Long categoryId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("해당 카테고리를 찾을 수 없습니다."));

        course.setSubject(title);
        course.setDescription(description);
        course.setCategory(category);

        courseRepository.save(course);
    }

    public void updateDetailedDescription(Long courseId, String detailedDescription) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("해당 강의를 찾을 수 없습니다."));

        course.setDetailedDescription(detailedDescription);
        courseRepository.save(course);
    }
}