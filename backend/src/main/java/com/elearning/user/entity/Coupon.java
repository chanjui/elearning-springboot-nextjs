package com.elearning.user.entity;

import com.elearning.common.entity.BaseEntity;
import com.elearning.course.entity.Course;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupon")
@Getter
@Setter
public class Coupon extends BaseEntity {

  @Column(nullable = false, length = 100)
  private String name;  // 쿠폰 이름 추가

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "courseId", nullable = true)
  private Course course;

  @Column(nullable = false, length = 255)
  private String code;

  @Column(nullable = false)
  private Integer discount;

  @Column
  private LocalDateTime expiryDate;  // 쿠폰 만료일 추가
}