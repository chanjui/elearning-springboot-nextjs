package com.elearning.common.config;

import com.elearning.common.ResultData;
import com.elearning.user.service.login.RequestService;
import com.elearning.user.service.login.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

  private final RequestService requestService;
  private final UserService userService;
  private final AntPathMatcher antPathMatcher = new AntPathMatcher();

  private boolean isPublicPath(String path) {
    return (antPathMatcher.match("/api/user/**", path) && !antPathMatcher.match("/api/user/coupons", path)) ||
           antPathMatcher.match("/api/course/**", path) ||
           antPathMatcher.match("/api/auth/**", path) ||
           antPathMatcher.match("/api/categories/**", path) ||
           antPathMatcher.match("/api/community/**", path) ||
           antPathMatcher.match("/api/admin/login", path);
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
      // 2. accessToken 확인 (쿠키 또는 Authorization 헤더에서)
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

      // 3. accessToken이 없는 경우
      if (accessToken == null || accessToken.isBlank()) {
        filterChain.doFilter(request, response);
        return;
      }

      // 4. accessToken이 유효한 경우
      if (userService.validateToken(accessToken)) {
        JwtUser jwtUser = userService.getUserFromAccessToken(accessToken);
        requestService.setMember(jwtUser);
        request.setAttribute("userId", jwtUser.getId());
        filterChain.doFilter(request, response);
        return;
      }

      // 5. accessToken이 만료된 경우, refreshToken으로 갱신 시도
      String refreshToken = requestService.getCookie("refreshToken");
      if (refreshToken != null && !refreshToken.isBlank()) {
        ResultData<String> resultData = userService.refreshAccessToken(refreshToken);
        String newAccessToken = resultData.getData();
        System.out.println("✅ [JwtFilter] RefreshToken 사용하여 새 AccessToken 발급: " + newAccessToken);
        requestService.setHeaderCookie("accessToken", newAccessToken);
        
        JwtUser jwtUser = userService.getUserFromAccessToken(newAccessToken);
        requestService.setMember(jwtUser);
        filterChain.doFilter(request, response);
        return;
      }
      
    } catch (Exception e) {
      // 오류 발생시 그냥 다음 필터로 진행 (인증 실패로 처리)
      e.printStackTrace();
    }
    
    filterChain.doFilter(request, response);
  }
}
