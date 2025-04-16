package com.elearning.user.repository;

import org.springframework.stereotype.Repository;

import java.util.concurrent.ConcurrentHashMap;

@Repository
public class EmailRepository {

  // 이메일별 인증 코드 저장소
  private final ConcurrentHashMap<String, String> emailAuthCodeMap = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<String, Long> emailAuthCodeTimestampMap = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<String, Boolean> emailVerifiedMap = new ConcurrentHashMap<>();

  // 이메일 인증 횟수 제한 관련 저장소
  private final ConcurrentHashMap<String, Integer> emailSendCountMap = new ConcurrentHashMap<>();
  private final ConcurrentHashMap<String, Long> emailSendResetTimeMap = new ConcurrentHashMap<>();

  // 인증 코드 저장
  public void saveAuthCode(String email, String authCode) {
    emailAuthCodeMap.put(email, authCode);
  }

  // 인증코드 만료시간 저장
  public void saveAuthCodeTimestamp(String email, long expirationTime) {
    emailAuthCodeTimestampMap.put(email, expirationTime);
  }

  // 인증코드 조회
  public String getAuthCode(String email) {
    return emailAuthCodeMap.get(email);
  }

  // 인증코드 만료시간 조회
  public Long getAuthCodeTimestamp(String email) {
    return emailAuthCodeTimestampMap.get(email);
  }

  // 인증코드 만료 여부 확인 (※ 사용처 없음)
  // public boolean isAuthCodeExpired(String email) {
  //   Long expirationTime = emailAuthCodeTimestampMap.get(email);
  //   return expirationTime == null || System.currentTimeMillis() > expirationTime;
  // }

  // 인증 성공 처리 (상태 true + 인증코드 삭제)
  public void verifyComplete(String email) {
    emailVerifiedMap.put(email, true);
    removeAuthCode(email);
  }

  // 인증코드 및 만료시간 삭제
  public void removeAuthCode(String email) {
    emailAuthCodeMap.remove(email);
    emailAuthCodeTimestampMap.remove(email);
  }

  // 이메일 인증 완료 여부 확인
  public boolean isVerified(String email) {
    return emailVerifiedMap.getOrDefault(email, false);
  }

  // 이메일 인증 상태 저장 (true or false)
  public void saveVerifiedStatus(String email, boolean status) {
    emailVerifiedMap.put(email, status);
  }

  // 현재까지 발송 횟수 조회 (기본값 0)
  public int getSendCount(String email) {
    return emailSendCountMap.getOrDefault(email, 0);
  }


  // 발송 횟수 1 증가
  public void incrementSendCount(String email) {
    int newCount = getSendCount(email) + 1;
    emailSendCountMap.put(email, getSendCount(email) + 1);
    //System.out.println("📩 [EmailRepository] " + email + "의 현재 발송 카운트: " + newCount);
  }

  // 발송 횟수 및 제한 초기화
  public void resetSendCount(String email) {
    emailSendCountMap.remove(email);
    emailSendResetTimeMap.remove(email);
  }

  // 현재 제한 초기화 예정 시각 조회 (기본값 0)
  public long getSendResetTime(String email) {
    return emailSendResetTimeMap.getOrDefault(email, 0L);
  }

  // 발송 제한 초기화 시각 설정
  public void setSendResetTime(String email, long timestamp) {
    emailSendResetTimeMap.put(email, timestamp);
  }
}
