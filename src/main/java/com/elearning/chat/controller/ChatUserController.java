package com.elearning.chat.controller;

import com.elearning.chat.dto.ChatUserDTO;
import com.elearning.chat.service.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user/chat")
@RequiredArgsConstructor
public class ChatUserController {

  private final ChatUserService chatUserService;

  // 이름, 이메일, 깃허브 링크 검색
  @GetMapping("/search")
  public List<ChatUserDTO> searchUsers(@RequestParam String keyword) {
    return chatUserService.searchUsers(keyword);
  }

  // 추천 유저 (LikeTable 기반)
  @GetMapping("/recommended")
  public List<ChatUserDTO> getRecommendedUsers(@RequestParam Long userId) {
    return chatUserService.getRecommendedUsers(userId);
  }
}
