package com.elearning.chat.entity;

import com.elearning.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "chatMessageRead", uniqueConstraints = {
  @UniqueConstraint(columnNames = {"messageId", "userId"})
})
public class ChatMessageRead {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // 메시지와의 다대일 관계
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "messageId", nullable = false)
  private ChatMessage message;

  // 사용자와의 다대일 관계
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userId", nullable = false)
  private User user;

  @Column(name = "readAt", nullable = false)
  private LocalDateTime readAt = LocalDateTime.now();

  // 생성자
  public ChatMessageRead(ChatMessage message, User user) {
    this.message = message;
    this.user = user;
    this.readAt = LocalDateTime.now();
  }
}
