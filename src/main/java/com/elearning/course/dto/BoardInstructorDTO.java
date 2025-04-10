package com.elearning.course.dto;

import com.elearning.course.entity.Board;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BoardInstructorDTO {

  private Long id;
  private Board.BoardType bname;
  private String subject;
  private String content;
  private LocalDateTime regDate;
  private Long viewCount;
  private String reply;
  private Long likeCount;
  private Long commentCount;
}