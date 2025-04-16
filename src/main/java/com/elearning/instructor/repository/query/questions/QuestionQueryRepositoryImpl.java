package com.elearning.instructor.repository.query.questions;

import com.elearning.instructor.dto.questions.QuestionListDTO;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class QuestionQueryRepositoryImpl implements QuestionQueryRepository {

  private final EntityManager em;

  @Override
  public Page<QuestionListDTO> searchQuestionList(Long instructorId, String keyword, Long courseId, String status, String sortBy, Pageable pageable) {

    StringBuilder jpql = new StringBuilder("""
      SELECT new com.elearning.instructor.dto.questions.QuestionListDTO(
        b.id,
        b.subject,
        c.subject,
        u.nickname,
        b.regDate,
        b.viewCount,
        (SELECT COUNT(cm) FROM Comment cm WHERE cm.board.id = b.id AND cm.isDel = false),
        (SELECT COUNT(bl) FROM BoardLike bl WHERE bl.board.id = b.id),
        CASE 
          WHEN (SELECT COUNT(cm) 
                FROM Comment cm 
                WHERE cm.board.id = b.id 
                  AND cm.isDel = false 
                  AND cm.user.id = (SELECT i.user.id FROM Instructor i WHERE i.id = :instructorId)) > 0
          THEN '답변완료'
          ELSE '미답변'
        END
      )
      FROM Board b
      JOIN b.course c
      JOIN b.user u
      WHERE b.bname = '질문및답변'
        AND b.isDel = false
        AND c.instructor.id = :instructorId
    """);

    if (keyword != null && !keyword.isBlank()) {
      jpql.append(" AND (b.subject LIKE :keyword OR u.nickname LIKE :keyword) ");
    }

    if (courseId != null) {
      jpql.append(" AND c.id = :courseId ");
    }

    if (status != null && !"전체".equals(status)) {
      if ("미답변".equals(status)) {
        jpql.append("""
          AND (SELECT COUNT(cm) 
               FROM Comment cm 
               WHERE cm.board.id = b.id 
                 AND cm.isDel = false 
                 AND cm.user.id = (SELECT i.user.id FROM Instructor i WHERE i.id = :instructorId)) = 0
        """);
      } else if ("답변완료".equals(status)) {
        jpql.append("""
          AND (SELECT COUNT(cm) 
               FROM Comment cm 
               WHERE cm.board.id = b.id 
                 AND cm.isDel = false 
                 AND cm.user.id = (SELECT i.user.id FROM Instructor i WHERE i.id = :instructorId)) > 0
        """);
      }
    }

    if ("최근 답변순".equals(sortBy)) {
      jpql.append("""
    ORDER BY (SELECT MAX(cm.regDate) 
              FROM Comment cm 
              WHERE cm.board.id = b.id) DESC NULLS LAST
  """);
    } else if ("추천순".equals(sortBy)) {
      jpql.append("""
    ORDER BY (SELECT COUNT(bl) 
              FROM BoardLike bl 
              WHERE bl.board.id = b.id) DESC
  """);
    } else { // 기본 최신순
      jpql.append(" ORDER BY b.id DESC ");
    }

    var query = em.createQuery(jpql.toString(), QuestionListDTO.class)
      .setParameter("instructorId", instructorId)
      .setFirstResult((int) pageable.getOffset())
      .setMaxResults(pageable.getPageSize());

    if (keyword != null && !keyword.isBlank()) {
      query.setParameter("keyword", "%" + keyword + "%");
    }

    if (courseId != null) {
      query.setParameter("courseId", courseId);
    }

    List<QuestionListDTO> content = query.getResultList();

    Long total = em.createQuery("""
      SELECT COUNT(b)
      FROM Board b
      JOIN b.course c
      WHERE b.bname = '질문및답변'
        AND b.isDel = false
        AND c.instructor.id = :instructorId
    """, Long.class)
      .setParameter("instructorId", instructorId)
      .getSingleResult();

    return PageableExecutionUtils.getPage(content, pageable, () -> total);
  }
}
