package com.elearning.course.repository;

import com.elearning.course.entity.Course;
import com.elearning.course.entity.CourseSection;
import com.elearning.course.entity.CourseTechMapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
  // 상태별 최신 강의 조회 (등록일 내림차순)
  @Query("SELECT DISTINCT c FROM Course c " +
    "LEFT JOIN FETCH c.instructor i " +
    "LEFT JOIN FETCH i.user " +
    "WHERE c.status = :status " +
    "ORDER BY c.regDate DESC")
  List<Course> findTop5ByStatusOrderByRegDateDesc(@Param("status") Course.CourseStatus status);

  Optional<Course> findByIdAndStatus(Long id, Course.CourseStatus status);

  // 상태와 가격(무료 강의인 경우 price = 0)으로 조회
  @Query("SELECT DISTINCT c FROM Course c " +
    "LEFT JOIN FETCH c.instructor i " +
    "LEFT JOIN FETCH i.user " +
    "WHERE c.status = :status AND c.price = :price " +
    "ORDER BY c.regDate DESC")
  List<Course> findTop5ByStatusAndPrice(@Param("status") Course.CourseStatus status, @Param("price") Integer price);

  // 메인 페이지 카테고리별 top1 강의 (ACTIVE 상태, 평점 내림차순)
  @Query("SELECT DISTINCT c FROM Course c " +
    "LEFT JOIN FETCH c.instructor i " +
    "LEFT JOIN FETCH i.user " +
    "WHERE c.category.id = :categoryId AND c.status = :status " +
    "ORDER BY (SELECT COALESCE(AVG(cr.rating), 0) FROM CourseRating cr WHERE cr.course = c AND cr.isDel = false) DESC")
  List<Course> findTopByCategoryIdAndStatusOrderByAverageRatingDesc(
    @Param("categoryId") Long categoryId,
    @Param("status") Course.CourseStatus status,
    Pageable pageable);

  // instructor, category 정보만 포함한 기본 fetch
  @Query("SELECT c FROM Course c " +
    "LEFT JOIN FETCH c.instructor i " +
    "LEFT JOIN FETCH i.user " +
    "LEFT JOIN FETCH c.category " +
    "WHERE c.id = :id")
  Optional<Course> findBasicById(@Param("id") Long id);

  // CourseSection + Lecture fetch
  @Query("SELECT cs FROM CourseSection cs " +
    "LEFT JOIN FETCH cs.lectures " +
    "WHERE cs.course.id = :courseId")
  List<CourseSection> findSectionsByCourseId(@Param("courseId") Long courseId);

  // CourseTechMapping + TechStack fetch
  @Query("SELECT ct FROM CourseTechMapping ct " +
    "LEFT JOIN FETCH ct.techStack " +
    "WHERE ct.course.id = :courseId")
  List<CourseTechMapping> findTechsByCourseId(@Param("courseId") Long courseId);

  // 인기 강의 조회 (수강생 수 기준)
  @Query("SELECT DISTINCT c FROM Course c " +
    "LEFT JOIN FETCH c.instructor i " +
    "LEFT JOIN FETCH i.user " +
    "WHERE c.status = :status " +
    "ORDER BY (SELECT COUNT(ce) FROM CourseEnrollment ce WHERE ce.course = c) DESC")
  Page<Course> findPopularCourses(@Param("status") Course.CourseStatus status, Pageable pageable);

  // 모든 강의 조회 (최적화된 쿼리)
  @Query("SELECT DISTINCT c FROM Course c " +
    "LEFT JOIN FETCH c.instructor i " +
    "LEFT JOIN FETCH i.user u " +
    "LEFT JOIN FETCH c.category " +
    "WHERE c.status = :status " +
    "ORDER BY c.regDate DESC")
  List<Course> findAllWithInstructor(@Param("status") Course.CourseStatus status);

  // 새로운 강의 조회 (최적화된 쿼리)
  @Query("SELECT DISTINCT c FROM Course c " +
    "LEFT JOIN FETCH c.instructor i " +
    "LEFT JOIN FETCH i.user " +
    "LEFT JOIN FETCH c.category " +
    "WHERE c.status = :status AND c.regDate > :date")
  List<Course> findNewCourses(@Param("status") Course.CourseStatus status, @Param("date") LocalDateTime date);

  // 무료 강의 조회 (최적화된 쿼리)
  @Query("SELECT DISTINCT c FROM Course c " +
    "LEFT JOIN FETCH c.instructor i " +
    "LEFT JOIN FETCH i.user " +
    "LEFT JOIN FETCH c.category " +
    "WHERE c.status = :status AND c.price = 0")
  List<Course> findFreeCourses(@Param("status") Course.CourseStatus status);

  // 강의 통계 정보를 한 번에 가져오는 쿼리
  @Query("SELECT c.id, " +
    "COUNT(DISTINCT ce) as studentCount, " +
    "COALESCE(AVG(cr.rating), 0) as avgRating, " +
    "COUNT(DISTINCT cr) as ratingCount " +
    "FROM Course c " +
    "LEFT JOIN CourseEnrollment ce ON ce.course = c AND ce.isDel = false " +
    "LEFT JOIN CourseRating cr ON cr.course = c " +
    "WHERE c.id IN :courseIds " +
    "GROUP BY c.id")
  List<Object[]> getCourseStats(@Param("courseIds") List<Long> courseIds);

  // 삭제되지 않은 전체 강의 수
  int countByIsDelFalse();

  // 최근(일주일) 작성된 게시글 수
  int countByRegDateBeforeAndIsDelFalse(LocalDateTime regDate);

  // 심사 대기중인 강의 개수
  int countByStatus(Course.CourseStatus status);

  Course findTopByOrderByRegDateDesc();

  List<Course> findAllByStatus(Course.CourseStatus status);

  List<Course> findByStatusAndIsDelFalse(Course.CourseStatus status);

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

