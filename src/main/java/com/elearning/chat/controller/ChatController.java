package com.elearning.chat.controller;

import com.elearning.chat.dto.*;
import com.elearning.chat.service.ChatMessageService;
import com.elearning.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

  private final ChatRoomService chatRoomService;
  private final ChatMessageService chatMessageService;
  private final SimpMessagingTemplate messagingTemplate;

  /**
   * 채팅방 생성 (1:1 또는 그룹)
   */
  @PostMapping("/rooms")
  public ResponseEntity<ChatRoomResponseDTO> createChatRoom(@RequestBody CreateChatRoomRequestDTO request) {
    ChatRoomResponseDTO room = chatRoomService.createChatRoom(request.getParticipantIds());
    return ResponseEntity.ok(room);
  }

  /**
   * 단일 채팅방 정보 조회
   */
  @GetMapping("/rooms/{roomId}")
  public ResponseEntity<ChatRoomResponseDTO> getChatRoomInfo(
    @PathVariable Long roomId,
    @RequestParam Long userId
  ) {
    ChatRoomResponseDTO detail = chatRoomService.getChatRoomInfo(roomId, userId);
    return ResponseEntity.ok(detail);
  }

  /**
   * 유저가 참여 중인 채팅방 목록
   */
  @GetMapping("/rooms")
  public ResponseEntity<List<ChatRoomResponseDTO>> getMyChatRooms(@RequestParam Long userId) {
    List<ChatRoomResponseDTO> rooms = chatRoomService.getChatRoomsForUser(userId);
    return ResponseEntity.ok(rooms);
  }

  /**
   * 특정 채팅방의 메시지 목록
   */
  @GetMapping("/rooms/{roomId}/messages")
  public ResponseEntity<List<ChatMessageResponseDTO>> getMessages(@PathVariable Long roomId) {
    List<ChatMessageResponseDTO> messages = chatMessageService.getMessagesByRoomId(roomId);
    return ResponseEntity.ok(messages);
  }

  /**
   * 메시지 전송
   */
  @PostMapping("/messages")
  public ResponseEntity<ChatMessageSendResponseDTO> sendMessage(@RequestBody SendChatMessageRequestDTO request) {
    ChatMessageSendResponseDTO response = chatMessageService.saveMessage(request);
    return ResponseEntity.ok(response);
  }

  /**
   * 메시지 읽음 처리
   */
  @Transactional
  @PutMapping("/rooms/{roomId}/read")
  public ResponseEntity<Void> markMessagesAsRead(
    @PathVariable Long roomId,
    @RequestParam Long userId
  ) {

    // 1) DB에 읽음 저장
    chatMessageService.markMessagesAsRead(roomId, userId);

    // 2) 지금 읽은 메시지 ID들을 가져와서 payload에 담아 브로드캐스트
    List<Long> messageIds = chatMessageService
      .getMessagesByRoomId(roomId).stream()
      .map(ChatMessageResponseDTO::getId)  // DTO에 getId()가 있다고 가정
      .collect(Collectors.toList());

    Map<String, Object> payload = Map.of(
      "type",       "READ",
      "roomId",     roomId,
      "userId",     userId,
      "messageIds", messageIds
    );
    messagingTemplate.convertAndSend("/topic/chat/" + roomId, payload);

    return ResponseEntity.ok().build();
  }

  /**
   * 해당 유저의 안읽은 메시지 수 구하기
   */
  @GetMapping("/unreadCount")
  public ResponseEntity<Integer> getUnreadMessageCount(@RequestParam Long userId) {
    int count = chatMessageService.countTotalUnreadMessages(userId);
    return ResponseEntity.ok(count);
  }

}
