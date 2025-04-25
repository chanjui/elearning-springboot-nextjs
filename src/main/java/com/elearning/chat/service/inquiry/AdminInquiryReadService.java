package com.elearning.chat.service.inquiry;

import java.util.List;

public interface AdminInquiryReadService {
  /**
   * 관리자가 roomId 문의방에서 user 측 메시지 읽음 처리
   *
   * @param roomId      문의방 ID
   * @param adminId     관리자 ID (필요시 기록용)
   * @param messageIds  읽음 처리할 메시지 ID 목록
   */
  void markAsRead(Long roomId, Long adminId, List<Long> messageIds);
}
