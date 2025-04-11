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

  // JPQL new용 생성자 필수!
  public QuestionListDTO(Long id, String title, String courseTitle, String author, LocalDateTime regDate,
                         Integer viewCount, long commentCount, long likeCount) {
    this.id = id;
    this.title = title;
    this.courseTitle = courseTitle;
    this.author = author;
    this.regDate = regDate;
    this.viewCount = viewCount;
    this.commentCount = commentCount;
    this.likeCount = likeCount;
  }
}

