package com.elearning.instructor.service;

import com.elearning.course.entity.Board;
import com.elearning.course.entity.Comment;
import com.elearning.course.repository.BoardRepository;
import com.elearning.course.repository.CommentRepository;
import com.elearning.instructor.dto.questions.QuestionDetailDTO;
import com.elearning.instructor.dto.questions.QuestionReplyDTO;
import com.elearning.instructor.repository.query.questions.QuestionDetailQueryRepository;
import com.elearning.user.entity.User;
import com.elearning.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QuestionDetailService {

  private final QuestionDetailQueryRepository questionDetailQueryRepository;
  private final CommentRepository commentRepository;
  private final BoardRepository boardRepository;
  private final UserRepository userRepository;

  // 질문 상세 조회
  public QuestionDetailDTO getQuestionDetail(Long questionId, Long instructorId) {
    return questionDetailQueryRepository.findQuestionDetail(questionId, instructorId);
  }

  // 댓글 등록
  @Transactional
  public void addReply(Long boardId, QuestionReplyDTO dto, Long userId) {
    Board board = boardRepository.findById(boardId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 게시글입니다."));

    User user = userRepository.findById(userId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

    Comment comment = new Comment();
    comment.setBoard(board);
    comment.setUser(user);
    comment.setContent(dto.getContent());
    comment.setEditDate(LocalDateTime.now());

    commentRepository.save(comment);
  }

  // 댓글 수정
  @Transactional
  public void updateReply(Long replyId, QuestionReplyDTO dto, Long userId) {
    Comment reply = commentRepository.findById(replyId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 댓글입니다."));

    if (!reply.getUser().getId().equals(userId)) {
      throw new RuntimeException("수정 권한이 없습니다.");
    }

    reply.setContent(dto.getContent());
    reply.setEditDate(LocalDateTime.now());
  }

  // 댓글 삭제
  @Transactional
  public void deleteReply(Long replyId, Long userId) {
    Comment reply = commentRepository.findById(replyId)
      .orElseThrow(() -> new RuntimeException("존재하지 않는 댓글입니다."));

    if (!reply.getUser().getId().equals(userId)) {
      throw new RuntimeException("삭제 권한이 없습니다.");
    }

    reply.setDel(true); // 소프트 삭제
  }
}
