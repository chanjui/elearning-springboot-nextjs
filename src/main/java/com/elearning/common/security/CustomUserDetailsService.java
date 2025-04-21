package com.elearning.common.security;

import com.elearning.admin.entity.Admin;
import com.elearning.admin.repository.AdminRepository;
import com.elearning.common.config.JwtUser;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 먼저 일반 사용자 확인
        return userRepository.findByEmail(username)
                .map(this::createUserDetails)
                .orElseGet(() -> adminRepository.findByEmail(username)
                        .map(this::createAdminDetails)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username)));
    }

    private UserDetails createUserDetails(User user) {
        return new JwtUser(
                user.getId(),
                user.getEmail(),
                "ROLE_USER",
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    private UserDetails createAdminDetails(Admin admin) {
        return new JwtUser(
                admin.getId(),
                admin.getEmail(),
                "ROLE_ADMIN",
                admin.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
    }
} 