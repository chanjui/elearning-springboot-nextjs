package com.elearning.chat.entity.inquiry;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "adminInquiryMessage")
@Getter
@Setter
@NoArgsConstructor
public class AdminInquiryMessage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long roomId; // adminInquiryRoom의 id

  private Long senderId; // user or admin의 id

  @Enumerated(EnumType.STRING)
  private SenderType senderType; // USER or ADMIN

  @Column(columnDefinition = "TEXT")
  private String message;

  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(nullable = false)
  private Boolean isRead = false;

  public enum SenderType {
    USER,
    ADMIN
  }
}
