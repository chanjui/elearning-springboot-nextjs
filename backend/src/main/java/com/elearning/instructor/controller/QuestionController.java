package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.instructor.dto.questions.QuestionDetailDTO;
import com.elearning.instructor.dto.questions.QuestionListDTO;
import com.elearning.instructor.dto.questions.QuestionReplyDTO;
import com.elearning.instructor.service.QuestionDetailService;
import com.elearning.instructor.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/instructor/questions")
public class QuestionController {

  private final QuestionService questionService;
  private final QuestionDetailService questionDetailService;

  /**
   * 강사 질문 목록 조회
   */
  @GetMapping("/{instructorId}")
  public ResultData<Page<QuestionListDTO>> searchQuestionList(
    @PathVariable Long instructorId,
    @RequestParam(required = false) String keyword,
    @RequestParam(required = false) Long courseId,
    @RequestParam(required = false, defaultValue = "전체") String status,
    @RequestParam(required = false, defaultValue = "최신순") String sortBy,
    Pageable pageable
  ) {
    Page<QuestionListDTO> result = questionService.searchQuestionList(instructorId, keyword, courseId, status, sortBy, pageable);
    return ResultData.of((int) result.getTotalElements(), "조회 성공", result);
  }

  /**
   * 질문 상세 조회
   */
  @GetMapping("/detail/{questionId}")
  public ResultData<QuestionDetailDTO> getQuestionDetail(
    @PathVariable Long questionId,
    @RequestParam Long instructorId
  ) {
    QuestionDetailDTO result = questionDetailService.getQuestionDetail(questionId, instructorId);
    return ResultData.of(1, "조회 성공", result);
  }

  /**
   * 댓글 등록
   */
  @PostMapping("/{boardId}/reply")
  public ResultData<?> addReply(
    @PathVariable Long boardId,
    @RequestBody QuestionReplyDTO dto,
    @RequestParam Long userId
  ) {
    questionDetailService.addReply(boardId, dto, userId);
    return ResultData.of(1, "댓글 등록 완료");
  }

  /**
   * 댓글 수정
   */
  @PutMapping("/reply/{replyId}")
  public ResultData<?> updateReply(
    @PathVariable Long replyId,
    @RequestBody QuestionReplyDTO dto,
    @RequestParam Long userId
  ) {
    questionDetailService.updateReply(replyId, dto, userId);
    return ResultData.of(1, "댓글 수정 완료");
  }

  /**
   * 댓글 삭제
   */
  @DeleteMapping("/reply/{replyId}")
  public ResultData<?> deleteReply(
    @PathVariable Long replyId,
    @RequestParam Long userId
  ) {
    questionDetailService.deleteReply(replyId, userId);
    return ResultData.of(1, "댓글 삭제 완료");
  }
}
