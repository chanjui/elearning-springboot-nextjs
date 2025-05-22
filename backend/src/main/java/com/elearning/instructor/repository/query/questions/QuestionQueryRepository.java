package com.elearning.instructor.repository.query.questions;

import com.elearning.instructor.dto.questions.QuestionListDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface QuestionQueryRepository {

  Page<QuestionListDTO> searchQuestionList(Long instructorId, String keyword, Long courseId, String status, String sortBy, Pageable pageable);
}
