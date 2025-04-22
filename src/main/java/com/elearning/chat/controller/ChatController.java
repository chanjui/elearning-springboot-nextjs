package com.elearning.chat.controller;

import com.elearning.chat.dto.*;
import com.elearning.chat.service.ChatMessageService;
import com.elearning.chat.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/chat")
@RequiredArgsConstructor
public class ChatController {

  private final ChatRoomService chatRoomService;
  private final ChatMessageService chatMessageService;

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
  public ResponseEntity<Void> markMessagesAsRead(@PathVariable String roomId, @RequestParam Long userId) {
    chatMessageService.markMessagesAsRead(roomId, userId);
    return ResponseEntity.ok().build();
  }

}
