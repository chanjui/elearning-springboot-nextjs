package com.elearning.chat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "chatRoomParticipant")
@Getter
@Setter
public class ChatRoomParticipant {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "chatRoomId")
  private Long chatRoomId;
  private Long userId;
  private String participantType; // "USER", "INSTRUCTOR", "ADMIN"
}

