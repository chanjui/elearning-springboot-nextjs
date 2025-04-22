package com.elearning.user.repository;

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
    return em.createQuery(
        "SELECT new com.elearning.user.dto.Home.UserHomePostDTO(" +
          "b.id, " +
          "b.bname, " +
          "b.subject, " +
          "b.content, " +
          "FUNCTION('DATE_FORMAT', b.regDate, '%Y.%m.%d'), " +
          "b.viewCount, " +
          "(SELECT COUNT(bl) FROM BoardLike bl WHERE bl.board.id = b.id), " + // 좋아요 수
          "(SELECT COUNT(c) FROM Comment c WHERE c.board.id = b.id), " +       // 댓글 수
          "NULL" +                                                             // reply (아직 reply 기능 없음)
          ") " +
          "FROM Board b " +
          "WHERE b.user.id = :userId " +
          "AND b.bname = com.elearning.course.entity.BoardType.질문및답변 " +
          "ORDER BY b.regDate DESC",
        UserHomePostDTO.class
      )
      .setParameter("userId", userId)
      .getResultList();
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
