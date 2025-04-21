package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import com.elearning.course.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
  List<Comment> findByBoardId(Long boardId);

  // 특정 게시글(boardId)에 대한 답변(댓글)만 조회 (삭제되지 않은 것만)
  List<Comment> findByBoardIdAndIsDel(Long boardId, boolean isDel);

  int countByBoardAndIsDelFalse(Board board);

  List<Comment> findByBoardAndIsDelFalse(Board board);


  // 게시글 ID 기준 댓글 수 (DTO 변환용)
  @Query("""
      SELECT COUNT(c) FROM Comment c WHERE c.board.id = :boardId AND c.isDel = false
  """)
  int countByBoardIdAndIsDelFalse(Long boardId);

  // 사용자가 댓글 단 게시글 목록 조회 (중복 제거 + 삭제 게시글 제외)
  @Query("""
      SELECT DISTINCT c.board FROM Comment c
      WHERE c.user.id = :userId 
        AND c.board.isDel = false 
        AND c.isDel = false
  """)
  List<Board> findBoardByUserId(Long userId);
}
