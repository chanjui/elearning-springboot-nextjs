package com.elearning.instructor.dto.questions;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QuestionReplyDTO {
  private Long id;                // 댓글 ID
  private String author;          // 작성자 닉네임
  private String content;         // 내용
  private String regDate;         // 작성일
  private int likeCount;          // 좋아요 수
  private boolean isInstructor;   // 강사 여부
}

