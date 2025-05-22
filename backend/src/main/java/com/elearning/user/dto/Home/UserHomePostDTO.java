package com.elearning.user.dto.Home;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserHomePostDTO {
  private Long postId;
  private String bname;   // 질문 및 답변
  private String subject;
  private String content;
  private String createdDate; // yyyy.MM.dd 포맷 예정
  private Integer viewCount;
  private Integer likeCount;
  private Integer commentCount;
  private String reply;       // 답변글 (있으면)
  private Long authorId;     // 작성자 userId 추가
  private Boolean isInstructor; // 작성자가 강사인지 여부 추가
}
