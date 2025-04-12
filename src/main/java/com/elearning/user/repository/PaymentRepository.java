package com.elearning.user.repository;

import com.elearning.common.entity.Payment;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
  // 사용자 ID로 결제 내역 조회
  List<Payment> findByUser(User user);

  // 여러 결제 조회
  List<Payment> findAllByImpUid(String impUid);

  // 단일 결제 조회 - 삭제 예정
  // Optional<Payment> findByImpUid(String impUid);
}
