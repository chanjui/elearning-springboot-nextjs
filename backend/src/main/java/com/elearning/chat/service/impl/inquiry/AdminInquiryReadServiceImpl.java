package com.elearning.chat.service.impl.inquiry;

import com.elearning.chat.entity.inquiry.AdminInquiryMessage;
import com.elearning.chat.repository.inquiry.AdminInquiryMessageRepository;
import com.elearning.chat.service.inquiry.AdminInquiryReadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminInquiryReadServiceImpl implements AdminInquiryReadService {
  private final AdminInquiryMessageRepository msgRepo;

  @Override
  @Transactional
  public void markAsRead(Long roomId, Long adminId, List<Long> messageIds) {
    // 1) 해당 ID 목록의 메시지 조회
    List<AdminInquiryMessage> messages = msgRepo.findAllById(messageIds);

    // 2) roomId 일치 메시지에 대해서만 isRead=true 설정
    messages.stream()
      .filter(m -> m.getRoomId().equals(roomId))
      .forEach(m -> m.setIsRead(true));

    // 3) 변경된 엔티티 일괄 저장
    msgRepo.saveAll(messages);
  }
}
