package com.elearning.instructor.dto.questions;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class QuestionReplyDTO {
  private Long id;                // 댓글 ID
  private String author;          // 작성자 닉네임
  private Long userId;            // 댓글 작성자 ID
  private String content;         // 내용
  private LocalDateTime regDate;         // 작성일
  private String profileUrl;      // 댓글 작성자 프로필 이미지
  private boolean isInstructor;   // 강사 여부
}

