package com.elearning.chat.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CreateChatRoomRequestDTO { // 채팅방 생성 요청 dto
  private List<Long> participantIds; // 참여자 ID 목록 (2명 이상 가능)
}
