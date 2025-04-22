package com.elearning.admin.entity;

import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "adminLog")
@Getter
@Setter
public class AdminLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "adminId", nullable = false)
  private Admin admin;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userId", nullable = false)
  private User user;

  @Column(nullable = false, length = 100)
  private String activityType;

  @Column(columnDefinition = "TEXT")
  private String description;

  @Column(name = "createdAt")
  private LocalDateTime createdAt = LocalDateTime.now();
} 