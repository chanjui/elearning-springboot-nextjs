package com.elearning.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "`user`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 20, nullable = false)
  private String nickname;

  @Column(length = 255, nullable = false)
  private String password;

  @Column(length = 50, nullable = false)
  private String email;

  @Column(length = 20)
  private String phone;

  @Column(length = 255)
  private String profileUrl;

  @Column(name = "regDate")
  private LocalDateTime regDate = LocalDateTime.now();

  @Column(name = "isDel", nullable = false)
  private Boolean isDel = false;

  @Column(length = 1000)
  private String refreshToken;

  @Column(name = "isInstructor", nullable = false)
  private Boolean isInstructor = false;

  @Column(length = 1000)
  private String bio;

  @Column(length = 255)
  private String githubLink;
}