package com.elearning.chat.service;

import com.elearning.chat.dto.ChatMessageResponseDTO;
import com.elearning.chat.dto.ChatMessageSendResponseDTO;
import com.elearning.chat.dto.SendChatMessageRequestDTO;

import java.util.List;

public interface ChatMessageService {

  // 메시지 저장 및 전송
  ChatMessageSendResponseDTO saveMessage(SendChatMessageRequestDTO requestDto);

  // 채팅방 메시지 불러오기
  List<ChatMessageResponseDTO> getMessagesByRoomId(Long roomId);

  // 읽음 처리
  void markMessagesAsRead(Long roomId, Long userId);

  // 전체 안읽은 메시지 개수 조회
  int countTotalUnreadMessages(Long userId);
}
