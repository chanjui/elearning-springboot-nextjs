package com.elearning.instructor.dto.questions;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class QuestionListDTO {
  private Long id;
  private String title;
  private String courseTitle;
  private String author;
  private LocalDateTime regDate;
  private Integer viewCount;
  private long commentCount;
  private long likeCount;
  private String status; // (답변완료/미답변)

  // JPQL new용 생성자
  public QuestionListDTO(Long id, String title, String courseTitle, String author, LocalDateTime regDate,
                         Integer viewCount, long commentCount, long likeCount, String status) {
    this.id = id;
    this.title = title;
    this.courseTitle = courseTitle;
    this.author = author;
    this.regDate = regDate;
    this.viewCount = viewCount;
    this.commentCount = commentCount;
    this.likeCount = likeCount;
    this.status = status;
  }
}

