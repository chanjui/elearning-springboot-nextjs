package com.elearning.course.repository;

import com.elearning.course.entity.Course;
import com.elearning.course.entity.CourseSection;
import com.elearning.course.entity.CourseTechMapping;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

        // 상태별 최신 강의 조회 (등록일 내림차순)
        List<Course> findTop5ByStatusOrderByRegDateDesc(Course.CourseStatus status);

        Optional<Course> findByIdAndStatus(Long id, Course.CourseStatus status);

        // 상태와 가격(무료 강의인 경우 price = 0)으로 조회
        List<Course> findTop5ByStatusAndPrice(Course.CourseStatus status, Integer price);

        // 메인 페이지 카테고리별 top1 강의 (ACTIVE 상태, 평점 내림차순)
        @Query("""
                            SELECT c FROM Course c
                            WHERE c.category.id = :categoryId AND c.status = :status
                            ORDER BY (SELECT COALESCE(AVG(cr.rating), 0)
                                      FROM CourseRating cr
                                      WHERE cr.course = c AND cr.isDel = false) DESC
                        """)
        List<Course> findTopByCategoryIdAndStatusOrderByAverageRatingDesc(
                        @Param("categoryId") Long categoryId,
                        @Param("status") Course.CourseStatus status,
                        Pageable pageable);

        // instructor, category 정보만 포함한 기본 fetch
        @Query("""
                            SELECT c FROM Course c
                            LEFT JOIN FETCH c.instructor i
                            LEFT JOIN FETCH i.user
                            LEFT JOIN FETCH c.category
                            WHERE c.id = :id
                        """)
        Optional<Course> findBasicById(@Param("id") Long id);

        // CourseSection + Lecture fetch
        @Query("""
                            SELECT cs FROM CourseSection cs
                            LEFT JOIN FETCH cs.lectures
                            WHERE cs.course.id = :courseId
                        """)
        List<CourseSection> findSectionsByCourseId(@Param("courseId") Long courseId);

        // CourseTechMapping + TechStack fetch
        @Query("""
                            SELECT ct FROM CourseTechMapping ct
                            LEFT JOIN FETCH ct.techStack
                            WHERE ct.course.id = :courseId
                        """)
        List<CourseTechMapping> findTechsByCourseId(@Param("courseId") Long courseId);

        // 강의 관리 페이지용
        List<Course> findByInstructorIdAndIsDel(Long instructorId, boolean isDel);

        @Query("""
                            SELECT c FROM Course c
                            WHERE c.instructor.id = :instructorId
                              AND (:status IS NULL OR c.status = :status)
                              AND (:keyword IS NULL OR LOWER(c.subject) LIKE LOWER(CONCAT('%', :keyword, '%')))
                        """)
        Page<Course> findByInstructorWithFilter(
                        @Param("instructorId") Long instructorId,
                        @Param("status") Course.CourseStatus status,
                        @Param("keyword") String keyword,
                        Pageable pageable);
}