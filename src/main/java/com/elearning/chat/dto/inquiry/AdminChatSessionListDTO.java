package com.elearning.chat.dto.inquiry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 채팅방 리스트용 DTO (관리자용)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminChatSessionListDTO {
  private Long roomId;
  private AdminChatUserDTO user;         // 문의한 유저 정보
  private String status;            // "waiting" | "active" | "closed"
  private String lastMessage;       // 마지막 메시지 요약
  private LocalDateTime lastAt;     // 마지막 메시지 시각
  private int unreadCount;          // 안 읽은 메시지 수
}
