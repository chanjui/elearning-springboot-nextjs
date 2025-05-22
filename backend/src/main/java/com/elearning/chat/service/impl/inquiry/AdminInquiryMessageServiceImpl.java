package com.elearning.chat.service.impl.inquiry;

import com.elearning.chat.dto.inquiry.AdminChatMessageDTO;
import com.elearning.chat.dto.inquiry.AdminReadEventDTO;
import com.elearning.chat.entity.inquiry.AdminInquiryMessage;
import com.elearning.chat.entity.inquiry.AdminInquiryMessage.SenderType;
import com.elearning.chat.entity.inquiry.AdminInquiryRoom;
import com.elearning.chat.repository.inquiry.*;
import com.elearning.chat.service.inquiry.AdminInquiryMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminInquiryMessageServiceImpl implements AdminInquiryMessageService {
  private final AdminInquiryMessageRepository msgRepo;
  private final AdminInquiryRoomRepository roomRepo;
  // SimpMessagingTemplate는 더 이상 여기서 사용하지 않으므로 제거해도 됩니다.

  @Override
  public List<AdminChatMessageDTO> getMessages(Long roomId) {
    return msgRepo.findByRoomIdOrderByCreatedAtAsc(roomId).stream()
      .map(m -> new AdminChatMessageDTO(
        m.getId(),
        m.getSenderType().name(),
        m.getMessage(),
        m.getCreatedAt(),
        m.getIsRead()
      ))
      .collect(Collectors.toList());
  }

  @Override
  @Transactional
  public AdminChatMessageDTO sendMessage(Long roomId, Long adminId, String content) {
    AdminInquiryRoom room = roomRepo.findById(roomId)
      .orElseThrow(() -> new IllegalArgumentException("문의방 없음"));

    AdminInquiryMessage m = new AdminInquiryMessage();
    m.setRoomId(roomId);
    m.setSenderId(adminId);
    m.setSenderType(SenderType.ADMIN);
    m.setMessage(content);
    m.setCreatedAt(LocalDateTime.now());
    msgRepo.save(m);

    // DTO만 생성해서 반환
    return new AdminChatMessageDTO(
      m.getId(),
      m.getSenderType().name(),
      m.getMessage(),
      m.getCreatedAt(),
      m.getIsRead()
    );
  }

  @Override
  @Transactional
  public AdminReadEventDTO markAsRead(Long roomId, Long adminId, List<Long> messageIds) {
    List<AdminInquiryMessage> messages = msgRepo.findAllById(messageIds);
    messages.stream()
      .filter(m -> m.getRoomId().equals(roomId))
      .forEach(m -> m.setIsRead(true));
    msgRepo.saveAll(messages);

    // DTO만 생성해서 반환
    return new AdminReadEventDTO(roomId, adminId, messageIds);
  }
}


