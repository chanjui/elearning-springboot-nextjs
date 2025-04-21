package com.elearning.chat.repository;

import com.elearning.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

  // 오름차순 메시지 조회
  @Query("SELECT m FROM ChatMessage m WHERE m.room.id = :roomId ORDER BY m.sendAt ASC")
  List<ChatMessage> findByRoomIdOrderByCreatedAtAsc(@Param("roomId") Long roomId);

  // 내림차순 메시지 조회
  @Query("SELECT m FROM ChatMessage m WHERE m.room.id = :roomId ORDER BY m.sendAt DESC")
  List<ChatMessage> findByRoomIdOrderByCreatedAtDesc(@Param("roomId") Long roomId);

  // 안 읽은 메시지 (내가 보낸 건 제외)
  @Query("SELECT m FROM ChatMessage m WHERE m.room.id = :roomId AND m.senderId <> :userId AND m.isRead = false")
  List<ChatMessage> findUnreadMessages(@Param("roomId") Long roomId, @Param("userId") Long userId);

}
