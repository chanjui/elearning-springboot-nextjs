package com.elearning.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  @Override
  public void configureMessageBroker(MessageBrokerRegistry config) {
    config.enableSimpleBroker("/topic"); // 프론트에서 구독하는 경로
    config.setApplicationDestinationPrefixes("/app"); // 프론트에서 메시지 보낼 때 접두어
  }

  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry.addEndpoint("/ws") // 프론트에서 SockJS 연결할 경로
      .setAllowedOriginPatterns("*")
      .withSockJS();
  }
}

