package com.elearning.chat.service.impl;

import com.elearning.chat.dto.user.ChatMessageResponseDTO;
import com.elearning.chat.dto.user.ChatMessageSendResponseDTO;
import com.elearning.chat.dto.user.SendChatMessageRequestDTO;
import com.elearning.chat.entity.ChatMessage;
import com.elearning.chat.entity.ChatMessageRead;
import com.elearning.chat.entity.ChatRoom;
import com.elearning.chat.repository.ChatMessageReadRepository;
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
  private final ChatMessageReadRepository chatMessageReadRepository;

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

    // 여기에 참여자 수를 조회해서 DTO 에 담아 줍니다.
    int participantCount = chatRoomParticipantRepository.countByChatRoomId(saved.getRoom().getId());

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
      .participantCount(participantCount)
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
        User sender = userRepository.findById(msg.getSenderId()).orElse(null);

        // 본인(senderId)은 제외하고 읽은 사람 수 계산
        int readCount = chatMessageReadRepository.countByMessageIdAndUserIdNot(msg.getId(), msg.getSenderId());

        // 참여자 수 조회
        int participantCount = chatRoomParticipantRepository.countByChatRoomId(roomIdLong);

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
          .readCount(readCount) // 본인을 제외한 읽은 사람 수
          .participantCount(participantCount)
          .build();
      })
      .collect(Collectors.toList());
  }

  /**
   * 읽음 처리
   */
  @Transactional
  @Override
  public void markMessagesAsRead(Long roomId, Long userId) {
    Long roomIdLong = Long.valueOf(roomId);
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

    List<ChatMessage> messages = chatMessageRepository.findByRoomIdOrderByCreatedAtAsc(roomIdLong);

    for (ChatMessage message : messages) {
      boolean alreadyRead = chatMessageReadRepository.existsByMessageIdAndUserId(message.getId(), userId);
      if (!alreadyRead) {
        ChatMessageRead read = new ChatMessageRead(message, user);
        chatMessageReadRepository.save(read);
      }
    }

    logger.info("▶▶ 메시지 읽음 처리 완료 - roomId: {}, userId: {}", roomId, userId);
  }

  @Override
  public int countTotalUnreadMessages(Long userId) {
    // 유저가 참여 중인 채팅방들
    List<Long> roomIds = chatRoomParticipantRepository.findByUserId(userId)
      .stream()
      .map(p -> p.getChatRoomId())
      .collect(Collectors.toList());

    if (roomIds.isEmpty()) return 0;

    // 내가 보낸 메시지 제외 + 읽음 처리 안된 메시지 수
    return chatMessageRepository.countUnreadMessagesByUserId(userId, roomIds);
  }
}
