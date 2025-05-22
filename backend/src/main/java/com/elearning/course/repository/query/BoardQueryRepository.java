package com.elearning.course.repository.query;

import com.elearning.course.dto.BoardInstructorDTO;
import com.elearning.course.dto.Community.TopWriterDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface BoardQueryRepository {
  // 특정 강사의 모든 강의에 작성된 게시글 조회
  List<BoardInstructorDTO> findPostsByInstructorId(Long instructorId);

  List<TopWriterDTO> findTopWriters(int limit);

}
