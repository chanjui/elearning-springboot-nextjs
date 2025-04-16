package com.elearning.instructor.dto.questions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class QuestionDetailDTO {
  private Long id;                // 게시글 ID
  private String title;           // 제목
  private String content;         // 내용
  private String courseTitle;     // 강의명
  private String author;          // 작성자 닉네임
  private LocalDateTime regDate;         // 작성일
  private int viewCount;          // 조회수
  private String profileUrl;      // 작성자 프로필 이미지

  @Setter
  private int likeCount;          // 좋아요 수

  @Setter
  private List<QuestionReplyDTO> replies; // 댓글 목록

  // JPQL new 구문용 public 생성자
  public QuestionDetailDTO(Long id, String title, String content, String courseTitle,
                           String author, LocalDateTime regDate, int viewCount, String profileUrl) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.courseTitle = courseTitle;
    this.author = author;
    this.regDate = regDate;
    this.viewCount = viewCount;
    this.profileUrl = profileUrl;
  }
}

