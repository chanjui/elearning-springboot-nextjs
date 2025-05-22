package com.elearning.instructor.repository.query.questions;

import com.elearning.instructor.dto.questions.QuestionDetailDTO;
import com.elearning.instructor.dto.questions.QuestionReplyDTO;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class QuestionDetailQueryRepositoryImpl implements QuestionDetailQueryRepository {

  private final EntityManager em;

  @Override
  public QuestionDetailDTO findQuestionDetail(Long questionId, Long instructorId) {

    // 질문 본문 조회 (좋아요 count 제외)
    QuestionDetailDTO question = em.createQuery("""
        SELECT new com.elearning.instructor.dto.questions.QuestionDetailDTO(
            b.id,
            b.subject,
            b.content,
            c.subject,
            u.nickname,
            b.regDate,
            b.viewCount,
            u.profileUrl
        )
        FROM Board b
        JOIN b.course c
        JOIN b.user u
        WHERE b.id = :questionId
          AND b.isDel = false
    """, QuestionDetailDTO.class)
      .setParameter("questionId", questionId)
      .getSingleResult();


    // 좋아요 개수 별도 조회
    Long likeCount = em.createQuery("""
            SELECT COUNT(bl)
            FROM BoardLike bl
            WHERE bl.board.id = :questionId
        """, Long.class)
      .setParameter("questionId", questionId)
      .getSingleResult();
    question.setLikeCount(likeCount.intValue());

    // 댓글 목록 조회
    List<QuestionReplyDTO> replies = em.createQuery("""
            SELECT new com.elearning.instructor.dto.questions.QuestionReplyDTO(
                cm.id,
                u.nickname,
                u.id,
                cm.content,
                cm.regDate,
                u.profileUrl,
                CASE WHEN i.id IS NOT NULL THEN true ELSE false END
            )
            FROM Comment cm
            JOIN cm.user u
            LEFT JOIN Instructor i ON u.id = i.user.id
            WHERE cm.board.id = :questionId
              AND cm.isDel = false
            ORDER BY cm.id ASC
        """, QuestionReplyDTO.class)
      .setParameter("questionId", questionId)
      .getResultList();

    question.setReplies(replies);

    return question;
  }
}
