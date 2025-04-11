package com.elearning.instructor.controller;

import com.elearning.common.ResultData;
import com.elearning.instructor.dto.questions.QuestionListDTO;
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

  /**
   * 강사 질문 목록 조회
   */
  @GetMapping("/{instructorId}")
  public ResultData<Page<QuestionListDTO>> searchQuestionList(
    @PathVariable Long instructorId,
    @RequestParam(required = false) String keyword,
    @RequestParam(required = false) Long courseId,
    @RequestParam(required = false, defaultValue = "전체") String status,
    Pageable pageable
  ) {
    Page<QuestionListDTO> result = questionService.searchQuestionList(instructorId, keyword, courseId, status, pageable);
    return ResultData.of((int) result.getTotalElements(), "조회 성공", result);
  }
}
