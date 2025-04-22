package com.elearning.chat.repository;

import com.elearning.chat.entity.ChatRoomParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatRoomParticipantRepository extends JpaRepository<ChatRoomParticipant, Long> {

  // 특정 유저가 속한 모든 채팅방 ID 조회
  @Query("SELECT p.chatRoomId FROM ChatRoomParticipant p WHERE p.userId = :userId")
  List<Long> findChatRoomIdsByUserId(Long userId);

  // 채팅방에 속한 모든 참여자 조회
  List<ChatRoomParticipant> findByChatRoomId(Long chatRoomId);

  // 해당 유저가 이미 참여 중인 채팅방이 있는지 확인
  @Query("SELECT p FROM ChatRoomParticipant p WHERE p.chatRoomId = :roomId AND p.userId = :userId")
  ChatRoomParticipant findByRoomIdAndUserId(Long roomId, Long userId);

  // 유저 ID로 참여 중인 채팅방 리스트 조회
  List<ChatRoomParticipant> findByUserId(Long userId);
}
