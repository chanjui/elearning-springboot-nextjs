package com.elearning.chat.dto.inquiry;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 채팅방 상세조회용 DTO (관리자용)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminChatSessionDetailDTO {
  private Long roomId;
  private AdminChatUserDTO user;
  private String status;
  private List<AdminChatMessageDTO> messages;
  private int unreadCount;
}
