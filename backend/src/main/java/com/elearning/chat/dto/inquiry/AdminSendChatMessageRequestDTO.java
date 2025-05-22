package com.elearning.chat.dto.inquiry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 관리자 → 클라이언트(WebSocket) 메시지 전송용 Request DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminSendChatMessageRequestDTO {
  private Long roomId;
  private Long adminId;
  private String message;
}
