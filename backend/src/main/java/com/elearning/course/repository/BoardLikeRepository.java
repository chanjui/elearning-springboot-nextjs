package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import com.elearning.course.entity.BoardLike;
import com.elearning.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardLikeRepository extends JpaRepository<BoardLike, Long> {

  int countByBoard(Board board);

  Optional<BoardLike> findByBoardAndUser(Board board, User user);

  // 사용자 기준 좋아요 누른 게시글 목록 조회 (isDel = false 필터링)
  @Query("""
      SELECT bl.board FROM BoardLike bl
      WHERE bl.user.id = :userId AND bl.board.isDel = false
  """)
  List<Board> findBoardsByUserId(Long userId);

  // 게시글 ID 기준 좋아요 수 (for toDTO)
  @Query("""
      SELECT COUNT(bl) FROM BoardLike bl WHERE bl.board.id = :boardId
  """)
  int countByBoardId(Long boardId);
}
