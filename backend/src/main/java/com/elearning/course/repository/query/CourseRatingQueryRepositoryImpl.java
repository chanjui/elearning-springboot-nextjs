package com.elearning.course.repository.query;

import com.elearning.course.dto.CourseRatingDTO;
import com.elearning.course.repository.CourseRatingRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CourseRatingQueryRepositoryImpl implements CourseRatingQueryRepository {

  @PersistenceContext
  private EntityManager em;

  // 강의 평점 조회
  @Override
  public List<CourseRatingDTO> findRatingsByInstructorId(Long instructorId) {
    String jpql = """
                SELECT new com.elearning.course.dto.CourseRatingDTO(
                    cr.id,
                    cr.course.id,
                    cr.course.subject,
                    cr.course.thumbnailUrl,
                    cr.user.id,
                    cr.user.nickname,
                    cr.user.profileUrl,
                    cr.content,
                    cr.rating,
                    cr.regDate
                )
                FROM CourseRating cr
                WHERE cr.course.instructor.id = :instructorId
                AND cr.isDel = false
                ORDER BY cr.regDate DESC
                """;

    TypedQuery<CourseRatingDTO> query = em.createQuery(jpql, CourseRatingDTO.class);
    query.setParameter("instructorId", instructorId);

    return query.getResultList();
  }

  // 특정 강사가 등록한 모든 강의에 작성된 수강평 총 개수
  @Override
  public int countRatingsByInstructorId(Long instructorId) {
    String jpql = """
      SELECT COUNT(cr)
      FROM CourseRating cr
      WHERE cr.course.instructor.id = :instructorId
        AND cr.isDel = false
  """;
    Long count = em.createQuery(jpql, Long.class)
      .setParameter("instructorId", instructorId)
      .getSingleResult();
    return count.intValue();
  }

  // 전체 강의 평균 평점
  @Override
  public double averageRatingByInstructorId(Long instructorId) {
    String jpql = """
      SELECT AVG(cr.rating)
      FROM CourseRating cr
      JOIN cr.course c
      JOIN c.instructor i
      WHERE i.id = :instructorId
        AND cr.isDel = false
        AND cr.rating IS NOT NULL
  """;
    Double avg = em.createQuery(jpql, Double.class)
      .setParameter("instructorId", instructorId)
      .getSingleResult();
    return avg != null ? avg : 0.0;
  }

  @Override
  public double averageRatingByCourseId(Long courseId) {
    String jpql = """
      SELECT AVG(cr.rating)
      FROM CourseRating cr
      WHERE cr.course.id = :courseId
        AND cr.isDel = false
        AND cr.rating IS NOT NULL
    """;
    Double avg = em.createQuery(jpql, Double.class)
      .setParameter("courseId", courseId)
      .getSingleResult();
    return avg != null ? avg : 0.0;
  }

}
