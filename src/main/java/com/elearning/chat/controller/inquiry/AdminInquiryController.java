package com.elearning.chat.controller.inquiry;

import com.elearning.chat.dto.inquiry.*;
import com.elearning.chat.service.inquiry.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/inquiry")
@RequiredArgsConstructor
public class AdminInquiryController {
  private final AdminInquiryRoomService roomService;
  private final AdminInquiryMessageService msgService;

  /** 1) 문의방 리스트 조회 */
  @GetMapping("/rooms")
  public List<AdminChatSessionListDTO> listRooms(
    @RequestParam(value = "search", required = false, defaultValue = "") String search
  ) {
    return roomService.listAllRooms(search);
  }

  /** 2) 문의방 상세(메시지 포함) */
  @GetMapping("/rooms/{roomId}")
  public AdminChatSessionDetailDTO getRoom(@PathVariable Long roomId) {
    return roomService.getRoomDetail(roomId);
  }

  /** 3) 관리자 메시지 전송 (REST) */
  @PostMapping("/rooms/{roomId}/message")
  public ResponseEntity<Void> sendMessage(
    @PathVariable Long roomId,
    @RequestBody AdminSendChatMessageRequestDTO req
  ) {
    msgService.sendMessage(roomId, req.getAdminId(), req.getMessage());
    return ResponseEntity.ok().build();
  }

  /** 4) 읽음 처리 (REST) */
  @PostMapping("/rooms/{roomId}/read")
  public ResponseEntity<Void> markRead(
    @PathVariable Long roomId,
    @RequestBody AdminReadEventDTO dto
  ) {
    msgService.markAsRead(roomId, dto.getAdminId(), dto.getMessageIds());
    return ResponseEntity.ok().build();
  }

  /** 5) 문의 종료 */
  @PostMapping("/rooms/{roomId}/close")
  public ResponseEntity<Void> closeRoom(@PathVariable Long roomId) {
    roomService.closeRoom(roomId);
    return ResponseEntity.ok().build();
  }
}

