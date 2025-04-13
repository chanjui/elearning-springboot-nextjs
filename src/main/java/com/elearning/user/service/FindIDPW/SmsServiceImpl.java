package com.elearning.user.service.FindIDPW;

import lombok.RequiredArgsConstructor;
import net.nurigo.java_sdk.api.Message;
import net.nurigo.java_sdk.exceptions.CoolsmsException;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class SmsServiceImpl implements SmsService {

  private final Message coolSmsMessage;

  @Override
  public void sendMessage(String to, String content) {
    HashMap<String, String> params = new HashMap<>();
    params.put("to", to);                  // 수신번호
    params.put("from", "01099067266");     // 발신번호 (쿨SMS 등록번호)
    params.put("type", "SMS");             // 문자타입
    params.put("text", content);           // 보낼 내용

    try {
      coolSmsMessage.send(params);
    } catch (CoolsmsException e) {
      throw new RuntimeException("문자 발송 실패 : " + e.getMessage());
    }
  }
}