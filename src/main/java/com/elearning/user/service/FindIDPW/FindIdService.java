package com.elearning.user.service.FindIDPW;

import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class FindIdService {
  private final UserRepository userRepository;
  private final SmsService smsService;

  private final Map<String, String> authCodeMap = new ConcurrentHashMap<>();

  // 인증번호 생성
  private String createAuthCode() {
    return String.valueOf((int) ((Math.random() * 900000) + 100000)); // 6자리 숫자
  }

  // 인증번호 발송
  public void sendAuthCode(String phone) {
    if (!userRepository.existsByPhone(phone)) {
      throw new RuntimeException("등록되지 않은 전화번호입니다.");
    }

    String authCode = createAuthCode();
    smsService.sendMessage(phone, "[elearning] 인증번호: " + authCode);
    authCodeMap.put(phone, authCode);
  }

  // 인증번호 검증 + 아이디(이메일) 반환
  public String verifyAuthCode(String phone, String inputCode) {
    String savedCode = authCodeMap.get(phone);

    if (savedCode == null) {
      throw new RuntimeException("인증번호를 먼저 요청해주세요.");
    }

    if (!savedCode.equals(inputCode)) {
      throw new RuntimeException("인증번호가 일치하지 않습니다.");
    }

    // 인증 성공 -> 이메일 반환
    return userRepository.findEmailByPhone(phone)
      .orElseThrow(() -> new RuntimeException("해당 전화번호로 가입된 이메일이 없습니다."));
  }
}
