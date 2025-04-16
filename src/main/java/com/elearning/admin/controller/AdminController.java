package com.elearning.admin.controller;

import com.elearning.admin.dto.AdminUserDTO;
import com.elearning.admin.service.AdminUserService;
import com.elearning.common.ResultData;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user/admin")
@RequiredArgsConstructor
public class AdminController {
  private final String msg = "success";
  private final AdminUserService adminUserService;

  @GetMapping("/user")
  public ResultData<List<AdminUserDTO>> getCourseParticular() {
    return ResultData.of(1, msg, adminUserService.getAllUsersWithCourses());
  }

  @PostMapping("/delUser/{userId}/abcdefghijklmnopqrstuvwxyz")
  public ResultData<Boolean> delUser(@PathVariable Long userId) {
    return ResultData.of(1, msg, adminUserService.deactivateUser(userId));
  }
}
