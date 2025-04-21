package com.elearning.course.repository;

import com.elearning.course.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
  // 강의 상세 페이지 수강전 문의
  List<Board> findByCourseIdAndBnameAndUserId(Long courseId, Board.BoardType bname, Long userId);

  // 커뮤니티 내 게시물(수강평, 수강전문의 제외)
  List<Board> findAllByBnameNotInAndIsDelFalse(List<Board.BoardType> 수강평);

  // 커뮤니티 게시물 1개 반환
  Optional<Board> findByIdAndIsDelFalse(Long boardId);

  // 특정 강사의 강의들에 속한 수강전 질문만 조회 (삭제되지 않은 것만)
  List<Board> findByCourse_InstructorIdAndBnameAndIsDel(Long instructorId, String bname, boolean isDel);

  // 답변되지 않은 게시물 수
  @Query("""
      SELECT COUNT(b) FROM Board b WHERE b.bname = '질문및답변' AND NOT EXISTS ( SELECT c FROM Comment c WHERE c.board = b )
    """)
  int countUnansweredQuestions();

  // 최근(일주일) 작성된 게시물 수
  int countByRegDateBeforeAndIsDelFalse(LocalDateTime regDate);

  // 사용자가 작성한 커뮤니티 게시글 조회 (삭제되지 않은 것만)
  List<Board> findAllByUserIdAndIsDelFalse(Long userId);
}
