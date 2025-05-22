package com.elearning.chat.service.impl;

import com.elearning.chat.entity.ChatMessage;
import com.elearning.chat.entity.ChatMessageRead;
import com.elearning.chat.repository.ChatMessageReadRepository;
import com.elearning.chat.repository.ChatMessageRepository;
import com.elearning.chat.service.ChatMessageReadService;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageReadServiceImpl implements ChatMessageReadService {
  private final ChatMessageReadRepository readRepo;
  private final ChatMessageRepository     msgRepo;
  private final UserRepository            userRepo;

  @Override
  @Transactional
  public void markMessagesAsRead(Long roomId, Long userId, List<Long> messageIds) {
    List<Long> already = readRepo.findReadMessageIdsByUser(userId, messageIds);
    for (Long mid : messageIds) {
      if (already.contains(mid)) continue;
      ChatMessage msg = msgRepo.findById(mid)
        .orElseThrow(() -> new IllegalArgumentException("메시지를 찾을 수 없습니다. id = " + mid));
      User usr = userRepo.findById(userId)
        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다. id = " + userId));
      readRepo.save(new ChatMessageRead(msg, usr));
    }
  }

}


