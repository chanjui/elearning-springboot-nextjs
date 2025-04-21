package com.elearning.admin.dto;

// UserSuspendRequest.java
public class UserSuspendRequest {
  private Long userId;
  private String reason;

  // getter/setter
  public Long getUserId() {
    return userId;
  }

  public void setUserId(Long userId) {
    this.userId = userId;
  }

  public String getReason() {
    return reason;
  }

  public void setReason(String reason) {
    this.reason = reason;
  }
}
