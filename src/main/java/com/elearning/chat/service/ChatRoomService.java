package com.elearning.chat.service;

import com.elearning.chat.dto.ChatMessageResponseDTO;
import com.elearning.chat.dto.ChatRoomResponseDTO;

import java.util.List;

public interface ChatRoomService {
  // 1:1 or 1:N 채팅방 생성
  ChatRoomResponseDTO createChatRoom(List<Long> participantIds);

  // 유저가 속한 모든 채팅방 목록1
  List<ChatRoomResponseDTO> getChatRoomsForUser(Long userId);

  // 특정 채팅방 상세 정보 (참여자 목록 등)
  ChatRoomResponseDTO getChatRoomInfo(Long roomId, Long userId);
  List<ChatMessageResponseDTO> getMessages(Long roomId);
}
