package com.elearning.chat.controller.inquiry;

import com.elearning.chat.dto.inquiry.AdminSendChatMessageRequestDTO;
import com.elearning.chat.dto.inquiry.AdminReadEventDTO;
import com.elearning.chat.dto.inquiry.AdminChatMessageDTO;
import com.elearning.chat.service.inquiry.AdminInquiryMessageService;
import com.elearning.chat.service.inquiry.AdminInquiryReadService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class AdminInquiryWebSocketController {
  private final SimpMessagingTemplate messagingTemplate;
  private final AdminInquiryMessageService messageService;
  private final AdminInquiryReadService readService;

  /** 1) 관리자 메시지 전송 전용 */
  @MessageMapping("/inquiry/message")
  public void handleInquiryMessage(@Payload AdminSendChatMessageRequestDTO req) {
    // 메시지 저장 + DTO 생성
    AdminChatMessageDTO resp = messageService.sendMessage(
      req.getRoomId(),
      req.getAdminId(),
      req.getMessage()
    );
    // ChatController와 동일하게 브로드캐스트
    messagingTemplate.convertAndSend(
      "/topic/chat/" + req.getRoomId(),
      resp
    );
  }

  /** 2) 관리자 읽음 처리 전용 */
  @MessageMapping("/inquiry/read")
  public void handleInquiryRead(@Payload AdminReadEventDTO dto) {
    // 읽음 처리
    readService.markAsRead(
      dto.getRoomId(),
      dto.getAdminId(),
      dto.getMessageIds()
    );
    // ChatController와 동일하게 읽음 이벤트 브로드캐스트
    messagingTemplate.convertAndSend(
      "/topic/chat/" + dto.getRoomId(),
      dto
    );
  }
}

