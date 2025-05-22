package com.elearning.chat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "chatMessage")
@Getter
@Setter
public class ChatMessage {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "chatRoomId", nullable = false)
  private ChatRoom room;

  private Long senderId;
  private String senderType; // "USER", "INSTRUCTOR", "ADMIN"

  private String content;
  private Boolean isImage;
  private String imageUrl;
  private Boolean isRead;

  @Column(name = "sendAt")
  private LocalDateTime sendAt;
}

