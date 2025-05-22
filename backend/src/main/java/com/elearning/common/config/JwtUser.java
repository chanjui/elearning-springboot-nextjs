package com.elearning.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

@Getter
@Setter
public class JwtUser extends User {
  private Long id;
  private String email;
  private String role;

  public JwtUser(String id, String email, String nickname, String password, Collection<? extends GrantedAuthority> authorities) {
    super(email, password, authorities);
    this.id = Long.parseLong(id);
    this.email = email;
    this.role = "ROLE_USER";
  }

  public JwtUser(Long id, String email, String role, String password, Collection<? extends GrantedAuthority> authorities) {
    super(email, password, authorities);
    this.id = id;
    this.email = email;
    this.role = role;
  }

  // Spring Security에서 인증 처리 시 사용할 Authentication 객체 반환
  public Authentication getAuthentication() {
    return new UsernamePasswordAuthenticationToken(this, this.getPassword(), this.getAuthorities());
  }
}
