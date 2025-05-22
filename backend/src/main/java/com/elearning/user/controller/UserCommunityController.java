package com.elearning.user.controller;

import com.elearning.common.ResultData;
import com.elearning.course.dto.Community.UserStateDTO;
import com.elearning.course.service.Community.CommunityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mypage/community")
@RequiredArgsConstructor
public class UserCommunityController {

  private final CommunityService communityService;

  @GetMapping("/userStats")
  public ResultData<UserStateDTO> getUserStats(@RequestParam Long userId) {
    //System.out.println("통계확인");
    return ResultData.of(1, "사용자 활동 통계 조회 성공", communityService.getUserStats(userId));
  }
}
