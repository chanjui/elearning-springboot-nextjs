package com.elearning.user.controller;

import com.elearning.course.dto.dashboard.DashboardResponseDto;
import com.elearning.user.service.MyLearningDashboardService;
import com.elearning.user.service.login.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/dashboard")
@RequiredArgsConstructor
public class MyLearningDashboardController {

    private final MyLearningDashboardService dashboardService;
    private final RequestService requestService;

    @GetMapping
    public ResponseEntity<DashboardResponseDto> getDashboardData() {
        Long userId = requestService.getJwtUser().getId();
        DashboardResponseDto response = dashboardService.getDashboardData(userId);
        return ResponseEntity.ok(response);
    }
} 