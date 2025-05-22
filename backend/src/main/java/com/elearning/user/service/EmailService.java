package com.elearning.user.service;

import com.elearning.user.repository.EmailRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class EmailService {

  @Qualifier("gmailMailSender")
  private final JavaMailSender gmailMailSender;

  @Qualifier("naverMailSender")
  private final JavaMailSender naverMailSender;
  private final EmailRepository emailRepository;

  // 인증 코드 유효 시간 (ms)
  @Value("${email.auth-code-expiration-time}")
  private long codeExpirationTime;

  // 최대 발송 횟수 제한
  @Value("${email.auth-code-send-limit}")
  private int maxSendCount;

  // 제한 시간(예: 1시간 동안 최대 maxSendCount회 발송 가능)
  @Value("${email.auth-code-send-limit-window}")
  private long sendLimitWindow;

  // 인증 코드 6자리 무작위 생성
  public String createCode() {
    Random random = new Random();
    StringBuilder key = new StringBuilder();

    for (int i = 0; i < 6; i++) {
      int idx = random.nextInt(3);
      switch (idx) {
        case 0 -> key.append((char) (random.nextInt(26) + 97)); // a-z
        case 1 -> key.append((char) (random.nextInt(26) + 65)); // A-Z
        case 2 -> key.append(random.nextInt(10));               // 0-9
      }
    }
    return key.toString();
  }

  // 사용자가 입력한 인증 코드가 유효한지 확인
  public boolean verifyEmailAuthCode(String email, String inputAuthCode) {
    String storedAuthCode = emailRepository.getAuthCode(email);
    Long storedTimestamp = emailRepository.getAuthCodeTimestamp(email);

    // 저장된 인증 정보가 없거나, 유효 시간이 지났을 경우
    if (storedAuthCode == null || storedTimestamp == null || System.currentTimeMillis() > storedTimestamp + codeExpirationTime) {
      return false;
    }

    boolean isValid = inputAuthCode.equals(storedAuthCode);
    if (isValid) {
      emailRepository.verifyComplete(email);
    }
    return isValid;
  }

  // 이메일 인증 완료 여부 확인
  public boolean isEmailVerified(String email) {
    return emailRepository.isVerified(email);
  }

  // 이메일 주소에 따라 Gmail 또는 Naver 발송기 반환
  private JavaMailSender resolveMailSender(String email) {
    return email.endsWith("@naver.com") ? naverMailSender : gmailMailSender;
  }

  // 실제로 발송할 HTML 이메일 양식 생성
  public MimeMessage createEmailForm(JavaMailSender sender, String email, String authCode) throws MessagingException, UnsupportedEncodingException {
    String title = "회원가입 인증 코드";
    String msgOfEmail = "<div style='margin:20px;'>"
      + "<h1 style='font-size:16px; font-weight:bold;'>안녕하세요, [CodeFlix]입니다.</h1>"
      + "<p style='font-size:16px; color:#555;'>아래 인증 코드를 입력해주세요.</p>"
      + "<div style='margin-top:20px;'>"
      + "<div style='border:1px solid #ddd; padding:10px; background:#f9f9f9; border-radius:8px; "
      + "display:inline-block; text-align:center; min-width:200px;'>"
      + "<h3 style='color:#e50914; margin-bottom:10px; font-size:16px;'>회원가입 인증 코드</h3>"
      + "<div style='font-size:20px; font-weight:bold; color:#333;'><strong>" + authCode + "</strong></div>"
      + "</div>"
      + "</div>"
      + "</div>";

    // 보내는 사람 주소 설정
    String from = sender instanceof JavaMailSenderImpl ? ((JavaMailSenderImpl) sender).getUsername() : "elearning0326@gmail.com";

    MimeMessage message = sender.createMimeMessage();
    message.setFrom(from);
    message.addRecipients(MimeMessage.RecipientType.TO, email);
    message.setSubject(title);
    message.setText(msgOfEmail, "utf-8", "html");

    return message;
  }

  // 이메일 전송 (발송 횟수 제한 포함)
  public String sendEmail(String email) throws MessagingException, UnsupportedEncodingException {
    long now = System.currentTimeMillis();
    long resetTime = emailRepository.getSendResetTime(email);

    // 제한 시간이 지나면 카운트 초기화
    if (now > resetTime) {
      emailRepository.resetSendCount(email);
      emailRepository.setSendResetTime(email, now + sendLimitWindow);
    }

    // 발송 횟수 초과 여부 확인
    if (emailRepository.getSendCount(email) >= maxSendCount) {
      return null; // ✅ 예외 대신 null 반환
    }

    // 인증 코드 생성 및 이메일 전송
    String authCode = createCode();
    JavaMailSender sender = resolveMailSender(email);
    MimeMessage message = createEmailForm(sender, email, authCode);
    sender.send(message);

    // 인증 관련 정보 저장
    long expirationTime = System.currentTimeMillis() + codeExpirationTime;
    emailRepository.saveAuthCode(email, authCode);
    emailRepository.saveAuthCodeTimestamp(email, expirationTime);
    emailRepository.saveVerifiedStatus(email, false);
    emailRepository.incrementSendCount(email); // 횟수 증가

    return authCode;
  }

  // 인증 코드 재발급 (sendEmail과 동일하게 동작)
  public String reissueAuthCode(String email) throws MessagingException, UnsupportedEncodingException {
    return sendEmail(email); // 재발급도 동일한 로직 적용
  }
}
