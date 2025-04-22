package com.elearning.chat.service.impl;

import com.elearning.chat.dto.ChatMessageResponseDTO;
import com.elearning.chat.dto.ChatRoomResponseDTO;
import com.elearning.chat.entity.ChatRoom;
import com.elearning.chat.entity.ChatRoomParticipant;
import com.elearning.chat.entity.ChatMessage;
import com.elearning.chat.repository.ChatRoomRepository;
import com.elearning.chat.repository.ChatRoomParticipantRepository;
import com.elearning.chat.repository.ChatMessageRepository;
import com.elearning.chat.service.ChatRoomService;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

  private final ChatRoomRepository chatRoomRepository;
  private final ChatRoomParticipantRepository chatRoomParticipantRepository;
  private final ChatMessageRepository chatMessageRepository;
  private final UserRepository userRepository;

  private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("HH:mm");

  /**
   * 1:1 또는 1:N 채팅방 생성
   */
  @Override
  public ChatRoomResponseDTO createChatRoom(List<Long> participantIds) {
    // 참여자 수 검증
    if (participantIds.size() < 2) {
      throw new IllegalArgumentException("참여자는 2명 이상이어야 합니다.");
    }

    // 채팅방 생성
    ChatRoom room = new ChatRoom();
    room.setRoomType(participantIds.size() == 2 ? "PRIVATE" : "GROUP");
    room.setCreatedAt(LocalDateTime.now());
    chatRoomRepository.save(room);
    chatMessageRepository.flush();

    // 참여자 저장
    for (Long userId : participantIds) {
      User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자 없음: " + userId));

      ChatRoomParticipant participant = new ChatRoomParticipant();
      participant.setChatRoomId(room.getId());
      participant.setUserId(user.getId());
      participant.setParticipantType(Boolean.TRUE.equals(user.getIsInstructor()) ? "INSTRUCTOR" : "USER");

      chatRoomParticipantRepository.save(participant);
    }

    return ChatRoomResponseDTO.builder()
      .roomId(room.getId())
      .name("채팅방") // 이름은 프론트에서 구성하는 구조로
      .lastMessage("")
      .time("방금")
      .unreadCount(0)
      .isInstructor(false)
      .build();
  }

  /**
   * 유저가 속한 모든 채팅방 목록
   */
  @Override
  public List<ChatRoomResponseDTO> getChatRoomsForUser(Long userId) {
    // 유저가 참여 중인 채팅방 찾기
    List<ChatRoomParticipant> participants = chatRoomParticipantRepository.findByUserId(userId);
    List<Long> roomIds = participants.stream()
      .map(ChatRoomParticipant::getChatRoomId)
      .distinct()
      .collect(Collectors.toList());

    // 각 채팅방마다 최근 메시지 및 안읽은 메시지 수
    return roomIds.stream().map(roomId -> {
      List<ChatMessage> messages = chatMessageRepository.findByRoomIdOrderByCreatedAtDesc(roomId);
      ChatMessage lastMessage = messages.isEmpty() ? null : messages.get(0);
      long unreadCount = messages.stream()
        .filter(m -> !m.getSenderId().equals(userId) && !Boolean.TRUE.equals(m.getIsRead()))
        .count();

      // 참여자 1명 정보 가져오기 (본인 제외)
      List<ChatRoomParticipant> roomParticipants = chatRoomParticipantRepository.findByChatRoomId(roomId);
      Optional<User> targetUser = roomParticipants.stream()
        .map(p -> userRepository.findById(p.getUserId()).orElse(null))
        .filter(u -> u != null && !Objects.equals(u.getId(), userId))
        .findFirst();

      return ChatRoomResponseDTO.builder()
        .roomId(roomId)
        .name(targetUser.map(User::getNickname).orElse("알 수 없음"))
        .lastMessage(lastMessage != null ? lastMessage.getContent() : "")
        .time(lastMessage != null ? lastMessage.getSendAt().format(formatter) : "")
        .unreadCount((int) unreadCount)
        .isInstructor(targetUser.map(User::getIsInstructor).orElse(false))
        .build();
    }).collect(Collectors.toList());
  }

  /**
   * 채팅방 단일 상세 정보
   */
  @Override
  public ChatRoomResponseDTO getChatRoomInfo(Long roomId, Long userId) {
    Long roomIdLong = Long.valueOf(roomId);
    ChatRoom room = chatRoomRepository.findById(roomIdLong)
      .orElseThrow(() -> new RuntimeException("채팅방 없음"));

    List<ChatRoomParticipant> participants = chatRoomParticipantRepository.findByChatRoomId(roomIdLong);
    Optional<User> other = participants.stream()
      .filter(p -> !Objects.equals(p.getUserId(), userId))
      .map(p -> userRepository.findById(p.getUserId()).orElse(null))
      .filter(Objects::nonNull)
      .findFirst();

    return ChatRoomResponseDTO.builder()
      .roomId(roomId)
      .name(other.map(User::getNickname).orElse("알 수 없음"))
      .lastMessage("") // 상세에서는 메시지 목록 별도로 가져오므로 생략 가능
      .time(room.getCreatedAt().format(formatter))
      .unreadCount(0)
      .isInstructor(other.map(User::getIsInstructor).orElse(false))
      .build();
  }

  /**
   * 메시지 목록 조회 (실제로는 MessageService에서 처리되므로 위임 가능)
   */
  @Override
  public List<ChatMessageResponseDTO> getMessages(Long roomId) {
    throw new UnsupportedOperationException("getMessages는 ChatMessageService에서 처리하세요.");
  }
}
