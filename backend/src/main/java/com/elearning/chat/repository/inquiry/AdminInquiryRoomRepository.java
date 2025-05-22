package com.elearning.chat.repository.inquiry;

import com.elearning.chat.entity.inquiry.AdminInquiryRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdminInquiryRoomRepository extends JpaRepository<AdminInquiryRoom, Long> {
  // AdminInquiryRoomRepository.java
  // 1) 사용자 이름 검색 (User 엔티티와 조인)
  @Query("""
      SELECT r
      FROM AdminInquiryRoom r
      JOIN User u ON r.userId = u.id
      WHERE LOWER(u.nickname) LIKE LOWER(CONCAT('%', :search, '%'))
    """)
  List<AdminInquiryRoom> findByUserNameContaining(@Param("search") String search);

  // 2) 마지막 메시지 내용 검색 (서브쿼리로 각 방의 최신 메시지)
  @Query("""
      SELECT r
      FROM AdminInquiryRoom r
      WHERE EXISTS (
        SELECT 1
        FROM AdminInquiryMessage m
        WHERE m.roomId = r.id
          AND LOWER(m.message) LIKE LOWER(CONCAT('%', :search, '%'))
      )
    """)
  List<AdminInquiryRoom> findByLastMessageContaining(@Param("search") String search);
}
