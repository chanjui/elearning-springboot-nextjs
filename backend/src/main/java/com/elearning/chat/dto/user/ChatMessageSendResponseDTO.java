package com.elearning.chat.dto.user;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChatMessageSendResponseDTO { // 메시지 전송 응답 dto
  private Long id;
  private Long roomId;
  private Long userId;
  private String nickname;
  private String profileUrl;
  private boolean isInstructor;
  private String content;
  private String time;
  private boolean isImage;
  private String imageUrl;
  private boolean isRead;
  private int participantCount;
}
