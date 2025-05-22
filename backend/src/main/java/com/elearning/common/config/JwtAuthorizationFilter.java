package com.elearning.common.config;

import com.elearning.user.service.login.RequestService;
import com.elearning.common.security.JwtTokenProvider;
import com.elearning.common.config.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

  private final RequestService requestService;
  private final JwtTokenProvider jwtTokenProvider;
  private final JwtProvider jwtProvider;
  private final AntPathMatcher antPathMatcher = new AntPathMatcher();

  private boolean isPublicPath(String path) {
    return antPathMatcher.match("/api/course/**", path) ||
           antPathMatcher.match("/api/auth/**", path) ||
           antPathMatcher.match("/api/categories/**", path) ||
           antPathMatcher.match("/api/community/**", path) ||
           antPathMatcher.match("/api/admin/login", path) ||
           antPathMatcher.match("/api/user/courses", path) ||
           antPathMatcher.match("/api/user/coding-test", path) ||
           (antPathMatcher.match("/api/user/**", path) && !antPathMatcher.match("/api/user/coupons", path));
  }

  @Override
  @SneakyThrows
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
    // 1. 인증이 필요없는 경로는 필터 통과
    String path = request.getRequestURI();
    if (isPublicPath(path)) {
      filterChain.doFilter(request, response);
      return;
    }

    try {
      // 2. 관리자 토큰 확인 (쿠키에서)
      String adminToken = requestService.getCookie("admin-token");
      if (adminToken != null && !adminToken.isBlank() && jwtTokenProvider.validateToken(adminToken)) {
        System.out.println("👑 관리자 토큰 확인: " + adminToken.substring(0, 10) + "...");
        
        // 관리자 인증 정보 설정
        var authentication = jwtTokenProvider.getAuthentication(adminToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // 요청 속성 설정
        request.setAttribute("isAdmin", true);
        request.setAttribute("userId", authentication.getName());
        
        filterChain.doFilter(request, response);
        return;
      }
      
      // 3. 사용자 액세스 토큰 확인 (쿠키 또는 Authorization 헤더에서)
      String accessToken = null;
      
      // 먼저 Authorization 헤더에서 확인
      String authHeader = request.getHeader("Authorization");
      if (authHeader != null && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.substring(7); // "Bearer " 이후의 토큰 값 추출
        System.out.println("🔑 Authorization 헤더에서 토큰 추출: " + accessToken.substring(0, 10) + "...");
      }
      
      // Authorization 헤더에 없으면 쿠키에서 확인
      if (accessToken == null || accessToken.isBlank()) {
        accessToken = requestService.getCookie("accessToken");
        System.out.println("🍪 요청된 accessToken 쿠키: " + accessToken);
      }

      // 4. accessToken이 없는 경우
      if (accessToken == null || accessToken.isBlank()) {
        filterChain.doFilter(request, response);
        return;
      }

      // 5. accessToken이 유효한 경우
      if (jwtProvider.verify(accessToken)) {
        var claims = jwtProvider.getClaims(accessToken);
        String id = String.valueOf(claims.get("id"));
        String email = (String) claims.get("email");
        String nickname = (String) claims.get("nickname");
        
        JwtUser jwtUser = new JwtUser(id, email, nickname, "", new ArrayList<>());
        requestService.setMember(jwtUser);
        request.setAttribute("userId", jwtUser.getId());
        filterChain.doFilter(request, response);
        return;
      }

      // 6. accessToken이 만료된 경우, refreshToken으로 갱신 시도
      String refreshToken = requestService.getCookie("refreshToken");
      if (refreshToken != null && !refreshToken.isBlank()) {
        // refreshToken 검증 및 새로운 accessToken 발급 로직
        if (jwtProvider.verify(refreshToken)) {
          var claims = jwtProvider.getClaims(refreshToken);
          String newAccessToken = jwtProvider.getAccessToken(claims);
          requestService.setHeaderCookie("accessToken", newAccessToken);
          
          String id = String.valueOf(claims.get("id"));
          String email = (String) claims.get("email");
          String nickname = (String) claims.get("nickname");
          
          JwtUser jwtUser = new JwtUser(id, email, nickname, "", new ArrayList<>());
          requestService.setMember(jwtUser);
          filterChain.doFilter(request, response);
          return;
        }
      }
      
    } catch (Exception e) {
      // 오류 발생시 그냥 다음 필터로 진행 (인증 실패로 처리)
      e.printStackTrace();
    }
    
    filterChain.doFilter(request, response);
  }
}
