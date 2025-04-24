package com.elearning.user.repository;

import com.elearning.course.entity.Board;
import com.elearning.user.dto.Home.UserHomeProfileDTO;
import com.elearning.user.dto.Home.UserHomePostDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class UserHomeRepositoryImpl implements UserHomeRepository {

  @PersistenceContext
  private EntityManager em;

  @Override
  public UserHomeProfileDTO findUserProfile(Long userId) {
    return em.createQuery(
        "SELECT new com.elearning.user.dto.Home.UserHomeProfileDTO(u.id, u.nickname, u.bio, u.githubLink, u.profileUrl) " +
          "FROM User u WHERE u.id = :userId", UserHomeProfileDTO.class)
      .setParameter("userId", userId)
      .getSingleResult();
  }

  @Override
  public List<UserHomePostDTO> findUserPosts(Long userId) {
    String jpql = """
    SELECT b FROM Board b
    WHERE b.user.id = :userId
      AND b.bname = '질문및답변'
    ORDER BY b.regDate DESC
  """;

    List<Board> boards = em.createQuery(jpql, Board.class)
      .setParameter("userId", userId)
      .getResultList();

    return boards.stream().map(board -> {
      // 좋아요 수
      Long likeCount = em.createQuery(
          "SELECT COUNT(bl) FROM BoardLike bl WHERE bl.board.id = :boardId", Long.class)
        .setParameter("boardId", board.getId())
        .getSingleResult();

      // 댓글 수
      Long commentCount = em.createQuery(
          "SELECT COUNT(c) FROM Comment c WHERE c.board.id = :boardId", Long.class)
        .setParameter("boardId", board.getId())
        .getSingleResult();

      // 작성자가 강사인지 확인
      Boolean isInstructor = em.createQuery(
          "SELECT COUNT(i) FROM Instructor i WHERE i.user.id = :userId", Long.class)
        .setParameter("userId", board.getUser().getId())
        .getSingleResult() > 0;

      // 날짜 포맷 처리
      String formattedDate = board.getRegDate().toLocalDate().toString().replace("-", ".");

      return new UserHomePostDTO(
        board.getId(),
        board.getBname().toString(),
        board.getSubject(),
        board.getContent(),
        formattedDate,
        board.getViewCount(),
        likeCount.intValue(),
        commentCount.intValue(),
        null,
        board.getUser().getId(),
        isInstructor
      );
    }).toList();
  }

  @Override
  public int countFollowers(Long userId) {
    Long count = em.createQuery(
        "SELECT COUNT(l) FROM LikeTable l " +
          "WHERE l.targetUser.id = :userId " +
          "AND l.type = 2",
        Long.class
      )
      .setParameter("userId", userId)
      .getSingleResult();
    return count.intValue();
  }

  @Override
  public boolean isFollowing(Long loginUserId, Long targetUserId) {
    Long count = em.createQuery(
        "SELECT COUNT(l) FROM LikeTable l " +
          "WHERE l.user.id = :loginUserId " +
          "AND l.targetUser.id = :targetUserId " +
          "AND l.type = 2",
        Long.class
      )
      .setParameter("loginUserId", loginUserId)
      .setParameter("targetUserId", targetUserId)
      .getSingleResult();
    return count > 0;
  }
}
