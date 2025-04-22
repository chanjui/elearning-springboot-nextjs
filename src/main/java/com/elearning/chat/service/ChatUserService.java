package com.elearning.chat.service;

import com.elearning.chat.dto.ChatUserDTO;

import java.util.List;

public interface ChatUserService {

  List<ChatUserDTO> getRecommendedUsers(Long userId);
  List<ChatUserDTO> searchUsers(String keyword);
}
