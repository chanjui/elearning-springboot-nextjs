package com.elearning.user.controller;

import com.elearning.user.dto.Coupon.UserCouponDTO;
import com.elearning.user.service.Coupon.CouponService;
import com.elearning.user.service.login.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;
    private final RequestService requestService;

    @GetMapping
    public ResponseEntity<List<UserCouponDTO>> getUserCoupons() {
        Long userId = requestService.getJwtUser().getId();
        List<UserCouponDTO> coupons = couponService.getUserCoupons(userId);
        return ResponseEntity.ok(coupons);
    }
}