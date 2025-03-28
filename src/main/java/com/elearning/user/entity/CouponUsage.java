package com.elearning.user.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.common.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "couponUsage")
@Getter
@Setter
public class CouponUsage extends BaseEntity {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "couponId", nullable = false)
    private Coupon coupon;
    
    @Column(name = "useDate")
    private LocalDateTime useDate = LocalDateTime.now();
} 