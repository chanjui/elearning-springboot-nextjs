package com.elearning.course.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class BoardInstructorDTO {
  private Long id;
  private String bname; // 게시글 타입
  private String subject;
  private String content;
  private LocalDateTime regDate;
  private String reply; // 강사의 댓글

  public BoardInstructorDTO(Long id, String bname, String subject, String content, LocalDateTime regDate, String reply) {
    this.id = id;
    this.bname = bname;
    this.subject = subject;
    this.content = content;
    this.regDate = regDate;
    this.reply = reply;
  }
}
