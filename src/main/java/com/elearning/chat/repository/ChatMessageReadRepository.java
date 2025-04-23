package com.elearning.chat.repository;

import com.elearning.chat.entity.ChatMessageRead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageReadRepository extends JpaRepository<ChatMessageRead, Long> {

  /**
   * 특정 메시지를 특정 사용자가 읽었는지 여부를 확인합니다.
   * @param messageId 메시지 ID
   * @param userId 사용자 ID
   * @return 읽음 여부
   */
  boolean existsByMessageIdAndUserId(Long messageId, Long userId);

  // 본인을 제외한 읽은 유저 수
  int countByMessageIdAndUserIdNot(Long messageId, Long userId);
}
