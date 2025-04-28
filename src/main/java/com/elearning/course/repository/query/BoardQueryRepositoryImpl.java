package com.elearning.course.repository.query;

import com.elearning.course.dto.BoardInstructorDTO;
import com.elearning.course.dto.Community.TopWriterDTO;
import com.elearning.course.entity.Board;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class BoardQueryRepositoryImpl implements BoardQueryRepository {

  @PersistenceContext
  private EntityManager em;

  @Override
  public List<BoardInstructorDTO> findPostsByInstructorId(Long instructorId) {
    // 먼저 Board 엔티티를 조회하는 방식으로 변경했어요
    // 그전에는 바로 dto를 만들려고하시더고요
    String jpql = """
      SELECT b
      FROM Board b
      WHERE b.course.instructor.id = :instructorId
        AND b.isDel = false
      ORDER BY b.regDate DESC
    """;

    TypedQuery<Board> query = em.createQuery(jpql, Board.class);
    query.setParameter("instructorId", instructorId);
    List<Board> boards = query.getResultList();

    // Board 엔티티를 DTO로 변환
    return boards.stream().map(board -> {
      // 강사의 마지막 댓글 조회
      String commentJpql = """
        SELECT c.content
        FROM Comment c
        WHERE c.board.id = :boardId
          AND c.user.id = :instructorUserId
          AND c.regDate = (
              SELECT MAX(c2.regDate)
              FROM Comment c2
              WHERE c2.board.id = :boardId
                AND c2.user.id = :instructorUserId
                AND c2.isDel = false
          )
      """;

      TypedQuery<String> commentQuery = em.createQuery(commentJpql, String.class);
      commentQuery.setParameter("boardId", board.getId());
      commentQuery.setParameter("instructorUserId", board.getCourse().getInstructor().getUser().getId());
      List<String> comments = commentQuery.getResultList();
      String reply = comments.isEmpty() ? "" : comments.get(0);

      // 좋아요 수 조회
      String likeCountJpql = """
          SELECT COUNT(*)
          FROM BoardLike bl
          JOIN bl.board b
          WHERE bl.board.id = :boardId
            AND b.isDel = false
      """;
      TypedQuery<Long> likeCountQuery = em.createQuery(likeCountJpql, Long.class);
      likeCountQuery.setParameter("boardId", board.getId());
      Long likeCount = likeCountQuery.getSingleResult();

      // 댓글 수 조회
      String commentCountJpql = "SELECT COUNT(*) FROM Comment c WHERE c.board.id = :boardId AND c.isDel = false";
      TypedQuery<Long> commentCountQuery = em.createQuery(commentCountJpql, Long.class);
      commentCountQuery.setParameter("boardId", board.getId());
      Long commentCount = commentCountQuery.getSingleResult();

      // DTO 생성 및 반환
      return new BoardInstructorDTO(
        board.getId(),
        board.getBname(),
        board.getSubject(),
        board.getContent(),
        board.getRegDate(),
        (long) board.getViewCount(),
        reply,
        likeCount,
        commentCount
      );
    }).collect(Collectors.toList());
  }

  @Override
  public List<TopWriterDTO> findTopWriters(int limit) {
    String jpql = """
        SELECT 
            u.id,
            u.nickname,
            u.profileUrl,
            COUNT(b.id)
        FROM Board b
        JOIN b.user u
        WHERE b.isDel = false
        GROUP BY u.id, u.nickname, u.profileUrl
        ORDER BY COUNT(b.id) DESC
    """;

    List<Object[]> resultList = em.createQuery(jpql, Object[].class)
      .setMaxResults(limit)
      .getResultList();

    return resultList.stream()
      .map(row -> {
        Long userId = row[0] != null ? ((Number) row[0]).longValue() : 0L;
        String nickname = row[1] != null ? (String) row[1] : "";
        String profileUrl = row[2] != null ? (String) row[2] : "";
        Long postCount = row[3] != null ? ((Number) row[3]).longValue() : 0L;
        return new TopWriterDTO(userId, nickname, profileUrl, postCount);
      })
      .collect(Collectors.toList());
  }
}