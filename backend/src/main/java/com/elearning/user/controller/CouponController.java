package com.elearning.user.controller;

import com.elearning.user.dto.Coupon.UserCouponDTO;
import com.elearning.user.service.Coupon.CouponService;
import com.elearning.user.service.login.RequestService;
import com.elearning.common.config.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mypage/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;
    private final RequestService requestService;
    private final JwtProvider jwtProvider;

    // 로그인한 사용자 ID 조회 (공통 메서드)
    private Long getLoginUserId() {
        String accessToken = requestService.getCookie("accessToken");
        if (accessToken == null || accessToken.isBlank()) {
            throw new RuntimeException("로그인이 필요합니다.");
        }
        return jwtProvider.getUserId(accessToken);
    }

    @GetMapping
    public ResponseEntity<List<UserCouponDTO>> getUserCoupons() {
        Long userId = getLoginUserId();
        List<UserCouponDTO> coupons = couponService.getUserCoupons(userId);
        return ResponseEntity.ok(coupons);
    }
}