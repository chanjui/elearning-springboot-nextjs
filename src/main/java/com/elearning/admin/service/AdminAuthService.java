package com.elearning.admin.service;

import com.elearning.admin.entity.Admin;
import com.elearning.admin.repository.AdminRepository;
import com.elearning.common.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminRepository adminRepository;
     private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public String authenticate(String email, String password) {
        log.info("관리자 로그인 시도: {}", email);
        
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("관리자를 찾을 수 없음: {}", email);
                    return new RuntimeException("관리자를 찾을 수 없습니다.");
                });

        if (!passwordEncoder.matches(password, admin.getPassword())) {
            log.error("비밀번호 불일치: {}", email);
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        log.info("관리자 인증 성공: {}", email);
        
        // JWT 토큰 생성
        String token = jwtTokenProvider.createToken(admin.getId(), "ADMIN");
        log.info("JWT 토큰 생성 완료: {}", token.substring(0, 10) + "...");
        
        return token;
    }
} 