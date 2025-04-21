package com.elearning.chat.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChatMessageResponseDTO { // 메시지 응답 dto
  private Long id;
  private String roomId;
  private Long userId;
  private String nickname;
  private String profileUrl;
  private boolean isInstructor;
  private String content;
  private String time;
  private boolean isImage;
  private String imageUrl;
  private boolean isRead;
}
