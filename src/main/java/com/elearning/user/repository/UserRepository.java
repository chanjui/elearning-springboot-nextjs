package com.elearning.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.elearning.user.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User, Long> {
  // 회원가입 없어도 성공
  //로그인
  Optional<User> findByEmail(String email);
  Optional<User> findByRefreshToken(String refreshToken);

  // 이메일 중복 체크
  boolean existsByEmail(String email);
  
  //전화번호 중복 체크
  boolean existsByPhone(String phone);

  // 전화번호로 이메일 찾기
  @Query("SELECT u.email FROM User u WHERE u.phone = :phone")
  Optional<String> findEmailByPhone(@Param("phone") String phone);

  // refreshToken을 Update하는 기능
  @Modifying
  @Transactional  // 업데이트가 안될 때 알아서 rollback 해줌
  @Query("UPDATE User user SET user.refreshToken = :refreshToken WHERE user.id = :id")
  void updateRefreshToken(@Param("id") Long id, @Param("refreshToken") String refreshToken);
}