package com.elearning.chat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "chatRoom")
@Getter
@Setter
public class ChatRoom {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String roomType; // "PRIVATE", "GROUP", "ADMIN"
  private LocalDateTime createdAt;
}