package com.elearning.course.service.CourseParticular;

import com.elearning.common.entity.LikeTable;
import com.elearning.common.repository.LikeTableRepository;
import com.elearning.course.dto.CourseParticular.*;
import com.elearning.course.entity.Board;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.*;
import com.elearning.user.entity.CourseEnrollment;
import com.elearning.user.entity.User;
import com.elearning.user.repository.CourseEnrollmentRepository;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseParticularService {
  private final BoardRepository boardRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CourseRepository courseRepository;
  private final CourseSectionRepository courseSectionRepository;
  private final LectureVideoRepository lectureVideoRepository;
  private final CourseRatingRepository courseRatingRepository;
  private final CommentRepository commentRepository;
  private final UserRepository userRepository;
  private final LikeTableRepository likeTableRepository;

  public CourseInfoDTO getCourseParticular(Long courseId, Long userId) {
    System.out.println("getCourseParticular 호출 - courseId: " + courseId + ", userId: " + userId);

    Course course = courseRepository.findByIdAndStatus(courseId, Course.CourseStatus.ACTIVE).orElse(null);
    if (course == null) {
      System.out.println("강의를 찾을 수 없음 - courseId: " + courseId);
      return null;
    }

    // boolean isEnrolled = courseEnrollmentRepository.existsByCourseIdAndUserId(courseId, userId);


    List<CourseEnrollment> list = courseEnrollmentRepository.findByUserIdAndCourseId(userId, courseId);
    for (CourseEnrollment e : list) {
      System.out.println(String.format(
        "▶▶ 직접 조회한 Enrollment[id=%d, isDel=%b]",
        e.getId(), e.isDel()
      ));
    }

    // soft-delete 체크 포함한 exists 호출 결과 확인
    boolean isEnrolled = courseEnrollmentRepository.existsByCourseIdAndUserIdAndIsDelFalse(courseId, userId);


    System.out.println("수강 등록 여부 확인 - courseId: " + courseId + ", userId: " + userId + ", isEnrolled: " + isEnrolled);

    boolean isLiked = likeTableRepository.existsByCourseIdAndUserId(courseId, userId);
    System.out.println("좋아요 상태 확인 - courseId: " + courseId + ", userId: " + userId + ", isLiked: " + isLiked);

    // LikeTable 엔티티 직접 조회
    Optional<LikeTable> likeTable = likeTableRepository.findByCourseIdAndUserId(courseId, userId);
    System.out.println("LikeTable 엔티티 조회 결과: " + (likeTable.isPresent() ? "존재함" : "없음"));
    if (likeTable.isPresent()) {
      System.out.println("LikeTable 상세 정보: " + likeTable.get());
    }

    List<CourseSectionDTO> curriculum = courseSectionRepository.findByCourseIdOrderByOrderNumAsc(courseId).stream().map(
      section -> new CourseSectionDTO(
        section.getId(),
        section.getSubject(),
        lectureVideoRepository.findBySectionIdOrderBySeqAsc(section.getId()).stream().map(
          lecture -> new LectureVideoDTO(
            lecture.getId(),
            lecture.getTitle(),
            lecture.getDuration(),
            lecture.isFree()
          )).collect(Collectors.toList())
      )).collect(Collectors.toList());

    List<CourseRatingDTO> reviews = courseRatingRepository.findByCourseId(courseId).stream().map(
      rating -> new CourseRatingDTO(
        rating.getId(),
        rating.getUser().getId(),
        rating.getUser().getNickname(),
        rating.getUser().getProfileUrl(),
        rating.getRating(),
        rating.getRegDate().toLocalDate(),
        rating.getContent()
      )).collect(Collectors.toList());

    List<BoardDTO> questions = boardRepository.findByCourseIdAndBnameAndUserId(courseId, Board.BoardType.수강전질문, userId)
      .stream()
      .map(q -> new BoardDTO(
        q.getId(),
        q.getUser().getId(),
        q.getUser().getNickname(),
        q.getUser().getProfileUrl(),
        q.getSubject(),
        q.getContent(),
        q.getRegDate().toLocalDate(),
        commentRepository.findByBoardId(q.getId()).stream().map(
          comment -> new CommentDTO(
            comment.getId(),
            comment.getUser().getId(),
            comment.getUser().getNickname(),
            comment.getUser().getProfileUrl(),
            comment.getContent(),
            comment.getEditDate().toLocalDate()
          )).collect(Collectors.toList())
      ))
      .collect(Collectors.toList());

    int students = courseEnrollmentRepository.countCourseEnrollmentByCourseId(courseId);
    double averageRating = reviews.stream().mapToInt(CourseRatingDTO::getRating).average().orElse(0.0);
    int totalLectures = curriculum.stream().mapToInt(section -> section.getLectures().size()).sum();
    double totalHours = curriculum.stream().flatMap(section -> section.getLectures().stream()).mapToInt(
      LectureVideoDTO::getDuration).sum() / 60.0;
    totalHours = Math.round(totalHours * 100.0) / 100.0;

    return new CourseInfoDTO(
      course.getId(),
      course.getSubject(),
      course.getDetailedDescription(),
      course.getInstructor().getUser().getNickname(),
      course.getInstructor().getId(),
      course.getPrice(),
      averageRating,
      students,
      totalLectures,
      totalHours,
      course.getTarget(),
      course.getUpdateDate().toLocalDate(),
      course.getThumbnailUrl(),
      curriculum,
      reviews,
      questions,
      isEnrolled,
      isLiked // ✅ DTO 에 추가
    );
  }

  public void addInquiry(Long userId, Long courseId, String subject, String content) {
    // 사용자 및 강의 조회
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    Course course = courseRepository.findById(courseId)
      .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의입니다."));

    // Board 엔티티 생성 및 설정
    Board board = new Board();
    board.setUser(user);
    board.setCourse(course);
    board.setBname(Board.BoardType.수강전질문); // 문의는 수강전질문으로 고정
    board.setSubject(subject);
    board.setContent(content);
    board.setRegDate(LocalDateTime.now()); // BaseEntity 상속된 필드일 수도 있음
    board.setEditDate(LocalDateTime.now()); // 처음엔 수정 없음

    boardRepository.save(board);
  }

  public boolean toggleCourseLike(Long courseId, Long userId) {
    System.out.println("toggleCourseLike 호출 - courseId: " + courseId + ", userId: " + userId);

    // 좋아요 존재 여부 확인
    Optional<LikeTable> existingLike = likeTableRepository.findByCourseIdAndUserId(courseId, userId);
    System.out.println("기존 좋아요 존재 여부: " + (existingLike.isPresent() ? "존재함" : "없음"));

    if (existingLike.isPresent()) {
      likeTableRepository.delete(existingLike.get());
      System.out.println("좋아요 삭제 완료");
      return false; // 좋아요 취소됨
    }

    // 없으면 새로 생성
    Course course = courseRepository.findById(courseId)
      .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 강의입니다."));
    User user = userRepository.findById(userId)
      .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다."));

    LikeTable newLikeTable = new LikeTable();
    newLikeTable.setUser(user);
    newLikeTable.setCourse(course);
    newLikeTable.setType(1); // 강의 좋아요는 type = 1
    newLikeTable.setCreatedDate(LocalDateTime.now());
    System.out.println("새로운 좋아요 생성 시도");
    likeTableRepository.save(newLikeTable);
    System.out.println("새로운 좋아요 저장 완료");

    return true; // 좋아요 추가됨
  }

}
