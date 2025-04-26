package com.elearning.chat.repository.inquiry;

import com.elearning.chat.entity.inquiry.AdminInquiryMessage;
import com.elearning.chat.entity.inquiry.AdminInquiryMessage.SenderType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminInquiryMessageRepository extends JpaRepository<AdminInquiryMessage, Long> {

  List<AdminInquiryMessage> findByRoomIdOrderByCreatedAtAsc(Long roomId);

  // 안읽은 메시지 개수 카운트
  long countByRoomIdAndSenderTypeAndIsReadFalse(Long roomId, SenderType senderType);
}
