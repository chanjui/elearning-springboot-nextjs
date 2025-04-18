package com.elearning.admin.service;

import com.elearning.admin.dto.*;
import com.elearning.common.entity.Payment;
import com.elearning.course.dto.CourseParticular.CourseInfoDTO;
import com.elearning.course.dto.CourseParticular.CourseRatingDTO;
import com.elearning.course.dto.CourseParticular.CourseSectionDTO;
import com.elearning.course.dto.CourseParticular.LectureVideoDTO;
import com.elearning.course.entity.Course;
import com.elearning.course.repository.*;
import com.elearning.user.entity.User;
import com.elearning.user.repository.CourseEnrollmentRepository;
import com.elearning.user.repository.PaymentRepository;
import com.elearning.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
  private final PaymentRepository paymentRepository;
  private final UserRepository userRepository;
  private final CourseRepository courseRepository;
  private final BoardRepository boardRepository;
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CourseRatingRepository courseRatingRepository;
  private final CourseSectionRepository courseSectionRepository;
  private final LectureVideoRepository lectureVideoRepository;


  public long calculateTotalRevenue() {
    Long totalRevenue = paymentRepository.sumByPrice();
    return totalRevenue != null ? totalRevenue : 0L;
  }

  public int totalUsers() {
    return userRepository.countByIsDelFalse();
  }

  public int getUserCountBeforeOneWeek() {
    LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
    return userRepository.countByRegDateBeforeAndIsDelFalse(oneWeekAgo);
  }

  public int totalCourses() {
    return courseRepository.countByIsDelFalse();
  }

  public int getCourseCountBeforeOneWeek() {
    LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
    return courseRepository.countByRegDateBeforeAndIsDelFalse(oneWeekAgo);
  }

  public int unresolvedInquiries() {
    return boardRepository.countUnansweredQuestions();
  }

  public int getBoardCountBeforeOneWeek() {
    LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
    return boardRepository.countByRegDateBeforeAndIsDelFalse(oneWeekAgo);
  }

  // 월별 매출(최근 6개월)
  public List<MonthlyRevenueDTO> calculateMonthlyRevenue() {
    List<MonthlyRevenueDTO> monthlyRevenueList = new ArrayList<>();

    YearMonth currentMonth = YearMonth.now(); // 현재 월
    for (int i = 5; i >= 0; i--) { // 최근 6개월 (과거부터 현재까지)
      YearMonth targetMonth = currentMonth.minusMonths(i);

      // 해당 월의 시작일과 종료일 계산
      LocalDateTime startOfMonth = targetMonth.atDay(1).atStartOfDay();
      LocalDateTime endOfMonth = targetMonth.atEndOfMonth().atTime(LocalTime.MAX);

      // 결제 내역 조회
      List<Payment> payments = paymentRepository.findByRegDateBetween(startOfMonth, endOfMonth);

      // 매출 합계 계산
      BigDecimal revenue = payments.stream()
        .map(payment -> BigDecimal.valueOf(payment.getPrice()))
        .reduce(BigDecimal.ZERO, BigDecimal::add);

      // DTO 생성
      MonthlyRevenueDTO dto = MonthlyRevenueDTO.builder()
        .month(String.valueOf(targetMonth)) // 예: "2025-04"
        .revenue(revenue)
        .build();

      monthlyRevenueList.add(dto);
    }

    return monthlyRevenueList;
  }

  // 최근 5개 판매 강의
  public List<RecentSaleDTO> getRecentSales() {
    List<Payment> recentPayments = paymentRepository.findByRegDateBetween(
      LocalDateTime.now().minusWeeks(1), LocalDateTime.now());

    return recentPayments.stream()
      .map(payment -> {
        // 결제한 사람과 강의 정보를 가져오기
        User purchaser = payment.getUser(); // 결제한 사람
        Course course = payment.getCourse(); // 결제된 강의

        // 구매 시간 계산 (예: "2시간 전" 등)
        String purchasedAt = calculateTimeAgo(payment.getRegDate());

        return RecentSaleDTO.builder()
          .courseTitle(course != null ? course.getSubject() : "Unknown Course") // 강의 제목
          .purchaserId(purchaser != null ? purchaser.getId() : 0)
          .purchaserName(purchaser != null ? purchaser.getNickname() : "Unknown User") // 결제한 사람 이름
          .profileImg(purchaser != null ? purchaser.getProfileUrl() : "Unknown User") // 결제한 사람 프로필 이미지
          .price(payment.getPrice()) // 결제 금액
          .purchasedAt(purchasedAt) // 결제 시간
          .build();
      })
      .limit(5) // 최근 5개만 가져오기
      .collect(Collectors.toList());
  }

  // 결제 시간으로부터 "2시간 전", "3일 전" 등의 문자열을 계산하는 함수
  private String calculateTimeAgo(LocalDateTime dateTime) {
    LocalDateTime now = LocalDateTime.now();
    long seconds = java.time.Duration.between(dateTime, now).getSeconds();

    if (seconds < 60) {
      return seconds + "초 전";
    } else if (seconds < 3600) {
      return seconds / 60 + "분 전";
    } else if (seconds < 86400) {
      return seconds / 3600 + "시간 전";
    } else if (seconds < 2592000) {
      return seconds / 86400 + "일 전";
    } else {
      return seconds / 2592000 + "개월 전";
    }
  }

  public int getCountPendingCourse() {
    return courseRepository.countByStatus(Course.CourseStatus.PREPARING);
  }

  public List<PopularCategoryDTO> getPopularCategories() {
    List<Object[]> results = courseEnrollmentRepository.findPopularCategoriesRaw();
    return results.stream()
      .map(row -> PopularCategoryDTO.builder()
        .categoryName((String) row[0])
        .usageRate(((Number) row[1]).intValue())
        .build())
      .collect(Collectors.toList());
  }

  public DailyUserRegistrationDTO getTodayUserRegistrationSummary() {
    int todayCount = userRepository.countByRegDateAfter(LocalDateTime.now().toLocalDate().atStartOfDay());

    String lastRegisteredAgo;

    if (todayCount == 0) {
      lastRegisteredAgo = "-";
    } else {
      User lastUser = userRepository.findTopByOrderByRegDateDesc().get();
      LocalDateTime now = LocalDateTime.now();
      Duration duration = Duration.between(lastUser.getRegDate(), now);

      long hoursAgo = duration.toHours();
      lastRegisteredAgo = hoursAgo + "시간전";
    }

    return DailyUserRegistrationDTO.builder()
      .todayCount(todayCount)
      .lastUserRegisteredAgo(lastRegisteredAgo)
      .build();
  }

  public RecentCourseDTO getRecentCourseSummary() {
    Course recentCourse = courseRepository.findTopByOrderByRegDateDesc();

    if (recentCourse == null) {
      return RecentCourseDTO.builder()
        .courseTitle("-")
        .instructorName("-")
        .registeredAgo("-")
        .build();
    }

    LocalDateTime now = LocalDateTime.now();
    Duration duration = Duration.between(recentCourse.getRegDate(), now);
    long hoursAgo = duration.toHours();

    return RecentCourseDTO.builder()
      .courseTitle(recentCourse.getSubject())
      .instructorName(recentCourse.getInstructor().getUser().getNickname())
      .registeredAgo(hoursAgo + "시간 전")
      .build();
  }

  public AdminDashboardDTO getDashboardSummary() {
    return AdminDashboardDTO.builder()
      .totalRevenue(calculateTotalRevenue())

      .totalUsers(totalUsers())
      .userIncreaseFromLastWeek(totalUsers() - getUserCountBeforeOneWeek())

      .totalCourses(totalCourses())
      .courseIncreaseFromLastWeek(totalCourses() - getCourseCountBeforeOneWeek())

      .unresolvedInquiries(unresolvedInquiries())
      .inquiryIncreaseFromLastWeek(unresolvedInquiries() - getBoardCountBeforeOneWeek())

      .monthlyRevenueOverview(calculateMonthlyRevenue())
      .recentSales(getRecentSales())

      .pendingCourse(getCountPendingCourse())
      .popularCategories(getPopularCategories())

      .recentActivity(
        RecentActivityDTO.builder()
          .userRegistrations(getTodayUserRegistrationSummary())
          .recentCourse(getRecentCourseSummary())
          .build()
      )
      .build();
  }

  public List<CourseSummaryDTO> getAllCourses() {
    List<Course> courses = courseRepository.findAll();

    return courses.stream()
      .map(course -> {
        Long courseId = course.getId();

        Long studentCount = courseEnrollmentRepository.countByCourseId(courseId);
        double averageRating = courseRatingRepository.getAverageRatingByCourseId(courseId);

        return CourseSummaryDTO.builder()
          .id(courseId)
          .title(course.getSubject())
          .instructor(course.getInstructor().getUser().getNickname())
          .category(course.getCategory().getName())
          .price(course.getPrice())
          .status(course.getStatus().name())
          .students(Math.toIntExact(studentCount))
          .rating(averageRating)
          .createdAt(course.getRegDate())
          .build();
      })
      .collect(Collectors.toList());
  }

  public CourseInfoDTO getCourseParticular(Long courseId) {
    Course course = courseRepository.findById(courseId).orElse(null);
    if (course == null) {
      return null;
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

    int students = courseEnrollmentRepository.countCourseEnrollmentByCourseId(courseId);
    double averageRating = reviews.stream().mapToInt(CourseRatingDTO::getRating).average().orElse(0.0);
    int totalLectures = curriculum.stream().mapToInt(section -> section.getLectures().size()).sum();
    double totalHours = curriculum.stream().flatMap(section -> section.getLectures().stream()).mapToInt(
      LectureVideoDTO::getDuration).sum() / 60.0;
    totalHours = Math.round(totalHours * 100.0) / 100.0;

    return new CourseInfoDTO(
      course.getId(),
      course.getSubject(),
      course.getDescription(),
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
      null,
      null,
      null// ✅ DTO 에 추가
    );
  }

  public List<PendingCourseDTO> getPendingCourses() {
    List<Course> courses = courseRepository.findAllByStatus(Course.CourseStatus.PREPARING);

    return courses.stream()
      .map(course -> {
        Long courseId = course.getId();

        // 전체 커리큘럼 조회 (섹션 + 강의)
        List<CourseSectionDTO> curriculum = courseSectionRepository.findByCourseIdOrderByOrderNumAsc(courseId).stream()
          .map(section -> new CourseSectionDTO(
            section.getId(),
            section.getSubject(),
            lectureVideoRepository.findBySectionIdOrderBySeqAsc(section.getId()).stream()
              .map(lecture -> new LectureVideoDTO(
                lecture.getId(),
                lecture.getTitle(),
                lecture.getDuration(),
                lecture.isFree()
              ))
              .collect(Collectors.toList())
          ))
          .toList();

        int sectionCount = curriculum.size();

        // 강의 개수 및 전체 시간 계산
        int videoCount = curriculum.stream()
          .mapToInt(section -> section.getLectures().size())
          .sum();

        int totalDuration = curriculum.stream()
          .flatMap(section -> section.getLectures().stream())
          .mapToInt(LectureVideoDTO::getDuration)
          .sum();

        return PendingCourseDTO.builder()
          .id(courseId)
          .title(course.getSubject())
          .instructor(course.getInstructor().getUser().getNickname())
          .instructorEmail(course.getInstructor().getUser().getEmail())
          .category(course.getCategory().getName())
          .description(course.getDescription())
          .price(course.getPrice())
          .createdAt(course.getRegDate().toLocalDate().toString())
          .status(course.getStatus().name().toLowerCase())
          .sections(sectionCount)
          .videos(videoCount)
          .duration(totalDuration)
          .build();
      })
      .collect(Collectors.toList());
  }


}
