package com.elearning.common.config;

import lombok.RequiredArgsConstructor;
import net.nurigo.java_sdk.api.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class SmsConfig {

  @Value("${coolsms.api-key}")
  private String apiKey;

  @Value("${coolsms.api-secret}")
  private String apiSecret;

  @Bean
  public Message coolSmsMessage() {
    return new Message(apiKey, apiSecret);
  }
}
