package com.elearning.instructor.dto.questions;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class QuestionDetailDTO {
  private Long id;                // 게시글 ID
  private String title;           // 제목
  private String content;         // 내용
  private String courseTitle;     // 강의명
  private String author;          // 작성자 닉네임
  private String regDate;         // 작성일
  private int likeCount;          // 좋아요 수
  private int viewCount;          // 조회수
  private List<QuestionReplyDTO> replies; // 댓글 목록
}

