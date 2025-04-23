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

  // 안 읽은 메시지 총 개수
  @Query("SELECT COUNT(m) FROM ChatMessage m " +
    "WHERE m.room.id IN :roomIds " +
    "AND m.senderId != :userId " +
    "AND NOT EXISTS (" +
    "   SELECT r FROM ChatMessageRead r WHERE r.message.id = m.id AND r.user.id = :userId" +
    ")")
  int countUnreadMessagesByUserId(@Param("userId") Long userId, @Param("roomIds") List<Long> roomIds);

  // 안읽은 메시지 목록 보기
  @Query("SELECT m FROM ChatMessage m " +
    "WHERE m.room.id = :roomId " +
    "AND m.senderId <> :userId " +
    "AND NOT EXISTS (" +
    "  SELECT r FROM ChatMessageRead r WHERE r.message.id = m.id AND r.user.id = :userId" +
    ") " +
    "ORDER BY m.sendAt DESC")
  List<ChatMessage> findUnreadMessagesByRoomIdAndUserId(@Param("roomId") Long roomId,
                                                        @Param("userId") Long userId);
  // 안읽은 메시지 목록 보기
  @Query("SELECT COUNT(m) FROM ChatMessage m " +
    "WHERE m.room.id = :roomId " +
    "AND m.senderId <> :userId " +
    "AND NOT EXISTS (" +
    "  SELECT r FROM ChatMessageRead r WHERE r.message.id = m.id AND r.user.id = :userId" +
    ")")
  int countUnreadMessagesByRoomIdAndUserId(@Param("roomId") Long roomId,
                                           @Param("userId") Long userId);
}
