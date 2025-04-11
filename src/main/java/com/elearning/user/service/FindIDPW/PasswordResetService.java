package com.elearning.user.service.FindIDPW;

import com.elearning.user.dto.FindIDPW.PasswordResetConfirmDTO;
import com.elearning.user.dto.FindIDPW.PasswordResetRequestDTO;
import com.elearning.user.entity.PasswordResetToken;
import com.elearning.user.entity.User;
import com.elearning.user.repository.PasswordResetTokenRepository;
import com.elearning.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class PasswordResetService {
  // 비밀번호 재설정 기능 전반을 처리하는 서비스

  private final UserRepository userRepository;
  private final PasswordResetTokenRepository tokenRepository;
  private final PasswordEncoder passwordEncoder;

  @Qualifier("gmailMailSender")
  private final JavaMailSender gmailMailSender;

  @Qualifier("naverMailSender")
  private final JavaMailSender naverMailSender;

  @Value("${reset.base-url}")
  private String baseUrl; // 이메일에 포함될 프론트엔드 비밀번호 재설정 페이지 링크

  // 비밀번호 재설정 요청 처리
  public void requestReset(PasswordResetRequestDTO dto) {
    Optional<User> userOpt = userRepository.findByEmail(dto.getEmail());
    if (userOpt.isEmpty()) {
      throw new IllegalArgumentException("등록되지 않은 이메일입니다.");
    }

    // 기존 토큰 제거
    tokenRepository.deleteByEmail(dto.getEmail());

    // 새 토큰 생성
    String token = UUID.randomUUID().toString();
    PasswordResetToken resetToken = PasswordResetToken.builder()
      .email(dto.getEmail())
      .token(token)
      .expiryDate(LocalDateTime.now().plusHours(1)) // 1시간 유효
      .build();

    // 토큰 저장
    tokenRepository.save(resetToken);

    // 이메일 전송
    sendResetMail(dto.getEmail(), token);
  }

  // 이메일 주소에 따라 Gmail 또는 Naver 발송기 선택
  private JavaMailSender resolveMailSender(String email) {
    return email.endsWith("@naver.com") ? naverMailSender : gmailMailSender;
  }

  // 비밀번호 재설정 링크 이메일 발송
  private void sendResetMail(String to, String token) {
    String link = baseUrl + "/reset-password?token=" + token;
    String subject = "[CodeFlix] 비밀번호 재설정 링크입니다.";
    String body = "<h3>비밀번호 재설정을 위한 링크입니다</h3>"
                  + "<p>아래 버튼을 눌러 비밀번호를 재설정하세요.</p>"
                  + "<a href='" + link + "' style='padding: 10px 20px; background: #e50914; color: white; text-decoration: none;'>비밀번호 재설정</a>"
                  + "<p>이 링크는 1시간 후 만료됩니다.</p>";

    try {
      JavaMailSender mailSender = resolveMailSender(to); // 발송기 선택
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, false, "utf-8");
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(body, true);
      mailSender.send(message);
    } catch (MessagingException e) {
      throw new RuntimeException("이메일 전송에 실패했습니다.", e);
    }
  }

  // 비밀번호 재설정 완료 처리
  @Transactional
  public void confirmReset(PasswordResetConfirmDTO dto) {
    PasswordResetToken token = tokenRepository.findByToken(dto.getToken())
      .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));

    if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
      throw new IllegalArgumentException("토큰이 만료되었습니다.");
    }

    User user = userRepository.findByEmail(token.getEmail())
      .orElseThrow(() -> new IllegalStateException("사용자를 찾을 수 없습니다."));

    // 새 비밀번호 암호화 후 저장
    user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
    
    // 토큰 제거 (한 번만 사용 가능)
    tokenRepository.delete(token);
  }
}
