package com.elearning.chat.service;

import java.util.List;

public interface ChatMessageReadService {
  /**
   * 주어진 메시지들에 대해 읽음 레코드를 남긴다.
   *
   * @param roomId     채팅방 아이디
   * @param userId     읽음 처리 하는 사용자 아이디
   * @param messageIds 읽음 처리할 메시지 ID 목록
   */
  void markMessagesAsRead(Long roomId, Long userId, List<Long> messageIds);
}
