package com.elearning.instructor.repository.query.questions;

import com.elearning.instructor.dto.questions.QuestionDetailDTO;

public interface QuestionDetailQueryRepository {
  QuestionDetailDTO findQuestionDetail(Long questionId, Long instructorId);
}
