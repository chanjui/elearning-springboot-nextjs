package com.elearning.user.dto.MyPage;

import lombok.Data;

// 언팔로우/위시리스트 삭제 요청 DTO
@Data
public class DeleteLikeRequestDTO {
  private Long targetId; // 강의ID 또는 강사ID
  private Integer type;  // 1: 강의, 2: 강사
}
