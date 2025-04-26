package com.elearning.chat.dto.inquiry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 관리자 → 클라이언트(WebSocket) 읽음 이벤트용 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminReadEventDTO {
  private Long roomId;
  private Long adminId;
  private List<Long> messageIds;    // 읽음 처리할 메시지 ID 목록
}
