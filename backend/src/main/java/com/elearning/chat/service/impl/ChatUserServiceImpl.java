package com.elearning.chat.service.impl;

import com.elearning.chat.dto.user.ChatUserDTO;
import com.elearning.chat.repository.ChatUserRepository;
import com.elearning.chat.service.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatUserServiceImpl implements ChatUserService {

  private final ChatUserRepository chatUserRepository;

  @Override
  public List<ChatUserDTO> searchUsers(String keyword) {
    return chatUserRepository.searchUsers(keyword);
  }

  @Override
  public List<ChatUserDTO> getRecommendedUsers(Long userId) {
    return chatUserRepository.getRecommendedUsers(userId);
  }
}
