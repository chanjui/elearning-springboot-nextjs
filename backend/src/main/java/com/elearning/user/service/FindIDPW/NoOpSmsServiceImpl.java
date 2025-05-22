package com.elearning.user.service.FindIDPW;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Profile("!sms")
public class NoOpSmsServiceImpl implements SmsService {
    @Override
    public void sendMessage(String to, String content) {
        log.info("SMS is disabled. Would have sent message to {} with content: {}", to, content);
    }
} 