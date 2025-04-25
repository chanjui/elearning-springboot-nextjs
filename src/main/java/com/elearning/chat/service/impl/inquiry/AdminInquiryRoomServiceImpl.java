package com.elearning.chat.service.impl.inquiry;

import com.elearning.chat.dto.inquiry.*;
import com.elearning.chat.entity.inquiry.AdminInquiryRoom;
import com.elearning.chat.entity.inquiry.AdminInquiryMessage;
import com.elearning.chat.entity.inquiry.AdminInquiryMessage.SenderType;
import com.elearning.chat.repository.inquiry.*;
import com.elearning.chat.service.inquiry.AdminInquiryRoomService;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AdminInquiryRoomServiceImpl implements AdminInquiryRoomService {
  private final AdminInquiryRoomRepository roomRepo;
  private final AdminInquiryMessageRepository msgRepo;
  private final UserRepository userRepository;

  @Override
  public List<AdminChatSessionListDTO> listAllRooms() {
    return roomRepo.findAll().stream().map(room -> {
      var lastMsg = msgRepo.findByRoomIdOrderByCreatedAtAsc(room.getId())
        .stream().reduce((first, second) -> second).orElse(null);
      return new AdminChatSessionListDTO(
        room.getId(),
        new AdminChatUserDTO(/* userId→유저 조회 or 매핑 */),
        room.getStatus().name().toLowerCase(),
        lastMsg != null ? lastMsg.getMessage() : "",
        lastMsg != null ? lastMsg.getCreatedAt() : room.getCreatedAt(),
        (int) msgRepo.countByRoomIdAndSenderTypeAndIsReadFalse(room.getId(), SenderType.USER)
      );
    }).collect(Collectors.toList());
  }

  @Override
  public AdminChatSessionDetailDTO getRoomDetail(Long roomId) {
    AdminInquiryRoom room = roomRepo.findById(roomId)
      .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 문의방입니다."));
    var messages = msgRepo.findByRoomIdOrderByCreatedAtAsc(roomId).stream()
      .map(m -> new AdminChatMessageDTO(
        m.getId(),
        m.getSenderType().name(),
        m.getMessage(),
        m.getCreatedAt(),
        m.getIsRead()
      )).collect(Collectors.toList());
    int unread = (int) msgRepo.countByRoomIdAndSenderTypeAndIsReadFalse(roomId, SenderType.USER);
    return new AdminChatSessionDetailDTO(
      room.getId(),
      /*유저 매핑*/ null,
      room.getStatus().name().toLowerCase(),
      messages,
      unread
    );
  }

  @Override
  @Transactional
  public void closeRoom(Long roomId) {
    AdminInquiryRoom room = roomRepo.findById(roomId)
      .orElseThrow(() -> new IllegalArgumentException("문의방 없음"));
    room.setStatus(AdminInquiryRoom.InquiryStatus.CLOSED);
  }

  // AdminInquiryRoomServiceImpl.java
  @Override
  public List<AdminChatSessionListDTO> listAllRooms(String search) {
    // 1) 검색에 따라 방 목록 조회
    List<AdminInquiryRoom> rooms;
    if (search == null || search.isBlank()) {
      rooms = roomRepo.findAll();
    } else {
      // 사용자 이름에 매칭되는 방
      List<AdminInquiryRoom> byName    = roomRepo.findByUserNameContaining(search);
      // 마지막 메시지에 매칭되는 방
      List<AdminInquiryRoom> byMessage = roomRepo.findByLastMessageContaining(search);
      // 두 리스트를 합치되, 중복 제거
      Set<Long> seen = new HashSet<>();
      rooms = Stream
        .concat(byName.stream(), byMessage.stream())
        .filter(r -> seen.add(r.getId()))
        .collect(Collectors.toList());
    }

    // 2) DTO 매핑
    return rooms.stream().map(room -> {
      // 2.1) 유저 정보 조회
      User user = userRepository.findById(room.getUserId())
        .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다. id=" + room.getUserId()));

      // 2.2) 마지막 메시지 조회
      List<AdminInquiryMessage> msgs = msgRepo.findByRoomIdOrderByCreatedAtAsc(room.getId());
      AdminInquiryMessage lastMsg = msgs.isEmpty() ? null : msgs.get(msgs.size() - 1);

      String lastContent = lastMsg != null ? lastMsg.getMessage() : "";
      LocalDateTime lastAt = lastMsg != null
        ? lastMsg.getCreatedAt()
        : room.getCreatedAt();

      // 2.3) 안 읽은 메시지 수 계산 (USER 기준)
      int unread = (int) msgRepo.countByRoomIdAndSenderTypeAndIsReadFalse(
        room.getId(), SenderType.USER
      );

      // 2.4) ChatUser DTO 생성
      AdminChatUserDTO chatUser = new AdminChatUserDTO(
        user.getId(),
        user.getNickname(),
        user.getEmail(),
        user.getProfileUrl()
      );

      // 2.5) 최종 리스트용 DTO 반환
      return new AdminChatSessionListDTO(
        room.getId(),
        chatUser,
        room.getStatus().name().toLowerCase(),
        lastContent,
        lastAt,
        unread
      );
    }).collect(Collectors.toList());
  }


}

