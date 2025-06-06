package com.elearning.user.service.login;

import com.elearning.common.ResultData;
import com.elearning.common.config.JwtProvider;
import com.elearning.common.config.JwtUser;
import com.elearning.instructor.entity.Instructor;
import com.elearning.instructor.repository.InstructorRepository;
import com.elearning.user.dto.UserDTO;
import com.elearning.user.entity.User;
import com.elearning.user.repository.EmailRepository;
import com.elearning.user.repository.UserRepository;
import com.elearning.user.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

@Service
@RequiredArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final JwtProvider jwtProvider;
  private final PasswordEncoder passwordEncoder;
  private final EmailRepository emailRepository;
  private final InstructorRepository instructorRepository;
  private final EmailService emailService;


  public boolean existsByEmail(String email) {
    return userRepository.existsByEmail(email);
  }

  // 이름 유효성 검사 메서드
  private void validateNickname(String nickname) {
    if (nickname == null || !nickname.matches("^[가-힣a-zA-Z]{2,6}$")) {
      throw new RuntimeException("이름은 2~6자의 공백 없는 한글 또는 영문이어야 합니다.");
    }
  }

  // 이메일 유효성 검사
  private void validateEmail(String email) {
    if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
      throw new RuntimeException("올바른 이메일 형식이 아닙니다.");
    }
  }

  // 연락처 유효성 검사 메서드
  private void validatePhone(String phone) {
    if (phone == null || !phone.matches("^010\\d{8}$")) {
      throw new RuntimeException("전화번호는 010으로 시작하는 숫자 11자리여야 합니다.");
    }
  }

  // 비밀번호 유효성 검사 메서드
  private void validatePassword(String password) {
    String pattern = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";
    if (!password.matches(pattern)) {
      throw new RuntimeException("비밀번호는 공백 없이 8자 이상, 영문 + 숫자 + 특수문자를 포함해야 합니다.");
    }
  }

  // 이메일 인증 후 회원가입
  @Transactional  // DB 작업을 트랜잭션으로 묶음
  public User registeredUser(UserDTO user) {
    // 앞뒤 공백 제거
    String nickname = user.getNickname().trim();
    String email = user.getEmail().trim();
    String phone = user.getPhone().trim();

    // 이메일 중복 여부 확인
    if (existsByEmail(user.getEmail())) {
      throw new RuntimeException("이미 사용 중인 이메일입니다.");
    }

    // 이메일 인증 여부 확인
    if (!emailRepository.isVerified(user.getEmail())) {
      throw new RuntimeException("이메일 인증이 완료되지 않았습니다.");
    }

    // 유효성 검사
    validateNickname(nickname);
    validateEmail(email);
    validatePhone(phone);
    validatePassword(user.getPassword());

    // 비밀번호 해싱
    String encodedPassword = passwordEncoder.encode(user.getPassword());

    // User 엔티티 생성
    User newUser = User.builder()
      .email(email)
      .password(encodedPassword)
      .nickname(nickname)
      .phone(phone)
      .isDel(false)
      .isInstructor(false)
      .regDate(LocalDateTime.now())
      .build();

    // 저장
    return userRepository.save(newUser);
  }

  // 로그인 및 토큰 생성
  public UserDTO authAndMakeToken(String email, String rawPassword) {
    User user = userRepository.findByEmail(email)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

    // ✅ 탈퇴한 유저라면 로그인 불가
    if (user.getIsDel()) {
      throw new RuntimeException("탈퇴한 사용자입니다. 로그인이 불가능합니다.");
    }

    if (passwordEncoder.matches(rawPassword, user.getPassword())) {
      Map<String, Object> claims = new HashMap<>();
      claims.put("id", user.getId());
      claims.put("nickname", user.getNickname());
      claims.put("email", user.getEmail());
      claims.put("phone", user.getPhone());
      claims.put("profileUrl", user.getProfileUrl());
      claims.put("bio", user.getBio());
      claims.put("githubLink", user.getGithubLink());

      // instructorId 조회 및 claims에 추가 (토큰 생성 전에 수행)
      Long instructorId = null;
      if (user.getIsInstructor()) {
        instructorId = instructorRepository.findInstructorIdByUserId(user.getId())
          .orElse(null);
        claims.put("instructorId", instructorId);
        //System.out.println("강사아이디="+instructorId);
      }

      String accessToken = jwtProvider.getAccessToken(claims);
      String refreshToken = jwtProvider.getRefreshToken(claims);

      user.setRefreshToken(refreshToken);
      userRepository.save(user); // 또는 updateRefreshToken 메서드 사용

      return UserDTO.builder()
        .nickname(user.getNickname())
        .email(user.getEmail())
        .phone(user.getPhone())
        .profileUrl(user.getProfileUrl())
        .bio(user.getBio())
        .githubLink(user.getGithubLink())
        .isInstructor(user.getIsInstructor())
        .instructorId(instructorId)
        .accessToken(accessToken)
        .refreshToken(refreshToken)
        .build();
    } else {
      throw new RuntimeException("비밀번호가 일치하지 않습니다.");
    }
  }

  // Entity -> DTO 변환 메서드
  private UserDTO convertToDto(User user) {
    return UserDTO.builder()
      .id(user.getId())
      .nickname(user.getNickname())
      .email(user.getEmail())
      .phone(user.getPhone())
      .build();
  }

  // 토큰으로부터 사용자 정보 얻기
  public JwtUser getUserFromAccessToken(String accessToken) {
    Map<String, Object> claims = jwtProvider.getClaims(accessToken);
    String id = String.valueOf(claims.get("id"));
    // System.out.println(">> [UserService] 토큰에서 추출한 id: " + id + " (" + id.getClass() + ")");
    String email = (String) claims.get("email");
    String nickname = (String) claims.get("nickname");
    List<GrantedAuthority> authorities = new ArrayList<>();

    return new JwtUser(id, email, nickname, "", authorities);
  }

  // 토큰 검증
  public boolean validateToken(String token) {
    return jwtProvider.verify(token);
  }

  // refreshToken을 이용한 accessToken 재발급
  public ResultData<String> refreshAccessToken(String refreshToken) {
    User user = userRepository.findByRefreshToken(refreshToken)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 refreshToken입니다."));

    Map<String, Object> claims = new HashMap<>();
    claims.put("id", user.getId());
    claims.put("nickname", user.getNickname());
    claims.put("email", user.getEmail());
    claims.put("phone", user.getPhone());
    claims.put("profileUrl", user.getProfileUrl());
    
    // 강사 ID 추가 (토큰 생성 전에 수행)
    if (user.getIsInstructor()) {
      Long instructorId = instructorRepository.findInstructorIdByUserId(user.getId())
        .orElse(null);
      claims.put("instructorId", instructorId);
      System.out.println("🔄 [refreshAccessToken] 강사아이디="+instructorId);
    }
    
    String newAccessToken = jwtProvider.getAccessToken(claims);

    System.out.println("🔄 AccessToken 재발급 완료: " + newAccessToken);  // 재발급 확인
    // 필요한 경우 DB 업데이트
    return ResultData.of(1, "success", newAccessToken);
  }

  // HttpServletRequest에서 토큰을 추출하여 사용자 ID를 반환하는 메서드
  public Long getUserIdFromToken(HttpServletRequest request) {
    String token = jwtProvider.resolveToken(request);
    if (token == null) {
      return null;
    }
    return jwtProvider.getUserId(token);
  }

  // 전화번호 중복 체크
  public boolean existsByPhone(String phone) {
    return userRepository.existsByPhone(phone);
  }

  // 연락처 업데이트
  @Transactional
  public void updatePhone(Long userId, String phone) {
    // 연락처 유효성 검사
    validatePhone(phone);
    // 유저 존재 여부 확인
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
    // 연락처 업데이트
    user.setPhone(phone);
    // 명시적 저장 추가
    userRepository.save(user);

    System.out.println("전화번호 업데이트 완료: " + user.getId() + ", 번호: " + phone);
  }

  // 사용자 정보 조회
  @Transactional(readOnly = true)
  public UserDTO getMyInfo(Long userId) {
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

    Instructor instructor = instructorRepository.findByUserId(userId).orElse(null);

    return UserDTO.builder()
      .id(user.getId())
      .nickname(user.getNickname())
      .email(user.getEmail())
      .phone(user.getPhone())
      .isInstructor(user.getIsInstructor())
      .profileUrl(user.getProfileUrl())
      .bio(user.getBio())
      .githubLink(user.getGithubLink())
      .instructorId(instructor != null ? instructor.getId() : null)
      .build();
  }

}