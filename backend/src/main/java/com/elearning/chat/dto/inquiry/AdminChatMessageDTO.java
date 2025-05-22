package com.elearning.chat.dto.inquiry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 메시지 DTO (관리자용)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminChatMessageDTO {
  private Long messageId;
  private String sender;            // "USER" or "ADMIN"
  private String content;
  private LocalDateTime sentAt;
  private boolean isRead;           // 읽음 여부
}
