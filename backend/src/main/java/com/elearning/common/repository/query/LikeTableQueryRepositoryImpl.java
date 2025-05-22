package com.elearning.common.repository.query;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class LikeTableQueryRepositoryImpl implements LikeTableQueryRepository {
  @PersistenceContext
  private EntityManager em;

  @Override
  public boolean isFollowing(Long userId, Long instructorId) {
    String query = "SELECT COUNT(l) FROM LikeTable l WHERE l.user.id = :userId AND l.instructor.id = :instructorId AND l.type = 2";
    Long count = em.createQuery(query, Long.class)
      .setParameter("userId", userId)
      .setParameter("instructorId", instructorId)
      .getSingleResult();
    return count > 0;
  }
}
