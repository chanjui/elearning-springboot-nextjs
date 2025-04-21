package com.elearning.user.service.MyPage;

import com.elearning.course.entity.Board;
import com.elearning.course.repository.BoardLikeRepository;
import com.elearning.course.repository.BoardRepository;
import com.elearning.course.repository.CommentRepository;
import com.elearning.user.dto.MyPage.MyCommunityDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyCommunityService {
  private final BoardRepository boardRepository;
  private final BoardLikeRepository boardLikeRepository;
  private final CommentRepository commentRepository;

  // 게시글 탭, 사용자가 작성한 게시글 목록을 반환
  public List<MyCommunityDTO> getMyPosts(Long userId) {
    return boardRepository.findAllByUserIdAndIsDelFalse(userId)
      .stream().map(this::toDTO)
      .collect(Collectors.toList());
  }

  // 좋아요 탭, 사용자가 좋아요 누른 게시글 목록을 반환
  public List<MyCommunityDTO> getMyLikedPosts(Long userId) {
    return boardLikeRepository.findBoardsByUserId(userId)
      .stream().map(this::toDTO)
      .collect(Collectors.toList());
  }

  // 댓글 탭, 사용자가 댓글을 단 게시글 목록을 반환
  public List<MyCommunityDTO> getMyCommentedPosts(Long userId) {
    return commentRepository.findBoardByUserId(userId)
      .stream().map(this::toDTO)
      .collect(Collectors.toList());
  }

  // Board 엔티티를 프론트에 필요한 MyCommunityDTO로 변환
  private MyCommunityDTO toDTO(Board board) {
    // 게시판 타입이 질문이고, 댓글이 하나라도 달렸는지 체크
    boolean isQuestion = board.getBname() == Board.BoardType.질문및답변;
    boolean hasComment = commentRepository.countByBoardIdAndIsDelFalse(board.getId()) > 0;

    return MyCommunityDTO.builder()
      .id(board.getId())
      .title(board.getSubject())
      .content(board.getContent())
      .category(mapBoardTypeToCategory(board.getBname().name())) // ENUM → 문자열 매핑
      .createdAt(board.getRegDate())
      .commentCount(commentRepository.countByBoardIdAndIsDelFalse(board.getId()))
      .likeCount(boardLikeRepository.countByBoardId(board.getId()))
      .viewCount(board.getViewCount())
      .thumbnailUrl(null) // 게시글 썸네일이 없으므로 현재는 null
      .solved(isQuestion && hasComment)
      // .solved(false) // 향후 Q&A 상태 확인 로직 필요 시 수정 가능
      .isNew(board.getRegDate().isAfter(LocalDateTime.now().minusDays(3))) // 최근 3일 게시글이면 NEW
      .isTrending(board.getViewCount() >= 300) // 조회수 300 이상이면 인기글
      .build();
  }

  //  BoardType ENUM 값을 프론트에서 쓰는 카테고리 문자열로 변환
  private String mapBoardTypeToCategory(String bname) {
    return switch (bname) {
      case "질문및답변" -> "question";
      case "프로젝트" -> "project";
      case "자유게시판" -> "free";
      default -> "other"; // 프론트에서 "기타"로 처리
    };
  }
}