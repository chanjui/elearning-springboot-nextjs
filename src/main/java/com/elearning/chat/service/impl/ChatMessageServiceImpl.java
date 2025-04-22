package com.elearning.chat.service.impl;

import com.elearning.chat.dto.ChatMessageResponseDTO;
import com.elearning.chat.dto.ChatMessageSendResponseDTO;
import com.elearning.chat.dto.SendChatMessageRequestDTO;
import com.elearning.chat.entity.ChatMessage;
import com.elearning.chat.entity.ChatRoom;
import com.elearning.chat.repository.ChatMessageRepository;
import com.elearning.chat.repository.ChatRoomParticipantRepository;
import com.elearning.chat.repository.ChatRoomRepository;
import com.elearning.chat.service.ChatMessageService;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatMessageServiceImpl implements ChatMessageService {

  private static final Logger logger = LoggerFactory.getLogger(ChatMessageServiceImpl.class);

  private final ChatMessageRepository chatMessageRepository;
  private final ChatRoomRepository chatRoomRepository;
  private final ChatRoomParticipantRepository chatRoomParticipantRepository;
  private final UserRepository userRepository;

  private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

  /**
   * 메시지 저장 및 전송
   */
  @Override
  public ChatMessageSendResponseDTO saveMessage(SendChatMessageRequestDTO requestDto) {
    User sender = userRepository.findById(requestDto.getUserId())
      .orElseThrow(() -> new RuntimeException("유저 없음"));
    ChatRoom room = chatRoomRepository.findById(Long.valueOf(requestDto.getRoomId()))
      .orElseThrow(() -> new RuntimeException("채팅방 없음"));

    ChatMessage message = new ChatMessage();
    message.setRoom(room);
    message.setSenderId(sender.getId());
    message.setSenderType(Boolean.TRUE.equals(sender.getIsInstructor()) ? "INSTRUCTOR" : "USER");
    message.setContent(requestDto.getContent());
    message.setIsImage(requestDto.isImage());
    message.setImageUrl(requestDto.getImageUrl());
    message.setIsRead(false);
    message.setSendAt(LocalDateTime.now());

    ChatMessage saved = chatMessageRepository.save(message);

    return ChatMessageSendResponseDTO.builder()
      .id(saved.getId())
      .roomId(saved.getRoom().getId())
      .userId(sender.getId())
      .nickname(sender.getNickname())
      .profileUrl(sender.getProfileUrl())
      .isInstructor(Boolean.TRUE.equals(sender.getIsInstructor()))
      .content(saved.getContent())
      .time(saved.getSendAt().format(formatter))
      .isImage(saved.getIsImage())
      .imageUrl(saved.getImageUrl())
      .isRead(saved.getIsRead())
      .build();
  }

  /**
   * 채팅방 메시지 목록 조회
   */
  @Override
  public List<ChatMessageResponseDTO> getMessagesByRoomId(Long roomId) {
    Long roomIdLong = Long.valueOf(roomId);

    return chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomIdLong)
      .stream()
      .map(msg -> {
        User sender = userRepository.findById(msg.getSenderId())
          .orElse(null);

        return ChatMessageResponseDTO.builder()
          .id(msg.getId())
          .roomId(msg.getRoom().getId())
          .userId(msg.getSenderId())
          .nickname(sender != null ? sender.getNickname() : "알 수 없음")
          .profileUrl(sender != null ? sender.getProfileUrl() : null)
          .isInstructor(sender != null && Boolean.TRUE.equals(sender.getIsInstructor()))
          .content(msg.getContent())
          .time(msg.getSendAt().format(formatter))
          .isImage(msg.getIsImage())
          .imageUrl(msg.getImageUrl())
          .isRead(msg.getIsRead())
          .build();
      })
      .collect(Collectors.toList());
  }

  /**
   * 읽음 처리
   */
  @Transactional
  @Override
  public void markMessagesAsRead(String roomId, Long userId) {
    Long roomIdLong = Long.valueOf(roomId); // ← 여기서 변환
    List<ChatMessage> unreadMessages = chatMessageRepository.findUnreadMessages(roomIdLong, userId);

    logger.info("▶▶ 읽지 않은 메시지 개수: {}", unreadMessages.size());

    for (ChatMessage message : unreadMessages) {
      logger.info("▶▶ 읽음 처리 중 - messageId: {}, content: {}", message.getId(), message.getContent());
      message.setIsRead(true);
    }
    chatMessageRepository.saveAll(unreadMessages);
  }

}
