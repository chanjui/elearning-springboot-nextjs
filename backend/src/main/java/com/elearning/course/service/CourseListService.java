package com.elearning.course.service;

import com.elearning.course.dto.CourseDTO;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.CourseRepository;
import com.elearning.course.repository.CourseRatingRepository;
import com.elearning.user.repository.CourseEnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseListService {
    private final CourseRepository courseRepository;
    private final CourseRatingRepository courseRatingRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private static final Logger log = LoggerFactory.getLogger(CourseListService.class);

    public List<CourseDTO> getAllCourses() {
        try {
            List<Course> courses = courseRepository.findAllWithInstructor(Course.CourseStatus.ACTIVE);
            if (courses == null || courses.isEmpty()) {
                return new ArrayList<>();
            }
            return convertToDTOsWithStats(courses);
        } catch (Exception e) {
            log.error("Error fetching all courses: ", e);
            throw new RuntimeException("Failed to fetch courses", e);
        }
    }

    public List<CourseDTO> getNewCourses() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);
        List<Course> courses = courseRepository.findNewCourses(Course.CourseStatus.ACTIVE, oneMonthAgo);
        return convertToDTOsWithStats(courses);
    }

    public List<CourseDTO> getPopularCourses() {
        List<Course> courses = courseRepository.findPopularCourses(Course.CourseStatus.ACTIVE, null).getContent();
        return convertToDTOsWithStats(courses);
    }

    public List<CourseDTO> getFreeCourses() {
        List<Course> courses = courseRepository.findFreeCourses(Course.CourseStatus.ACTIVE);
        return convertToDTOsWithStats(courses);
    }

    public void evictAllCourseCaches() {
         // 캐시 제거 메서드는 더 이상 필요하지 않으므로 비워둡니다
    }

    private List<CourseDTO> convertToDTOsWithStats(List<Course> courses) {
        List<Long> courseIds = courses.stream()
                .map(Course::getId)
                .collect(Collectors.toList());

        Map<Long, CourseStats> statsMap = courseRepository.getCourseStats(courseIds).stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> new CourseStats(
                                ((Number) row[1]).longValue(),  // studentCount
                                ((Number) row[2]).doubleValue(), // avgRating
                                ((Number) row[3]).longValue()    // ratingCount
                        )
                ));

        return courses.stream()
                .map(course -> convertToDTO(course, statsMap.getOrDefault(course.getId(), new CourseStats(0L, 0.0, 0L))))
                .collect(Collectors.toList());
    }

    private CourseDTO convertToDTO(Course course, CourseStats stats) {
        CourseDTO dto = new CourseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getSubject());
        dto.setDescription(course.getDescription());
        dto.setPrice(course.getPrice().doubleValue());
        
        // 강사 정보 설정
        if (course.getInstructor() != null) {
            log.debug("Instructor found for course {}: {}", course.getId(), course.getInstructor());
            if (course.getInstructor().getUser() != null) {
                log.debug("User found for instructor: {}", course.getInstructor().getUser());
                dto.setInstructorName(course.getInstructor().getUser().getNickname());
            } else {
                log.warn("User is null for instructor in course {}", course.getId());
                dto.setInstructorName("Unknown Instructor");
            }
        } else {
            log.warn("Instructor is null for course {}", course.getId());
            dto.setInstructorName("Unknown Instructor");
        }
        
        // 카테고리 정보 설정
        if (course.getCategory() != null) {
            dto.setCategoryName(course.getCategory().getName());
        } else {
            dto.setCategoryName("Uncategorized");
        }
        
        dto.setStudentCount(stats.studentCount);
        dto.setRating(stats.avgRating);
        dto.setRatingCount(stats.ratingCount);
        
        // 썸네일 URL 설정 (데이터베이스에서 가져온 값 그대로 사용)
        dto.setThumbnailUrl(course.getThumbnailUrl());
        
        // 난이도 정보 설정
        dto.setTarget(course.getTarget());
        
        return dto;
    }

    private static class CourseStats {
        private final long studentCount;
        private final double avgRating;
        private final long ratingCount;

        public CourseStats(long studentCount, double avgRating, long ratingCount) {
            this.studentCount = studentCount;
            this.avgRating = avgRating;
            this.ratingCount = ratingCount;
        }
    }
} 