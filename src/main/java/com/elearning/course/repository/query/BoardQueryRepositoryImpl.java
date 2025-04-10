package com.elearning.course.repository.query;

import com.elearning.course.dto.BoardInstructorDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BoardQueryRepositoryImpl implements BoardQueryRepository {

  @PersistenceContext
  private EntityManager em;

  @Override
  public List<BoardInstructorDTO> findPostsByInstructorId(Long instructorId) {
    String jpql = """
      SELECT new com.elearning.course.dto.BoardInstructorDTO(
           b.id,
           CAST(b.bname AS string),
           b.subject,
           b.content,
           b.regDate,
           b.viewCount,
           COALESCE((
               SELECT c.content
               FROM Comment c
               WHERE c.board.id = b.id
                 AND c.user.id = b.course.instructor.user.id
                 AND c.regDate = (
                     SELECT MAX(c2.regDate)
                     FROM Comment c2
                     WHERE c2.board.id = b.id
                       AND c2.user.id = b.course.instructor.user.id
                 )
           ), ''),
           (SELECT COUNT(*) FROM BoardLike bl WHERE bl.board.id = b.id),
           (SELECT COUNT(*) FROM Comment c WHERE c.board.id = b.id)
      )
      FROM Board b
      WHERE b.course.instructor.id = :instructorId
        AND b.isDel = false
      ORDER BY b.regDate DESC
    """;

    TypedQuery<BoardInstructorDTO> query = em.createQuery(jpql, BoardInstructorDTO.class);
    query.setParameter("instructorId", instructorId);
    return query.getResultList();
  }
}
