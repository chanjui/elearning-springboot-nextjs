package com.elearning.user.service.MyPage;

import com.elearning.common.ResultData;
import com.elearning.user.dto.MyPage.PasswordUpdateDTO;
import com.elearning.user.dto.MyPage.ProfileUpdateRequestDTO;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MyPageService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  // userId로 User 조회
  @Transactional(readOnly = true)
  public User findById(Long userId) {
    return userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));
  }

  // 프로필 정보 수정
  @Transactional
  public ResultData<String> updateProfile(Long userId, ProfileUpdateRequestDTO dto) {
    User user = findById(userId);

    user.setNickname(dto.getNickname());
    user.setGithubLink(dto.getGithubLink());
    user.setBio(dto.getBio());
    user.setProfileUrl(dto.getProfileUrl());

    userRepository.save(user); // 저장

    return ResultData.of(1, "프로필이 성공적으로 수정되었습니다.");
  }

  // 이메일 변경
  @Transactional
  public ResultData<String> updateEmail(Long userId, String newEmail) {
    User user = findById(userId);

    if (newEmail == null || newEmail.isBlank()) {
      return ResultData.of(0, "이메일을 입력해주세요.");
    }

    validateEmail(newEmail);

    if (!newEmail.equals(user.getEmail())) {
      // 다른 이메일일 때만 중복 체크
      if (userRepository.existsByEmail(newEmail)) {
        return ResultData.of(0, "이미 사용 중인 이메일입니다.");
      }
    }

    user.setEmail(newEmail); // 같아도 그냥 덮어쓰기
    userRepository.save(user);

    return ResultData.of(1, "이메일이 성공적으로 수정되었습니다.");
  }


  // 휴대폰 번호 변경
  @Transactional
  public ResultData<String> updatePhone(Long userId, String newPhone) {
    User user = findById(userId);

    if (newPhone == null || newPhone.isBlank()) {
      return ResultData.of(0, "연락처를 입력해주세요.");
    }

    validatePhone(newPhone);

    if (!newPhone.equals(user.getPhone())) {
      // 다른 번호일 때만 중복 체크
      if (userRepository.existsByPhone(newPhone)) {
        return ResultData.of(0, "이미 사용 중인 연락처입니다.");
      }
    }

    user.setPhone(newPhone); // 같아도 그냥 덮어쓰기
    userRepository.save(user);

    return ResultData.of(1, "연락처가 성공적으로 수정되었습니다.");
  }

  // 이메일 형식 체크
  private void validateEmail(String email) {
    if (email == null || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
      throw new RuntimeException("올바른 이메일 형식이 아닙니다.");
    }
  }

  // 전화번호 형식 체크
  private void validatePhone(String phone) {
    if (phone == null || !phone.matches("^010\\d{8}$")) {
      throw new RuntimeException("전화번호는 010으로 시작하는 숫자 11자리여야 합니다.");
    }
  }
}
