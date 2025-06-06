package com.elearning.common.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class ApiSecurityConfig {

  @Bean
  public SecurityFilterChain apiFilterChain(HttpSecurity http, JwtAuthorizationFilter jwtAuthorizationFilter)
    throws Exception {
    http.csrf(AbstractHttpConfigurer::disable)
      .headers(headers -> headers.frameOptions(
        HeadersConfigurer.FrameOptionsConfig::sameOrigin))
      .securityMatcher("/api/**")
      .authorizeHttpRequests(authorize -> authorize
        // 더 구체적인 경로를 먼저 설정
        .requestMatchers("/api/courses/instructor/**").authenticated()
        .requestMatchers("/api/courses/*/basic-info").authenticated()
        .requestMatchers("/api/courses/*/detailed-description").authenticated()
        .requestMatchers("/api/courses/*/pricing").authenticated()
        .requestMatchers("/api/courses/*/faq").authenticated()
        .requestMatchers("/api/courses/*/curriculum").authenticated()
        .requestMatchers("/api/courses/*/cover-image").authenticated()
        .requestMatchers("/api/user/v1/vc/**").authenticated()   //vc는 인증 필요
        .requestMatchers("/api/cart/**").authenticated()
        .requestMatchers("/api/payment/**").authenticated()

        // 그 다음 넓은 범위의 경로 설정
        .requestMatchers(
          "/api/user/**",    // 나머지 user 경로는 인증 불필요
          "/api/course/**",
          "/api/categories/**",
          "/api/courses/**",
           "/api/coding/**",
          // "/api/instructor/**",
          "/api/auth/**",
          "/api/community/**",  // 커뮤니티 경로 추가
          "api/admin/login",
          "api/chat/**"  // 채팅 경로 추가
        ).permitAll()
        .anyRequest().authenticated()
      )
      .csrf(csrf -> csrf.disable())
      .httpBasic(httpBasic -> httpBasic.disable())
      .formLogin(form -> form.disable())
      .sessionManagement(
        sessionManagement -> sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      )
      .addFilterBefore(jwtAuthorizationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }
}