package com.elearning.user.repository;

import com.elearning.common.entity.Payment;
import com.elearning.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
  // 사용자 ID로 결제 내역 조회
  List<Payment> findByUser(User user);

  // 여러 결제 조회
  List<Payment> findAllByImpUid(String impUid);

  // 단일 결제 조회 - 삭제 예정
  // Optional<Payment> findByImpUid(String impUid);

  // 특정 기간에 해당하는 결제 내역 조회
  List<Payment> findByRegDateBetweenAndStatus(LocalDateTime startDate, LocalDateTime endDate, Integer status);


  // 전체 결제 금액 합계 조회
  @Query("SELECT SUM(p.price) FROM Payment p WHERE p.status = 0 ")
  Long sumByPrice();

  // 정상 결재 내역 조회
  List<Payment> findByStatus(Integer status);


}
