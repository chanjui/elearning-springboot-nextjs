package com.elearning.user.controller;

import com.elearning.user.dto.Coupon.UserCouponDTO;
import com.elearning.user.service.Coupon.CouponService;
import com.elearning.user.service.login.RequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<UserCouponDTO>> getUserCoupons() {
        if (requestService.getJwtUser() == null) {
            return ResponseEntity.status(401).build();
        }
        Long userId = Long.parseLong(requestService.getJwtUser().getId());
        List<UserCouponDTO> coupons = couponService.getUserCoupons(userId);
        return ResponseEntity.ok(coupons);
    }
}