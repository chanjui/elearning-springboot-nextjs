package com.elearning.chat.controller;

import com.elearning.chat.dto.ReadEventDTO;
import com.elearning.chat.dto.SendChatMessageRequestDTO;
import com.elearning.chat.dto.ChatMessageSendResponseDTO;
import com.elearning.chat.service.ChatMessageReadService;
import com.elearning.chat.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {
  private final SimpMessagingTemplate messagingTemplate;
  private final ChatMessageService chatMessageService;
  private final ChatMessageReadService chatMessageReadService;

  /** 1) 일반 메시지 전송 전용 */
  @MessageMapping("/chat/message")
  public void handleMessage(@Payload SendChatMessageRequestDTO req) {
    // 메시지 저장
    ChatMessageSendResponseDTO resp = chatMessageService.saveMessage(req);
    // 해당 룸 구독자에게 브로드캐스트
    messagingTemplate.convertAndSend("/topic/chat/" + req.getRoomId(), resp);
  }

  /** 2) 읽음 처리 전용 */
  @MessageMapping("/chat/read")
  public void handleRead(@Payload ReadEventDTO dto) {
    // DB에 읽음 상태 저장
    chatMessageReadService.markMessagesAsRead(dto.getRoomId(), dto.getUserId(), dto.getMessageIds());
    // 읽음 이벤트만 브로드캐스트
    messagingTemplate.convertAndSend("/topic/chat/" + dto.getRoomId(), dto);
  }
}
