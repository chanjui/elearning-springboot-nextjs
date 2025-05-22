package com.elearning.course.dto.Community;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopWriterDTO {
  private Long userId;
  private String nickname;
  private String profileUrl;
  private Long postCount;
}