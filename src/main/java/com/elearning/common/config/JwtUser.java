package com.elearning.common.config;

import lombok.Getter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class JwtUser extends User {
  @Getter
  private String id;
  private String email;
  private String nickname;

  public JwtUser(String id, String email, String nickname, String password, Collection<? extends GrantedAuthority> authorities) {
    super(email, password, authorities); // username 역할로 email 사용
    this.id = id;
    this.email = email;
    this.nickname = nickname;
  }

  // Spring Security에서 인증 처리 시 사용할 Authentication 객체 반환
  public Authentication getAuthentication() {
    return new UsernamePasswordAuthenticationToken(this, this.getPassword(), this.getAuthorities());
  }
}
