package com.elearning.chat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendChatMessageRequestDTO { // 메시지 저장 요청 dto
  private Long roomId;
  private Long userId;
  private String content;
  private boolean isImage;
  private String imageUrl;
}
