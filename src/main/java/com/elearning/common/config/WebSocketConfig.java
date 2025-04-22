package com.elearning.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    // 클라이언트가 연결할 수 있는 WebSocket 엔드포인트 지정
    registry.addEndpoint("/ws")  // 이게 필요함!
      .setAllowedOriginPatterns("*")  // CORS 허용
      .withSockJS(); // SockJS 사용 시
  }

  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    registry.enableSimpleBroker("/topic"); // 프론트 구독 경로: "/topic/chat"
    registry.setApplicationDestinationPrefixes("/app"); // 프론트 전송 경로: "/app/chat/message"
  }
}
