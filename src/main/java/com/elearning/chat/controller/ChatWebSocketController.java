package com.elearning.chat.controller;

import com.elearning.chat.dto.SendChatMessageRequestDTO;
import com.elearning.chat.dto.ChatMessageSendResponseDTO;
import com.elearning.chat.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {

  private static final Logger logger = LoggerFactory.getLogger(ChatWebSocketController.class);

  private final ChatMessageService chatMessageService;

  @MessageMapping("/chat/message") // 클라이언트가 "/app/chat/message"로 보낸 요청을 수신
  @SendTo("/topic/chat") // 이 경로로 구독 중인 모든 사용자에게 메시지 브로드캐스팅
  public ChatMessageSendResponseDTO receiveMessage(@Payload SendChatMessageRequestDTO request) {
    logger.info("WebSocket 메시지 수신: roomId={}, userId={}, content={}",
      request.getRoomId(), request.getUserId(), request.getContent());
    // DB 저장 로직 그대로 재사용
    return chatMessageService.saveMessage(request);
  }
}
