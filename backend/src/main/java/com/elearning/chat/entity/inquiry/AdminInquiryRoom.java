package com.elearning.chat.entity.inquiry;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "adminInquiryRoom")
@Getter
@Setter
@NoArgsConstructor
public class AdminInquiryRoom {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long userId;

  private LocalDateTime createdAt = LocalDateTime.now();

  @Enumerated(EnumType.STRING)
  private InquiryStatus status = InquiryStatus.WAITING; // WAITING / ACTIVE / CLOSED

  public enum InquiryStatus {
    WAITING,
    ACTIVE,
    CLOSED
  }
}
