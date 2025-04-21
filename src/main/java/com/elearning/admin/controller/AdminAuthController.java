package com.elearning.admin.controller;

import com.elearning.admin.service.AdminAuthService;
import com.elearning.common.dto.ResponseDTO;
import com.elearning.admin.dto.AdminLoginRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> login(
            @RequestBody AdminLoginRequest request,
            HttpServletResponse response) {
        
        String token = adminAuthService.authenticate(request.getEmail(), request.getPassword());
        
        // 쿠키에 토큰 저장
        Cookie cookie = new Cookie("admin-token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // 개발 환경에서는 false로 설정
        cookie.setPath("/");
        cookie.setMaxAge(3600); // 1시간
        response.addCookie(cookie);
        
        return ResponseEntity.ok(new ResponseDTO(1, "로그인 성공", null));
    }

    @PostMapping("/logout")
    public ResponseEntity<ResponseDTO> logout(HttpServletResponse response) {
        // 쿠키 삭제
        Cookie cookie = new Cookie("admin-token", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        
        return ResponseEntity.ok(new ResponseDTO(1, "로그아웃 성공", null));
    }
} 