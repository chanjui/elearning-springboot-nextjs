package com.elearning.instructor.service;

import com.elearning.instructor.dto.questions.QuestionListDTO;
import com.elearning.instructor.repository.query.questions.QuestionQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuestionService {

  private final QuestionQueryRepository questionQueryRepository;

  public Page<QuestionListDTO> searchQuestionList(Long instructorId, String keyword, Long courseId, String status, Pageable pageable) {
    return questionQueryRepository.searchQuestionList(instructorId, keyword, courseId, status, pageable);
  }
}
