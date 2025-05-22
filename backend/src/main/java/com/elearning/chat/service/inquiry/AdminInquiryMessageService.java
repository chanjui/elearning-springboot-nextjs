package com.elearning.chat.service.inquiry;

import com.elearning.chat.dto.inquiry.AdminChatMessageDTO;
import com.elearning.chat.dto.inquiry.AdminReadEventDTO;

import java.util.List;

public interface AdminInquiryMessageService {
  /**
   * 해당 방의 모든 메시지를 DTO 리스트로 조회
   */
  List<AdminChatMessageDTO> getMessages(Long roomId);

  /**
   * 관리자 메시지를 저장하고, 브로드캐스트할 DTO를 반환
   */
  AdminChatMessageDTO sendMessage(Long roomId, Long adminId, String content);

  /**
   * 읽음 처리 후, 읽음 이벤트 DTO를 반환
   */
  AdminReadEventDTO markAsRead(Long roomId, Long adminId, List<Long> messageIds);
}
