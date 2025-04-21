package com.elearning.user.dto.MyPage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyCommunityDTO {
  private Long id;  // 게시글 ID
  private Long commentId;  // 댓글 ID
  private String title;
  private String content;
  private String category; // "질문및답변", "프로젝트", "자유게시판"
  private LocalDateTime createdAt;
  private int commentCount;
  private int likeCount;
  private int viewCount;
  private String thumbnailUrl;
  private boolean solved;
  private boolean isNew;
  private boolean isTrending;
}
