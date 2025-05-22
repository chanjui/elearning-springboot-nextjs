package com.elearning.common.config;

import lombok.RequiredArgsConstructor;
import net.nurigo.java_sdk.api.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration
@RequiredArgsConstructor
@Profile("sms") // SMS 기능이 필요한 프로필에서만 로드
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
