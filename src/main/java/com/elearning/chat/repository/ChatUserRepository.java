package com.elearning.chat.repository;

import com.elearning.chat.dto.ChatUserDTO;
import com.elearning.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatUserRepository extends JpaRepository<User, Long> {

  @Query("""
    SELECT new com.elearning.chat.dto.ChatUserDTO(
      u.id, u.nickname, u.email, u.githubLink, u.profileUrl, u.isInstructor
    )
    FROM User u
    WHERE u.isDel = false
      AND (
        LOWER(u.nickname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR
        LOWER(u.githubLink) LIKE LOWER(CONCAT('%', :keyword, '%'))
      )
    """)
  List<ChatUserDTO> searchUsers(@Param("keyword") String keyword);

  @Query("""
    SELECT new com.elearning.chat.dto.ChatUserDTO(
      u.id, u.nickname, u.email, u.githubLink, u.profileUrl, u.isInstructor
    )
    FROM LikeTable l
    JOIN l.targetUser u
    WHERE l.user.id = :userId
      AND u.isDel = false
    """)
  List<ChatUserDTO> getRecommendedUsers(@Param("userId") Long userId);
}
