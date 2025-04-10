package com.elearning.course.dto;

import java.time.LocalDateTime;

public class BoardInstructorDTO {

  private Long id;
  private String bname;
  private String subject;
  private String content;
  private LocalDateTime regDate;
  private Long viewCount;
  private String reply;
  private Long likeCount;
  private Long commentCount;

  public BoardInstructorDTO(
    Long id,
    String bname,
    String subject,
    String content,
    LocalDateTime regDate,
    Long viewCount,
    String reply,
    Long likeCount,
    Long commentCount
  ) {
    this.id = id;
    this.bname = bname;
    this.subject = subject;
    this.content = content;
    this.regDate = regDate;
    this.viewCount = viewCount;
    this.reply = reply;
    this.likeCount = likeCount;
    this.commentCount = commentCount;
  }

}
